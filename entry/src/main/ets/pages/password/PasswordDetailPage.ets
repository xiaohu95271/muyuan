
import { AppConstants, PASSWORD_CATEGORIES } from '../../common/constants/AppConstants';
import { DatabaseManager } from '../../common/database/DatabaseManager';
import { PasswordModel } from '../../models/PasswordModel';
import { CryptoUtil } from '../../common/utils/CryptoUtil';
import { ToastUtil } from '../../common/utils/ToastUtil';
import { EventUtil } from '../../common/utils/EventUtil';
import { pasteboard } from '@kit.BasicServicesKit';
import { preferences } from '@kit.ArkData';

@Entry
@Component
struct PasswordDetailPage {
  @State passwordId: number = -1;
  @State platform: string = '';
  @State account: string = '';
  @State password: string = '';
  @State category: string = '其他';
  @State website: string = '';
  @State tags: string = '';
  @State notes: string = '';
  @State isEdit: boolean = false;
  @State passwordStrength: number = 0; // 0-3
  @State isWeakPassword: boolean = false;
  @State weakPasswordReason: string = '';

  // 常见弱密码字典
  private weakPasswordDict: string[] = [
    '123456', '123456789', '12345678', '1234567', '12345', '1234567890',
    'password', 'qwerty', 'abc123', '111111', '123123', 'admin',
    'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
    'princess', 'qwerty123', 'passw0rd', 'shadow', 'sunshine',
    '000000', '666666', '888888', 'iloveyou', 'trustno1',
    'football', 'baseball', 'access', 'hello', 'charlie',
    'qwer1234', 'asdf1234', 'zxcv1234', 'password1', 'password123',
    'a123456', 'aaa111', 'qaz123', 'abcd1234', '123abc',
    'p@ssw0rd', 'P@ssword1', 'Aa123456', 'aa123456'
  ];

  aboutToAppear() {
    let params = this.getUIContext().getRouter().getParams() as object;
    if (params) {
      let p = params as Record<string, Object>;
      if (p['id'] !== undefined) {
        this.passwordId = p['id'] as number;
        this.isEdit = true;
        this.loadPasswordDetail();
      }
    }
  }

  async loadPasswordDetail() {
    const model = await DatabaseManager.getInstance().queryPasswordById(this.passwordId);
    if (model) {
      this.platform = model.platform;
      this.account = model.account;
      this.password = await CryptoUtil.decrypt(model.password);
      this.category = model.category;
      this.website = model.website;
      this.tags = model.tags;
      this.notes = model.notes;
      this.checkPasswordStrength();
    }
  }

  checkPasswordStrength() {
    const pwd = this.password;
    if (!pwd) {
      this.passwordStrength = 0;
      this.isWeakPassword = false;
      this.weakPasswordReason = '';
      return;
    }

    // 弱密码字典检查
    const lowerPwd = pwd.toLowerCase();
    if (this.weakPasswordDict.some(w => w.toLowerCase() === lowerPwd)) {
      this.isWeakPassword = true;
      this.weakPasswordReason = '此密码在常见泄露密码字典中，极易被破解';
      this.passwordStrength = 0;
      return;
    }

    // 检查纯数字密码
    if (/^\d+$/.test(pwd) && pwd.length <= 8) {
      this.isWeakPassword = true;
      this.weakPasswordReason = '纯数字短密码容易被暴力破解';
      this.passwordStrength = 0;
      return;
    }

    // 检查连续字符（如 aaaaaa）
    if (/^(.)\1+$/.test(pwd)) {
      this.isWeakPassword = true;
      this.weakPasswordReason = '密码全是相同字符，安全性极低';
      this.passwordStrength = 0;
      return;
    }

    // 检查顺序键盘模式
    const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', '123456', '654321', 'abcdef'];
    if (keyboardPatterns.some(p => lowerPwd.includes(p))) {
      this.isWeakPassword = true;
      this.weakPasswordReason = '包含键盘顺序模式，容易被猜测';
      this.passwordStrength = 1;
      return;
    }

    this.isWeakPassword = false;
    this.weakPasswordReason = '';

    // 强度评分
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    this.passwordStrength = Math.min(3, Math.floor(score / 2));
  }

