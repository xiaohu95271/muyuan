import { DatabaseManager } from '../../common/database/DatabaseManager';
import { WeightModel, WeightStatistics, WeightGoal } from '../../models/WeightModel';
import { DateUtil } from '../../common/utils/DateUtil';
import { AppConstants } from '../../common/constants/AppConstants';
import { preferences } from '@kit.ArkData';




@Entry
@Component
struct WeightStatisticsPage {
  @State weightList: WeightModel[] = [];
  @State statistics: WeightStatistics = new WeightStatistics();
  @State weightGoal: WeightGoal = new WeightGoal();
  @State selectedPeriod: string = '周';
  @State chartData: WeightModel[] = [];

  aboutToAppear() {
    this.loadWeightGoal();
    this.loadStatistics();
  }

  onPageShow() {
    this.loadWeightGoal();
    this.loadStatistics();
  }

  async loadWeightGoal() {
    try {
      const context = this.getUIContext().getHostContext();
      const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
      const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
      if (goalStr) {
        let parsed: WeightGoal = JSON.parse(goalStr) as WeightGoal;
        this.weightGoal = parsed;
      }
    } catch (e) {
      console.error('Load weight goal error:', JSON.stringify(e));
    }
  }

  async loadStatistics() {
    this.weightList = await DatabaseManager.getInstance().queryAllWeights();
    this.calculateStatistics();
    this.updateChartData();
  }

  calculateStatistics() {
    if (this.weightList.length === 0) {
      this.statistics = new WeightStatistics();
      return;
    }
    const weights = this.weightList.map(w => w.weight);
    const bmis = this.weightList.map(w => w.bmi).filter(b => b > 0);
    let stats = new WeightStatistics();
    stats.averageWeight = parseFloat((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1));
    stats.maxWeight = weights[0];
    stats.minWeight = weights[0];
    for (let i = 1; i < weights.length; i++) {
      if (weights[i] > stats.maxWeight) stats.maxWeight = weights[i];
      if (weights[i] < stats.minWeight) stats.minWeight = weights[i];
    }
    stats.weightChange = parseFloat((weights[weights.length - 1] - weights[0]).toFixed(1));
    stats.averageBmi = bmis.length > 0 ? parseFloat((bmis.reduce((a, b) => a + b, 0) / bmis.length).toFixed(1)) : 0;
    stats.recordCount = this.weightList.length;
    stats.startDate = this.weightList[0].date;
    stats.endDate = this.weightList[this.weightList.length - 1].date;
    this.statistics = stats;
  }

