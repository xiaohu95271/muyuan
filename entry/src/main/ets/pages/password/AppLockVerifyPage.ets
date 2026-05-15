import { AppConstants } from '../../common/constants/AppConstants';
import { preferences } from '@kit.ArkData';
import { ToastUtil } from '../../common/utils/ToastUtil';


@Entry
@Component
struct AppLockVerifyPage {
  @State pinCode: string = '';
  @State verifyStatus: number = 0; // 0: 待验证 1: 验证中 2: 成功
  @State isMandatory: boolean = false; // 是否强制验证（应用启动/前台切换）
  @StorageLink('need_lock_verify') needLockVerify: boolean = false;

  aboutToAppear() {
    // 检查是否是强制验证模式（应用启动/前台切换触发）
    const params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
    if (params && params['mandatory'] as boolean) {
      this.isMandatory = true;
    }
    // 检查是否设置了 PIN 码
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const pin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
      if (!pin) {
        // 未设置 PIN 码，解锁并返回
        this.needLockVerify = false;
        this.getUIContext().getRouter().back();
      }
    } catch (e) {
      console.error('Check lock pin error:', JSON.stringify(e));
    }
  }

  verifyPin() {
    if (this.pinCode.length < 4) {
      ToastUtil.show('请输入至少 4 位数字');
      return;
    }
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const storedPin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
      if (this.pinCode === storedPin) {
        this.verifyStatus = 2;
        // 解锁成功，清除锁定标志
        this.needLockVerify = false;
        ToastUtil.show('验证成功');
        this.getUIContext().getRouter().back();
      } else {
        this.verifyStatus = 0;
        this.pinCode = '';
        ToastUtil.show('PIN 码错误，请重试');
      }
    } catch (e) {
      console.error('Verify pin error:', JSON.stringify(e));
      ToastUtil.show('验证失败');
    }
  }

  build() {
    Column({ space: 24 }) {
      // 顶部导航栏
      Row() {
        if (!this.isMandatory) {
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
        } else {
          Blank().width(52)
        }

        Text('应用锁验证')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')

        Blank()
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 16 })
      .justifyContent(FlexAlign.SpaceBetween)
      .backgroundColor('#FFFFFF')

      Column({ space: 32 }) {
        Shape() {
          Path()
            .width(48)
            .height(48)
            .commands('M14 24 L14 16 A10 10 0 1 1 34 16 L34 24 M10 24 L38 24 L38 42 L10 42 Z M24 30 A2 2 0 1 0 24 36 A2 2 0 1 0 24 30')
            .stroke('#007DFF')
            .strokeWidth(2)
            .fill('none')
        }
        .width(64)
        .height(64)

        Text('请输入应用锁密码')
          .fontSize(16)
          .fontColor('#666666')

        // PIN 显示区域
        Row({ space: 12 }) {
          ForEach([0, 1, 2, 3, 4, 5], (index: number) => {
            Row()
              .width(16)
              .height(16)
              .backgroundColor(index < this.pinCode.length ? '#007DFF' : '#E0E0E0')
              .borderRadius(8)
          }, (index: number) => index.toString())
        }
        .height(40)
        .justifyContent(FlexAlign.Center)

        // 数字键盘
        Column({ space: 16 }) {
          Row({ space: 24 }) {
            PinButton('1', (v) => { this.appendPin(v); })
            PinButton('2', (v) => { this.appendPin(v); })
            PinButton('3', (v) => { this.appendPin(v); })
          }
          Row({ space: 24 }) {
            PinButton('4', (v) => { this.appendPin(v); })
            PinButton('5', (v) => { this.appendPin(v); })
            PinButton('6', (v) => { this.appendPin(v); })
          }
          Row({ space: 24 }) {
            PinButton('7', (v) => { this.appendPin(v); })
            PinButton('8', (v) => { this.appendPin(v); })
            PinButton('9', (v) => { this.appendPin(v); })
          }
          Row({ space: 24 }) {
            Blank().width(64)
            PinButton('0', (v) => { this.appendPin(v); })
            Button() {
              Shape() {
                Path()
                  .width(24)
                  .height(24)
                  .commands('M14 3 L5 10 L14 17 M5 10 L16 10')
                  .stroke('#666666')
                  .strokeWidth(2)
                  .fill('none')
              }
              .width(28)
              .height(28)
            }
            .width(64)
            .height(64)
            .type(ButtonType.Circle)
            .backgroundColor('#F5F5F5')
            .onClick(() => {
              if (this.pinCode.length > 0) {
                this.pinCode = this.pinCode.substring(0, this.pinCode.length - 1);
              }
            })
          }
        }
      }
      .layoutWeight(1)
      .padding({ top: 40 })

      Button('确认')
        .width('80%')
        .height(48)
        .fontSize(16)
        .fontColor('#FFFFFF')
        .backgroundColor('#007DFF')
        .borderRadius(24)
        .margin({ bottom: 40 })
        .onClick(() => {
          this.verifyPin();
        })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }

  appendPin(value: string) {
    if (this.pinCode.length < 6) {
      this.pinCode = this.pinCode + value;
    }
  }
}

@Builder
function PinButton(value: string, onClick: (v: string) => void) {
  Button(value)
    .width(64)
    .height(64)
    .fontSize(24)
    .fontColor('#333333')
    .backgroundColor('#F5F5F5')
    .borderRadius(32)
    .onClick(() => {
      onClick(value);
    })
}
