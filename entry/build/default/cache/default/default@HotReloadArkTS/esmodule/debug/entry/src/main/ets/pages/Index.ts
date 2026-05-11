if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingsEntry_Params {
    appLockEnabled?: boolean;
    clipboardClearEnabled?: boolean;
    passwordCount?: number;
    weightCount?: number;
}
interface WeightEntry_Params {
    weightList?: WeightModel[];
    latestWeight?: number;
    latestBmi?: number;
    weightGoal?: WeightGoal;
    isLoading?: boolean;
    weightEventId?: number;
}
interface PasswordEntry_Params {
    passwordList?: PasswordModel[];
    searchKeyword?: string;
    selectedCategory?: string;
    isLoading?: boolean;
    categories?: string[];
    passwordEventId?: number;
}
interface HomeContent_Params {
    passwordCount?: number;
    latestWeight?: string;
    daysSinceLastRecord?: number;
    weightGoal?: WeightGoal;
    latestWeightNum?: number;
    goalProgress?: number;
    latestBmi?: number;
    weightRecordCount?: number;
    recentPasswords?: PasswordModel[];
    greeting?: string;
    refreshTrigger?: number;
    weightEventId?: number;
    passwordEventId?: number;
}
interface Index_Params {
    currentIndex?: number;
    tabsController?: TabsController;
}
import { AppConstants, PASSWORD_CATEGORIES } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { EventUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/EventUtil&";
import { WeightGoal } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import type { WeightModel } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import type { PasswordModel } from '../models/PasswordModel';
import { CryptoUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/CryptoUtil&";
import { ToastUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/ToastUtil&";
import { DateUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtil&";
import preferences from "@ohos:data.preferences";
import pasteboard from "@ohos:pasteboard";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.tabsController = new TabsController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.tabsController !== undefined) {
            this.tabsController = params.tabsController;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private tabsController: TabsController;
    onPageShow() {
        AppStorage.setOrCreate('home_refresh_trigger', Date.now());
    }
    aboutToAppear() {
        // 数据库已在 EntryAbility.onCreate 中初始化
    }
    TabBarBuilder(title: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(88);
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                this.currentIndex = index;
                this.tabsController.changeIndex(index);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (index === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831533, "type": 40000, params: [], "bundleName": "com.gyhgt.tools", "moduleName": "entry" });
                        SymbolGlyph.fontSize(36);
                        SymbolGlyph.fontColor([this.currentIndex === index ? '#007DFF' : '#999999']);
                    }, SymbolGlyph);
                });
            }
            else if (index === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125832252, "type": 40000, params: [], "bundleName": "com.gyhgt.tools", "moduleName": "entry" });
                        SymbolGlyph.fontSize(36);
                        SymbolGlyph.fontColor([this.currentIndex === index ? '#007DFF' : '#999999']);
                    }, SymbolGlyph);
                });
            }
            else if (index === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831544, "type": 40000, params: [], "bundleName": "com.gyhgt.tools", "moduleName": "entry" });
                        SymbolGlyph.fontSize(36);
                        SymbolGlyph.fontColor([this.currentIndex === index ? '#007DFF' : '#999999']);
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚙');
                        Text.fontSize(36);
                        Text.fontColor(this.currentIndex === index ? '#007DFF' : '#999999');
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(16);
            Text.fontColor(this.currentIndex === index ? '#007DFF' : '#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ barPosition: BarPosition.End, controller: this.tabsController });
            Tabs.barWidth('100%');
            Tabs.barHeight(80);
            Tabs.onChange((index: number) => {
                this.currentIndex = index;
            });
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new HomeContent(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 65, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "HomeContent" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, '首页', 0);
                } });
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new PasswordEntry(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 70, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "PasswordEntry" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, '密码', 1);
                } });
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new WeightEntry(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 75, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "WeightEntry" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, '体重', 2);
                } });
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new SettingsEntry(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 80, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "SettingsEntry" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, '设置', 3);
                } });
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
class HomeContent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__passwordCount = new ObservedPropertySimplePU(0, this, "passwordCount");
        this.__latestWeight = new ObservedPropertySimplePU('--', this, "latestWeight");
        this.__daysSinceLastRecord = new ObservedPropertySimplePU(0, this, "daysSinceLastRecord");
        this.__weightGoal = new ObservedPropertyObjectPU(new WeightGoal(), this, "weightGoal");
        this.__latestWeightNum = new ObservedPropertySimplePU(0, this, "latestWeightNum");
        this.__goalProgress = new ObservedPropertySimplePU(0, this, "goalProgress");
        this.__latestBmi = new ObservedPropertySimplePU(0, this, "latestBmi");
        this.__weightRecordCount = new ObservedPropertySimplePU(0, this, "weightRecordCount");
        this.__recentPasswords = new ObservedPropertyObjectPU([], this, "recentPasswords");
        this.__greeting = new ObservedPropertySimplePU('', this, "greeting");
        this.__refreshTrigger = this.createStorageLink('home_refresh_trigger', 0, "refreshTrigger");
        this.weightEventId = -1;
        this.passwordEventId = -1;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("refreshTrigger", this.onRefreshTriggerChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomeContent_Params) {
        if (params.passwordCount !== undefined) {
            this.passwordCount = params.passwordCount;
        }
        if (params.latestWeight !== undefined) {
            this.latestWeight = params.latestWeight;
        }
        if (params.daysSinceLastRecord !== undefined) {
            this.daysSinceLastRecord = params.daysSinceLastRecord;
        }
        if (params.weightGoal !== undefined) {
            this.weightGoal = params.weightGoal;
        }
        if (params.latestWeightNum !== undefined) {
            this.latestWeightNum = params.latestWeightNum;
        }
        if (params.goalProgress !== undefined) {
            this.goalProgress = params.goalProgress;
        }
        if (params.latestBmi !== undefined) {
            this.latestBmi = params.latestBmi;
        }
        if (params.weightRecordCount !== undefined) {
            this.weightRecordCount = params.weightRecordCount;
        }
        if (params.recentPasswords !== undefined) {
            this.recentPasswords = params.recentPasswords;
        }
        if (params.greeting !== undefined) {
            this.greeting = params.greeting;
        }
        if (params.weightEventId !== undefined) {
            this.weightEventId = params.weightEventId;
        }
        if (params.passwordEventId !== undefined) {
            this.passwordEventId = params.passwordEventId;
        }
    }
    updateStateVars(params: HomeContent_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__passwordCount.purgeDependencyOnElmtId(rmElmtId);
        this.__latestWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__daysSinceLastRecord.purgeDependencyOnElmtId(rmElmtId);
        this.__weightGoal.purgeDependencyOnElmtId(rmElmtId);
        this.__latestWeightNum.purgeDependencyOnElmtId(rmElmtId);
        this.__goalProgress.purgeDependencyOnElmtId(rmElmtId);
        this.__latestBmi.purgeDependencyOnElmtId(rmElmtId);
        this.__weightRecordCount.purgeDependencyOnElmtId(rmElmtId);
        this.__recentPasswords.purgeDependencyOnElmtId(rmElmtId);
        this.__greeting.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshTrigger.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__passwordCount.aboutToBeDeleted();
        this.__latestWeight.aboutToBeDeleted();
        this.__daysSinceLastRecord.aboutToBeDeleted();
        this.__weightGoal.aboutToBeDeleted();
        this.__latestWeightNum.aboutToBeDeleted();
        this.__goalProgress.aboutToBeDeleted();
        this.__latestBmi.aboutToBeDeleted();
        this.__weightRecordCount.aboutToBeDeleted();
        this.__recentPasswords.aboutToBeDeleted();
        this.__greeting.aboutToBeDeleted();
        this.__refreshTrigger.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __passwordCount: ObservedPropertySimplePU<number>;
    get passwordCount() {
        return this.__passwordCount.get();
    }
    set passwordCount(newValue: number) {
        this.__passwordCount.set(newValue);
    }
    private __latestWeight: ObservedPropertySimplePU<string>;
    get latestWeight() {
        return this.__latestWeight.get();
    }
    set latestWeight(newValue: string) {
        this.__latestWeight.set(newValue);
    }
    private __daysSinceLastRecord: ObservedPropertySimplePU<number>;
    get daysSinceLastRecord() {
        return this.__daysSinceLastRecord.get();
    }
    set daysSinceLastRecord(newValue: number) {
        this.__daysSinceLastRecord.set(newValue);
    }
    private __weightGoal: ObservedPropertyObjectPU<WeightGoal>;
    get weightGoal() {
        return this.__weightGoal.get();
    }
    set weightGoal(newValue: WeightGoal) {
        this.__weightGoal.set(newValue);
    }
    private __latestWeightNum: ObservedPropertySimplePU<number>;
    get latestWeightNum() {
        return this.__latestWeightNum.get();
    }
    set latestWeightNum(newValue: number) {
        this.__latestWeightNum.set(newValue);
    }
    private __goalProgress: ObservedPropertySimplePU<number>;
    get goalProgress() {
        return this.__goalProgress.get();
    }
    set goalProgress(newValue: number) {
        this.__goalProgress.set(newValue);
    }
    private __latestBmi: ObservedPropertySimplePU<number>;
    get latestBmi() {
        return this.__latestBmi.get();
    }
    set latestBmi(newValue: number) {
        this.__latestBmi.set(newValue);
    }
    private __weightRecordCount: ObservedPropertySimplePU<number>;
    get weightRecordCount() {
        return this.__weightRecordCount.get();
    }
    set weightRecordCount(newValue: number) {
        this.__weightRecordCount.set(newValue);
    }
    private __recentPasswords: ObservedPropertyObjectPU<PasswordModel[]>;
    get recentPasswords() {
        return this.__recentPasswords.get();
    }
    set recentPasswords(newValue: PasswordModel[]) {
        this.__recentPasswords.set(newValue);
    }
    private __greeting: ObservedPropertySimplePU<string>;
    get greeting() {
        return this.__greeting.get();
    }
    set greeting(newValue: string) {
        this.__greeting.set(newValue);
    }
    private __refreshTrigger: ObservedPropertyAbstractPU<number>;
    get refreshTrigger() {
        return this.__refreshTrigger.get();
    }
    set refreshTrigger(newValue: number) {
        this.__refreshTrigger.set(newValue);
    }
    private weightEventId: number;
    private passwordEventId: number;
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
            if (hour < 6)
                this.greeting = '夜深了，注意休息';
            else if (hour < 11)
                this.greeting = '早上好';
            else if (hour < 14)
                this.greeting = '中午好';
            else if (hour < 18)
                this.greeting = '下午好';
            else
                this.greeting = '晚上好';
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
            }
            else {
                this.latestWeight = '--';
                this.latestWeightNum = 0;
                this.latestBmi = 0;
                this.daysSinceLastRecord = -1;
            }
            this.loadGoalProgress();
        }
        catch (e) {
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
                    }
                    else {
                        this.goalProgress = 1;
                    }
                }
            }
        }
        catch (e) {
            console.error('Load goal progress error:', JSON.stringify(e));
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.align(Alignment.TopStart);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.padding({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 问候语 + 日期
            Column.create({ space: 4 });
            // 问候语 + 日期
            Column.alignItems(HorizontalAlign.Start);
            // 问候语 + 日期
            Column.width('100%');
            // 问候语 + 日期
            Column.margin({ left: 20, top: 20, bottom: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.greeting}！`);
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getTodayDateStr());
            Text.fontSize(13);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        // 问候语 + 日期
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据概览卡片
            Row.create({ space: 10 });
            // 数据概览卡片
            Row.width('100%');
            // 数据概览卡片
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.padding({ top: 14, bottom: 14 });
            Column.backgroundColor('#F0F8FF');
            Column.borderRadius(12);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.passwordCount}`);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#007DFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码记录');
            Text.fontSize(11);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.padding({ top: 14, bottom: 14 });
            Column.backgroundColor('#FFF5F5');
            Column.borderRadius(12);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.weightRecordCount}`);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF6B6B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重记录');
            Text.fontSize(11);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.padding({ top: 14, bottom: 14 });
            Column.backgroundColor('#F0FFF4');
            Column.borderRadius(12);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestBmi > 0 ? `${this.latestBmi.toFixed(1)}` : '--');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(DateUtil.getBMIColor(this.latestBmi));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('BMI');
            Text.fontSize(11);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Column.pop();
        // 数据概览卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 智能提醒卡片
            if (this.daysSinceLastRecord >= 3) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding(14);
                        Row.backgroundColor('#FFF8F0');
                        Row.borderRadius(12);
                        Row.border({ width: 1, color: '#FFE0C0' });
                        Row.margin({ left: 16, right: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠');
                        Text.fontSize(22);
                        Text.margin({ right: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 3 });
                        Column.alignItems(HorizontalAlign.Start);
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`已${this.daysSinceLastRecord}天未记录体重`);
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#FF6B00');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('坚持记录才能更好地管理体重哦～');
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('去记录');
                        Button.fontSize(12);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#FF6B00');
                        Button.height(30);
                        Button.borderRadius(15);
                        Button.padding({ left: 14, right: 14 });
                        Button.onClick(() => {
                            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                });
            }
            // 目标进度卡片
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 目标进度卡片
            if (this.weightGoal.targetWeight > 0 && this.latestWeightNum > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                        Column.margin({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('目标进度');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#333333');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${Math.round(this.goalProgress * 100)}%`);
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#4CAF50');
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 进度条
                        Stack.create({ alignContent: Alignment.Start });
                        // 进度条
                        Stack.width('100%');
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(8);
                        Row.backgroundColor('#F0F0F0');
                        Row.borderRadius(4);
                    }, Row);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(`${Math.round(this.goalProgress * 100)}%`);
                        Row.height(8);
                        Row.backgroundColor('#4CAF50');
                        Row.borderRadius(4);
                    }, Row);
                    Row.pop();
                    // 进度条
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`当前 ${this.latestWeightNum.toFixed(1)} kg`);
                        Text.fontSize(12);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`目标 ${this.weightGoal.targetWeight.toFixed(1)} kg`);
                        Text.fontSize(12);
                        Text.fontColor('#4CAF50');
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            // 密码保险柜卡片
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码保险柜卡片
            Row.create();
            // 密码保险柜卡片
            Row.width('100%');
            // 密码保险柜卡片
            Row.height(130);
            // 密码保险柜卡片
            Row.padding(20);
            // 密码保险柜卡片
            Row.linearGradient({
                direction: GradientDirection.LeftTop,
                colors: [['#667eea', 0.0], ['#764ba2', 1.0]]
            });
            // 密码保险柜卡片
            Row.borderRadius(16);
            // 密码保险柜卡片
            Row.margin({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码保险柜');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.passwordCount} 条记录·安全守护中`);
            Text.fontSize(13);
            Text.fontColor('rgba(255,255,255,0.8)');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('查看全部');
            Button.fontSize(12);
            Button.fontColor('#007DFF');
            Button.backgroundColor('#FFFFFF');
            Button.height(30);
            Button.width(80);
            Button.margin({ top: 8 });
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
            });
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 盾牌图标
            Column.create();
            // 盾牌图标
            Column.width(64);
            // 盾牌图标
            Column.height(64);
            // 盾牌图标
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🛡️');
            Text.fontSize(48);
        }, Text);
        Text.pop();
        // 盾牌图标
        Column.pop();
        // 密码保险柜卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 最近密码活动
            if (this.recentPasswords.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                        Column.margin({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('最近密码');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#333333');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('更多 >');
                        Text.fontSize(12);
                        Text.fontColor('#007DFF');
                        Text.onClick(() => {
                            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
                        });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 12 });
                                Row.width('100%');
                                Row.padding(10);
                                Row.backgroundColor('#F8F9FA');
                                Row.borderRadius(10);
                                Row.onClick(() => {
                                    this.getUIContext().getRouter().pushUrl({
                                        url: AppConstants.PAGE_PASSWORD_DETAIL,
                                        params: { id: item.id }
                                    });
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.platform.substring(0, 1));
                                Text.fontSize(16);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor('#FFFFFF');
                                Text.width(36);
                                Text.height(36);
                                Text.textAlign(TextAlign.Center);
                                Text.backgroundColor(this.getCategoryColor(item.category));
                                Text.borderRadius(10);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 2 });
                                Column.alignItems(HorizontalAlign.Start);
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.platform);
                                Text.fontSize(14);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor('#333333');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.account);
                                Text.fontSize(11);
                                Text.fontColor('#999999');
                            }, Text);
                            Text.pop();
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.category);
                                Text.fontSize(10);
                                Text.fontColor(this.getCategoryColor(item.category));
                                Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                Text.backgroundColor(`${this.getCategoryColor(item.category)}15`);
                                Text.borderRadius(6);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.recentPasswords, forEachItemGenFunction, (item: PasswordModel) => item.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            // 体重记录卡片
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 体重记录卡片
            Row.create();
            // 体重记录卡片
            Row.width('100%');
            // 体重记录卡片
            Row.height(130);
            // 体重记录卡片
            Row.padding(20);
            // 体重记录卡片
            Row.linearGradient({
                direction: GradientDirection.LeftTop,
                colors: [['#f093fb', 0.0], ['#f5576c', 1.0]]
            });
            // 体重记录卡片
            Row.borderRadius(16);
            // 体重记录卡片
            Row.margin({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重记录');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`最新体重 ${this.latestWeight} kg`);
            Text.fontSize(13);
            Text.fontColor('rgba(255,255,255,0.8)');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('记录今日');
            Button.fontSize(12);
            Button.fontColor('#FF6B6B');
            Button.backgroundColor('#FFFFFF');
            Button.height(30);
            Button.width(80);
            Button.margin({ top: 8 });
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
            });
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心形图标
            Column.create();
            // 心形图标
            Column.width(64);
            // 心形图标
            Column.height(64);
            // 心形图标
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('❤️');
            Text.fontSize(48);
        }, Text);
        Text.pop();
        // 心形图标
        Column.pop();
        // 体重记录卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快捷操作
            Column.create({ space: 12 });
            // 快捷操作
            Column.width('100%');
            // 快捷操作
            Column.padding(16);
            // 快捷操作
            Column.backgroundColor('#FFFFFF');
            // 快捷操作
            Column.borderRadius(16);
            // 快捷操作
            Column.margin({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('快捷操作');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        QuickActionButton.bind(this)('生成密码', '#007DFF', () => {
            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
        });
        QuickActionButton.bind(this)('体重统计', '#FF6B6B', () => {
            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
        });
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        QuickActionButton.bind(this)('添加密码', '#9C27B0', () => {
            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
        });
        QuickActionButton.bind(this)('设置', '#607D8B', () => {
            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_SETTINGS });
        });
        Row.pop();
        // 快捷操作
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 安全小贴士
            Column.create({ space: 8 });
            // 安全小贴士
            Column.width('100%');
            // 安全小贴士
            Column.padding(16);
            // 安全小贴士
            Column.backgroundColor('#FFFDE7');
            // 安全小贴士
            Column.borderRadius(12);
            // 安全小贴士
            Column.margin({ left: 16, right: 16, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💡 安全小贴士');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getSecurityTip());
            Text.fontSize(13);
            Text.fontColor('#666666');
            Text.lineHeight(20);
        }, Text);
        Text.pop();
        // 安全小贴士
        Column.pop();
        Column.pop();
        Scroll.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