  updateChartData() {
    const now = Date.now();
    let startTime: number;
    switch (this.selectedPeriod) {
      case '周':
        startTime = DateUtil.getWeekStart();
        break;
      case '月':
        startTime = DateUtil.getMonthStart();
        break;
      case '年':
        startTime = DateUtil.getYearStart();
        break;
      default:
        startTime = 0;
    }
    this.chartData = this.weightList.filter(w => w.date >= startTime);
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

        Text('体重统计')
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
          // 周期切换
          Row({ space: 8 }) {
            ForEach(['周', '月', '年', '全部'], (period: string) => {
              Text(period)
                .fontSize(14)
                .fontColor(this.selectedPeriod === period ? '#FFFFFF' : '#666666')
                .padding({ left: 20, right: 20, top: 8, bottom: 8 })
                .backgroundColor(this.selectedPeriod === period ? '#FF6B6B' : '#F0F0F0')
                .borderRadius(20)
                .onClick(() => {
                  this.selectedPeriod = period;
                  this.updateChartData();
                })
            }, (period: string) => period)
          }
          .width('100%')
          .justifyContent(FlexAlign.Center)
          .padding({ top: 8, bottom: 8 })

          // 统计卡片
          if (this.weightList.length > 0) {
            Column({ space: 12 }) {
              Text('数据概览')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
                .alignSelf(ItemAlign.Start)

              Row({ space: 12 }) {
                StatItem('平均体重', `${this.statistics.averageWeight}kg`, '#FF6B6B')
                StatItem('最高体重', `${this.statistics.maxWeight}kg`, '#FF9800')
                StatItem('最低体重', `${this.statistics.minWeight}kg`, '#4CAF50')
              }
              .width('100%')

              Row({ space: 12 }) {
                StatItem('体重变化', `${this.statistics.weightChange > 0 ? '+' : ''}${this.statistics.weightChange}kg`,
                  this.statistics.weightChange > 0 ? '#FF4444' : '#4CAF50')
                StatItem('平均BMI', `${this.statistics.averageBmi}`, '#2196F3')
                StatItem('记录数', `${this.statistics.recordCount}`, '#9C27B0')
              }
              .width('100%')
            }
            .width('100%')
            .padding(20)
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .margin({ left: 16, right: 16 })

            // 趋势图表
            Column({ space: 12 }) {
              Text('体重趋势')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
                .alignSelf(ItemAlign.Start)

              WeightChart({
                data: this.chartData,
                targetWeight: this.weightGoal.targetWeight
              })
            }
            .width('100%')
            .padding(20)
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .margin({ left: 16, right: 16 })
          } else {
            Column({ space: 0 }) {
              // 空状态插画区域
              Column({ space: 0 }) {
                // 装饰性背景圆
                Stack() {
                  // 外层淡色圆环
                  Column()
                    .width(140)
                    .height(140)
                    .borderRadius(70)
                    .backgroundColor('rgba(255, 107, 107, 0.06)')

                  // 中层圆环
                  Column()
                    .width(108)
                    .height(108)
                    .borderRadius(54)
                    .backgroundColor('rgba(255, 107, 107, 0.10)')

                  // 内层图标容器
                  Column({ space: 4 }) {
                    SymbolGlyph($r('sys.symbol.character_textbox'))
                      .fontSize(40)
                      .fontColor(['#FF6B6B'])
                  }
                  .width(76)
                  .height(76)
                  .borderRadius(38)
                  .backgroundColor('#FFFFFF')
                  .justifyContent(FlexAlign.Center)
                  .alignItems(HorizontalAlign.Center)
                  .shadow({ radius: 12, color: 'rgba(255, 107, 107, 0.15)', offsetY: 4 })
                }
                .width(140)
                .height(140)
                .alignContent(Alignment.Center)
              }
              .margin({ top: 40, bottom: 28 })

              // 文案区域
              Text('还没有体重记录')
                .fontSize(18)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
                .margin({ bottom: 8 })

              Text('开始记录体重，查看你的健康趋势变化')
                .fontSize(14)
                .fontColor('#757575')
                .margin({ bottom: 8 })

              // 功能预览提示
              Row({ space: 20 }) {
                Column({ space: 6 }) {
                  SymbolGlyph($r('sys.symbol.character_textbox'))
                    .fontSize(24)
                    .fontColor(['#FF6B6B'])
                  Text('趋势分析')
                    .fontSize(11)
                    .fontColor('#757575')
                }
                .alignItems(HorizontalAlign.Center)

                Column({ space: 6 }) {
                  SymbolGlyph($r('sys.symbol.target_ceremony'))
                    .fontSize(24)
                    .fontColor(['#4CAF50'])
                  Text('目标追踪')
                    .fontSize(11)
                    .fontColor('#757575')
                }
                .alignItems(HorizontalAlign.Center)

                Column({ space: 6 }) {
                  SymbolGlyph($r('sys.symbol.doc_text'))
                    .fontSize(24)
                    .fontColor(['#2196F3'])
                  Text('数据统计')
                    .fontSize(11)
                    .fontColor('#757575')
                }
                .alignItems(HorizontalAlign.Center)
              }
              .width('100%')
              .justifyContent(FlexAlign.Center)
              .padding({ top: 20, bottom: 28 })
              .margin({ left: 40, right: 40 })
              .backgroundColor('#FAFAFA')
              .borderRadius(16)
              .margin({ top: 24 })

              // 操作按钮
              Button() {
                Row({ space: 8 }) {
                  SymbolGlyph($r('sys.symbol.plus'))
                    .fontSize(18)
                    .fontColor(['#FFFFFF'])
                  Text('去记录体重')
                    .fontSize(15)
                    .fontColor('#FFFFFF')
                    .fontWeight(FontWeight.Medium)
                }
              }
              .width(200)
              .height(44)
              .backgroundColor('#FF6B6B')
              .borderRadius(22)
              .margin({ top: 28 })
              .shadow({ radius: 8, color: 'rgba(255, 107, 107, 0.3)', offsetY: 4 })
              .onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
              })
            }
            .width('100%')
            .alignItems(HorizontalAlign.Center)
          }
        }
        .width('100%')
        .padding({ top: 8, bottom: 20 })
      }
      .width('100%')
      .layoutWeight(1)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}

