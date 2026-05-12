
import { AppConstants } from '../../common/constants/AppConstants';
import { WeightGoal } from '../../models/WeightModel';
import { preferences } from '@kit.ArkData';
import { DatabaseManager } from '../../common/database/DatabaseManager';
import { ToastUtil } from '../../common/utils/ToastUtil';
import { promptAction } from '@kit.ArkUI';
import { pasteboard } from '@kit.BasicServicesKit';

@Entry
@Component
struct SettingsPage {
  @State weightGoal: WeightGoal = new WeightGoal();
  @State appLockEnabled: boolean = false;
  @State autoLockTimeout: number = AppConstants.DEFAULT_AUTO_LOCK_MINUTES;
  @State clipboardClearEnabled: boolean = true;

  aboutToAppear() {
    this.loadSettings();
  }

  loadSettings() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });

      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      if (goalStr) {
        let parsed: WeightGoal = JSON.parse(goalStr) as WeightGoal;
        this.weightGoal = parsed;
      }

      this.appLockEnabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
      this.autoLockTimeout = pref.getSync(AppConstants.PREF_AUTO_LOCK_TIMEOUT, AppConstants.DEFAULT_AUTO_LOCK_MINUTES) as number;
      this.clipboardClearEnabled = pref.getSync(AppConstants.PREF_CLIPBOARD_CLEAR, true) as boolean;
    } catch (e) {
      console.error('Load settings error:', JSON.stringify(e));
    }
  }

  saveWeightGoal() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const existingStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      let existing: WeightGoal = existingStr ? JSON.parse(existingStr) as WeightGoal : new WeightGoal();
      existing.targetWeight = this.weightGoal.targetWeight;
      existing.targetDate = this.weightGoal.targetDate;
      // 保留已有的身高，不覆盖
      pref.put(AppConstants.PREF_WEIGHT_GOAL, JSON.stringify(existing));
      pref.flush();
    } catch (e) {
      console.error('Save weight goal error:', JSON.stringify(e));
    }
  }

  saveAppLock(enabled: boolean) {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      pref.put(AppConstants.PREF_APP_LOCK_ENABLED, enabled);
      pref.flush();
    } catch (e) {
      console.error('Save app lock error:', JSON.stringify(e));
    }
  }

  saveAppLockPin(pin: string) {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      pref.put(AppConstants.PREF_APP_LOCK_PIN, pin);
      pref.flush();
      ToastUtil.show('PIN 码已保存');
    } catch (e) {
      console.error('Save pin error:', JSON.stringify(e));
      ToastUtil.show('保存失败');
    }
  }

  saveAutoLockTimeout(timeout: number) {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      pref.put(AppConstants.PREF_AUTO_LOCK_TIMEOUT, timeout);
      pref.flush();
    } catch (e) {
      console.error('Save auto lock error:', JSON.stringify(e));
    }
  }

  saveClipboardClear(enabled: boolean) {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      pref.put(AppConstants.PREF_CLIPBOARD_CLEAR, enabled);
      pref.flush();
    } catch (e) {
      console.error('Save clipboard clear error:', JSON.stringify(e));
    }
  }

  async clearPasswords() {
    try {
      const result = await promptAction.showDialog({
        title: '确认清除',
        message: '确定要清除所有密码数据吗？此操作不可恢复。',
        buttons: [
          {
            text: '取消',
            color: '#999999'
          },
          {
            text: '确定',
            color: '#007DFF'
          }
        ]
      });
      if (result.index === 1) {
        await DatabaseManager.getInstance().clearAllPasswords();
        ToastUtil.show('密码数据已清除');
      }
    } catch (e) {
      console.error('Show dialog error:', JSON.stringify(e));
    }
  }

  async clearWeights() {
    try {
      const result = await promptAction.showDialog({
        title: '确认清除',
        message: '确定要清除所有体重数据吗？此操作不可恢复。',
        buttons: [
          {
            text: '取消',
            color: '#999999'
          },
          {
            text: '确定',
            color: '#007DFF'
          }
        ]
      });
      if (result.index === 1) {
        await DatabaseManager.getInstance().clearAllWeights();
        ToastUtil.show('体重数据已清除');
      }
    } catch (e) {
      console.error('Show dialog error:', JSON.stringify(e));
    }
  }

  async exportData() {
    try {
      const jsonStr = await DatabaseManager.getInstance().exportAllData();
      if (jsonStr) {
        const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, jsonStr);
        const systemPasteboard = pasteboard.getSystemPasteboard();
        await systemPasteboard.setData(pasteData);
        ToastUtil.show('数据已导出到剪贴板');
      }
    } catch (e) {
      console.error('Export data error:', JSON.stringify(e));
      ToastUtil.show('导出失败');
    }
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button() {
          SymbolGlyph($r('sys.symbol.chevron_left'))
            .fontSize(22)
            .fontColor(['#333333'])
        }
        .width(40)
        .height(40)
        .type(ButtonType.Circle)
        .backgroundColor('transparent')
        .onClick(() => {
          this.getUIContext().getRouter().back();
        })

        Text('设置')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
          .margin({ left: 4 })

        Blank()
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .alignItems(VerticalAlign.Center)

      Scroll() {
        Column({ space: 20 }) {
          // 安全设置
          Column({ space: 0 }) {
            Row() {
              Text('安全设置')
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#666666')
              Blank()
              Divider().width('60%').color('#EEEEEE')
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 8 })

            Column() {
              // 应用锁
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.lock'))
                    .fontSize(18)
                    .fontColor(['#007DFF'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#E8F0FE')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('应用锁')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('开启后进入应用需要验证')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Toggle({ type: ToggleType.Switch, isOn: this.appLockEnabled })
                  .selectedColor('#007DFF')
                  .switchPointColor('#FFFFFF')
                  .backgroundColor('#E0E0E0')
                  .border({ width: 1.5, color: this.appLockEnabled ? '#007DFF' : '#BDBDBD', radius: 14 })
                  .onChange((value: boolean) => {
                    this.appLockEnabled = value;
                    this.saveAppLock(value);
                  })
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)

              if (this.appLockEnabled) {
                Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

                Row() {
                  Column({ space: 2 }) {
                    Text('应用锁密码')
                      .fontSize(15)
                      .fontColor('#333333')
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)

                  TextInput({ placeholder: '4-6位数字密码', text: '' })
                    .type(InputType.Number)
                    .width(130)
                    .height(36)
                    .fontColor('#333333')
                    .placeholderColor('#999999')
                    .backgroundColor('#F5F5F5')
                    .borderRadius(8)
                    .maxLength(6)
                    .onChange((value) => {
                      if (value.length >= 4) {
                        this.saveAppLockPin(value);
                      }
                    })
                }
                .width('100%')
                .height(52)
                .padding({ left: 66, right: 16 })
                .alignItems(VerticalAlign.Center)

                Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

                Row() {
                  Text('自动锁定时间')
                    .fontSize(15)
                    .fontColor('#333333')
                    .layoutWeight(1)
                  Text(`${this.autoLockTimeout} 分钟`)
                    .fontSize(14)
                    .fontColor('#999999')
                }
                .width('100%')
                .height(52)
                .padding({ left: 66, right: 16 })
                .alignItems(VerticalAlign.Center)
              }

              Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

              // 剪贴板自动清除
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
                    .fontSize(18)
                    .fontColor(['#007DFF'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#E8F0FE')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('剪贴板自动清除')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('自动清除剪贴板内容')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Toggle({ type: ToggleType.Switch, isOn: this.clipboardClearEnabled })
                  .selectedColor('#007DFF')
                  .switchPointColor('#FFFFFF')
                  .backgroundColor('#E0E0E0')
                  .border({ width: 1.5, color: this.clipboardClearEnabled ? '#007DFF' : '#BDBDBD', radius: 14 })
                  .onChange((value: boolean) => {
                    this.clipboardClearEnabled = value;
                    this.saveClipboardClear(value);
                  })
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .margin({ left: 16, right: 16 })
            .padding({ top: 4, bottom: 4 })
          }
          .width('100%')

          // 体重管理
          Column({ space: 0 }) {
            Row() {
              Text('体重管理')
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#666666')
              Blank()
              Divider().width('60%').color('#EEEEEE')
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 8 })

            Column() {
              // 目标体重
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
                    .fontSize(18)
                    .fontColor(['#4CAF50'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#E8F5E9')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('目标体重')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('设置你的目标体重')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Row({ space: 4 }) {
                  TextInput({ placeholder: '60', text: this.weightGoal.targetWeight > 0 ? this.weightGoal.targetWeight.toString() : '' })
                    .type(InputType.Number)
                    .width(60)
                    .height(34)
                    .fontColor('#333333')
                    .fontSize(15)
                    .textAlign(TextAlign.Center)
                    .placeholderColor('#CCCCCC')
                    .backgroundColor('#F5F5F5')
                    .borderRadius(8)
                    .onChange((value) => {
                      let g = new WeightGoal();
                      g.targetWeight = parseFloat(value) || 0;
                      g.targetDate = this.weightGoal.targetDate;
                      g.height = this.weightGoal.height;
                      this.weightGoal = g;
                      this.saveWeightGoal();
                    })
                  Text('kg')
                    .fontSize(13)
                    .fontColor('#999999')
                }
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)

              Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

              // 身高
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
                    .fontSize(18)
                    .fontColor(['#4CAF50'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#E8F5E9')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('身高')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('设置你的身高')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Row({ space: 4 }) {
                  TextInput({ placeholder: '170', text: this.weightGoal.height > 0 ? this.weightGoal.height.toString() : '' })
                    .type(InputType.Number)
                    .width(60)
                    .height(34)
                    .fontColor('#333333')
                    .fontSize(15)
                    .textAlign(TextAlign.Center)
                    .placeholderColor('#CCCCCC')
                    .backgroundColor('#F5F5F5')
                    .borderRadius(8)
                    .onChange((value) => {
                      let g2 = new WeightGoal();
                      g2.targetWeight = this.weightGoal.targetWeight;
                      g2.targetDate = this.weightGoal.targetDate;
                      g2.height = parseFloat(value) || 170;
                      this.weightGoal = g2;
                      this.saveWeightGoal();
                    })
                  Text('cm')
                    .fontSize(13)
                    .fontColor('#999999')
                }
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .margin({ left: 16, right: 16 })
            .padding({ top: 4, bottom: 4 })
          }
          .width('100%')

          // 数据管理
          Column({ space: 0 }) {
            Row() {
              Text('数据管理')
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#666666')
              Blank()
              Divider().width('60%').color('#EEEEEE')
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 8 })

            Column() {
              // 清除密码数据
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.star'))
                    .fontSize(18)
                    .fontColor(['#7C4DFF'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#EDE7F6')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('清除密码数据')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('删除所有密码记录')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Text('>')
                  .fontSize(18)
                  .fontColor('#CCCCCC')
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)
              .onClick(() => {
                this.clearPasswords();
              })

              Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

              // 清除体重数据
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
                    .fontSize(18)
                    .fontColor(['#FF5252'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#FFEBEE')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('清除体重数据')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('删除所有体重记录')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Text('>')
                  .fontSize(18)
                  .fontColor('#CCCCCC')
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)
              .onClick(() => {
                this.clearWeights();
              })

              Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

              // 导出数据
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
                    .fontSize(18)
                    .fontColor(['#FF8A00'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#FFF3E0')
                .margin({ right: 12 })

                Column({ space: 2 }) {
                  Text('导出数据')
                    .fontSize(15)
                    .fontColor('#333333')
                  Text('将数据导出为文件')
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Text('>')
                  .fontSize(18)
                  .fontColor('#CCCCCC')
              }
              .width('100%')
              .height(64)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)
              .onClick(() => {
                this.exportData();
              })
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .margin({ left: 16, right: 16 })
            .padding({ top: 4, bottom: 4 })
          }
          .width('100%')

          // 关于
          Column({ space: 0 }) {
            Row() {
              Text('关于')
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#666666')
              Blank()
              Divider().width('60%').color('#EEEEEE')
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 8 })

            Column() {
              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.info_circle'))
                    .fontSize(18)
                    .fontColor(['#007DFF'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#E8F0FE')
                .margin({ right: 12 })

                Text('版本')
                  .fontSize(15)
                  .fontColor('#333333')
                  .layoutWeight(1)

                Text('1.0.0')
                  .fontSize(14)
                  .fontColor('#999999')
              }
              .width('100%')
              .height(56)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)

              Divider().color('#F0F0F0').margin({ left: 66, right: 16 })

              Row() {
                Column() {
                  SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
                    .fontSize(18)
                    .fontColor(['#007DFF'])
                }
                .width(38)
                .height(38)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(10)
                .backgroundColor('#E8F0FE')
                .margin({ right: 12 })

                Text('数据存储')
                  .fontSize(15)
                  .fontColor('#333333')
                  .layoutWeight(1)

                Text('本地加密存储')
                  .fontSize(14)
                  .fontColor('#4CAF50')
              }
              .width('100%')
              .height(56)
              .padding({ left: 16, right: 16 })
              .alignItems(VerticalAlign.Center)
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .margin({ left: 16, right: 16 })
            .padding({ top: 4, bottom: 4 })
          }
          .width('100%')
        }
        .width('100%')
        .padding({ top: 8, bottom: 20 })
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