  async savePassword() {
    if (!this.platform.trim() || !this.account.trim() || !this.password.trim()) {
      ToastUtil.show('请填写必填项');
      return;
    }
    const encryptedPwd = await CryptoUtil.encrypt(this.password);
    if (!encryptedPwd) {
      ToastUtil.show('密码加密失败，请重试');
      return;
    }
    const model = new PasswordModel();
    model.id = this.passwordId;
    model.platform = this.platform.trim();
    model.account = this.account.trim();
    model.password = encryptedPwd;
    model.category = this.category;
    model.website = this.website.trim();
    model.tags = this.tags.trim();
    model.notes = this.notes.trim();

    try {
      let result: number = -1;
      if (this.isEdit) {
        result = await DatabaseManager.getInstance().updatePassword(model);
      } else {
        result = await DatabaseManager.getInstance().insertPassword(model);
      }
      if (result < 0) {
        ToastUtil.show('保存失败，数据库写入异常');
        return;
      }
      EventUtil.emitPasswordSaved();
      ToastUtil.show(this.isEdit ? '修改成功' : '保存成功');
      this.getUIContext().getRouter().back();
    } catch (e) {
      console.error('Save password error:', JSON.stringify(e));
      ToastUtil.show('保存失败，请重试');
    }
  }

  getStrengthText(): string {
    switch (this.passwordStrength) {
      case 0: return '弱';
      case 1: return '中';
      case 2: return '强';
      case 3: return '极强';
      default: return '';
    }
  }

  getStrengthColor(): string {
    switch (this.passwordStrength) {
      case 0: return '#F44336';
      case 1: return '#FF9800';
      case 2: return '#4CAF50';
      case 3: return '#2196F3';
      default: return '#757575';
    }
  }

