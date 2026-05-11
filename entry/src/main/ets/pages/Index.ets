
import { AppConstants, PASSWORD_CATEGORIES } from '../common/constants/AppConstants';
import { DatabaseManager } from '../common/database/DatabaseManager';
import { EventUtil } from '../common/utils/EventUtil';
import { WeightGoal, WeightModel } from '../models/WeightModel';
import { PasswordModel } from '../models/PasswordModel';
import { CryptoUtil } from '../common/utils/CryptoUtil';
import { ToastUtil } from '../common/utils/ToastUtil';
import { DateUtil } from '../common/utils/DateUtil';
import { preferences } from '@kit.ArkData';
import { pasteboard } from '@kit.BasicServicesKit';

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
  @State daysSinceLastRecord: number = 0;
  @State weightGoal: WeightGoal = new WeightGoal();
  @State latestWeightNum: number = 0;
  @State goalProgress: number = 0;
  @State latestBmi: number = 0;
  @State weightRecordCount: number = 0;
  @State recentPasswords: PasswordModel[] = [];
  @State greeting: string = '';
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
      // 问候语
      const hour = new Date().getHours();
      if (hour < 6) this.greeting = '夜深了，注意休息';
      else if (hour < 11) this.greeting = '早上好';
      else if (hour < 14) this.greeting = '中午好';
      else if (hour < 18) this.greeting = '下午好';
      else this.greeting = '晚上好';

      const passwords = await DatabaseManager.getInstance().queryAllPasswords();
      this.passwordCount = passwords.length;
      this.recentPasswords = passwords.slice(0, 3);

      const weights = await DatabaseManager.getInstance().queryAllWeights();
      this.weightRecordCount = weights.length;
      if (weights.length > 0) {
        const latest = weights[weights.length - 1];
        this.latestWeight = latest.weight.toFixed(1);
        this.latestWeightNum = latest.weight;
        this.latestBmi = latest.bmi;
        const lastDate = latest.date;
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        this.daysSinceLastRecord = Math.floor((todayStart - lastDate) / (24 * 60 * 60 * 1000));
      } else {
        this.latestWeight = '--';
        this.latestWeightNum = 0;
        this.latestBmi = 0;
        this.daysSinceLastRecord = -1;
      }
      this.loadGoalProgress();
    } catch (e) {
      console.error('HomeContent loadHomeData error:', JSON.stringify(e));
    }
  }

  async loadGoalProgress() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      if (goalStr) {
        this.weightGoal = JSON.parse(goalStr) as WeightGoal;
      }
      // 计算进度：以第一次记录的体重为起点，目标体重为终点
      if (this.weightGoal.targetWeight > 0 && this.latestWeightNum > 0) {
        const allWeights = await DatabaseManager.getInstance().queryAllWeights();
        if (allWeights.length > 0) {
          const startWeight = allWeights[0].weight;
          const totalDiff = Math.abs(startWeight - this.weightGoal.targetWeight);
          const currentDiff = Math.abs(this.latestWeightNum - this.weightGoal.targetWeight);
          if (totalDiff > 0) {
            this.goalProgress = Math.min(1, Math.max(0, 1 - currentDiff / totalDiff));
          } else {
            this.goalProgress = 1;
          }
        }
      }
    } catch (e) {
      console.error('Load goal progress error:', JSON.stringify(e));
    }
  }

  build() {
    Scroll() {
      Column({ space: 16 }) {
        // 问候语 + 日期
        Column({ space: 4 }) {
          Text(`${this.greeting}！`)
            .fontSize(26)
            .fontWeight(FontWeight.Bold)
            .fontColor('#333333')
          Text(this.getTodayDateStr())
            .fontSize(13)
            .fontColor('#999999')
        }
        .alignItems(HorizontalAlign.Start)
        .width('100%')
        .margin({ left: 20, top: 20, bottom: 4 })

        // 数据概览卡片
        Row({ space: 10 }) {
          Column({ space: 4 }) {
            Text(`${this.passwordCount}`)
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor('#007DFF')
            Text('密码记录')
              .fontSize(11)
              .fontColor('#666666')
          }
          .layoutWeight(1)
          .padding({ top: 14, bottom: 14 })
          .backgroundColor('#F0F8FF')
          .borderRadius(12)
          .alignItems(HorizontalAlign.Center)

          Column({ space: 4 }) {
            Text(`${this.weightRecordCount}`)
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF6B6B')
            Text('体重记录')
              .fontSize(11)
              .fontColor('#666666')
          }
          .layoutWeight(1)
          .padding({ top: 14, bottom: 14 })
          .backgroundColor('#FFF5F5')
          .borderRadius(12)
          .alignItems(HorizontalAlign.Center)

          Column({ space: 4 }) {
            Text(this.latestBmi > 0 ? `${this.latestBmi.toFixed(1)}` : '--')
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor(DateUtil.getBMIColor(this.latestBmi))
            Text('BMI')
              .fontSize(11)
              .fontColor('#666666')
          }
          .layoutWeight(1)
          .padding({ top: 14, bottom: 14 })
          .backgroundColor('#F0FFF4')
          .borderRadius(12)
          .alignItems(HorizontalAlign.Center)
        }
        .width('100%')
        .padding({ left: 16, right: 16 })

        // 智能提醒卡片
        if (this.daysSinceLastRecord >= 3) {
          Row() {
            Text('⚠')
              .fontSize(22)
              .margin({ right: 12 })
            Column({ space: 3 }) {
              Text(`已${this.daysSinceLastRecord}天未记录体重`)
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF6B00')
              Text('坚持记录才能更好地管理体重哦～')
                .fontSize(12)
                .fontColor('#999999')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)

            Button('去记录')
              .fontSize(12)
              .fontColor('#FFFFFF')
              .backgroundColor('#FF6B00')
              .height(30)
              .borderRadius(15)
              .padding({ left: 14, right: 14 })
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
              })
          }
          .width('100%')
          .padding(14)
          .backgroundColor('#FFF8F0')
          .borderRadius(12)
          .border({ width: 1, color: '#FFE0C0' })
          .margin({ left: 16, right: 16 })
        }

        // 目标进度卡片
        if (this.weightGoal.targetWeight > 0 && this.latestWeightNum > 0) {
          Column({ space: 12 }) {
            Row() {
              Text('目标进度')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
              Blank()
              Text(`${Math.round(this.goalProgress * 100)}%`)
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .fontColor('#4CAF50')
            }
            .width('100%')

            // 进度条
            Stack({ alignContent: Alignment.Start }) {
              Row()
                .width('100%')
                .height(8)
                .backgroundColor('#F0F0F0')
                .borderRadius(4)
              Row()
                .width(`${Math.round(this.goalProgress * 100)}%`)
                .height(8)
                .backgroundColor('#4CAF50')
                .borderRadius(4)
            }
            .width('100%')

            Row() {
              Text(`当前 ${this.latestWeightNum.toFixed(1)} kg`)
                .fontSize(12)
                .fontColor('#666666')
              Blank()
              Text(`目标 ${this.weightGoal.targetWeight.toFixed(1)} kg`)
                .fontSize(12)
                .fontColor('#4CAF50')
            }
            .width('100%')
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)
          .margin({ left: 16, right: 16 })
        }

        // 密码保险柜卡片
        Row() {
          Column({ space: 8 }) {
            Text('密码保险柜')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FFFFFF')
            Text(`${this.passwordCount} 条记录·安全守护中`)
              .fontSize(13)
              .fontColor('rgba(255,255,255,0.8)')
            Button('查看全部')
              .fontSize(12)
              .fontColor('#007DFF')
              .backgroundColor('#FFFFFF')
              .height(30)
              .width(80)
              .margin({ top: 8 })
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
              })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

          // 盾牌图标
          Column() {
            Text('🛡️')
              .fontSize(48)
          }
          .width(64)
          .height(64)
          .justifyContent(FlexAlign.Center)
        }
        .width('100%')
        .height(130)
        .padding(20)
        .linearGradient({
          direction: GradientDirection.LeftTop,
          colors: [['#667eea', 0.0], ['#764ba2', 1.0]]
        })
        .borderRadius(16)
        .margin({ left: 16, right: 16 })

        // 最近密码活动
        if (this.recentPasswords.length > 0) {
          Column({ space: 10 }) {
            Row() {
              Text('最近密码')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
              Blank()
              Text('更多 >')
                .fontSize(12)
                .fontColor('#007DFF')
                .onClick(() => {
                  this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
                })
            }
            .width('100%')

            ForEach(this.recentPasswords, (item: PasswordModel) => {
              Row({ space: 12 }) {
                Text(item.platform.substring(0, 1))
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#FFFFFF')
                  .width(36)
                  .height(36)
                  .textAlign(TextAlign.Center)
                  .backgroundColor(this.getCategoryColor(item.category))
                  .borderRadius(10)

                Column({ space: 2 }) {
                  Text(item.platform)
                    .fontSize(14)
                    .fontWeight(FontWeight.Medium)
                    .fontColor('#333333')
                  Text(item.account)
                    .fontSize(11)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Text(item.category)
                  .fontSize(10)
                  .fontColor(this.getCategoryColor(item.category))
                  .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                  .backgroundColor(`${this.getCategoryColor(item.category)}15`)
                  .borderRadius(6)
              }
              .width('100%')
              .padding(10)
              .backgroundColor('#F8F9FA')
              .borderRadius(10)
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({
                  url: AppConstants.PAGE_PASSWORD_DETAIL,
                  params: { id: item.id }
                });
              })
            }, (item: PasswordModel) => item.id.toString())
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)
          .margin({ left: 16, right: 16 })
        }

        // 体重记录卡片
        Row() {
          Column({ space: 8 }) {
            Text('体重记录')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FFFFFF')
            Text(`最新体重 ${this.latestWeight} kg`)
              .fontSize(13)
              .fontColor('rgba(255,255,255,0.8)')
            Button('记录今日')
              .fontSize(12)
              .fontColor('#FF6B6B')
              .backgroundColor('#FFFFFF')
              .height(30)
              .width(80)
              .margin({ top: 8 })
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
              })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

          // 心形图标
          Column() {
            Text('❤️')
              .fontSize(48)
          }
          .width(64)
          .height(64)
          .justifyContent(FlexAlign.Center)
        }
        .width('100%')
        .height(130)
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
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333333')
            .alignSelf(ItemAlign.Start)

          Row({ space: 10 }) {
            QuickActionButton('生成密码', '#007DFF', () => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
            })
            QuickActionButton('体重统计', '#FF6B6B', () => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
            })
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceBetween)

          Row({ space: 10 }) {
            QuickActionButton('添加密码', '#9C27B0', () => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
            })
            QuickActionButton('设置', '#607D8B', () => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_SETTINGS });
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

        // 安全小贴士
        Column({ space: 8 }) {
          Text('💡 安全小贴士')
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333333')
            .alignSelf(ItemAlign.Start)
          Text(this.getSecurityTip())
            .fontSize(13)
            .fontColor('#666666')
            .lineHeight(20)
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFDE7')
        .borderRadius(12)
        .margin({ left: 16, right: 16, bottom: 8 })
      }
      .width('100%')
      .padding({ bottom: 20 })
    }
    .width('100%')
    .height('100%')
    .align(Alignment.TopStart)
  }

  getTodayDateStr(): string {
    const now = new Date();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case '工作': return '#007DFF';
      case '社交': return '#00C853';
      case '金融': return '#FF6B00';
      default: return '#9E9E9E';
    }
  }

  getSecurityTip(): string {
    const tips: string[] = [
      '建议每个平台使用不同的密码，避免一处泄露全线失守。',
      '密码长度建议至少 12 位，混合大小写、数字和特殊字符。',
      '定期更换重要账户密码，每 3-6 个月更换一次为佳。',
      '切勿在聊天工具或邮件中直接发送密码，请使用安全方式分享。',
      '开启应用锁可以防止他人查看您的密码数据。',
      '坚持记录体重可以更好地了解身体变化趋势。',
      'BMI 在 18.5-24 之间为正常范围，保持健康体重很重要。'
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return tips[dayOfYear % tips.length];
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
 * 密码管理 Tab：直接展示密码列表
 */
@Component
struct PasswordEntry {
  @State passwordList: PasswordModel[] = [];
  @State searchKeyword: string = '';
  @State selectedCategory: string = '全部';
  @State isLoading: boolean = false;
  @State categories: string[] = ['全部'];
  private passwordEventId: number = -1;

  aboutToAppear() {
    this.categories = ['全部'].concat(PASSWORD_CATEGORIES);
    this.loadPasswords();
    this.passwordEventId = EventUtil.onPasswordSaved(() => {
      this.loadPasswords();
    });
  }

  aboutToDisappear() {
    EventUtil.offPasswordSaved(this.passwordEventId);
  }

  async loadPasswords(): Promise<void> {
    if (this.isLoading) return;
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
      } else {
        ToastUtil.show('密码解密失败');
      }
    } catch (e) {
      console.error('Copy password error:', JSON.stringify(e));
      ToastUtil.show('复制失败');
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case '工作': return '#007DFF';
      case '社交': return '#00C853';
      case '金融': return '#FF6B00';
      default: return '#9E9E9E';
    }
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Text('密码管理')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')

        Blank()

        Button() {
          Text('+')
            .fontSize(24)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(40)
        .height(40)
        .backgroundColor('#007DFF')
        .type(ButtonType.Circle)
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
        })
      }
      .width('100%')
      .height(56)
      .padding({ left: 20, right: 20 })
      .backgroundColor('#FFFFFF')

      // 搜索栏
      Search({ value: this.searchKeyword, placeholder: '搜索平台、账号...' })
        .height(40)
        .backgroundColor('#F5F5F5')
        .borderRadius(20)
        .margin({ left: 16, right: 16, top: 8 })
        .onChange((value: string) => {
          this.searchKeyword = value;
          this.loadPasswords();
        })

      // 分类筛选
      Scroll() {
        Row({ space: 8 }) {
          ForEach(this.categories, (category: string) => {
            Text(category)
              .fontSize(13)
              .fontColor(this.selectedCategory === category ? '#FFFFFF' : '#666666')
              .padding({ left: 14, right: 14, top: 6, bottom: 6 })
              .backgroundColor(this.selectedCategory === category ? '#007DFF' : '#F0F0F0')
              .borderRadius(16)
              .onClick(() => {
                this.selectedCategory = category;
                this.loadPasswords();
              })
          }, (category: string) => category)
        }
        .padding({ left: 16, right: 16 })
      }
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .width('100%')
      .height(44)

      // 列表内容
      if (this.isLoading) {
        Column() {
          LoadingProgress().width(36).height(36).color('#007DFF')
        }.width('100%').layoutWeight(1).justifyContent(FlexAlign.Center)
      } else if (this.passwordList.length === 0) {
        Column({ space: 12 }) {
          Text('暂无密码记录')
            .fontSize(16)
            .fontColor('#999999')
          Text('点击右上角 + 添加第一条记录')
            .fontSize(13)
            .fontColor('#CCCCCC')
        }
        .width('100%').layoutWeight(1).justifyContent(FlexAlign.Center)
      } else {
        List({ space: 10 }) {
          ForEach(this.passwordList, (item: PasswordModel) => {
            ListItem() {
              Row({ space: 12 }) {
                // 平台图标
                Text(item.platform.substring(0, 1))
                  .fontSize(18)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#FFFFFF')
                  .width(42)
                  .height(42)
                  .textAlign(TextAlign.Center)
                  .backgroundColor(this.getCategoryColor(item.category))
                  .borderRadius(12)

                // 信息
                Column({ space: 4 }) {
                  Text(item.platform)
                    .fontSize(15)
                    .fontWeight(FontWeight.Medium)
                    .fontColor('#333333')
                  Text(item.account)
                    .fontSize(12)
                    .fontColor('#999999')
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                // 分类标签
                Text(item.category)
                  .fontSize(10)
                  .fontColor(this.getCategoryColor(item.category))
                  .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                  .backgroundColor(`${this.getCategoryColor(item.category)}15`)
                  .borderRadius(6)
              }
              .width('100%')
              .padding(14)
              .backgroundColor('#FFFFFF')
              .borderRadius(12)
              .shadow({ radius: 2, color: '#0A000000', offsetY: 1 })
            }
            .onClick(() => {
              this.getUIContext().getRouter().pushUrl({
                url: AppConstants.PAGE_PASSWORD_DETAIL,
                params: { id: item.id }
              });
            })
            .gesture(
              LongPressGesture({ repeat: false })
                .onAction(() => {
                  this.copyPassword(item.password);
                })
            )
          }, (item: PasswordModel) => item.id.toString() + '_' + item.updateTime)
        }
        .width('100%')
        .layoutWeight(1)
        .padding({ left: 16, right: 16, top: 4 })
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}

/**
 * 体重记录 Tab：展示最近记录 + 快速添加
 */
@Component
struct WeightEntry {
  @State weightList: WeightModel[] = [];
  @State latestWeight: number = 0;
  @State latestBmi: number = 0;
  @State weightGoal: WeightGoal = new WeightGoal();
  @State isLoading: boolean = false;
  private weightEventId: number = -1;

  aboutToAppear() {
    this.loadData();
    this.weightEventId = EventUtil.onWeightSaved(() => {
      this.loadData();
    });
  }

  aboutToDisappear() {
    EventUtil.offWeightSaved(this.weightEventId);
  }

  async loadData() {
    this.isLoading = true;
    try {
      this.weightList = await DatabaseManager.getInstance().queryAllWeights();
      if (this.weightList.length > 0) {
        const latest = this.weightList[this.weightList.length - 1];
        this.latestWeight = latest.weight;
        this.latestBmi = latest.bmi;
      }
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      if (goalStr) {
        this.weightGoal = JSON.parse(goalStr) as WeightGoal;
      }
    } catch (e) {
      console.error('WeightEntry loadData error:', JSON.stringify(e));
    }
    this.isLoading = false;
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Text('体重记录')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')

        Blank()

        Button() {
          Text('统计')
            .fontSize(13)
            .fontColor('#007DFF')
        }
        .height(32)
        .backgroundColor('#E3F2FD')
        .borderRadius(16)
        .padding({ left: 12, right: 12 })
        .margin({ right: 8 })
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
        })

        Button() {
          Text('+')
            .fontSize(24)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(40)
        .height(40)
        .backgroundColor('#FF6B6B')
        .type(ButtonType.Circle)
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
        })
      }
      .width('100%')
      .height(56)
      .padding({ left: 20, right: 20 })
      .backgroundColor('#FFFFFF')

      // 数据概览卡片
      Row({ space: 12 }) {
        Column({ space: 4 }) {
          Text('最新体重')
            .fontSize(11)
            .fontColor('#999999')
          Text(this.latestWeight > 0 ? `${this.latestWeight.toFixed(1)}` : '--')
            .fontSize(26)
            .fontWeight(FontWeight.Bold)
            .fontColor('#333333')
          Text('kg')
            .fontSize(11)
            .fontColor('#999999')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
        .padding(12)
        .backgroundColor('#FFF5F5')
        .borderRadius(12)

        Column({ space: 4 }) {
          Text('BMI')
            .fontSize(11)
            .fontColor('#999999')
          Text(this.latestBmi > 0 ? `${this.latestBmi.toFixed(1)}` : '--')
            .fontSize(26)
            .fontWeight(FontWeight.Bold)
            .fontColor(DateUtil.getBMIColor(this.latestBmi))
          Text(this.latestBmi > 0 ? DateUtil.getBMICategory(this.latestBmi) : '')
            .fontSize(11)
            .fontColor(DateUtil.getBMIColor(this.latestBmi))
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
        .padding(12)
        .backgroundColor('#F0F8FF')
        .borderRadius(12)

        Column({ space: 4 }) {
          Text('目标')
            .fontSize(11)
            .fontColor('#999999')
          Text(this.weightGoal.targetWeight > 0 ? `${this.weightGoal.targetWeight.toFixed(1)}` : '--')
            .fontSize(26)
            .fontWeight(FontWeight.Bold)
            .fontColor('#007DFF')
          Text('kg')
            .fontSize(11)
            .fontColor('#999999')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
        .padding(12)
        .backgroundColor('#F0FFF0')
        .borderRadius(12)
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12 })

      // 最近记录列表
      if (this.weightList.length === 0) {
        Column({ space: 12 }) {
          Text('暂无体重记录')
            .fontSize(16)
            .fontColor('#999999')
          Text('点击右上角 + 记录今日体重')
            .fontSize(13)
            .fontColor('#CCCCCC')
        }
        .width('100%').layoutWeight(1).justifyContent(FlexAlign.Center)
      } else {
        Column() {
          Text('最近记录')
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor('#666666')
            .alignSelf(ItemAlign.Start)
            .margin({ left: 16, top: 16, bottom: 8 })

          List({ space: 8 }) {
            ForEach(this.weightList.slice().reverse(), (item: WeightModel) => {
              ListItem() {
                Row({ space: 12 }) {
                  // 日期
                  Column({ space: 2 }) {
                    Text(DateUtil.formatDate(item.date).split('-')[2])
                      .fontSize(20)
                      .fontWeight(FontWeight.Bold)
                      .fontColor('#FF6B6B')
                    Text(`${DateUtil.formatDate(item.date).split('-')[1]}月`)
                      .fontSize(10)
                      .fontColor('#999999')
                  }
                  .width(44)
                  .alignItems(HorizontalAlign.Center)

                  // 体重信息
                  Column({ space: 3 }) {
                    Text(`${item.weight.toFixed(1)} kg`)
                      .fontSize(16)
                      .fontWeight(FontWeight.Medium)
                      .fontColor('#333333')
                    Row({ space: 8 }) {
                      Text(`BMI ${item.bmi.toFixed(1)}`)
                        .fontSize(11)
                        .fontColor(DateUtil.getBMIColor(item.bmi))
                      if (item.bodyFatRate > 0) {
                        Text(`体脂 ${item.bodyFatRate.toFixed(1)}%`)
                          .fontSize(11)
                          .fontColor('#999999')
                      }
                    }
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)

                  // 与目标差距
                  if (this.weightGoal.targetWeight > 0) {
                    Text(`${(item.weight - this.weightGoal.targetWeight) > 0 ? '+' : ''}${(item.weight - this.weightGoal.targetWeight).toFixed(1)}`)
                      .fontSize(13)
                      .fontColor(Math.abs(item.weight - this.weightGoal.targetWeight) < 0.5 ? '#4CAF50' : ((item.weight - this.weightGoal.targetWeight) > 0 ? '#FF9800' : '#2196F3'))
                  }
                }
                .width('100%')
                .padding(12)
                .backgroundColor('#FFFFFF')
                .borderRadius(10)
              }
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({
                  url: AppConstants.PAGE_WEIGHT_DETAIL,
                  params: { id: item.id }
                });
              })
            }, (item: WeightModel) => item.id.toString() + '_' + item.updateTime)
          }
          .width('100%')
          .layoutWeight(1)
          .padding({ left: 16, right: 16 })
          .edgeEffect(EdgeEffect.Spring)
        }
        .width('100%')
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}

