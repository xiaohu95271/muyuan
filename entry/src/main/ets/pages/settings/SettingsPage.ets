
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

        Text('设置')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')

        Blank()
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 16 })
      .backgroundColor('#FFFFFF')

      Scroll() {
        Column({ space: 16 }) {
          // 安全设置
          SettingSection({ title: '安全设置' }) {
            SettingToggleItem('应用锁', this.appLockEnabled, (value) => {
              this.appLockEnabled = value;
              this.saveAppLock(value);
            })

            if (this.appLockEnabled) {
              SettingItem({ label: '应用锁密码' }) {
                TextInput({ placeholder: '4-6位数字密码', text: '' })
                  .type(InputType.Number)
                  .width(120)
                  .height(36)
                  .backgroundColor('#F5F5F5')
                  .borderRadius(8)
                  .maxLength(6)
                  .onChange((value) => {
                    if (value.length >= 4) {
                      this.saveAppLockPin(value);
                    }
                  })
              }

              SettingItem({ label: '自动锁定时间' }) {
                Text(`${this.autoLockTimeout} 分钟`)
                  .fontSize(14)
                  .fontColor('#999999')
              }
            }

            SettingToggleItem('剪贴板自动清除', this.clipboardClearEnabled, (value) => {
              this.clipboardClearEnabled = value;
              this.saveClipboardClear(value);
            })
          }

          // 体重目标设置
          SettingSection({ title: '体重管理' }) {
            SettingItem({ label: '目标体重' }) {
              TextInput({ placeholder: 'kg', text: this.weightGoal.targetWeight > 0 ? this.weightGoal.targetWeight.toString() : '' })
                .type(InputType.Number)
                .width(100)
                .height(36)
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
            }

            SettingItem({ label: '身高' }) {
              TextInput({ placeholder: 'cm', text: this.weightGoal.height > 0 ? this.weightGoal.height.toString() : '' })
                .type(InputType.Number)
                .width(100)
                .height(36)
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
            }
          }

          // 数据管理
          SettingSection({ title: '数据管理' }) {
            SettingItem({ label: '清除密码数据' }) {
              Text('')
              Button() {
                Shape() {
                  Path()
                    .width(20)
                    .height(20)
                    .commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11')
                    .stroke('#FF4444')
                    .strokeWidth(1.2)
                    .fill('none')
                }
                .width(22)
                .height(22)
              }
              .width(32)
              .height(32)
              .type(ButtonType.Circle)
              .backgroundColor('transparent')
              .onClick(() => {
                this.clearPasswords();
              })
            }

            SettingItem({ label: '清除体重数据' }) {
              Text('')
              Button() {
                Shape() {
                  Path()
                    .width(20)
                    .height(20)
                    .commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11')
                    .stroke('#FF4444')
                    .strokeWidth(1.2)
                    .fill('none')
                }
                .width(22)
                .height(22)
              }
              .width(32)
              .height(32)
              .type(ButtonType.Circle)
              .backgroundColor('transparent')
              .onClick(() => {
                this.clearWeights();
              })
            }

            SettingItem({ label: '导出数据' }) {
              Text('')
              Button() {
                Shape() {
                  Path()
                    .width(20)
                    .height(20)
                    .commands('M8 2 L8 12 M4 8 L8 12 L12 8 M2 14 L14 14')
                    .stroke('#007DFF')
                    .strokeWidth(1.2)
                    .fill('none')
                }
                .width(22)
                .height(22)
              }
              .width(32)
              .height(32)
              .type(ButtonType.Circle)
              .backgroundColor('transparent')
              .onClick(() => {
                this.exportData();
              })
            }
          }

          // 关于
          SettingSection({ title: '关于' }) {
            SettingItem({ label: '版本' }) {
              Text('1.0.0')
                .fontSize(14)
                .fontColor('#999999')
            }
            
            SettingItem({ label: '数据存储' }) {
              Text('本地加密')
                .fontSize(14)
                .fontColor('#4CAF50')
            }
          }
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

@Builder
function SettingToggleItem(label: string, isOn: boolean, onChange: (value: boolean) => void) {
  Row() {
    Text(label)
      .fontSize(15)
      .fontColor('#333333')
      .layoutWeight(1)

    Toggle({ type: ToggleType.Switch, isOn: isOn })
      .selectedColor('#007DFF')
      .onChange(onChange)
  }
  .width('100%')
  .height(52)
  .padding({ left: 16, right: 16 })
  .justifyContent(FlexAlign.SpaceBetween)
}

@Component
struct SettingSection {
  @Prop title: string = '';
  @BuilderParam content: () => void;

  build() {
    Column({ space: 0 }) {
      Text(this.title)
        .fontSize(13)
        .fontColor('#999999')
        .padding({ left: 16, top: 16, bottom: 8 })
        .alignSelf(ItemAlign.Start)

      Column() {
        this.content()
      }
      .width('100%')
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
      .padding({ top: 4, bottom: 4 })
      .margin({ left: 16, right: 16 })
    }
    .width('100%')
  }
}

@Component
struct SettingItem {
  @Prop label: string = '';
  @BuilderParam content: () => void;

  build() {
    Row() {
      Text(this.label)
        .fontSize(15)
        .fontColor('#333333')
        .layoutWeight(1)

      this.content()
    }
    .width('100%')
    .height(52)
    .padding({ left: 16, right: 16 })
    .justifyContent(FlexAlign.SpaceBetween)
  }
}