  async copyCurrentPassword(): Promise<void> {
    if (!this.password) {
      ToastUtil.show('密码为空');
      return;
    }
    try {
      const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.password);
      const systemPasteboard = pasteboard.getSystemPasteboard();
      await systemPasteboard.setData(pasteData);
      ToastUtil.show('密码已复制到剪贴板');
      this.scheduleClipboardClear();
    } catch (e) {
      console.error('Copy password error:', JSON.stringify(e));
      ToastUtil.show('复制失败');
    }
  }

  scheduleClipboardClear(): void {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const enabled = pref.getSync(AppConstants.PREF_CLIPBOARD_CLEAR, true) as boolean;
      if (enabled) {
        setTimeout(() => {
          try {
            const pb = pasteboard.getSystemPasteboard();
            pb.clearData();
            ToastUtil.show('剪贴板已自动清除');
          } catch (err) {
            console.error('Clear clipboard error:', JSON.stringify(err));
          }
        }, AppConstants.CLIPBOARD_CLEAR_DELAY * 1000);
      }
    } catch (e) {
      console.error('Schedule clipboard clear error:', JSON.stringify(e));
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

        Text(this.isEdit ? '编辑密码' : '新增密码')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')

        Button('保存')
          .fontSize(14)
          .fontColor('#007DFF')
          .backgroundColor('transparent')
          .onClick(async () => {
            await this.savePassword();
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 16 })
      .justifyContent(FlexAlign.SpaceBetween)
      .backgroundColor('#FFFFFF')

      // 表单内容
      Scroll() {
        Column({ space: 16 }) {
          // 平台名称
          FormItem({ label: '平台名称 *' }) {
            TextInput({ placeholder: '如：微信、GitHub', text: $$this.platform })
              .height(48)
              .fontColor('#333333')
              .placeholderColor('#757575')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
          }

          // 账号
          FormItem({ label: '账号 *' }) {
            TextInput({ placeholder: '用户名/手机号/邮箱', text: $$this.account })
              .height(48)
              .fontColor('#333333')
              .placeholderColor('#757575')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
          }

          // 密码
          FormItem({ label: '密码 *' }) {
            Row({ space: 8 }) {
              TextInput({ placeholder: '输入密码', text: $$this.password })
                .type(InputType.Password)
                .height(48)
                .fontColor('#333333')
                .placeholderColor('#757575')
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .layoutWeight(1)
                .onChange(() => {
                  this.checkPasswordStrength();
                })

              Button() {
                Text() {
                  SymbolSpan($r('sys.symbol.doc_text'))  // 复制图标
                    .fontColor(['#4CAF50'])
                    .fontSize(28)      // 可轻松调整大小
                }
              }
              .width(44)
              .height(44)
              .type(ButtonType.Circle)
              .backgroundColor('#E8F5E9')
              .onClick(() => {
                this.copyCurrentPassword();
              })

              Button() {
                Shape() {
                  Text() {
                    SymbolSpan($r('sys.symbol.satellite_map'))  // 复制图标
                      .fontColor(['#4CAF50'])
                      .fontSize(28)      // 可轻松调整大小
                  }
                }
                .width(24)
                .height(24)
              }
              .width(44)
              .height(44)
              .type(ButtonType.Circle)
              .backgroundColor('#E3F2FD')
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
              })
            }
            .width('100%')

            // 密码强度指示
            if (this.password.length > 0) {
              Row({ space: 8 }) {
                Row() {
                  ForEach([0, 1, 2, 3], (index: number) => {
                    Row()
                      .width(22)
                      .height(4)
                      .backgroundColor(index <= this.passwordStrength ? this.getStrengthColor() : '#E0E0E0')
                      .borderRadius(2)
                  }, (index: number) => index.toString())
                }
                .width(120)
                .justifyContent(FlexAlign.SpaceBetween)

                Text(this.getStrengthText())
                  .fontSize(12)
                  .fontColor(this.getStrengthColor())
              }
              .width('100%')
              .margin({ top: 4 })

              // 弱密码风险提示
              if (this.isWeakPassword) {
                Row({ space: 8 }) {
                  Text('⚠')
                    .fontSize(16)
                  Text(this.weakPasswordReason)
                    .fontSize(12)
                    .fontColor('#F44336')
                    .layoutWeight(1)
                }
                .width('100%')
                .padding(8)
                .backgroundColor('#FFF0F0')
                .borderRadius(6)
                .margin({ top: 4 })
              }
            }
          }

          // 分类
          FormItem({ label: '分类' }) {
            Row({ space: 8 }) {
              ForEach(PASSWORD_CATEGORIES, (cat: string) => {
                Text(cat)
                  .fontSize(13)
                  .fontColor(this.category === cat ? '#FFFFFF' : '#666666')
                  .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                  .backgroundColor(this.category === cat ? '#007DFF' : '#F0F0F0')
                  .borderRadius(8)
                  .onClick(() => {
                    this.category = cat;
                  })
              }, (cat: string) => cat)
            }
            .width('100%')
          }

          // 网站
          FormItem({ label: '网站地址' }) {
            TextInput({ placeholder: 'https://...', text: $$this.website })
              .height(48)
              .fontColor('#333333')
              .placeholderColor('#757575')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
          }

          // 标签
          FormItem({ label: '标签' }) {
            TextInput({ placeholder: '多个标签用逗号分隔', text: $$this.tags })
              .height(48)
              .fontColor('#333333')
              .placeholderColor('#757575')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
          }

          // 备注
          FormItem({ label: '备注' }) {
            TextArea({ placeholder: '额外信息...', text: $$this.notes })
              .height(100)
              .fontColor('#333333')
              .placeholderColor('#757575')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
          }
        }
        .width('100%')
        .padding(16)
      }
      .width('100%')
      .layoutWeight(1)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
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
