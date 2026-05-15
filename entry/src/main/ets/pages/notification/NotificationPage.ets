
import { AppConstants } from '../../common/constants/AppConstants';
import { preferences } from '@kit.ArkData';

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  time: string;
  iconColor: string;
  iconBgColor: string;
  isRead: boolean;
}

@Entry
@Component
struct NotificationPage {
  @State notifications: NotificationItem[] = [];
  @State readIds: number[] = [];

  aboutToAppear() {
    this.loadReadStatus();
    this.loadNotifications();
  }

  onPageShow() {
    // 返回时刷新已读状态
    this.loadReadStatus();
    this.refreshReadStatus();
  }

  loadReadStatus() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const readIdsStr = pref.getSync(AppConstants.PREF_NOTIFICATION_READ, '') as string;
      if (readIdsStr) {
        this.readIds = JSON.parse(readIdsStr) as number[];
      }
    } catch (e) {
      console.error('Load read status error:', JSON.stringify(e));
    }
  }

  refreshReadStatus() {
    this.notifications = this.notifications.map((item) => {
      let updated: NotificationItem = {
        id: item.id,
        title: item.title,
        content: item.content,
        time: item.time,
        iconColor: item.iconColor,
        iconBgColor: item.iconBgColor,
        isRead: this.readIds.includes(item.id)
      };
      return updated;
    });
  }

  loadNotifications() {
    this.notifications = [
      {
        id: 1,
        title: '欢迎使用隐私工具箱',
        content: '感谢您使用本应用！这里可以安全地管理您的密码和体重数据。所有数据均本地加密存储，保护您的隐私安全。如有任何问题，欢迎在设置中查看帮助信息。',
        time: '2026/05/13 12:00',
        iconColor: '#FF8A00',
        iconBgColor: '#FFF3E0',
        isRead: this.readIds.includes(1)
      }
    ];
  }

  markAllRead() {
    try {
      const allIds: number[] = this.notifications.map((item) => item.id);
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const readIdsStr = pref.getSync(AppConstants.PREF_NOTIFICATION_READ, '') as string;
      let existingIds: number[] = [];
      if (readIdsStr) {
        existingIds = JSON.parse(readIdsStr) as number[];
      }
      // 合并
      allIds.forEach((id) => {
        if (!existingIds.includes(id)) {
          existingIds.push(id);
        }
      });
      pref.put(AppConstants.PREF_NOTIFICATION_READ, JSON.stringify(existingIds));
      pref.flush();
      this.readIds = existingIds;
      this.refreshReadStatus();
    } catch (e) {
      console.error('Mark all read error:', JSON.stringify(e));
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter((item) => !item.isRead).length;
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

        Text('消息通知')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
          .margin({ left: 4 })

        if (this.getUnreadCount() > 0) {
          Text(`${this.getUnreadCount()}`)
            .fontSize(11)
            .fontColor('#FFFFFF')
            .backgroundColor('#FF3B30')
            .borderRadius(10)
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .margin({ left: 8 })
        }

        Blank()

        if (this.getUnreadCount() > 0) {
          Text('全部已读')
            .fontSize(13)
            .fontColor('#007DFF')
            .onClick(() => {
              this.markAllRead();
            })
        }
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .alignItems(VerticalAlign.Center)

      // 消息列表
      if (this.notifications.length === 0) {
        Column({ space: 16 }) {
          SymbolGlyph($r('sys.symbol.bell'))
            .fontSize(48)
            .fontColor(['#888888'])
          Text('暂无消息')
            .fontSize(16)
            .fontColor('#757575')
          Text('所有通知将会显示在这里')
            .fontSize(13)
            .fontColor('#888888')
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List({ space: 12 }) {
          ForEach(this.notifications, (item: NotificationItem) => {
            ListItem() {
              Row({ space: 12 }) {
                // 图标
                Column() {
                  SymbolGlyph($r('sys.symbol.bell'))
                    .fontSize(22)
                    .fontColor([item.iconColor])
                }
                .width(44)
                .height(44)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .borderRadius(12)
                .backgroundColor(item.iconBgColor)

                // 内容
                Column({ space: 4 }) {
                  Row() {
                    Text(item.title)
                      .fontSize(15)
                      .fontWeight(item.isRead ? FontWeight.Normal : FontWeight.Medium)
                      .fontColor(item.isRead ? '#666666' : '#333333')
                      .layoutWeight(1)

                    if (!item.isRead) {
                      Circle()
                        .width(9)
                        .height(9)
                        .fill('#FF3B30')
                    } else {
                      Text('已读')
                        .fontSize(10)
                        .fontColor('#4CAF50')
                        .padding({ left: 5, right: 5, top: 2, bottom: 2 })
                        .backgroundColor('#E8F5E9')
                        .borderRadius(4)
                    }
                  }
                  .width('100%')

                  Text(item.content)
                    .fontSize(13)
                    .fontColor(item.isRead ? '#757575' : '#666666')
                    .lineHeight(20)
                    .maxLines(2)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })

                  Text(item.time)
                    .fontSize(11)
                    .fontColor('#BBBBBB')
                    .margin({ top: 4 })
                }
                .layoutWeight(1)
                .alignItems(HorizontalAlign.Start)
              }
              .width('100%')
              .padding(16)
              .backgroundColor(item.isRead ? '#FAFAFA' : '#FFFFFF')
              .borderRadius(14)
              .shadow({ radius: item.isRead ? 0 : 2, color: '#0A000000', offsetY: 1 })
            }
            .onClick(() => {
              // 跳转到详情页
              this.getUIContext().getRouter().pushUrl({
                url: AppConstants.PAGE_NOTIFICATION_DETAIL,
                params: {
                  id: item.id,
                  title: item.title,
                  content: item.content,
                  time: item.time
                }
              });
            })
          }, (item: NotificationItem) => item.id.toString() + '_' + item.isRead.toString())
        }
        .width('100%')
        .layoutWeight(1)
        .padding({ left: 16, right: 16, top: 8 })
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
