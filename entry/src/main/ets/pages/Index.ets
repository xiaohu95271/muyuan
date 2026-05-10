
import { AppConstants } from '../common/constants/AppConstants';
import { DatabaseManager } from '../common/database/DatabaseManager';
import { EventUtil } from '../common/utils/EventUtil';

@Entry
@Component
struct Index {
  @State currentIndex: number = 0;
  private tabsController: TabsController = new TabsController();

  onPageShow() {
    AppStorage.setOrCreate('home_refresh_trigger', Date.now());
  }

  aboutToAppear() {
    // 数据库已在 EntryAbility.onCreate 中初始化
  }

  @Builder
  TabBarBuilder(title: string, index: number) {
    Column() {
      if (index === 0) {
        SymbolGlyph($r('sys.symbol.house'))
          .fontSize(36)
          .fontColor([this.currentIndex === index ? '#007DFF' : '#999999'])
      } else if (index === 1) {
        SymbolGlyph($r('sys.symbol.lock'))
          .fontSize(36)
          .fontColor([this.currentIndex === index ? '#007DFF' : '#999999'])
      } else if (index === 2) {
        SymbolGlyph($r('sys.symbol.heart'))
          .fontSize(36)
          .fontColor([this.currentIndex === index ? '#007DFF' : '#999999'])
      } else {
        Text('⚙')
          .fontSize(36)
          .fontColor(this.currentIndex === index ? '#007DFF' : '#999999')
      }
      Text(title)
        .fontSize(16)
        .fontColor(this.currentIndex === index ? '#007DFF' : '#999999')
        .margin({ top: 4 })
    }
    .width('100%')
    .height(88)
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.currentIndex = index;
      this.tabsController.changeIndex(index);
    })
  }

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.End, controller: this.tabsController }) {
        TabContent() {
          HomeContent()
        }
        .tabBar(this.TabBarBuilder('首页', 0))

        TabContent() {
          PasswordEntry()
        }
        .tabBar(this.TabBarBuilder('密码', 1))

        TabContent() {
          WeightEntry()
        }
        .tabBar(this.TabBarBuilder('体重', 2))

        TabContent() {
          SettingsEntry()
        }
        .tabBar(this.TabBarBuilder('设置', 3))
      }
      .barWidth('100%')
      .barHeight(80)
      .onChange((index: number) => {
        this.currentIndex = index;
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}

/**
 * 首页内容：快捷入口与概览
 */
@Component
struct HomeContent {
  @State passwordCount: number = 0;
  @State latestWeight: string = '--';
  @StorageLink('home_refresh_trigger') @Watch('onRefreshTriggerChange') refreshTrigger: number = 0;
  private weightEventId: number = -1;
  private passwordEventId: number = -1;

  aboutToAppear() {
    this.loadHomeData();
    this.weightEventId = EventUtil.onWeightSaved(() => {
      this.loadHomeData();
    });
    this.passwordEventId = EventUtil.onPasswordSaved(() => {
      this.loadHomeData();
    });
  }

  onPageShow() {
    this.loadHomeData();
  }

  onRefreshTriggerChange() {
    this.loadHomeData();
  }

  async loadHomeData() {
    try {
      const passwords = await DatabaseManager.getInstance().queryAllPasswords();
      this.passwordCount = passwords.length;
      const weights = await DatabaseManager.getInstance().queryAllWeights();
      if (weights.length > 0) {
        this.latestWeight = weights[weights.length - 1].weight.toFixed(1);
      } else {
        this.latestWeight = '--';
      }
    } catch (e) {
      console.error('HomeContent loadHomeData error:', JSON.stringify(e));
    }
  }

  build() {
    Scroll() {
      Column({ space: 16 }) {
        Text('隐私助手')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
          .alignSelf(ItemAlign.Start)
          .margin({ left: 20, top: 20, bottom: 8 })

        // 密码模块入口卡片
        Row() {
          Column({ space: 8 }) {
            Text('密码保险柜')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FFFFFF')
            Text(`${this.passwordCount} 条记录`)
              .fontSize(14)
              .fontColor('rgba(255,255,255,0.8)')
            Button('查看全部')
              .fontSize(13)
              .fontColor('#007DFF')
              .backgroundColor('#FFFFFF')
              .height(32)
              .width(90)
              .margin({ top: 8 })
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
              })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

          Shape() {
            Path()
              .width(56)
              .height(56)
              .commands('M12 4 L12 12 M8 8 L16 8 M6 12 L22 12 L22 32 L6 32 Z M14 19 A2 2 0 1 0 14 25 A2 2 0 1 0 14 19')
              .stroke('rgba(255,255,255,0.3)')
              .strokeWidth(2)
              .fill('none')
          }
          .width(72)
          .height(72)
        }
        .width('100%')
        .height(140)
        .padding(20)
        .linearGradient({
          direction: GradientDirection.LeftTop,
          colors: [['#667eea', 0.0], ['#764ba2', 1.0]]
        })
        .borderRadius(16)
        .margin({ left: 16, right: 16 })

        // 体重模块入口卡片
        Row() {
          Column({ space: 8 }) {
            Text('体重记录')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FFFFFF')
            Text(`最新体重 ${this.latestWeight} kg`)
              .fontSize(14)
              .fontColor('rgba(255,255,255,0.8)')
            Button('记录今日')
              .fontSize(13)
              .fontColor('#FF6B6B')
              .backgroundColor('#FFFFFF')
              .height(32)
              .width(90)
              .margin({ top: 8 })
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_LIST });
              })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

          Shape() {
            Path()
              .width(56)
              .height(56)
              .commands('M16 28 L6 18 C2 14 2 8 6 4 C10 0 16 0 20 4 C24 0 30 0 34 4 C38 8 38 14 34 18 L24 28 L20 32 L16 28 Z')
              .stroke('rgba(255,255,255,0.3)')
              .strokeWidth(2)
              .fill('none')
          }
          .width(72)
          .height(72)
        }
        .width('100%')
        .height(140)
        .padding(20)
        .linearGradient({
          direction: GradientDirection.LeftTop,
          colors: [['#f093fb', 0.0], ['#f5576c', 1.0]]
        })
        .borderRadius(16)
        .margin({ left: 16, right: 16 })

        // 快捷操作
        Column({ space: 12 }) {
          Text('快捷操作')
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333333')
            .alignSelf(ItemAlign.Start)

          Row({ space: 12 }) {
            QuickActionButton('生成密码', '#007DFF', () => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
            })
            QuickActionButton('体重统计', '#FF6B6B', () => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
            })
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceBetween)
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFFFF')
        .borderRadius(16)
        .margin({ left: 16, right: 16 })
      }
      .width('100%')
      .padding({ bottom: 20 })
    }
    .width('100%')
    .height('100%')
    .align(Alignment.TopStart)
  }
}

@Builder
function QuickActionButton(text: string, color: string, onClick: () => void) {
  Button() {
    Text(text)
      .fontSize(14)
      .fontColor(color)
  }
  .width('48%')
  .height(48)
  .backgroundColor(`${color}15`)
  .border({ width: 1, color: `${color}30` })
  .borderRadius(12)
  .onClick(onClick)
}

/**
 * 密码模块入口占位
 */
@Component
struct PasswordEntry {
  build() {
    Column() {
      Button('进入密码管理')
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}

/**
 * 体重模块入口占位
 */
@Component
struct WeightEntry {
  build() {
    Column() {
      Button('进入体重记录')
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_LIST });
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}

/**
 * 设置入口占位
 */
@Component
struct SettingsEntry {
  build() {
    Column() {
      Button('进入设置')
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_SETTINGS });
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
