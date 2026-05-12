
import { CryptoUtil } from '../../common/utils/CryptoUtil';
import { PasswordGeneratorConfig } from '../../models/PasswordModel';
import { pasteboard } from '@kit.BasicServicesKit';
import { ToastUtil } from '../../common/utils/ToastUtil';

@Entry
@Component
struct PasswordGeneratorPage {
  @State config: PasswordGeneratorConfig = new PasswordGeneratorConfig();
  @State generatedPassword: string = '';
  @State historyList: string[] = [];

  aboutToAppear() {
    this.generatePassword();
  }

  generatePassword() {
    this.generatedPassword = CryptoUtil.generateRandomPassword(
      this.config.length,
      this.config.includeNumbers,
      this.config.includeLowercase,
      this.config.includeUppercase,
      this.config.includeSpecial,
      this.config.excludeAmbiguous
    );
    // 添加到历史（最新的在前面，保留最新10条）
    if (this.generatedPassword) {
      this.historyList = [this.generatedPassword, ...this.historyList];
      if (this.historyList.length > 10) {
        this.historyList = this.historyList.slice(0, 10);
      }
    }
  }

  async copyToClipboard(text: string) {
    try {
      const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
      const systemPasteboard = pasteboard.getSystemPasteboard();
      await systemPasteboard.setData(pasteData);
      ToastUtil.show('密码已复制');
    } catch (e) {
      console.error('Copy to clipboard error:', JSON.stringify(e));
    }
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button(){
          Text() {
            SymbolSpan($r('sys.symbol.chevron_left'))  // 返回箭头图标
              .fontSize(28)
          }
        }
          .fontSize(28)
          .fontColor('#666666')
          .width(52)
          .height(52)
          .type(ButtonType.Circle)
          .backgroundColor('transparent')
          .onClick(() => {
            this.getUIContext().getRouter().back();
          })

        Text('密码生成器')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor('#666666')

        Blank()
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 16 })
      .backgroundColor('#FFFFFF')

      Scroll() {
        Column({ space: 20 }) {
          // 生成的密码展示
          Column({ space: 16 }) {
            Text(this.generatedPassword)
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor('#333333')
              .fontFamily('monospace')
              .textAlign(TextAlign.Center)
              .width('100%')


            Row({ space: 12 }) {
              Button('重新生成')
                .fontSize(14)
                .fontColor('#007DFF')
                .backgroundColor('#E3F2FD')
                .height(40)
                .borderRadius(20)
                .onClick(() => {
                  this.generatePassword();
                  ToastUtil.show('密码已从新生成');
                })

              Button('复制')
                .fontSize(14)
                .fontColor('#FFFFFF')
                .backgroundColor('#007DFF')
                .height(40)
                .borderRadius(20)
                .onClick(() => {
                  this.copyToClipboard(this.generatedPassword);
                })
            }
          }
          .width('100%')
          .padding(24)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)
          .margin({ top: 16 })

          // 配置选项
          Column({ space: 16 }) {
            Text('生成规则')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)

            // 长度滑块
            Row() {
              Text('密码长度')
                .fontSize(14)
                .fontColor('#666666')
              Text(`${this.config.length}`)
                .fontSize(14)
                .fontColor('#007DFF')
                .fontWeight(FontWeight.Bold)
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)

            Slider({
              value: this.config.length,
              min: 4,
              max: 64,
              step: 1
            })
              .width('100%')
              .selectedColor('#007DFF')
              .onChange((value: number) => {
                this.config.length = Math.floor(value);
                this.generatePassword();
              })

            // 选项设置
            ToggleOption('包含数字', this.config.includeNumbers, (value) => {
              let c = this.config.copy();
              c.includeNumbers = value;
              this.config = c;
              this.generatePassword();
            })
            ToggleOption('包含小写字母', this.config.includeLowercase, (value) => {
              let c = this.config.copy();
              c.includeLowercase = value;
              this.config = c;
              this.generatePassword();
            })
            ToggleOption('包含大写字母', this.config.includeUppercase, (value) => {
              let c = this.config.copy();
              c.includeUppercase = value;
              this.config = c;
              this.generatePassword();
            })
            ToggleOption('包含特殊字符', this.config.includeSpecial, (value) => {
              let c = this.config.copy();
              c.includeSpecial = value;
              this.config = c;
              this.generatePassword();
            })
            ToggleOption('排除易混字符', this.config.excludeAmbiguous, (value) => {
              let c = this.config.copy();
              c.excludeAmbiguous = value;
              this.config = c;
              this.generatePassword();
            })
          }
          .width('100%')
          .padding(20)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)

          // 历史记录
          if (this.historyList.length > 0) {
            Column({ space: 12 }) {
              Row() {
                Text('历史记录')
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor('#333333')
                Blank()
                Text('清除')
                  .fontSize(13)
                  .fontColor('#FF4444')
                  .onClick(() => {
                    this.historyList = [];
                  })
              }
              .width('100%')

              ForEach(this.historyList, (pwd: string, index: number) => {
                Row({ space: 8 }) {
                  Text(pwd)
                    .fontSize(14)
                    .fontColor('#666666')
                    .fontFamily('monospace')
                    .layoutWeight(1)
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
              
                  Button() {
                    Text() {
                      SymbolSpan($r('sys.symbol.doc_plaintext'))  // 复制图标
                        .fontColor(['#4CAF50'])
                        .fontSize(28)      // 可轻松调整大小
                    }
                  }
                  .width(32)
                  .height(32)
                  .type(ButtonType.Circle)
                  .backgroundColor('transparent')
                  .onClick(() => {
                    this.copyToClipboard(pwd);
                  })
                }
                .width('100%')
                .height(44)
                .padding({ left: 12, right: 12 })
                .backgroundColor('#F8F8F8')
                .borderRadius(8)
              }, (pwd: string, index: number) => `${index}_${pwd}`)
            }
            .width('100%')
            .padding(20)
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
          }
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 20 })
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
function ToggleOption(label: string, isOn: boolean, onChange: (value: boolean) => void) {
  Row() {
    Text(label)
      .fontSize(14)
      .fontColor('#666666')
    Toggle({ type: ToggleType.Switch, isOn: isOn })
      .selectedColor('#007DFF')
      .onChange(onChange)
  }
  .width('100%')
  .height(44)
  .justifyContent(FlexAlign.SpaceBetween)
}