@Builder
function StatItem(label: string, value: string, color: string) {
  Column({ space: 4 }) {
    Text(value)
      .fontSize(18)
      .fontWeight(FontWeight.Bold)
      .fontColor(color)
    Text(label)
      .fontSize(11)
      .fontColor('#757575')
  }
  .layoutWeight(1)
  .padding(12)
  .backgroundColor('#F8F8F8')
  .borderRadius(12)
  .alignItems(HorizontalAlign.Center)
}

@Component
struct WeightChart {
  @Prop @Watch('onDataChange') data: WeightModel[] = [];
  @Prop targetWeight: number = 0;
  @State canvasWidth: number = 0;
  @State canvasHeight: number = 300;
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(new RenderingContextSettings(true));

  // 将对象字面量拆分为独立变量，避免 ArkTS 严格模式报错
  private pTop: number = 30;
  private pRight: number = 20;
  private pBottom: number = 40;
  private pLeft: number = 44;

  aboutToAppear() {
    // 延迟绘制，等待布局完成
    setTimeout(() => {
      this.drawChart();
    }, 100);
  }

  onDataChange() {
    // 数据变化时重绘图表
    if (this.canvasWidth > 0) {
      this.drawChart();
    } else {
      setTimeout(() => {
        this.drawChart();
      }, 100);
    }
  }

  build() {
    Column() {
      if (this.data.length === 0) {
        Column() {
          Text('暂无数据')
            .fontSize(14)
            .fontColor('#757575')
            .textAlign(TextAlign.Center)
            .width('100%')
          Text('记录体重后查看趋势')
            .fontSize(12)
            .fontColor('#888888')
            .margin({ top: 4 })
        }
        .width('100%')
        .height(this.canvasHeight)
        .backgroundColor('#FAFAFA')
        .borderRadius(8)
        .justifyContent(FlexAlign.Center)
      } else {
        Canvas(this.context)
          .width('100%')
          .height(this.canvasHeight)
          .backgroundColor('#FAFAFA')
          .borderRadius(8)
          .onReady(() => {
            this.drawChart();
          })
          .onAreaChange((oldArea, newArea) => {
            this.canvasWidth = newArea.width as number;
            this.drawChart();
          })
      }
    }
    .width('100%')
  }

