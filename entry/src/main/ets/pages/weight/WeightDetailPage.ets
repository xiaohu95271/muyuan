
import { AppConstants } from '../../common/constants/AppConstants';
import { DatabaseManager } from '../../common/database/DatabaseManager';
import { WeightModel, WeightGoal } from '../../models/WeightModel';
import { DateUtil } from '../../common/utils/DateUtil';
import { ToastUtil } from '../../common/utils/ToastUtil';
import { EventUtil } from '../../common/utils/EventUtil';
import { preferences } from '@kit.ArkData';
import { hilog } from '@kit.PerformanceAnalysisKit';

const maxWeight = 5000;
// 定义 Domain，通常用于标识业务模块，取值范围 0x0000 到 0xFFFF
const DOMAIN: number = 0x0001;
// 定义 Tag，用于标识日志来源，如当前的页面或服务
const TAG: string = '[WeightDetailPage.ets]';

interface DatePickerResult {
  year: number;
  month: number;
  day: number;
}

interface TimePickerResult {
  hour: number;
  minute: number;
}


@Entry
@Component
struct WeightDetailPage {
  @State weightId: number = -1;
  @State date: number = DateUtil.getTodayStart();
  @State time: number = Date.now();
  @State weight: string = '';
  @State bodyFatRate: string = '';
  @State notes: string = '';
  @State isEdit: boolean = false;
  @State userHeight: number = 0;
  @State bmiPreview: number = 0;
  @State isEditingHeight: boolean = false;
  @State tempHeight: string = '';
  @State useKg: boolean = true;
  @State isShowDatePicker: boolean = false;
  @State isShowTimePicker: boolean = false;
  private weightController: TextInputController = new TextInputController();
  private bodyFatController: TextInputController = new TextInputController();

  aboutToAppear() {
    this.loadHeight();
    let params = this.getUIContext().getRouter().getParams() as object;
    if (params) {
      let p = params as Record<string, Object>;
      if (p['id'] !== undefined) {
        this.weightId = p['id'] as number;
        this.isEdit = true;
        this.loadWeightDetail();
      } else {
        this.updateBMIPreview();
      }
    } else {
      this.updateBMIPreview();
    }
  }

