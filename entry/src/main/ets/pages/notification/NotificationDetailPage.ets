
import { AppConstants } from '../../common/constants/AppConstants';
import { preferences } from '@kit.ArkData';

@Entry
@Component
struct NotificationDetailPage {
  @State title: string = '';
  @State content: string = '';
  @State time: string = '';
  @State notificationId: number = 0;

  aboutToAppear() {
    const params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
    if (params) {
      this.notificationId = params['id'] as number || 0;
      this.title = params['title'] as string || '';
      this.content = params['content'] as string || '';
      this.time = params['time'] as string || '';
    }
    // 标记为已读并持久化
    this.markAsRead();
  }

  markAsRead() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const readIdsStr = pref.getSync(AppConstants.PREF_NOTIFICATION_READ, '') as string;
      let readIds: number[] = [];
      if (readIdsStr) {
        readIds = JSON.parse(readIdsStr) as number[];
      }
      if (!readIds.includes(this.notificationId)) {
        readIds.push(this.notificationId);
        pref.put(AppConstants.PREF_NOTIFICATION_READ, JSON.stringify(readIds));
        pref.flush();
      }
    } catch (e) {
      console.error('Mark notification read error:', JSON.stringify(e));
    }
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button() {
          SymbolGlyph($r('sys.symbol.chevron_left'))
            .fontSize(24)
            .fontColor(['#333333'])
        }
        .width(44)
        .height(44)
        .type(ButtonType.Circle)
        .backgroundColor('transparent')
        .onClick(() => {
          this.getUIContext().getRouter().back();
        })

        Text('消息详情')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1A1A1A')
          .margin({ left: 4 })

        Blank()
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .alignItems(VerticalAlign.Center)

      // 消息内容卡片
      Scroll() {
        Column() {
          Column({ space: 16 }) {
            // 消息内容标签
            Text('消息内容')
              .fontSize(13)
              .fontColor('#007DFF')
              .padding({ left: 12, right: 12, top: 5, bottom: 5 })
              .backgroundColor('#EBF5FF')
              .borderRadius(12)
              .alignSelf(ItemAlign.Start)

            // 标题
            Text(this.title)
              .fontSize(22)
              .fontWeight(FontWeight.Bold)
              .fontColor('#1A1A1A')
              .alignSelf(ItemAlign.Start)

            // 时间
            Row({ space: 8 }) {
              SymbolGlyph($r('sys.symbol.clock'))
                .fontSize(16)
                .fontColor(['#BBBBBB'])
              Text(this.time)
                .fontSize(14)
                .fontColor('#BBBBBB')
            }

            // 分割线
            Divider()
              .color('#F0F0F0')
              .margin({ top: 4, bottom: 4 })

            // 正文内容
            Text(this.content)
              .fontSize(16)
              .fontColor('#333333')
              .lineHeight(30)
              .alignSelf(ItemAlign.Start)
          }
          .width('100%')
          .padding({ left: 24, right: 24, top: 28, bottom: 32 })
          .backgroundColor('#FFFFFF')
          .borderRadius(20)
          .shadow({ radius: 8, color: '#0A000000', offsetY: 2 })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 20, bottom: 40 })
      }
      .width('100%')
      .layoutWeight(1)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F3F4F8')
  }
}