  drawChart() {
    if (this.data.length === 0 || this.canvasWidth <= 0) {
      return;
    }

    const ctx = this.context;
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    // 右侧留出空间给 BMI Y 轴
    const bmiAxisWidth: number = 44;
    const chartWidth = width - this.pLeft - this.pRight - bmiAxisWidth;
    const chartHeight = height - this.pTop - this.pBottom;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 计算体重数值范围
    const weights = this.data.map(d => d.weight);
    let minWeight = Math.min(...weights);
    let maxWeight = Math.max(...weights);
    if (this.targetWeight > 0) {
      minWeight = Math.min(minWeight, this.targetWeight);
      maxWeight = Math.max(maxWeight, this.targetWeight);
    }
    const weightRange = maxWeight - minWeight;
    const paddingRange = weightRange === 0 ? 2 : weightRange * 0.15;
    const yMin = Math.max(0, minWeight - paddingRange);
    const yMax = maxWeight + paddingRange;

    // 计算 BMI 数值范围
    const bmis = this.data.map(d => d.bmi).filter(b => b > 0);
    const hasBmi = bmis.length > 0;
    let bmiMin: number = 15;
    let bmiMax: number = 35;
    if (hasBmi) {
      bmiMin = Math.max(10, Math.min(...bmis) - 2);
      bmiMax = Math.max(...bmis) + 2;
    }

    // 坐标转换函数
    const getX = (index: number): number => {
      if (this.data.length === 1) {
        return this.pLeft + chartWidth / 2;
      }
      return this.pLeft + (index / (this.data.length - 1)) * chartWidth;
    };
    const getY = (weight: number): number => {
      if (yMax === yMin) {
        return this.pTop + chartHeight / 2;
      }
      return this.pTop + chartHeight - ((weight - yMin) / (yMax - yMin)) * chartHeight;
    };
    const getBmiY = (bmi: number): number => {
      if (bmiMax === bmiMin) {
        return this.pTop + chartHeight / 2;
      }
      return this.pTop + chartHeight - ((bmi - bmiMin) / (bmiMax - bmiMin)) * chartHeight;
    };

    // 绘制网格线（水平）
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E8E8E8';
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#757575';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = this.pTop + (i / gridCount) * chartHeight;
      const value = yMax - (i / gridCount) * (yMax - yMin);

      ctx.beginPath();
      ctx.moveTo(this.pLeft, y);
      ctx.lineTo(this.pLeft + chartWidth, y);
      ctx.stroke();

      // 左侧 Y 轴标签（体重）
      ctx.fillStyle = '#FF6B6B';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), this.pLeft - 6, y);
    }

    // 右侧 BMI Y 轴标签
    if (hasBmi) {
      ctx.textAlign = 'left';
      for (let i = 0; i <= gridCount; i++) {
        const y = this.pTop + (i / gridCount) * chartHeight;
        const bmiValue = bmiMax - (i / gridCount) * (bmiMax - bmiMin);
        ctx.fillStyle = '#2196F3';
        ctx.fillText(bmiValue.toFixed(1), this.pLeft + chartWidth + 8, y);
      }
    }

    // 绘制目标体重虚线
    if (this.targetWeight > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      const ty = getY(this.targetWeight);
      ctx.moveTo(this.pLeft, ty);
      ctx.lineTo(this.pLeft + chartWidth, ty);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 绘制体重折线
    ctx.beginPath();
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (let i = 0; i < this.data.length; i++) {
      const x = getX(i);
      const y = getY(this.data[i].weight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // 绘制体重填充区域
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 107, 107, 0.08)';
    for (let i = 0; i < this.data.length; i++) {
      const x = getX(i);
      const y = getY(this.data[i].weight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineTo(getX(this.data.length - 1), this.pTop + chartHeight);
    ctx.lineTo(getX(0), this.pTop + chartHeight);
    ctx.closePath();
    ctx.fill();

    // 绘制 BMI 折线（蓝色虚线）
    if (hasBmi) {
      ctx.beginPath();
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      let started = false;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].bmi > 0) {
          const x = getX(i);
          const y = getBmiY(this.data[i].bmi);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // BMI 数据点（小圆点）
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].bmi > 0) {
          const x = getX(i);
          const y = getBmiY(this.data[i].bmi);
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#2196F3';
          ctx.fill();
        }
      }
    }

    // 绘制体重数据点
    for (let i = 0; i < this.data.length; i++) {
      const x = getX(i);
      const y = getY(this.data[i].weight);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF6B6B';
      ctx.fill();
    }

    // 绘制 X 轴日期标签
    ctx.fillStyle = '#757575';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const labelStep = Math.max(1, Math.ceil(this.data.length / 6));
    for (let i = 0; i < this.data.length; i += labelStep) {
      const x = getX(i);
      const dateStr = DateUtil.formatDate(this.data[i].date).substring(5);
      ctx.fillText(dateStr, x, this.pTop + chartHeight + 8);
    }

    // 绘制体重数值标签（在点上方）
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (let i = 0; i < this.data.length; i++) {
      const x = getX(i);
      const y = getY(this.data[i].weight);
      ctx.fillText(this.data[i].weight.toFixed(1), x, y - 10);
    }

    // 绘制图例
    const legendY = height - 12;
    ctx.font = '11px sans-serif';
    ctx.textBaseline = 'middle';
    // 体重图例
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(this.pLeft + 8, legendY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    ctx.fillText('体重(kg)', this.pLeft + 16, legendY);
    // BMI 图例
    if (hasBmi) {
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(this.pLeft + 80, legendY, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#666666';
      ctx.fillText('BMI', this.pLeft + 88, legendY);
    }
    // 目标图例
    if (this.targetWeight > 0) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(this.pLeft + 120, legendY);
      ctx.lineTo(this.pLeft + 136, legendY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#666666';
      ctx.fillText(`目标${this.targetWeight.toFixed(0)}kg`, this.pLeft + 140, legendY);
    }
  }
}
