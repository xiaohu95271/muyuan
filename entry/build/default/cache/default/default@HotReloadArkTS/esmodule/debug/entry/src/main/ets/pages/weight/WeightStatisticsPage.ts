if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WeightChart_Params {
    data?: WeightModel[];
    targetWeight?: number;
    canvasWidth?: number;
    canvasHeight?: number;
    context?: CanvasRenderingContext2D;
    pTop?: number;
    pRight?: number;
    pBottom?: number;
    pLeft?: number;
}
interface WeightStatisticsPage_Params {
    weightList?: WeightModel[];
    statistics?: WeightStatistics;
    weightGoal?: WeightGoal;
    selectedPeriod?: string;
    chartData?: WeightModel[];
}
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { WeightStatistics, WeightGoal } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import type { WeightModel } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import { DateUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtil&";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import preferences from "@ohos:data.preferences";
class WeightStatisticsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__weightList = new ObservedPropertyObjectPU([], this, "weightList");
        this.__statistics = new ObservedPropertyObjectPU(new WeightStatistics(), this, "statistics");
        this.__weightGoal = new ObservedPropertyObjectPU(new WeightGoal(), this, "weightGoal");
        this.__selectedPeriod = new ObservedPropertySimplePU('周', this, "selectedPeriod");
        this.__chartData = new ObservedPropertyObjectPU([], this, "chartData");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightStatisticsPage_Params) {
        if (params.weightList !== undefined) {
            this.weightList = params.weightList;
        }
        if (params.statistics !== undefined) {
            this.statistics = params.statistics;
        }
        if (params.weightGoal !== undefined) {
            this.weightGoal = params.weightGoal;
        }
        if (params.selectedPeriod !== undefined) {
            this.selectedPeriod = params.selectedPeriod;
        }
        if (params.chartData !== undefined) {
            this.chartData = params.chartData;
        }
    }
    updateStateVars(params: WeightStatisticsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__weightList.purgeDependencyOnElmtId(rmElmtId);
        this.__statistics.purgeDependencyOnElmtId(rmElmtId);
        this.__weightGoal.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedPeriod.purgeDependencyOnElmtId(rmElmtId);
        this.__chartData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__weightList.aboutToBeDeleted();
        this.__statistics.aboutToBeDeleted();
        this.__weightGoal.aboutToBeDeleted();
        this.__selectedPeriod.aboutToBeDeleted();
        this.__chartData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __weightList: ObservedPropertyObjectPU<WeightModel[]>;
    get weightList() {
        return this.__weightList.get();
    }
    set weightList(newValue: WeightModel[]) {
        this.__weightList.set(newValue);
    }
    private __statistics: ObservedPropertyObjectPU<WeightStatistics>;
    get statistics() {
        return this.__statistics.get();
    }
    set statistics(newValue: WeightStatistics) {
        this.__statistics.set(newValue);
    }
    private __weightGoal: ObservedPropertyObjectPU<WeightGoal>;
    get weightGoal() {
        return this.__weightGoal.get();
    }
    set weightGoal(newValue: WeightGoal) {
        this.__weightGoal.set(newValue);
    }
    private __selectedPeriod: ObservedPropertySimplePU<string>;
    get selectedPeriod() {
        return this.__selectedPeriod.get();
    }
    set selectedPeriod(newValue: string) {
        this.__selectedPeriod.set(newValue);
    }
    private __chartData: ObservedPropertyObjectPU<WeightModel[]>;
    get chartData() {
        return this.__chartData.get();
    }
    set chartData(newValue: WeightModel[]) {
        this.__chartData.set(newValue);
    }
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
        }
        catch (e) {
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
            if (weights[i] > stats.maxWeight)
                stats.maxWeight = weights[i];
            if (weights[i] < stats.minWeight)
                stats.minWeight = weights[i];
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height(56);
            // 顶部导航栏
            Row.padding({ left: 8, right: 16 });
            // 顶部导航栏
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('<');
            Button.fontSize(28);
            Button.fontColor('#333333');
            Button.width(52);
            Button.height(52);
            Button.type(ButtonType.Circle);
            Button.backgroundColor('transparent');
            Button.onClick(() => {
                this.getUIContext().getRouter().back();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重统计');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.padding({ top: 8, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 周期切换
            Row.create({ space: 8 });
            // 周期切换
            Row.width('100%');
            // 周期切换
            Row.justifyContent(FlexAlign.Center);
            // 周期切换
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const period = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(period);
                    Text.fontSize(14);
                    Text.fontColor(this.selectedPeriod === period ? '#FFFFFF' : '#666666');
                    Text.padding({ left: 20, right: 20, top: 8, bottom: 8 });
                    Text.backgroundColor(this.selectedPeriod === period ? '#FF6B6B' : '#F0F0F0');
                    Text.borderRadius(20);
                    Text.onClick(() => {
                        this.selectedPeriod = period;
                        this.updateChartData();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['周', '月', '年', '全部'], forEachItemGenFunction, (period: string) => period, false, false);
        }, ForEach);
        ForEach.pop();
        // 周期切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 统计卡片
            if (this.weightList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.width('100%');
                        Column.padding(20);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                        Column.margin({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('数据概览');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#333333');
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 12 });
                        Row.width('100%');
                    }, Row);
                    StatItem.bind(this)('平均体重', `${this.statistics.averageWeight}kg`, '#FF6B6B');
                    StatItem.bind(this)('最高体重', `${this.statistics.maxWeight}kg`, '#FF9800');
                    StatItem.bind(this)('最低体重', `${this.statistics.minWeight}kg`, '#4CAF50');
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 12 });
                        Row.width('100%');
                    }, Row);
                    StatItem.bind(this)('体重变化', `${this.statistics.weightChange > 0 ? '+' : ''}${this.statistics.weightChange}kg`, this.statistics.weightChange > 0 ? '#FF4444' : '#4CAF50');
                    StatItem.bind(this)('平均BMI', `${this.statistics.averageBmi}`, '#2196F3');
                    StatItem.bind(this)('记录数', `${this.statistics.recordCount}`, '#9C27B0');
                    Row.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 趋势图表
                        Column.create({ space: 12 });
                        // 趋势图表
                        Column.width('100%');
                        // 趋势图表
                        Column.padding(20);
                        // 趋势图表
                        Column.backgroundColor('#FFFFFF');
                        // 趋势图表
                        Column.borderRadius(16);
                        // 趋势图表
                        Column.margin({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('体重趋势');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#333333');
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new WeightChart(this, {
                                    data: this.chartData,
                                    targetWeight: this.weightGoal.targetWeight
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/weight/WeightStatisticsPage.ets", line: 177, col: 15 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.chartData,
                                        targetWeight: this.weightGoal.targetWeight
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    data: this.chartData,
                                    targetWeight: this.weightGoal.targetWeight
                                });
                            }
                        }, { name: "WeightChart" });
                    }
                    // 趋势图表
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 16 });
                        Column.margin({ top: 80 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('记录体重后查看统计');
                        Text.fontSize(13);
                        Text.fontColor('#CCCCCC');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WeightStatisticsPage";
    }
}
function StatItem(label: string, value: string, color: string, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Column.create({ space: 4 });
        Column.layoutWeight(1);
        Column.padding(12);
        Column.backgroundColor('#F8F8F8');
        Column.borderRadius(12);
        Column.alignItems(HorizontalAlign.Center);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(value);
        Text.fontSize(18);
        Text.fontWeight(FontWeight.Bold);
        Text.fontColor(color);
    }, Text);
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(label);
        Text.fontSize(11);
        Text.fontColor('#999999');
    }, Text);
    Text.pop();
    Column.pop();
}
class WeightChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__data = new SynchedPropertyObjectOneWayPU(params.data, this, "data");
        this.__targetWeight = new SynchedPropertySimpleOneWayPU(params.targetWeight, this, "targetWeight");
        this.__canvasWidth = new ObservedPropertySimplePU(0, this, "canvasWidth");
        this.__canvasHeight = new ObservedPropertySimplePU(260, this, "canvasHeight");
        this.context = new CanvasRenderingContext2D(new RenderingContextSettings(true));
        this.pTop = 30;
        this.pRight = 20;
        this.pBottom = 40;
        this.pLeft = 44;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("data", this.onDataChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightChart_Params) {
        if (params.data === undefined) {
            this.__data.set([]);
        }
        if (params.targetWeight === undefined) {
            this.__targetWeight.set(0);
        }
        if (params.canvasWidth !== undefined) {
            this.canvasWidth = params.canvasWidth;
        }
        if (params.canvasHeight !== undefined) {
            this.canvasHeight = params.canvasHeight;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.pTop !== undefined) {
            this.pTop = params.pTop;
        }
        if (params.pRight !== undefined) {
            this.pRight = params.pRight;
        }
        if (params.pBottom !== undefined) {
            this.pBottom = params.pBottom;
        }
        if (params.pLeft !== undefined) {
            this.pLeft = params.pLeft;
        }
    }
    updateStateVars(params: WeightChart_Params) {
        this.__data.reset(params.data);
        this.__targetWeight.reset(params.targetWeight);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__targetWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__data.aboutToBeDeleted();
        this.__targetWeight.aboutToBeDeleted();
        this.__canvasWidth.aboutToBeDeleted();
        this.__canvasHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __data: SynchedPropertySimpleOneWayPU<WeightModel[]>;
    get data() {
        return this.__data.get();
    }
    set data(newValue: WeightModel[]) {
        this.__data.set(newValue);
    }
    private __targetWeight: SynchedPropertySimpleOneWayPU<number>;
    get targetWeight() {
        return this.__targetWeight.get();
    }
    set targetWeight(newValue: number) {
        this.__targetWeight.set(newValue);
    }
    private __canvasWidth: ObservedPropertySimplePU<number>;
    get canvasWidth() {
        return this.__canvasWidth.get();
    }
    set canvasWidth(newValue: number) {
        this.__canvasWidth.set(newValue);
    }
    private __canvasHeight: ObservedPropertySimplePU<number>;
    get canvasHeight() {
        return this.__canvasHeight.get();
    }
    set canvasHeight(newValue: number) {
        this.__canvasHeight.set(newValue);
    }
    private context: CanvasRenderingContext2D;
    // 将对象字面量拆分为独立变量，避免 ArkTS 严格模式报错
    private pTop: number;
    private pRight: number;
    private pBottom: number;
    private pLeft: number;
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
        }
        else {
            setTimeout(() => {
                this.drawChart();
            }, 100);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.data.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(this.canvasHeight);
                        Column.backgroundColor('#FAFAFA');
                        Column.borderRadius(8);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.textAlign(TextAlign.Center);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('记录体重后查看趋势');
                        Text.fontSize(12);
                        Text.fontColor('#CCCCCC');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Canvas.create(this.context);
                        Canvas.width('100%');
                        Canvas.height(this.canvasHeight);
                        Canvas.backgroundColor('#FAFAFA');
                        Canvas.borderRadius(8);
                        Canvas.onReady(() => {
                            this.drawChart();
                        });
                        Canvas.onAreaChange((oldArea, newArea) => {
                            this.canvasWidth = newArea.width as number;
                            this.drawChart();
                        });
                    }, Canvas);
                    Canvas.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    drawChart() {
        if (this.data.length === 0 || this.canvasWidth <= 0) {
            return;
        }
        const ctx = this.context;
        const width = this.canvasWidth;
        const height = this.canvasHeight;
        const chartWidth = width - this.pLeft - this.pRight;
        const chartHeight = height - this.pTop - this.pBottom;
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        // 计算数值范围
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
        // 绘制网格线（水平）
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#E8E8E8';
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#999999';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const gridCount = 5;
        for (let i = 0; i <= gridCount; i++) {
            const y = this.pTop + (i / gridCount) * chartHeight;
            const value = yMax - (i / gridCount) * (yMax - yMin);
            ctx.beginPath();
            ctx.moveTo(this.pLeft, y);
            ctx.lineTo(width - this.pRight, y);
            ctx.stroke();
            ctx.fillText(value.toFixed(1), this.pLeft - 6, y);
        }
        // 绘制目标体重虚线
        if (this.targetWeight > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 4]);
            const ty = getY(this.targetWeight);
            ctx.moveTo(this.pLeft, ty);
            ctx.lineTo(width - this.pRight, ty);
            ctx.stroke();
            ctx.setLineDash([]);
            // 目标体重标签
            ctx.fillStyle = '#4CAF50';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`目标 ${this.targetWeight.toFixed(1)}kg`, width - this.pRight + 4, ty);
        }
        // 绘制折线
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
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        // 绘制填充区域（折线下方半透明）
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 107, 107, 0.08)';
        for (let i = 0; i < this.data.length; i++) {
            const x = getX(i);
            const y = getY(this.data[i].weight);
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        ctx.lineTo(getX(this.data.length - 1), this.pTop + chartHeight);
        ctx.lineTo(getX(0), this.pTop + chartHeight);
        ctx.closePath();
        ctx.fill();
        // 绘制数据点
        for (let i = 0; i < this.data.length; i++) {
            const x = getX(i);
            const y = getY(this.data[i].weight);
            // 外圈
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 2;
            ctx.stroke();
            // 内圈
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF6B6B';
            ctx.fill();
        }
        // 绘制 X 轴日期标签
        ctx.fillStyle = '#999999';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labelStep = Math.max(1, Math.ceil(this.data.length / 6));
        for (let i = 0; i < this.data.length; i += labelStep) {
            const x = getX(i);
            const dateStr = DateUtil.formatDate(this.data[i].date).substring(5);
            ctx.fillText(dateStr, x, this.pTop + chartHeight + 8);
        }
        // 绘制数值标签（在点上方）
        ctx.fillStyle = '#666666';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        for (let i = 0; i < this.data.length; i++) {
            const x = getX(i);
            const y = getY(this.data[i].weight);
            ctx.fillText(this.data[i].weight.toFixed(1), x, y - 10);
        }
        // 绘制 Y 轴标题
        ctx.save();
        ctx.translate(12, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('体重 (kg)', 0, 0);
        ctx.restore();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new WeightStatisticsPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/weight/WeightStatisticsPage", pageFullPath: "entry/src/main/ets/pages/weight/WeightStatisticsPage", integratedHsp: "false", moduleType: "followWithHap" });