  async loadHeight() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      // 优先从独立键读取身高
      const heightStr = pref.getSync('user_height', '') as string;
      if (heightStr) {
        this.userHeight = parseFloat(heightStr) || 0;
        return;
      }
      // 兼容旧数据
      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      if (goalStr) {
        let goal: WeightGoal = JSON.parse(goalStr) as WeightGoal;
        this.userHeight = goal.height || 0;
      }
    } catch (e) {
      console.error('Load height error:', JSON.stringify(e));
    }
  }

  async saveHeight() {
    if (!this.tempHeight.trim()) {
      // 允许清空身高
      this.userHeight = 0;
      this.isEditingHeight = false;
      this.updateBMIPreview();
      try {
        const context = this.getUIContext().getHostContext();
        const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
        pref.putSync('user_height', '');
        const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
        let goal: WeightGoal = goalStr ? JSON.parse(goalStr) as WeightGoal : new WeightGoal();
        goal.height = 0;
        pref.putSync(AppConstants.PREF_WEIGHT_GOAL, JSON.stringify(goal));
        await pref.flush();
        ToastUtil.show('身高已清除');
      } catch (e) {
        console.error('Clear height error:', JSON.stringify(e));
      }
      return;
    }
    const h = parseFloat(this.tempHeight);
    if (isNaN(h) || h <= 0) {
      ToastUtil.show('请输入有效的身高');
      return;
    }
    this.userHeight = h;
    this.isEditingHeight = false;
    this.updateBMIPreview();
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      pref.putSync('user_height', h.toString());
      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      let goal: WeightGoal = goalStr ? JSON.parse(goalStr) as WeightGoal : new WeightGoal();
      goal.height = h;
      pref.putSync(AppConstants.PREF_WEIGHT_GOAL, JSON.stringify(goal));
      await pref.flush();
      ToastUtil.show('身高已保存');
    } catch (e) {
      console.error('Save height error:', JSON.stringify(e));
    }
  }

  async loadWeightDetail() {
    if (this.weightId > 0) {
      const all = await DatabaseManager.getInstance().queryAllWeights();
      const found = all.find(w => w.id === this.weightId);
      if (found) {
        this.date = found.date || DateUtil.getTodayStart();
        this.time = found.createTime || Date.now();
        this.weightController.stopEditing();
        this.weight = this.useKg ? found.weight.toFixed(2) : (found.weight * 2).toFixed(2);
        this.bodyFatRate = found.bodyFatRate > 0 ? found.bodyFatRate.toString() : '';
        this.notes = found.notes;
        this.updateBMIPreview();
      }
    }
  }

  toggleUnit() {
    const current = parseFloat(this.weight);
    if (!isNaN(current) && current > 0) {
      if (this.useKg) {
        this.weight = (current * 2).toFixed(2);
      } else {
        this.weight = (current / 2).toFixed(2);
      }
      this.weightController.stopEditing();
    }
    this.useKg = !this.useKg;
  }

  adjustWeight(step: number) {
    this.weightController.stopEditing();
    const current = parseFloat(this.weight) || 0;
    let next = current + step;
    if (next < 0) next = 0;
    this.weight = next.toFixed(2);
    this.updateBMIPreview();
  }

  formatDisplayDate(): string {
    const d = new Date(this.date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  formatDisplayTime(): string {
    const t = new Date(this.time);
    return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
  }

  updateBMIPreview() {
    const w = parseFloat(this.weight);
    if (!isNaN(w) && w > 0 && this.userHeight > 0) {
      this.bmiPreview = DateUtil.calculateBMI(w, this.userHeight);
    } else {
      this.bmiPreview = 0;
    }
  }

  // 滚轮选择器辅助方法
  getIntRange(): string[] {
    const range: string[] = [];
    for (let i = 0; i <= maxWeight; i++) {
      range.push(i.toString());
    }
    return range;
  }

  getDecimalRange(): string[] {
    const range: string[] = [];
    for (let i = 0; i < 99; i++) {
      range.push(i.toString().padStart(2, '0'));
    }
    return range;
  }

  getIntPart(): number {
    const val = parseFloat(this.weight) || 0;
    return Math.floor(val);
  }

  getDecimalPart(): number {
    const val = parseFloat(this.weight) || 0;
    return Math.round((val - Math.floor(val)) * 100);
  }

  getIntIndex(): number {
    const intPart = this.getIntPart();
    return Math.max(0, Math.min(maxWeight, intPart));
  }

  getDecimalIndex(): number {
    return this.getDecimalPart();
  }

  async saveWeight() {
    const displayWeight = parseFloat(this.weight);
    const kgWeight = this.useKg ? displayWeight : displayWeight / 2;
    if (isNaN(kgWeight) || kgWeight <= 0) {
      ToastUtil.show('请输入有效的体重数值');
      return;
    }
    const bfr = parseFloat(this.bodyFatRate);
    const bmi = DateUtil.calculateBMI(kgWeight, this.userHeight);
    const model = new WeightModel();
    model.id = this.weightId;
    model.date = this.date;
    model.weight = kgWeight;
    model.bmi = bmi;
    model.bodyFatRate = isNaN(bfr) ? 0 : bfr;
    model.notes = this.notes.trim();
    const dateObj = new Date(this.date);
    const timeObj = new Date(this.time);
    model.createTime = new Date(
      dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(),
      timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds()
    ).getTime();
    model.updateTime = Date.now();

    try {
      if (this.isEdit) {
        await DatabaseManager.getInstance().updateWeight(model);
      } else {
        const existing = await DatabaseManager.getInstance().queryWeightByDate(this.date);
        if (existing) {
          model.id = existing.id;
          await DatabaseManager.getInstance().updateWeight(model);
          ToastUtil.show('已更新当天记录');
        } else {
          const insertId = await DatabaseManager.getInstance().insertWeight(model);
          if (insertId > 0) {
            ToastUtil.show('保存成功');
          } else {
            ToastUtil.show('保存失败');
            return;
          }
        }
      }
      EventUtil.emitWeightSaved();
      this.getUIContext().getRouter().back();
    } catch (e) {
      console.error('Save weight error:', JSON.stringify(e));
      ToastUtil.show('保存出错，请重试');
    }
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Column() {
        // 顶部导航栏
        Row() {
          Button('<')
            .fontSize(28)
            .fontColor('#333333')
            .width(52)
            .height(52)
            .type(ButtonType.Circle)
            .backgroundColor('transparent')
            .onClick(() => {
              this.getUIContext().getRouter().back();
            })

          Text(this.isEdit ? '编辑记录' : '记录体重')
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333333')

          Button('保存')
            .fontSize(14)
            .fontColor(this.useKg ? '#FFFFFF' : '#666666')
            .backgroundColor('#333333')
            .borderRadius(20)
            .height(36)
            .padding({ left: 20, right: 20 })
            .onClick(() => {
              this.saveWeight();
            })
        }
        .width('100%')
        .height(56)
        .padding({ left: 8, right: 16 })
        .justifyContent(FlexAlign.SpaceBetween)
        .backgroundColor('#FFFFFF')

        Scroll() {
          Column({ space: 12 }) {
            // 体重卡片
            Column({ space: 16 }) {
              Row() {
                Text('体重')
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor('#333333')

                Row({ space: 0 }) {
                  Text('公斤')
                    .fontSize(13)
                    .fontColor(this.useKg ? '#FFFFFF' : '#666666')
                    .padding({ left: 12, right: 12, top: 4, bottom: 4 })
                    .backgroundColor(this.useKg ? '#333333' : '#F0F0F0')
                    .borderRadius({ topLeft: 12, bottomLeft: 12 })
                    .onClick(() => {
                      if (!this.useKg) this.toggleUnit();
                    })
                  Text('斤')
                    .fontSize(13)
                    .fontColor(this.useKg ? '#666666' : '#FFFFFF')
                    .padding({ left: 12, right: 12, top: 4, bottom: 4 })
                    .backgroundColor(this.useKg ? '#F0F0F0' : '#333333')
                    .borderRadius({ topRight: 12, bottomRight: 12 })
                    .onClick(() => {
                      if (this.useKg) this.toggleUnit();
                    })
                }
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              // 滚轮选择器（整数+小数部分）
              Row({ space: 4 }) {
                // 整数部分滚轮
                TextPicker({ range: this.getIntRange(), selected: this.getIntIndex() })
                  .layoutWeight(1)
                  .height(120)
                  .onChange((value: string | string[], index: number | number[]) => {
                    const selectedValue = typeof value === 'string' ? value : value[0];
                    const intPart = parseInt(selectedValue);
                    const currentDecimal = this.getDecimalPart();
                    const newWeight = `${intPart}.${currentDecimal.toString().padStart(2, '0')}`;
                    if (newWeight !== this.weight) {
                      this.weight = newWeight;
                      this.updateBMIPreview();
                    }
                  })

                Text('.')
                  .fontSize(32)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#333333')

                // 小数部分滚轮
                TextPicker({ range: this.getDecimalRange(), selected: this.getDecimalIndex() })
                  .layoutWeight(1)
                  .height(120)
                  .onChange((value: string | string[], index: number | number[]) => {
                    const selectedValue = typeof value === 'string' ? value : value[0];
                    const currentInt = this.getIntPart();
                    const newWeight = `${currentInt}.${selectedValue}`;
                    if (newWeight !== this.weight) {
                      this.weight = newWeight;
                      this.updateBMIPreview();
                    }
                  })

                Text(this.useKg ? 'kg' : '斤')
                  .fontSize(16)
                  .fontColor('#999999')
                  .margin({ left: 8 })
              }
              .width('100%')
              .padding({ left: 20, right: 20 })

              // 精确输入框（可切换）
              TextInput({ placeholder: '0', text: this.weight, controller: this.weightController })
                .type(InputType.Normal)
                .fontSize(20)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
                .placeholderColor('#999999')
                .textAlign(TextAlign.Center)
                .width('100%')
                .height(48)
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .inputFilter('[0-9.]')
                .onChange((value: string) => {
                  let filtered = value.replace(/[^0-9.]/g, '');
                  const parts = filtered.split('.');
                  if (parts.length > 2) {
                    filtered = parts[0] + '.' + parts.slice(1).join('');
                  }
                  this.weight = filtered;
                  this.updateBMIPreview();
                })
                .onBlur(() =>{
                  let itemWeight = parseFloat(this.weight);
                  this.weight = itemWeight.toFixed(2);
                  this.updateBMIPreview();
                })

              Row({ space: 8 }) {
                ForEach([-1, -0.5, -0.1, 0.1, 0.5, 1], (step: number) => {
                  Button(step > 0 ? `+${step}` : `${step}`)
                    .fontSize(12)
                    .fontColor(step > 0 ? '#FF6B6B' : '#4CAF50')
                    .backgroundColor(step > 0 ? '#FFF0F0' : '#F0FFF0')
                    .height(32)
                    .padding({ left: 8, right: 8 })
                    .borderRadius(16)
                    .onClick(() => {
                      this.adjustWeight(step);
                    })
                }, (step: number) => step.toString())
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .padding(16)

            // 日期时间卡片
            Row({ space: 16 }) {
              Column({ space: 8 }) {
                Text('测量日期')
                  .fontSize(13)
                  .fontColor('#999999')
                Text(this.formatDisplayDate())
                  .fontSize(16)
                  .fontColor('#333333')
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                  .padding({ left: 16, right: 16, top: 10, bottom: 10 })
                  .backgroundColor('#F5F5F5')
                  .borderRadius(8)
                  .width('100%')
              }
              .layoutWeight(2)
              .onClick(() => {
                this.isShowDatePicker = true;
              })

              Column({ space: 8 }) {
                Text('测量时间')
                  .fontSize(13)
                  .fontColor('#999999')
                Text(this.formatDisplayTime())
                  .fontSize(16)
                  .fontColor('#333333')
                  .maxLines(1)
                  .padding({ left: 16, right: 16, top: 10, bottom: 10 })
                  .backgroundColor('#F5F5F5')
                  .borderRadius(8)
                  .width('100%')
              }
              .layoutWeight(1)
              .onClick(() => {
                this.isShowTimePicker = true;
              })
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .padding(16)

            // 体脂率
            Column({ space: 8 }) {
              Text('体脂率 %（可选）')
                .fontSize(14)
                .fontColor('#333333')
                .alignSelf(ItemAlign.Start)
              TextInput({ placeholder: '例如 22.50', text: $$this.bodyFatRate, controller: this.bodyFatController })
                .type(InputType.Normal)
                .height(48)
                .fontColor('#333333')
                .placeholderColor('#999999')
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .padding({ left: 16 })
                .inputFilter('[0-9.]')
                .maxLength(5)
                .onChange((value: string) => {
                  let filtered = value.replace(/[^0-9.]/g, '');
                  const dotIdx = filtered.indexOf('.');
                  if (dotIdx >= 0) {
                    const intPart = filtered.substring(0, dotIdx);
                    const decPart = filtered.substring(dotIdx + 1).replace(/\./g, '');
                    filtered = intPart + '.' + decPart.substring(0, 2);
                  }
                  if (filtered !== value) {
                    this.bodyFatRate = filtered;
                  }
                })
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .padding(16)

            // 备注
            Column({ space: 8 }) {
              Text('备注')
                .fontSize(14)
                .fontColor('#333333')
                .alignSelf(ItemAlign.Start)
              TextInput({ placeholder: '例如 晨起空腹', text: $$this.notes })
                .height(48)
                .fontColor('#333333')
                .placeholderColor('#999999')
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .padding({ left: 16 })
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .padding(16)

            // BMI 预览
            if (this.bmiPreview > 0) {
              Row() {
                Text(`BMI: ${this.bmiPreview.toFixed(1)}`)
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor(DateUtil.getBMIColor(this.bmiPreview))
                Text(DateUtil.getBMICategory(this.bmiPreview))
                  .fontSize(14)
                  .fontColor('#999999')
                  .margin({ left: 8 })
              }
              .width('100%')
              .padding(12)
              .backgroundColor(`${DateUtil.getBMIColor(this.bmiPreview)}10`)
              .borderRadius(16)
            }

            // 身高
            if (this.isEditingHeight) {
              Column({ space: 8 }) {
                Text('请输入身高（cm）')
                  .fontSize(14)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                TextInput({ placeholder: '例如 170', text: $$this.tempHeight })
                  .type(InputType.Number)
                  .height(48)
                  .fontColor('#333333')
                  .placeholderColor('#999999')
                  .backgroundColor('#F5F5F5')
                  .borderRadius(8)
                  .padding({ left: 16 })
                Row({ space: 12 }) {
                  Button('取消')
                    .fontSize(14)
                    .fontColor('#666666')
                    .backgroundColor('#F0F0F0')
                    .height(40)
                    .padding({ left: 20, right: 20 })
                    .borderRadius(8)
                    .onClick(() => {
                      this.isEditingHeight = false;
                      this.tempHeight = '';
                    })
                  Button('确定')
                    .fontSize(14)
                    .fontColor('#FFFFFF')
                    .backgroundColor('#333333')
                    .height(40)
                    .padding({ left: 20, right: 20 })
                    .borderRadius(8)
                    .onClick(async () => {
                      await this.saveHeight();
                    })
                }
                .width('100%')
                .justifyContent(FlexAlign.End)
              }
              .width('100%')
              .backgroundColor('#FFFFFF')
              .borderRadius(16)
              .padding(16)
            } else {
              Row() {
                Column({ space: 4 }) {
                  Text('身高')
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                    .fontColor('#333333')
                  Text('用于计算 BMI')
                    .fontSize(12)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Text(this.userHeight > 0 ? `${this.userHeight} cm` : '点击输入')
                  .fontSize(16)
                  .fontColor(this.userHeight > 0 ? '#666666' : '#007DFF')
              }
              .width('100%')
              .backgroundColor('#FFFFFF')
              .borderRadius(16)
              .padding(16)
              .onClick(() => {
                this.tempHeight = this.userHeight > 0 ? this.userHeight.toString() : '';
                this.isEditingHeight = true;
              })
            }
          }
          .width('100%')
          .padding(16)
        }
        .width('100%')
        .layoutWeight(1)
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#F5F5F5')

      // 日期选择器弹窗
      if (this.isShowDatePicker) {
        Column({ space: 16 }) {
          DatePicker({
            start: new Date('1970-1-1'),
            end: new Date('2100-12-31'),
            selected: new Date(this.date)
          })
            .onDateChange((value: Date) => {
              this.date = value.getTime();
            })
          Button('确定')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor('#FFFFFF')
            .backgroundColor('#333333')
            .borderRadius(12)
            .onClick(() => {
              this.isShowDatePicker = false;
            })
        }
        .width('100%')
        .backgroundColor('#FFFFFF')
        .borderRadius({ topLeft: 20, topRight: 20 })
        .padding(16)
      }

      // 时间选择器弹窗
      if (this.isShowTimePicker) {
        Column({ space: 16 }) {
          TimePicker({
            selected: new Date(this.time)
          })
            .onChange((value: TimePickerResult) => {
              this.time = new Date(1970, 0, 1, value.hour, value.minute).getTime();
            })
          Button('确定')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor('#FFFFFF')
            .backgroundColor('#333333')
            .borderRadius(12)
            .onClick(() => {
              this.isShowTimePicker = false;
            })
        }
        .width('100%')
        .backgroundColor('#FFFFFF')
        .borderRadius({ topLeft: 20, topRight: 20 })
        .padding(16)
      }
    }
    .width('100%')
    .height('100%')
  }
}

@Component
struct FormItem {
  @Prop label: string = '';
  @BuilderParam content: () => void;

  build() {
    Column({ space: 8 }) {
      Text(this.label)
        .fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor('#666666')
        .alignSelf(ItemAlign.Start)

      this.content()
    }
    .width('100%')
  }
}