function QuickActionButton(text: string, color: string, onClick: () => void, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Button.createWithChild();
        Button.width('48%');
        Button.height(48);
        Button.backgroundColor(`${color}15`);
        Button.border({ width: 1, color: `${color}30` });
        Button.borderRadius(12);
        Button.onClick(onClick);
    }, Button);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(text);
        Text.fontSize(14);
        Text.fontColor(color);
    }, Text);
    Text.pop();
    Button.pop();
}
class PasswordEntry extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__passwordList = new ObservedPropertyObjectPU([], this, "passwordList");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__selectedCategory = new ObservedPropertySimplePU('全部', this, "selectedCategory");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__categories = new ObservedPropertyObjectPU(['全部'], this, "categories");
        this.passwordEventId = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PasswordEntry_Params) {
        if (params.passwordList !== undefined) {
            this.passwordList = params.passwordList;
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.selectedCategory !== undefined) {
            this.selectedCategory = params.selectedCategory;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.passwordEventId !== undefined) {
            this.passwordEventId = params.passwordEventId;
        }
    }
    updateStateVars(params: PasswordEntry_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__passwordList.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__passwordList.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__selectedCategory.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__categories.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __passwordList: ObservedPropertyObjectPU<PasswordModel[]>;
    get passwordList() {
        return this.__passwordList.get();
    }
    set passwordList(newValue: PasswordModel[]) {
        this.__passwordList.set(newValue);
    }
    private __searchKeyword: ObservedPropertySimplePU<string>;
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    private __selectedCategory: ObservedPropertySimplePU<string>;
    get selectedCategory() {
        return this.__selectedCategory.get();
    }
    set selectedCategory(newValue: string) {
        this.__selectedCategory.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __categories: ObservedPropertyObjectPU<string[]>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: string[]) {
        this.__categories.set(newValue);
    }
    private passwordEventId: number;
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
        if (this.isLoading)
            return;
        this.isLoading = true;
        if (this.searchKeyword.trim()) {
            this.passwordList = await DatabaseManager.getInstance().searchPasswords(this.searchKeyword);
        }
        else if (this.selectedCategory !== '全部') {
            this.passwordList = await DatabaseManager.getInstance().queryPasswordsByCategory(this.selectedCategory);
        }
        else {
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
            }
            else {
                ToastUtil.show('密码解密失败');
            }
        }
        catch (e) {
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            // 顶部标题栏
            Row.width('100%');
            // 顶部标题栏
            Row.height(56);
            // 顶部标题栏
            Row.padding({ left: 20, right: 20 });
            // 顶部标题栏
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码管理');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(40);
            Button.height(40);
            Button.backgroundColor('#007DFF');
            Button.type(ButtonType.Circle);
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+');
            Text.fontSize(24);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Button.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索栏
            Search.create({ value: this.searchKeyword, placeholder: '搜索平台、账号...' });
            // 搜索栏
            Search.height(40);
            // 搜索栏
            Search.backgroundColor('#F5F5F5');
            // 搜索栏
            Search.borderRadius(20);
            // 搜索栏
            Search.margin({ left: 16, right: 16, top: 8 });
            // 搜索栏
            Search.onChange((value: string) => {
                this.searchKeyword = value;
                this.loadPasswords();
            });
        }, Search);
        // 搜索栏
        Search.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类筛选
            Scroll.create();
            // 分类筛选
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 分类筛选
            Scroll.scrollBar(BarState.Off);
            // 分类筛选
            Scroll.width('100%');
            // 分类筛选
            Scroll.height(44);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category);
                    Text.fontSize(13);
                    Text.fontColor(this.selectedCategory === category ? '#FFFFFF' : '#666666');
                    Text.padding({ left: 14, right: 14, top: 6, bottom: 6 });
                    Text.backgroundColor(this.selectedCategory === category ? '#007DFF' : '#F0F0F0');
                    Text.borderRadius(16);
                    Text.onClick(() => {
                        this.selectedCategory = category;
                        this.loadPasswords();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, (category: string) => category, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 分类筛选
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 列表内容
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(36);
                        LoadingProgress.height(36);
                        LoadingProgress.color('#007DFF');
                    }, LoadingProgress);
                    Column.pop();
                });
            }
            else if (this.passwordList.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无密码记录');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击右上角 + 添加第一条记录');
                        Text.fontSize(13);
                        Text.fontColor('#CCCCCC');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 10 });
                        List.width('100%');
                        List.layoutWeight(1);
                        List.padding({ left: 16, right: 16, top: 4 });
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
                                    ListItem.onClick(() => {
                                        this.getUIContext().getRouter().pushUrl({
                                            url: AppConstants.PAGE_PASSWORD_DETAIL,
                                            params: { id: item.id }
                                        });
                                    });
                                    globalThis.Gesture.create(GesturePriority.Low);
                                    LongPressGesture.create({ repeat: false });
                                    LongPressGesture.onAction(() => {
                                        this.copyPassword(item.password);
                                    });
                                    LongPressGesture.pop();
                                    globalThis.Gesture.pop();
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 12 });
                                        Row.width('100%');
                                        Row.padding(14);
                                        Row.backgroundColor('#FFFFFF');
                                        Row.borderRadius(12);
                                        Row.shadow({ radius: 2, color: '#0A000000', offsetY: 1 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 平台图标
                                        Text.create(item.platform.substring(0, 1));
                                        // 平台图标
                                        Text.fontSize(18);
                                        // 平台图标
                                        Text.fontWeight(FontWeight.Bold);
                                        // 平台图标
                                        Text.fontColor('#FFFFFF');
                                        // 平台图标
                                        Text.width(42);
                                        // 平台图标
                                        Text.height(42);
                                        // 平台图标
                                        Text.textAlign(TextAlign.Center);
                                        // 平台图标
                                        Text.backgroundColor(this.getCategoryColor(item.category));
                                        // 平台图标
                                        Text.borderRadius(12);
                                    }, Text);
                                    // 平台图标
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 信息
                                        Column.create({ space: 4 });
                                        // 信息
                                        Column.alignItems(HorizontalAlign.Start);
                                        // 信息
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.platform);
                                        Text.fontSize(15);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.fontColor('#333333');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.account);
                                        Text.fontSize(12);
                                        Text.fontColor('#999999');
                                    }, Text);
                                    Text.pop();
                                    // 信息
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 分类标签
                                        Text.create(item.category);
                                        // 分类标签
                                        Text.fontSize(10);
                                        // 分类标签
                                        Text.fontColor(this.getCategoryColor(item.category));
                                        // 分类标签
                                        Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                        // 分类标签
                                        Text.backgroundColor(`${this.getCategoryColor(item.category)}15`);
                                        // 分类标签
                                        Text.borderRadius(6);
                                    }, Text);
                                    // 分类标签
                                    Text.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.passwordList, forEachItemGenFunction, (item: PasswordModel) => item.id.toString() + '_' + item.updateTime, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class WeightEntry extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__weightList = new ObservedPropertyObjectPU([], this, "weightList");
        this.__latestWeight = new ObservedPropertySimplePU(0, this, "latestWeight");
        this.__latestBmi = new ObservedPropertySimplePU(0, this, "latestBmi");
        this.__weightGoal = new ObservedPropertyObjectPU(new WeightGoal(), this, "weightGoal");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.weightEventId = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightEntry_Params) {
        if (params.weightList !== undefined) {
            this.weightList = params.weightList;
        }
        if (params.latestWeight !== undefined) {
            this.latestWeight = params.latestWeight;
        }
        if (params.latestBmi !== undefined) {
            this.latestBmi = params.latestBmi;
        }
        if (params.weightGoal !== undefined) {
            this.weightGoal = params.weightGoal;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.weightEventId !== undefined) {
            this.weightEventId = params.weightEventId;
        }
    }
    updateStateVars(params: WeightEntry_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__weightList.purgeDependencyOnElmtId(rmElmtId);
        this.__latestWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__latestBmi.purgeDependencyOnElmtId(rmElmtId);
        this.__weightGoal.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__weightList.aboutToBeDeleted();
        this.__latestWeight.aboutToBeDeleted();
        this.__latestBmi.aboutToBeDeleted();
        this.__weightGoal.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
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
    private __weightGoal: ObservedPropertyObjectPU<WeightGoal>;
    get weightGoal() {
        return this.__weightGoal.get();
    }
    set weightGoal(newValue: WeightGoal) {
        this.__weightGoal.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private weightEventId: number;
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
        }
        catch (e) {
            console.error('WeightEntry loadData error:', JSON.stringify(e));
        }
        this.isLoading = false;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            // 顶部标题栏
            Row.width('100%');
            // 顶部标题栏
            Row.height(56);
            // 顶部标题栏
            Row.padding({ left: 20, right: 20 });
            // 顶部标题栏
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重记录');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.height(32);
            Button.backgroundColor('#E3F2FD');
            Button.borderRadius(16);
            Button.padding({ left: 12, right: 12 });
            Button.margin({ right: 8 });
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_STATISTICS });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('统计');
            Text.fontSize(13);
            Text.fontColor('#007DFF');
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(40);
            Button.height(40);
            Button.backgroundColor('#FF6B6B');
            Button.type(ButtonType.Circle);
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_DETAIL });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+');
            Text.fontSize(24);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Button.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据概览卡片
            Row.create({ space: 12 });
            // 数据概览卡片
            Row.width('100%');
            // 数据概览卡片
            Row.padding({ left: 16, right: 16, top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(12);
            Column.backgroundColor('#FFF5F5');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最新体重');
            Text.fontSize(11);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestWeight > 0 ? `${this.latestWeight.toFixed(1)}` : '--');
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('kg');
            Text.fontSize(11);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(12);
            Column.backgroundColor('#F0F8FF');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('BMI');
            Text.fontSize(11);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestBmi > 0 ? `${this.latestBmi.toFixed(1)}` : '--');
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(DateUtil.getBMIColor(this.latestBmi));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestBmi > 0 ? DateUtil.getBMICategory(this.latestBmi) : '');
            Text.fontSize(11);
            Text.fontColor(DateUtil.getBMIColor(this.latestBmi));
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(12);
            Column.backgroundColor('#F0FFF0');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('目标');
            Text.fontSize(11);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weightGoal.targetWeight > 0 ? `${this.weightGoal.targetWeight.toFixed(1)}` : '--');
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#007DFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('kg');
            Text.fontSize(11);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Column.pop();
        // 数据概览卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 最近记录列表
            if (this.weightList.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无体重记录');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击右上角 + 记录今日体重');
                        Text.fontSize(13);
                        Text.fontColor('#CCCCCC');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('最近记录');
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#666666');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ left: 16, top: 16, bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 8 });
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
                                    ListItem.onClick(() => {
                                        this.getUIContext().getRouter().pushUrl({
                                            url: AppConstants.PAGE_WEIGHT_DETAIL,
                                            params: { id: item.id }
                                        });
                                    });
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 12 });
                                        Row.width('100%');
                                        Row.padding(12);
                                        Row.backgroundColor('#FFFFFF');
                                        Row.borderRadius(10);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 日期
                                        Column.create({ space: 2 });
                                        // 日期
                                        Column.width(44);
                                        // 日期
                                        Column.alignItems(HorizontalAlign.Center);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(DateUtil.formatDate(item.date).split('-')[2]);
                                        Text.fontSize(20);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor('#FF6B6B');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${DateUtil.formatDate(item.date).split('-')[1]}月`);
                                        Text.fontSize(10);
                                        Text.fontColor('#999999');
                                    }, Text);
                                    Text.pop();
                                    // 日期
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 体重信息
                                        Column.create({ space: 3 });
                                        // 体重信息
                                        Column.alignItems(HorizontalAlign.Start);
                                        // 体重信息
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${item.weight.toFixed(1)} kg`);
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.fontColor('#333333');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 8 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`BMI ${item.bmi.toFixed(1)}`);
                                        Text.fontSize(11);
                                        Text.fontColor(DateUtil.getBMIColor(item.bmi));
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.bodyFatRate > 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`体脂 ${item.bodyFatRate.toFixed(1)}%`);
                                                    Text.fontSize(11);
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
                                    // 体重信息
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        // 与目标差距
                                        if (this.weightGoal.targetWeight > 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`${(item.weight - this.weightGoal.targetWeight) > 0 ? '+' : ''}${(item.weight - this.weightGoal.targetWeight).toFixed(1)}`);
                                                    Text.fontSize(13);
                                                    Text.fontColor(Math.abs(item.weight - this.weightGoal.targetWeight) < 0.5 ? '#4CAF50' : ((item.weight - this.weightGoal.targetWeight) > 0 ? '#FF9800' : '#2196F3'));
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
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class SettingsEntry extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__appLockEnabled = new ObservedPropertySimplePU(false, this, "appLockEnabled");
        this.__clipboardClearEnabled = new ObservedPropertySimplePU(true, this, "clipboardClearEnabled");
        this.__passwordCount = new ObservedPropertySimplePU(0, this, "passwordCount");
        this.__weightCount = new ObservedPropertySimplePU(0, this, "weightCount");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsEntry_Params) {
        if (params.appLockEnabled !== undefined) {
            this.appLockEnabled = params.appLockEnabled;
        }
        if (params.clipboardClearEnabled !== undefined) {
            this.clipboardClearEnabled = params.clipboardClearEnabled;
        }
        if (params.passwordCount !== undefined) {
            this.passwordCount = params.passwordCount;
        }
        if (params.weightCount !== undefined) {
            this.weightCount = params.weightCount;
        }
    }
    updateStateVars(params: SettingsEntry_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__appLockEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__clipboardClearEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__passwordCount.purgeDependencyOnElmtId(rmElmtId);
        this.__weightCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__appLockEnabled.aboutToBeDeleted();
        this.__clipboardClearEnabled.aboutToBeDeleted();
        this.__passwordCount.aboutToBeDeleted();
        this.__weightCount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __appLockEnabled: ObservedPropertySimplePU<boolean>;
    get appLockEnabled() {
        return this.__appLockEnabled.get();
    }
    set appLockEnabled(newValue: boolean) {
        this.__appLockEnabled.set(newValue);
    }
    private __clipboardClearEnabled: ObservedPropertySimplePU<boolean>;
    get clipboardClearEnabled() {
        return this.__clipboardClearEnabled.get();
    }
    set clipboardClearEnabled(newValue: boolean) {
        this.__clipboardClearEnabled.set(newValue);
    }
    private __passwordCount: ObservedPropertySimplePU<number>;
    get passwordCount() {
        return this.__passwordCount.get();
    }
    set passwordCount(newValue: number) {
        this.__passwordCount.set(newValue);
    }
    private __weightCount: ObservedPropertySimplePU<number>;
    get weightCount() {
        return this.__weightCount.get();
    }
    set weightCount(newValue: number) {
        this.__weightCount.set(newValue);
    }
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
        }
        catch (e) {
            console.error('SettingsEntry load error:', JSON.stringify(e));
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题
            Row.create();
            // 顶部标题
            Row.width('100%');
            // 顶部标题
            Row.height(56);
            // 顶部标题
            Row.padding({ left: 20 });
            // 顶部标题
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        // 顶部标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据概览
            Row.create({ space: 16 });
            // 数据概览
            Row.width('100%');
            // 数据概览
            Row.padding({ left: 16, right: 16, top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.padding(16);
            Column.backgroundColor('#F0F8FF');
            Column.borderRadius(12);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.passwordCount}`);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#007DFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码记录');
            Text.fontSize(12);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.padding(16);
            Column.backgroundColor('#FFF5F5');
            Column.borderRadius(12);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.weightCount}`);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF6B6B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重记录');
            Text.fontSize(12);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Column.pop();
        // 数据概览
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 安全设置
            Column.create({ space: 0 });
            // 安全设置
            Column.width('100%');
            // 安全设置
            Column.padding(16);
            // 安全设置
            Column.backgroundColor('#FFFFFF');
            // 安全设置
            Column.borderRadius(12);
            // 安全设置
            Column.margin({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('安全');
            Text.fontSize(13);
            Text.fontColor('#999999');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('应用锁');
            Text.fontSize(15);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.appLockEnabled });
            Toggle.onChange((isOn: boolean) => {
                this.appLockEnabled = isOn;
                try {
                    const context = this.getUIContext().getHostContext();
                    const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
                    pref.put(AppConstants.PREF_APP_LOCK_ENABLED, isOn);
                    pref.flush();
                }
                catch (e) {
                    console.error('Toggle lock error:', JSON.stringify(e));
                }
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#F0F0F0');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('剪贴板自动清除');
            Text.fontSize(15);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.clipboardClearEnabled });
            Toggle.onChange((isOn: boolean) => {
                this.clipboardClearEnabled = isOn;
                try {
                    const context = this.getUIContext().getHostContext();
                    const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
                    pref.put(AppConstants.PREF_CLIPBOARD_CLEAR, isOn);
                    pref.flush();
                }
                catch (e) {
                    console.error('Toggle clipboard error:', JSON.stringify(e));
                }
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        // 安全设置
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能入口
            Column.create({ space: 0 });
            // 功能入口
            Column.width('100%');
            // 功能入口
            Column.padding(16);
            // 功能入口
            Column.backgroundColor('#FFFFFF');
            // 功能入口
            Column.borderRadius(12);
            // 功能入口
            Column.margin({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('更多');
            Text.fontSize(13);
            Text.fontColor('#999999');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12 });
            Row.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码生成器');
            Text.fontSize(15);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.fontSize(16);
            Text.fontColor('#CCCCCC');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#F0F0F0');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12 });
            Row.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_SETTINGS });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('全部设置');
            Text.fontSize(15);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.fontSize(16);
            Text.fontColor('#CCCCCC');
        }, Text);
        Text.pop();
        Row.pop();
        // 功能入口
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
