if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WeightCard_Params {
    item?: WeightModel;
    targetWeight?: number;
    onEdit?: () => void;
}
interface WeightListPage_Params {
    weightList?: WeightModel[];
    isLoading?: boolean;
    weightGoal?: WeightGoal;
    latestWeight?: number;
    latestBmi?: number;
    swipeDeleteId?: number;
    weightEventId?: number;
}
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { WeightGoal } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import type { WeightModel } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import { DateUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtil&";
import { EventUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/EventUtil&";
import preferences from "@ohos:data.preferences";
class WeightListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__weightList = new ObservedPropertyObjectPU([], this, "weightList");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__weightGoal = new ObservedPropertyObjectPU(new WeightGoal(), this, "weightGoal");
        this.__latestWeight = new ObservedPropertySimplePU(0, this, "latestWeight");
        this.__latestBmi = new ObservedPropertySimplePU(0, this, "latestBmi");
        this.__swipeDeleteId = new ObservedPropertySimplePU(-1, this, "swipeDeleteId");
        this.weightEventId = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightListPage_Params) {
        if (params.weightList !== undefined) {
            this.weightList = params.weightList;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.weightGoal !== undefined) {
            this.weightGoal = params.weightGoal;
        }
        if (params.latestWeight !== undefined) {
            this.latestWeight = params.latestWeight;
        }
        if (params.latestBmi !== undefined) {
            this.latestBmi = params.latestBmi;
        }
        if (params.swipeDeleteId !== undefined) {
            this.swipeDeleteId = params.swipeDeleteId;
        }
        if (params.weightEventId !== undefined) {
            this.weightEventId = params.weightEventId;
        }
    }
    updateStateVars(params: WeightListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__weightList.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__weightGoal.purgeDependencyOnElmtId(rmElmtId);
        this.__latestWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__latestBmi.purgeDependencyOnElmtId(rmElmtId);
        this.__swipeDeleteId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__weightList.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__weightGoal.aboutToBeDeleted();
        this.__latestWeight.aboutToBeDeleted();
        this.__latestBmi.aboutToBeDeleted();
        this.__swipeDeleteId.aboutToBeDeleted();
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
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __weightGoal: ObservedPropertyObjectPU<WeightGoal>;
    get weightGoal() {
        return this.__weightGoal.get();
    }
    set weightGoal(newValue: WeightGoal) {
        this.__weightGoal.set(newValue);
    }
    private __latestWeight: ObservedPropertySimplePU<number>;
    get latestWeight() {
        return this.__latestWeight.get();
    }
    set latestWeight(newValue: number) {
        this.__latestWeight.set(newValue);
    }
    private __latestBmi: ObservedPropertySimplePU<number>;
    get latestBmi() {
        return this.__latestBmi.get();
    }
    set latestBmi(newValue: number) {
        this.__latestBmi.set(newValue);
    }
    private __swipeDeleteId: ObservedPropertySimplePU<number>;
    get swipeDeleteId() {
        return this.__swipeDeleteId.get();
    }
    set swipeDeleteId(newValue: number) {
        this.__swipeDeleteId.set(newValue);
    }
    private weightEventId: number;
    aboutToAppear() {
        this.loadWeightGoal();
        this.loadWeights();
        this.weightEventId = EventUtil.onWeightSaved(() => {
            this.loadWeights();
        });
    }
    aboutToDisappear() {
        EventUtil.offWeightSaved(this.weightEventId);
    }
    onPageShow() {
        try {
            this.loadWeightGoal();
            this.loadWeights();
        }
        catch (e) {
            console.error('WeightListPage onPageShow error:', JSON.stringify(e));
        }
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
    async loadWeights() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.weightList = await DatabaseManager.getInstance().queryAllWeights();
        if (this.weightList.length > 0) {
            const latest = this.weightList[this.weightList.length - 1];
            this.latestWeight = latest.weight;
            this.latestBmi = latest.bmi;
        }
        this.isLoading = false;
    }
    async deleteWeight(id: number) {
        await DatabaseManager.getInstance().deleteWeight(id);
        this.loadWeights();
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
            Row.padding({ left: 8, right: 8 });
            // 顶部导航栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 顶部导航栏
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('<');
            Button.fontSize(28);
            Button.fontColor('#333333');
            Button.width(56);
            Button.height(56);
            Button.type(ButtonType.Circle);
            Button.backgroundColor('transparent');
            Button.onClick(() => {
                this.getUIContext().getRouter().back();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重记录');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('图');
            Button.fontSize(18);
            Button.fontColor('#333333');
            Button.width(56);
            Button.height(56);
            Button.type(ButtonType.Circle);
            Button.backgroundColor('transparent');
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.fontSize(32);
            Button.fontColor('#007DFF');
            Button.width(56);
            Button.height(56);
            Button.type(ButtonType.Circle);
            Button.backgroundColor('#E3F2FD');
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
            });
        }, Button);
        Button.pop();
        Row.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 最新数据概览卡片
            Row.create({ space: 16 });
            // 最新数据概览卡片
            Row.width('100%');
            // 最新数据概览卡片
            Row.padding(20);
            // 最新数据概览卡片
            Row.backgroundColor('#FFFFFF');
            // 最新数据概览卡片
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最新体重');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestWeight > 0 ? `${this.latestWeight.toFixed(1)}` : '--');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('kg');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('BMI');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestBmi > 0 ? `${this.latestBmi.toFixed(1)}` : '--');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(DateUtil.getBMIColor(this.latestBmi));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestBmi > 0 ? DateUtil.getBMICategory(this.latestBmi) : '');
            Text.fontSize(12);
            Text.fontColor(DateUtil.getBMIColor(this.latestBmi));
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('目标');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weightGoal.targetWeight > 0 ? `${this.weightGoal.targetWeight.toFixed(1)}` : '--');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#007DFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('kg');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Column.pop();
        // 最新数据概览卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 记录列表
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(48);
                        LoadingProgress.height(48);
                        LoadingProgress.color('#FF6B6B');
                        LoadingProgress.margin({ top: 80 });
                    }, LoadingProgress);
                });
            }
            else if (this.weightList.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 16 });
                        Column.margin({ top: 80 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无体重记录');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('记录今日体重');
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor('#FF6B6B');
                        Button.onClick(() => {
                            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 12 });
                        List.width('100%');
                        List.layoutWeight(1);
                        List.padding({ left: 16, right: 16 });
                        List.edgeEffect(EdgeEffect.Spring);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.swipeAction({ end: this.DeleteBuilder.bind(this) });
                                    ListItem.onTouch((event) => {
                                        if (event.type === 2) {
                                            this.swipeDeleteId = item.id;
                                        }
                                    });
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new WeightCard(this, {
                                                    item: item,
                                                    targetWeight: this.weightGoal.targetWeight,
                                                    onEdit: () => {
                                                        this.getUIContext().getRouter().pushUrl({
                                                            url: AppConstants.PAGE_WEIGHT_DETAIL,
                                                            params: { id: item.id }
                                                        });
                                                    }
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/weight/WeightListPage.ets", line: 201, col: 15 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        item: item,
                                                        targetWeight: this.weightGoal.targetWeight,
                                                        onEdit: () => {
                                                            this.getUIContext().getRouter().pushUrl({
                                                                url: AppConstants.PAGE_WEIGHT_DETAIL,
                                                                params: { id: item.id }
                                                            });
                                                        }
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    item: item,
                                                    targetWeight: this.weightGoal.targetWeight
                                                });
                                            }
                                        }, { name: "WeightCard" });
                                    }
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.weightList.slice().reverse(), forEachItemGenFunction, (item: WeightModel) => item.id.toString() + '_' + item.updateTime, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    DeleteBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(60);
            Button.height('100%');
            Button.type(ButtonType.Normal);
            Button.backgroundColor('#FF4444');
            Button.margin({ left: 8 });
            Button.onClick(() => {
                if (this.swipeDeleteId > 0) {
                    this.deleteWeight(this.swipeDeleteId);
                    this.swipeDeleteId = -1;
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Shape.create();
            Shape.width(24);
            Shape.height(24);
        }, Shape);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(20);
            Path.height(20);
            Path.commands('M3 6 L5 6 L5 17 L15 17 L15 6 L17 6 M7 3 L7 6 M13 3 L13 6 M7 9 L7 14 M13 9 L13 14');
            Path.stroke('#FFFFFF');
            Path.strokeWidth(1.5);
            Path.fill('none');
        }, Path);
        Shape.pop();
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WeightListPage";
    }
}
class WeightCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__item = new SynchedPropertyObjectOneWayPU(params.item, this, "item");
        this.__targetWeight = new SynchedPropertySimpleOneWayPU(params.targetWeight, this, "targetWeight");
        this.onEdit = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightCard_Params) {
        if (params.targetWeight === undefined) {
            this.__targetWeight.set(0);
        }
        if (params.onEdit !== undefined) {
            this.onEdit = params.onEdit;
        }
    }
    updateStateVars(params: WeightCard_Params) {
        this.__item.reset(params.item);
        this.__targetWeight.reset(params.targetWeight);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__item.purgeDependencyOnElmtId(rmElmtId);
        this.__targetWeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__item.aboutToBeDeleted();
        this.__targetWeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __item: SynchedPropertySimpleOneWayPU<WeightModel>;
    get item() {
        return this.__item.get();
    }
    set item(newValue: WeightModel) {
        this.__item.set(newValue);
    }
    private __targetWeight: SynchedPropertySimpleOneWayPU<number>;
    get targetWeight() {
        return this.__targetWeight.get();
    }
    set targetWeight(newValue: number) {
        this.__targetWeight.set(newValue);
    }
    private onEdit: () => void;
    getWeightDiff(): string {
        if (this.targetWeight <= 0)
            return '';
        const diff = this.item.weight - this.targetWeight;
        const sign = diff > 0 ? '+' : '';
        return `${sign}${diff.toFixed(1)}kg`;
    }
    getWeightDiffColor(): string {
        if (this.targetWeight <= 0)
            return '#999999';
        const diff = this.item.weight - this.targetWeight;
        if (Math.abs(diff) < 0.5)
            return '#4CAF50';
        return diff > 0 ? '#FF9800' : '#2196F3';
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 16 });
            Row.width('100%');
            Row.padding(16);
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius(12);
            Row.shadow({ radius: 4, color: '#0D000000', offsetY: 2 });
            Row.onClick(() => {
                this.onEdit();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期
            Column.create({ space: 2 });
            // 日期
            Column.width(50);
            // 日期
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtil.formatDate(this.item.date).split('-')[2]);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF6B6B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${DateUtil.formatDate(this.item.date).split('-')[0]}-${DateUtil.formatDate(this.item.date).split('-')[1]}`);
            Text.fontSize(11);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        // 日期
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 体重信息
            Column.create({ space: 4 });
            // 体重信息
            Column.layoutWeight(1);
            // 体重信息
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.item.weight.toFixed(1)}`);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('kg');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.targetWeight > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getWeightDiff());
                        Text.fontSize(11);
                        Text.fontColor(this.getWeightDiffColor());
                        Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                        Text.backgroundColor(`${this.getWeightDiffColor()}15`);
                        Text.borderRadius(6);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`BMI ${this.item.bmi.toFixed(1)}`);
            Text.fontSize(12);
            Text.fontColor(DateUtil.getBMIColor(this.item.bmi));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.item.bodyFatRate > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`体脂 ${this.item.bodyFatRate.toFixed(1)}%`);
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.item.notes) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.item.notes);
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 体重信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 箭头
            Shape.create();
            // 箭头
            Shape.width(16);
            // 箭头
            Shape.height(16);
        }, Shape);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(16);
            Path.height(16);
            Path.commands('M5 3 L12 8 L5 13');
            Path.stroke('#CCCCCC');
            Path.strokeWidth(2);
            Path.fill('none');
        }, Path);
        // 箭头
        Shape.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new WeightListPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/weight/WeightListPage", pageFullPath: "entry/src/main/ets/pages/weight/WeightListPage", integratedHsp: "false", moduleType: "followWithHap" });
