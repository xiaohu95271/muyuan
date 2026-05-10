
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
struct PasswordListPage {
  @State passwordList: PasswordModel[] = [];
  @State searchKeyword: string = '';
  @State selectedCategory: string = '全部';
  @State isLoading: boolean = false;
  @State showPasswordIds: Set<number> = new Set();
  @State swipeDeleteId: number = -1;
  @State categories: string[] = ['全部'];
  private passwordEventId: number = -1;

  aboutToAppear() {
    this.categories = ['全部'].concat(PASSWORD_CATEGORIES);
    this.checkAppLock();
    this.loadPasswords();
    this.passwordEventId = EventUtil.onPasswordSaved(() => {
      this.loadPasswords();
    });
  }

  aboutToDisappear() {
    EventUtil.offPasswordSaved(this.passwordEventId);
  }

  onPageShow() {
    this.loadPasswords();
  }

  checkAppLock(): void {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const enabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
      if (enabled) {
        const pin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
        if (pin) {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_APP_LOCK_VERIFY });
        }
      }
    } catch (e) {
      console.error('Check app lock error:', JSON.stringify(e));
    }
  }

  async loadPasswords(): Promise<void> {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    if (this.searchKeyword.trim()) {
      this.passwordList = await DatabaseManager.getInstance().searchPasswords(this.searchKeyword);
    } else if (this.selectedCategory !== '全部') {
      this.passwordList = await DatabaseManager.getInstance().queryPasswordsByCategory(this.selectedCategory);
    } else {
      this.passwordList = await DatabaseManager.getInstance().queryAllPasswords();
    }
    this.isLoading = false;
  }

  async deletePassword(id: number): Promise<void> {
    await DatabaseManager.getInstance().deletePassword(id);
    this.loadPasswords();
  }

  async copyPassword(encryptedPwd: string): Promise<void> {
    if (!encryptedPwd) {
      ToastUtil.show('密码为空');
      return;
    }
    try {
      const plainPwd = await CryptoUtil.decrypt(encryptedPwd);
      if (plainPwd) {
        const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, plainPwd);
        const systemPasteboard = pasteboard.getSystemPasteboard();
        await systemPasteboard.setData(pasteData);
        ToastUtil.show('密码已复制到剪贴板');
        this.scheduleClipboardClear();
      } else {
        ToastUtil.show('密码解密失败');
      }
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

  toggleShowPassword(id: number): void {
    const newSet = new Set(this.showPasswordIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.showPasswordIds = newSet;
  }

  build() {
    Stack({ alignContent: Alignment.BottomEnd }) {
      Column() {
        // 顶部搜索栏
        Row({ space: 12 }) {
          Search({ value: this.searchKeyword, placeholder: '搜索平台、账号或标签...' })
            .layoutWeight(1)
            .height(44)
            .backgroundColor('#F5F5F5')
            .borderRadius(22)
            .onChange((value: string) => {
              this.searchKeyword = value;
              this.loadPasswords();
            })
        }
        .width('100%')
        .padding(16)

        // 分类筛选
        Row({ space: 8 }) {
          ForEach(this.categories, (category: string) => {
            Text(category)
              .fontSize(13)
              .fontColor(this.selectedCategory === category ? '#FFFFFF' : '#666666')
              .padding({ left: 16, right: 16, top: 6, bottom: 6 })
              .backgroundColor(this.selectedCategory === category ? '#007DFF' : '#F0F0F0')
              .borderRadius(16)
              .onClick(() => {
                this.selectedCategory = category;
                this.loadPasswords();
              })
          }, (category: string) => category)
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 8 })

        // 列表内容
        if (this.isLoading) {
          LoadingProgress()
            .width(48)
            .height(48)
            .color('#007DFF')
            .margin({ top: 100 })
        } else if (this.passwordList.length === 0) {
          Column({ space: 16 }) {
            Text('暂无密码记录')
              .fontSize(16)
              .fontColor('#999999')
            Button('添加第一条记录')
              .type(ButtonType.Capsule)
              .backgroundColor('#007DFF')
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
              })
          }
          .margin({ top: 100 })
        } else {
          List({ space: 12 }) {
            ForEach(this.passwordList, (item: PasswordModel) => {
              ListItem() {
                PasswordCard({
                  item: item,
                  isShowPassword: this.showPasswordIds.has(item.id),
                  onTogglePassword: (): void => { this.toggleShowPassword(item.id); },
                  onEdit: (): void => {
                    this.getUIContext().getRouter().pushUrl({
                      url: AppConstants.PAGE_PASSWORD_DETAIL,
                      params: { id: item.id }
                    });
                  },
                  onDelete: (): void => { this.deletePassword(item.id); },
                  onCopy: (): void => { this.copyPassword(item.password); }
                })
              }
              .swipeAction({ end: this.DeleteBuilder })
              .onTouch((event) => {
                if (event.type === 2) {
                  this.swipeDeleteId = item.id;
                }
              })
            }, (item: PasswordModel) => item.id.toString() + '_' + item.updateTime)
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

      // 右下角浮动添加按钮（列表有数据时显示）
      if (this.passwordList.length > 0) {
        Button() {
          Text('+')
            .fontSize(32)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(56)
        .height(56)
        .backgroundColor('#007DFF')
        .type(ButtonType.Circle)
        .margin({ right: 24, bottom: 24 })
        .shadow({ radius: 8, color: 'rgba(0,0,0,0.2)' })
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
        })
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  DeleteBuilder() {
    Button() {
      Shape() {
        Path()
          .width(24)
          .height(24)
          .commands('M3 6 L5 6 L5 17 L15 17 L15 6 L17 6 M7 3 L7 6 M13 3 L13 6 M7 9 L7 14 M13 9 L13 14')
          .stroke('#FFFFFF')
          .strokeWidth(1.5)
          .fill('none')
      }
      .width(28)
      .height(28)
    }
    .width(60)
    .height('100%')
    .type(ButtonType.Normal)
    .backgroundColor('#FF4444')
    .margin({ left: 8 })
    .onClick(() => {
      if (this.swipeDeleteId > 0) {
        this.deletePassword(this.swipeDeleteId);
        this.swipeDeleteId = -1;
      }
    })
  }
}

@Component
struct PasswordCard {
  @Prop item: PasswordModel;
  @Prop isShowPassword: boolean;
  onTogglePassword: () => void = () => {};
  onEdit: () => void = () => {};
  onDelete: () => void = () => {};
  onCopy: () => void = () => {};

  @State decryptedPassword: string = '';

  async aboutToAppear() {
    if (this.item.password) {
      this.decryptedPassword = await CryptoUtil.decrypt(this.item.password);
    }
  }

  getCategoryColor(): string {
    switch (this.item.category) {
      case '工作': return '#007DFF';
      case '社交': return '#00C853';
      case '金融': return '#FF6B00';
      default: return '#9E9E9E';
    }
  }

  build() {
    Column({ space: 8 }) {
      Row() {
        // 左侧：平台图标和名称
        Row({ space: 12 }) {
          Text(this.item.platform.substring(0, 1))
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
            .width(44)
            .height(44)
            .textAlign(TextAlign.Center)
            .backgroundColor(this.getCategoryColor())
            .borderRadius(12)

          Column({ space: 4 }) {
            Text(this.item.platform)
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
            Text(this.item.account)
              .fontSize(13)
              .fontColor('#999999')
          }
          .alignItems(HorizontalAlign.Start)
        }

        // 右侧：分类标签
        Text(this.item.category)
          .fontSize(11)
          .fontColor(this.getCategoryColor())
          .padding({ left: 8, right: 8, top: 2, bottom: 2 })
          .backgroundColor(`${this.getCategoryColor()}15`)
          .borderRadius(8)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)

      // 密码显示区域
      if (this.decryptedPassword) {
        Row({ space: 8 }) {
          Text(this.isShowPassword ? this.decryptedPassword : '••••••••')
            .fontSize(14)
            .fontColor('#666666')
            .fontFamily('monospace')
            .layoutWeight(1)

          Button() {
            Shape() {
              Path()
                .width(24)
                .height(24)
                .commands('M2 10 Q10 4 18 10 Q10 16 2 10 Z M10 7 A3 3 0 1 0 10 13 A3 3 0 1 0 10 7')
                .stroke('#999999')
                .strokeWidth(1.5)
                .fill('none')
            }
            .width(24)
            .height(24)
          }
          .width(44)
          .height(44)
          .type(ButtonType.Circle)
          .backgroundColor('transparent')
          .onClick(() => {
            this.onTogglePassword();
          })

          Button() {
            Shape() {
              Path()
                .width(24)
                .height(24)
                .commands('M6 4 L16 4 L16 14 M4 6 L14 6 L14 20 L4 20 Z')
                .stroke('#999999')
                .strokeWidth(1.5)
                .fill('none')
            }
            .width(24)
            .height(24)
          }
          .width(44)
          .height(44)
          .type(ButtonType.Circle)
          .backgroundColor('transparent')
          .onClick(() => {
            this.onCopy();
          })
        }
        .width('100%')
        .padding({ top: 8 })
        .border({ width: { top: 1 }, color: '#F0F0F0' })
      }

      // 标签和备注
      if (this.item.tags || this.item.notes) {
        Row({ space: 8 }) {
          if (this.item.tags) {
            ForEach(this.item.tags.split(',').filter((t: string): boolean => t.trim() !== ''), (tag: string) => {
              Text(tag.trim())
                .fontSize(11)
                .fontColor('#007DFF')
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .backgroundColor('#E3F2FD')
                .borderRadius(6)
            }, (tag: string) => tag)
          }
        }
        .width('100%')
        .margin({ top: 4 })
      }
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
