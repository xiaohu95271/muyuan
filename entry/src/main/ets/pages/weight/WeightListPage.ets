
import { AppConstants } from '../../common/constants/AppConstants';
import { DatabaseManager } from '../../common/database/DatabaseManager';
import { WeightModel, WeightGoal } from '../../models/WeightModel';
import { DateUtil } from '../../common/utils/DateUtil';
import { EventUtil } from '../../common/utils/EventUtil';
import { preferences } from '@kit.ArkData';


@Entry
@Component
struct WeightListPage {
  @State weightList: WeightModel[] = [];
  @State isLoading: boolean = false;
  @State weightGoal: WeightGoal = new WeightGoal();
  @State latestWeight: number = 0;
  @State latestBmi: number = 0;
  @State swipeDeleteId: number = -1;
  private weightEventId: number = -1;

  aboutToAppear() {
    this.loadWeightGoal();
    this.loadWeights();
    this.weightEventId = EventUtil.onWeightSaved(() => {
      this.loadWeights();
    });
  }

  aboutToDisappear() {
    EventUtil.offWeightSaved(this.weightEventId);
  }

  onPageShow() {
    try {
      this.loadWeightGoal();
      this.loadWeights();
    } catch (e) {
      console.error('WeightListPage onPageShow error:', JSON.stringify(e));
    }
  }

