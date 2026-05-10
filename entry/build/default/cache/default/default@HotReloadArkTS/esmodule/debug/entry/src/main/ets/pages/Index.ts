if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingsEntry_Params {
}
interface WeightEntry_Params {
}
interface PasswordEntry_Params {
}
interface HomeContent_Params {
    passwordCount?: number;
    latestWeight?: string;
    refreshTrigger?: number;
    weightEventId?: number;
    passwordEventId?: number;
}
interface Index_Params {
    currentIndex?: number;
    tabsController?: TabsController;
}
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { EventUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/EventUtil&";
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
                            let componentCall = new HomeContent(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 58, col: 11 });
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
                            let componentCall = new PasswordEntry(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 63, col: 11 });
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
                            let componentCall = new WeightEntry(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 68, col: 11 });
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
                            let componentCall = new SettingsEntry(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 73, col: 11 });
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
        this.__refreshTrigger.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__passwordCount.aboutToBeDeleted();
        this.__latestWeight.aboutToBeDeleted();
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
            const passwords = await DatabaseManager.getInstance().queryAllPasswords();
            this.passwordCount = passwords.length;
            const weights = await DatabaseManager.getInstance().queryAllWeights();
            if (weights.length > 0) {
                this.latestWeight = weights[weights.length - 1].weight.toFixed(1);
            }
            else {
                this.latestWeight = '--';
            }
        }
        catch (e) {
            console.error('HomeContent loadHomeData error:', JSON.stringify(e));
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
            Text.create('隐私助手');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ left: 20, top: 20, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码模块入口卡片
            Row.create();
            // 密码模块入口卡片
            Row.width('100%');
            // 密码模块入口卡片
            Row.height(140);
            // 密码模块入口卡片
            Row.padding(20);
            // 密码模块入口卡片
            Row.linearGradient({
                direction: GradientDirection.LeftTop,
                colors: [['#667eea', 0.0], ['#764ba2', 1.0]]
            });
            // 密码模块入口卡片
            Row.borderRadius(16);
            // 密码模块入口卡片
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
            Text.create(`${this.passwordCount} 条记录`);
            Text.fontSize(14);
            Text.fontColor('rgba(255,255,255,0.8)');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('查看全部');
            Button.fontSize(13);
            Button.fontColor('#007DFF');
            Button.backgroundColor('#FFFFFF');
            Button.height(32);
            Button.width(90);
            Button.margin({ top: 8 });
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
            });
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Shape.create();
            Shape.width(72);
            Shape.height(72);
        }, Shape);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(56);
            Path.height(56);
            Path.commands('M12 4 L12 12 M8 8 L16 8 M6 12 L22 12 L22 32 L6 32 Z M14 19 A2 2 0 1 0 14 25 A2 2 0 1 0 14 19');
            Path.stroke('rgba(255,255,255,0.3)');
            Path.strokeWidth(2);
            Path.fill('none');
        }, Path);
        Shape.pop();
        // 密码模块入口卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 体重模块入口卡片
            Row.create();
            // 体重模块入口卡片
            Row.width('100%');
            // 体重模块入口卡片
            Row.height(140);
            // 体重模块入口卡片
            Row.padding(20);
            // 体重模块入口卡片
            Row.linearGradient({
                direction: GradientDirection.LeftTop,
                colors: [['#f093fb', 0.0], ['#f5576c', 1.0]]
            });
            // 体重模块入口卡片
            Row.borderRadius(16);
            // 体重模块入口卡片
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
            Text.fontSize(14);
            Text.fontColor('rgba(255,255,255,0.8)');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('记录今日');
            Button.fontSize(13);
            Button.fontColor('#FF6B6B');
            Button.backgroundColor('#FFFFFF');
            Button.height(32);
            Button.width(90);
            Button.margin({ top: 8 });
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_LIST });
            });
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Shape.create();
            Shape.width(72);
            Shape.height(72);
        }, Shape);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(56);
            Path.height(56);
            Path.commands('M16 28 L6 18 C2 14 2 8 6 4 C10 0 16 0 20 4 C24 0 30 0 34 4 C38 8 38 14 34 18 L24 28 L20 32 L16 28 Z');
            Path.stroke('rgba(255,255,255,0.3)');
            Path.strokeWidth(2);
            Path.fill('none');
        }, Path);
        Shape.pop();
        // 体重模块入口卡片
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
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
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
        // 快捷操作
        Column.pop();
        Column.pop();
        Scroll.pop();
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
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PasswordEntry_Params) {
    }
    updateStateVars(params: PasswordEntry_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('进入密码管理');
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_LIST });
            });
        }, Button);
        Button.pop();
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
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightEntry_Params) {
    }
    updateStateVars(params: WeightEntry_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('进入体重记录');
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_WEIGHT_LIST });
            });
        }, Button);
        Button.pop();
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
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsEntry_Params) {
    }
    updateStateVars(params: SettingsEntry_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('进入设置');
            Button.onClick(() => {
                this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_SETTINGS });
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