/**
 * 设置 Tab：直接展示设置内容
 */
@Component
struct SettingsEntry {
  @State appLockEnabled: boolean = false;
  @State clipboardClearEnabled: boolean = true;
  @State passwordCount: number = 0;
  @State weightCount: number = 0;

  aboutToAppear() {
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      this.appLockEnabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
      this.clipboardClearEnabled = pref.getSync(AppConstants.PREF_CLIPBOARD_CLEAR, true) as boolean;
      const passwords = await DatabaseManager.getInstance().queryAllPasswords();
      this.passwordCount = passwords.length;
      const weights = await DatabaseManager.getInstance().queryAllWeights();
      this.weightCount = weights.length;
    } catch (e) {
      console.error('SettingsEntry load error:', JSON.stringify(e));
    }
  }

  build() {
    Column() {
      // 顶部标题
      Row() {
        Text('设置')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
      }
      .width('100%')
      .height(56)
      .padding({ left: 20 })
      .backgroundColor('#FFFFFF')

      Scroll() {
        Column({ space: 12 }) {
          // 数据概览
          Row({ space: 16 }) {
            Column({ space: 4 }) {
              Text(`${this.passwordCount}`)
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .fontColor('#007DFF')
              Text('密码记录')
                .fontSize(12)
                .fontColor('#666666')
            }
            .layoutWeight(1)
            .padding(16)
            .backgroundColor('#F0F8FF')
            .borderRadius(12)
            .alignItems(HorizontalAlign.Center)

            Column({ space: 4 }) {
              Text(`${this.weightCount}`)
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .fontColor('#FF6B6B')
              Text('体重记录')
                .fontSize(12)
                .fontColor('#666666')
            }
            .layoutWeight(1)
            .padding(16)
            .backgroundColor('#FFF5F5')
            .borderRadius(12)
            .alignItems(HorizontalAlign.Center)
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12 })

          // 安全设置
          Column({ space: 0 }) {
            Text('安全')
              .fontSize(13)
              .fontColor('#999999')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            Row() {
              Text('应用锁')
                .fontSize(15)
                .fontColor('#333333')
              Blank()
              Toggle({ type: ToggleType.Switch, isOn: this.appLockEnabled })
                .onChange((isOn: boolean) => {
                  this.appLockEnabled = isOn;
                  try {
                    const context = this.getUIContext().getHostContext();
                    const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
                    pref.put(AppConstants.PREF_APP_LOCK_ENABLED, isOn);
                    pref.flush();
                  } catch (e) {
                    console.error('Toggle lock error:', JSON.stringify(e));
                  }
                })
            }
            .width('100%')
            .padding({ top: 12, bottom: 12 })

            Divider().color('#F0F0F0')

            Row() {
              Text('剪贴板自动清除')
                .fontSize(15)
                .fontColor('#333333')
              Blank()
              Toggle({ type: ToggleType.Switch, isOn: this.clipboardClearEnabled })
                .onChange((isOn: boolean) => {
                  this.clipboardClearEnabled = isOn;
                  try {
                    const context = this.getUIContext().getHostContext();
                    const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
                    pref.put(AppConstants.PREF_CLIPBOARD_CLEAR, isOn);
                    pref.flush();
                  } catch (e) {
                    console.error('Toggle clipboard error:', JSON.stringify(e));
                  }
                })
            }
            .width('100%')
            .padding({ top: 12, bottom: 12 })
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ left: 16, right: 16 })

          // 功能入口
          Column({ space: 0 }) {
            Text('更多')
              .fontSize(13)
              .fontColor('#999999')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            Row() {
              Text('密码生成器')
                .fontSize(15)
                .fontColor('#333333')
              Blank()
              Text('>')
                .fontSize(16)
                .fontColor('#CCCCCC')
            }
            .width('100%')
            .padding({ top: 12, bottom: 12 })
            .onClick(() => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
            })

            Divider().color('#F0F0F0')

            Row() {
              Text('全部设置')
                .fontSize(15)
                .fontColor('#333333')
              Blank()
              Text('>')
                .fontSize(16)
                .fontColor('#CCCCCC')
            }
            .width('100%')
            .padding({ top: 12, bottom: 12 })
            .onClick(() => {
              this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_SETTINGS });
            })
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ left: 16, right: 16 })
        }
        .width('100%')
        .padding({ bottom: 20 })
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