  async loadWeightGoal() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      if (goalStr) {
        let parsed: WeightGoal = JSON.parse(goalStr) as WeightGoal;
        this.weightGoal = parsed;
      }
    } catch (e) {
      console.error('Load weight goal error:', JSON.stringify(e));
    }
  }

  async loadWeights() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.weightList = await DatabaseManager.getInstance().queryAllWeights();
    if (this.weightList.length > 0) {
      const latest = this.weightList[this.weightList.length - 1];
      this.latestWeight = latest.weight;
      this.latestBmi = latest.bmi;
    }
    this.isLoading = false;
  }

  async deleteWeight(id: number) {
    await DatabaseManager.getInstance().deleteWeight(id);
    this.loadWeights();
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button('<')
          .fontSize(28)
          .fontColor('#333333')
          .width(56)
          .height(56)
          .type(ButtonType.Circle)
          .backgroundColor('transparent')
          .onClick(() => {
            this.getUIContext().getRouter().back();
          })

        Text('体重记录')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')

        Row({ space: 8 }) {
          Button('图')
            .fontSize(18)
            .fontColor('#333333')
            .width(56)
            .height(56)
            .type(ButtonType.Circle)
            .backgroundColor('transparent')
            .onClick(() => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
            })

          Button('+')
            .fontSize(32)
            .fontColor('#007DFF')
            .width(56)
            .height(56)
            .type(ButtonType.Circle)
            .backgroundColor('#E3F2FD')
            .onClick(() => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
            })
        }
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 8 })
      .justifyContent(FlexAlign.SpaceBetween)
      .backgroundColor('#FFFFFF')

      // 最新数据概览卡片
      Row({ space: 16 }) {
        Column({ space: 4 }) {
          Text('最新体重')
            .fontSize(12)
            .fontColor('#757575')
          Text(this.latestWeight > 0 ? `${this.latestWeight.toFixed(1)}` : '--')
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor('#333333')
          Text('kg')
            .fontSize(12)
            .fontColor('#757575')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        Column({ space: 4 }) {
          Text('BMI')
            .fontSize(12)
            .fontColor('#757575')
          Text(this.latestBmi > 0 ? `${this.latestBmi.toFixed(1)}` : '--')
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor(DateUtil.getBMIColor(this.latestBmi))
          Text(this.latestBmi > 0 ? DateUtil.getBMICategory(this.latestBmi) : '')
            .fontSize(12)
            .fontColor(DateUtil.getBMIColor(this.latestBmi))
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        Column({ space: 4 }) {
          Text('目标')
            .fontSize(12)
            .fontColor('#757575')
          Text(this.weightGoal.targetWeight > 0 ? `${this.weightGoal.targetWeight.toFixed(1)}` : '--')
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor('#007DFF')
          Text('kg')
            .fontSize(12)
            .fontColor('#757575')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)
      }
      .width('100%')
      .padding(20)
      .backgroundColor('#FFFFFF')
      .margin({ bottom: 12 })

      // 记录列表
      if (this.isLoading) {
        LoadingProgress()
          .width(48)
          .height(48)
          .color('#FF6B6B')
          .margin({ top: 80 })
      } else if (this.weightList.length === 0) {
        Column({ space: 16 }) {
          Text('暂无体重记录')
            .fontSize(16)
            .fontColor('#757575')
          Button('记录今日体重')
            .type(ButtonType.Capsule)
            .backgroundColor('#FF6B6B')
            .onClick(() => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
            })
        }
        .margin({ top: 80 })
      } else {
        List({ space: 12 }) {
          ForEach(this.weightList.slice().reverse(), (item: WeightModel) => {
            ListItem() {
              WeightCard({
                item: item,
                targetWeight: this.weightGoal.targetWeight,
                onEdit: () => {
                  this.getUIContext().getRouter().pushUrl({
                    url: AppConstants.PAGE_WEIGHT_DETAIL,
                    params: { id: item.id }
                  });
                }
              })
            }
            .swipeAction({ end: this.DeleteBuilder })
            .onTouch((event) => {
              if (event.type === 2) {
                this.swipeDeleteId = item.id;
              }
            })
          }, (item: WeightModel) => item.id.toString() + '_' + item.updateTime)
        }
        .width('100%')
        .layoutWeight(1)
        .padding({ left: 16, right: 16 })
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  DeleteBuilder() {
    Button() {
      Shape() {
        Path()
          .width(20)
          .height(20)
          .commands('M3 6 L5 6 L5 17 L15 17 L15 6 L17 6 M7 3 L7 6 M13 3 L13 6 M7 9 L7 14 M13 9 L13 14')
          .stroke('#FFFFFF')
          .strokeWidth(1.5)
          .fill('none')
      }
      .width(24)
      .height(24)
    }
    .width(60)
    .height('100%')
    .type(ButtonType.Normal)
    .backgroundColor('#FF4444')
    .margin({ left: 8 })
    .onClick(() => {
      if (this.swipeDeleteId > 0) {
        this.deleteWeight(this.swipeDeleteId);
        this.swipeDeleteId = -1;
      }
    })
  }
}

@Component
struct WeightCard {
  @Prop item: WeightModel;
  @Prop targetWeight: number = 0;
  onEdit: () => void = () => {};

  getWeightDiff(): string {
    if (this.targetWeight <= 0) return '';
    const diff = this.item.weight - this.targetWeight;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}kg`;
  }

  getWeightDiffColor(): string {
    if (this.targetWeight <= 0) return '#757575';
    const diff = this.item.weight - this.targetWeight;
    if (Math.abs(diff) < 0.5) return '#4CAF50';
    return diff > 0 ? '#FF9800' : '#2196F3';
  }

  build() {
    Row({ space: 16 }) {
      // 日期
      Column({ space: 2 }) {
        Text(DateUtil.formatDate(this.item.date).split('-')[2])
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FF6B6B')
        Text(`${DateUtil.formatDate(this.item.date).split('-')[0]}-${DateUtil.formatDate(this.item.date).split('-')[1]}`)
          .fontSize(11)
          .fontColor('#757575')
      }
      .width(50)
      .alignItems(HorizontalAlign.Center)

      // 体重信息
      Column({ space: 4 }) {
        Row({ space: 8 }) {
          Text(`${this.item.weight.toFixed(1)}`)
            .fontSize(20)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333333')
          Text('kg')
            .fontSize(12)
            .fontColor('#757575')

          if (this.targetWeight > 0) {
            Text(this.getWeightDiff())
              .fontSize(11)
              .fontColor(this.getWeightDiffColor())
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(`${this.getWeightDiffColor()}15`)
              .borderRadius(6)
          }
        }

        Row({ space: 12 }) {
          Text(`BMI ${this.item.bmi.toFixed(1)}`)
            .fontSize(12)
            .fontColor(DateUtil.getBMIColor(this.item.bmi))
          if (this.item.bodyFatRate > 0) {
            Text(`体脂 ${this.item.bodyFatRate.toFixed(1)}%`)
              .fontSize(12)
              .fontColor('#757575')
          }
        }

        if (this.item.notes) {
          Text(this.item.notes)
            .fontSize(12)
            .fontColor('#757575')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      // 箭头
      Shape() {
        Path()
          .width(16)
          .height(16)
          .commands('M5 3 L12 8 L5 13')
          .stroke('#888888')
          .strokeWidth(2)
          .fill('none')
      }
      .width(16)
      .height(16)
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .shadow({ radius: 4, color: '#0D000000', offsetY: 2 })
    .onClick(() => {
      this.onEdit();
    })
  }
}
