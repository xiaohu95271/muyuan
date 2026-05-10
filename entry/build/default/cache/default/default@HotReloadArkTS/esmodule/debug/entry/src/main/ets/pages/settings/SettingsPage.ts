if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingItem_Params {
    label?: string;
    content?: () => void;
}
interface SettingSection_Params {
    title?: string;
    content?: () => void;
}
interface SettingsPage_Params {
    weightGoal?: WeightGoal;
    appLockEnabled?: boolean;
    autoLockTimeout?: number;
    clipboardClearEnabled?: boolean;
}
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { WeightGoal } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import preferences from "@ohos:data.preferences";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { ToastUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/ToastUtil&";
import promptAction from "@ohos:promptAction";
import pasteboard from "@ohos:pasteboard";
class SettingsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__weightGoal = new ObservedPropertyObjectPU(new WeightGoal(), this, "weightGoal");
        this.__appLockEnabled = new ObservedPropertySimplePU(false, this, "appLockEnabled");
        this.__autoLockTimeout = new ObservedPropertySimplePU(AppConstants.DEFAULT_AUTO_LOCK_MINUTES, this, "autoLockTimeout");
        this.__clipboardClearEnabled = new ObservedPropertySimplePU(true, this, "clipboardClearEnabled");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsPage_Params) {
        if (params.weightGoal !== undefined) {
            this.weightGoal = params.weightGoal;
        }
        if (params.appLockEnabled !== undefined) {
            this.appLockEnabled = params.appLockEnabled;
        }
        if (params.autoLockTimeout !== undefined) {
            this.autoLockTimeout = params.autoLockTimeout;
        }
        if (params.clipboardClearEnabled !== undefined) {
            this.clipboardClearEnabled = params.clipboardClearEnabled;
        }
    }
    updateStateVars(params: SettingsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__weightGoal.purgeDependencyOnElmtId(rmElmtId);
        this.__appLockEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__autoLockTimeout.purgeDependencyOnElmtId(rmElmtId);
        this.__clipboardClearEnabled.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__weightGoal.aboutToBeDeleted();
        this.__appLockEnabled.aboutToBeDeleted();
        this.__autoLockTimeout.aboutToBeDeleted();
        this.__clipboardClearEnabled.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __weightGoal: ObservedPropertyObjectPU<WeightGoal>;
    get weightGoal() {
        return this.__weightGoal.get();
    }
    set weightGoal(newValue: WeightGoal) {
        this.__weightGoal.set(newValue);
    }
    private __appLockEnabled: ObservedPropertySimplePU<boolean>;
    get appLockEnabled() {
        return this.__appLockEnabled.get();
    }
    set appLockEnabled(newValue: boolean) {
        this.__appLockEnabled.set(newValue);
    }
    private __autoLockTimeout: ObservedPropertySimplePU<number>;
    get autoLockTimeout() {
        return this.__autoLockTimeout.get();
    }
    set autoLockTimeout(newValue: number) {
        this.__autoLockTimeout.set(newValue);
    }
    private __clipboardClearEnabled: ObservedPropertySimplePU<boolean>;
    get clipboardClearEnabled() {
        return this.__clipboardClearEnabled.get();
    }
    set clipboardClearEnabled(newValue: boolean) {
        this.__clipboardClearEnabled.set(newValue);
    }
    aboutToAppear() {
        this.loadSettings();
    }
    loadSettings() {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
            if (goalStr) {
                let parsed: WeightGoal = JSON.parse(goalStr) as WeightGoal;
                this.weightGoal = parsed;
            }
            this.appLockEnabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
            this.autoLockTimeout = pref.getSync(AppConstants.PREF_AUTO_LOCK_TIMEOUT, AppConstants.DEFAULT_AUTO_LOCK_MINUTES) as number;
            this.clipboardClearEnabled = pref.getSync(AppConstants.PREF_CLIPBOARD_CLEAR, true) as boolean;
        }
        catch (e) {
            console.error('Load settings error:', JSON.stringify(e));
        }
    }
    saveWeightGoal() {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            const existingStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
            let existing: WeightGoal = existingStr ? JSON.parse(existingStr) as WeightGoal : new WeightGoal();
            existing.targetWeight = this.weightGoal.targetWeight;
            existing.targetDate = this.weightGoal.targetDate;
            // 保留已有的身高，不覆盖
            pref.put(AppConstants.PREF_WEIGHT_GOAL, JSON.stringify(existing));
            pref.flush();
        }
        catch (e) {
            console.error('Save weight goal error:', JSON.stringify(e));
        }
    }
    saveAppLock(enabled: boolean) {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            pref.put(AppConstants.PREF_APP_LOCK_ENABLED, enabled);
            pref.flush();
        }
        catch (e) {
            console.error('Save app lock error:', JSON.stringify(e));
        }
    }
    saveAppLockPin(pin: string) {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            pref.put(AppConstants.PREF_APP_LOCK_PIN, pin);
            pref.flush();
            ToastUtil.show('PIN 码已保存');
        }
        catch (e) {
            console.error('Save pin error:', JSON.stringify(e));
            ToastUtil.show('保存失败');
        }
    }
    saveAutoLockTimeout(timeout: number) {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            pref.put(AppConstants.PREF_AUTO_LOCK_TIMEOUT, timeout);
            pref.flush();
        }
        catch (e) {
            console.error('Save auto lock error:', JSON.stringify(e));
        }
    }
    saveClipboardClear(enabled: boolean) {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            pref.put(AppConstants.PREF_CLIPBOARD_CLEAR, enabled);
            pref.flush();
        }
        catch (e) {
            console.error('Save clipboard clear error:', JSON.stringify(e));
        }
    }
    async clearPasswords() {
        try {
            const result = await promptAction.showDialog({
                title: '确认清除',
                message: '确定要清除所有密码数据吗？此操作不可恢复。',
                buttons: [
                    {
                        text: '取消',
                        color: '#999999'
                    },
                    {
                        text: '确定',
                        color: '#007DFF'
                    }
                ]
            });
            if (result.index === 1) {
                await DatabaseManager.getInstance().clearAllPasswords();
                ToastUtil.show('密码数据已清除');
            }
        }
        catch (e) {
            console.error('Show dialog error:', JSON.stringify(e));
        }
    }
    async clearWeights() {
        try {
            const result = await promptAction.showDialog({
                title: '确认清除',
                message: '确定要清除所有体重数据吗？此操作不可恢复。',
                buttons: [
                    {
                        text: '取消',
                        color: '#999999'
                    },
                    {
                        text: '确定',
                        color: '#007DFF'
                    }
                ]
            });
            if (result.index === 1) {
                await DatabaseManager.getInstance().clearAllWeights();
                ToastUtil.show('体重数据已清除');
            }
        }
        catch (e) {
            console.error('Show dialog error:', JSON.stringify(e));
        }
    }
    async exportData() {
        try {
            const jsonStr = await DatabaseManager.getInstance().exportAllData();
            if (jsonStr) {
                const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, jsonStr);
                const systemPasteboard = pasteboard.getSystemPasteboard();
                await systemPasteboard.setData(pasteData);
                ToastUtil.show('数据已导出到剪贴板');
            }
        }
        catch (e) {
            console.error('Export data error:', JSON.stringify(e));
            ToastUtil.show('导出失败');
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
            Text.create('设置');
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
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 安全设置
                    SettingSection(this, {
                        title: '安全设置',
                        content: () => {
                            SettingToggleItem.bind(this)('应用锁', this.appLockEnabled, (value) => {
                                this.appLockEnabled = value;
                                this.saveAppLock(value);
                            });
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.appLockEnabled) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new SettingItem(this, {
                                                        label: '应用锁密码',
                                                        content: () => {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                TextInput.create({ placeholder: '4-6位数字密码', text: '' });
                                                                TextInput.type(InputType.Number);
                                                                TextInput.width(120);
                                                                TextInput.height(36);
                                                                TextInput.backgroundColor('#F5F5F5');
                                                                TextInput.borderRadius(8);
                                                                TextInput.maxLength(6);
                                                                TextInput.onChange((value) => {
                                                                    if (value.length >= 4) {
                                                                        this.saveAppLockPin(value);
                                                                    }
                                                                });
                                                            }, TextInput);
                                                        }
                                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 205, col: 15 });
                                                    ViewPU.create(componentCall);
                                                    let paramsLambda = () => {
                                                        return {
                                                            label: '应用锁密码',
                                                            content: () => {
                                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                    TextInput.create({ placeholder: '4-6位数字密码', text: '' });
                                                                    TextInput.type(InputType.Number);
                                                                    TextInput.width(120);
                                                                    TextInput.height(36);
                                                                    TextInput.backgroundColor('#F5F5F5');
                                                                    TextInput.borderRadius(8);
                                                                    TextInput.maxLength(6);
                                                                    TextInput.onChange((value) => {
                                                                        if (value.length >= 4) {
                                                                            this.saveAppLockPin(value);
                                                                        }
                                                                    });
                                                                }, TextInput);
                                                            }
                                                        };
                                                    };
                                                    componentCall.paramsGenerator_ = paramsLambda;
                                                }
                                                else {
                                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                                        label: '应用锁密码'
                                                    });
                                                }
                                            }, { name: "SettingItem" });
                                        }
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new SettingItem(this, {
                                                        label: '自动锁定时间',
                                                        content: () => {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(`${this.autoLockTimeout} 分钟`);
                                                                Text.fontSize(14);
                                                                Text.fontColor('#999999');
                                                            }, Text);
                                                            Text.pop();
                                                        }
                                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 220, col: 15 });
                                                    ViewPU.create(componentCall);
                                                    let paramsLambda = () => {
                                                        return {
                                                            label: '自动锁定时间',
                                                            content: () => {
                                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                    Text.create(`${this.autoLockTimeout} 分钟`);
                                                                    Text.fontSize(14);
                                                                    Text.fontColor('#999999');
                                                                }, Text);
                                                                Text.pop();
                                                            }
                                                        };
                                                    };
                                                    componentCall.paramsGenerator_ = paramsLambda;
                                                }
                                                else {
                                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                                        label: '自动锁定时间'
                                                    });
                                                }
                                            }, { name: "SettingItem" });
                                        }
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            SettingToggleItem.bind(this)('剪贴板自动清除', this.clipboardClearEnabled, (value) => {
                                this.clipboardClearEnabled = value;
                                this.saveClipboardClear(value);
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 198, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '安全设置',
                            content: () => {
                                SettingToggleItem.bind(this)('应用锁', this.appLockEnabled, (value) => {
                                    this.appLockEnabled = value;
                                    this.saveAppLock(value);
                                });
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.appLockEnabled) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SettingItem(this, {
                                                            label: '应用锁密码',
                                                            content: () => {
                                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                    TextInput.create({ placeholder: '4-6位数字密码', text: '' });
                                                                    TextInput.type(InputType.Number);
                                                                    TextInput.width(120);
                                                                    TextInput.height(36);
                                                                    TextInput.backgroundColor('#F5F5F5');
                                                                    TextInput.borderRadius(8);
                                                                    TextInput.maxLength(6);
                                                                    TextInput.onChange((value) => {
                                                                        if (value.length >= 4) {
                                                                            this.saveAppLockPin(value);
                                                                        }
                                                                    });
                                                                }, TextInput);
                                                            }
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 205, col: 15 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                label: '应用锁密码',
                                                                content: () => {
                                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                        TextInput.create({ placeholder: '4-6位数字密码', text: '' });
                                                                        TextInput.type(InputType.Number);
                                                                        TextInput.width(120);
                                                                        TextInput.height(36);
                                                                        TextInput.backgroundColor('#F5F5F5');
                                                                        TextInput.borderRadius(8);
                                                                        TextInput.maxLength(6);
                                                                        TextInput.onChange((value) => {
                                                                            if (value.length >= 4) {
                                                                                this.saveAppLockPin(value);
                                                                            }
                                                                        });
                                                                    }, TextInput);
                                                                }
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            label: '应用锁密码'
                                                        });
                                                    }
                                                }, { name: "SettingItem" });
                                            }
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SettingItem(this, {
                                                            label: '自动锁定时间',
                                                            content: () => {
                                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                    Text.create(`${this.autoLockTimeout} 分钟`);
                                                                    Text.fontSize(14);
                                                                    Text.fontColor('#999999');
                                                                }, Text);
                                                                Text.pop();
                                                            }
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 220, col: 15 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                label: '自动锁定时间',
                                                                content: () => {
                                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                        Text.create(`${this.autoLockTimeout} 分钟`);
                                                                        Text.fontSize(14);
                                                                        Text.fontColor('#999999');
                                                                    }, Text);
                                                                    Text.pop();
                                                                }
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            label: '自动锁定时间'
                                                        });
                                                    }
                                                }, { name: "SettingItem" });
                                            }
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                SettingToggleItem.bind(this)('剪贴板自动清除', this.clipboardClearEnabled, (value) => {
                                    this.clipboardClearEnabled = value;
                                    this.saveClipboardClear(value);
                                });
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '安全设置'
                    });
                }
            }, { name: "SettingSection" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 体重目标设置
                    SettingSection(this, {
                        title: '体重管理',
                        content: () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '目标体重',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    TextInput.create({ placeholder: 'kg', text: this.weightGoal.targetWeight > 0 ? this.weightGoal.targetWeight.toString() : '' });
                                                    TextInput.type(InputType.Number);
                                                    TextInput.width(100);
                                                    TextInput.height(36);
                                                    TextInput.backgroundColor('#F5F5F5');
                                                    TextInput.borderRadius(8);
                                                    TextInput.onChange((value) => {
                                                        let g = new WeightGoal();
                                                        g.targetWeight = parseFloat(value) || 0;
                                                        g.targetDate = this.weightGoal.targetDate;
                                                        g.height = this.weightGoal.height;
                                                        this.weightGoal = g;
                                                        this.saveWeightGoal();
                                                    });
                                                }, TextInput);
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 235, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '目标体重',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        TextInput.create({ placeholder: 'kg', text: this.weightGoal.targetWeight > 0 ? this.weightGoal.targetWeight.toString() : '' });
                                                        TextInput.type(InputType.Number);
                                                        TextInput.width(100);
                                                        TextInput.height(36);
                                                        TextInput.backgroundColor('#F5F5F5');
                                                        TextInput.borderRadius(8);
                                                        TextInput.onChange((value) => {
                                                            let g = new WeightGoal();
                                                            g.targetWeight = parseFloat(value) || 0;
                                                            g.targetDate = this.weightGoal.targetDate;
                                                            g.height = this.weightGoal.height;
                                                            this.weightGoal = g;
                                                            this.saveWeightGoal();
                                                        });
                                                    }, TextInput);
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '目标体重'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '身高',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    TextInput.create({ placeholder: 'cm', text: this.weightGoal.height > 0 ? this.weightGoal.height.toString() : '' });
                                                    TextInput.type(InputType.Number);
                                                    TextInput.width(100);
                                                    TextInput.height(36);
                                                    TextInput.backgroundColor('#F5F5F5');
                                                    TextInput.borderRadius(8);
                                                    TextInput.onChange((value) => {
                                                        let g2 = new WeightGoal();
                                                        g2.targetWeight = this.weightGoal.targetWeight;
                                                        g2.targetDate = this.weightGoal.targetDate;
                                                        g2.height = parseFloat(value) || 170;
                                                        this.weightGoal = g2;
                                                        this.saveWeightGoal();
                                                    });
                                                }, TextInput);
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 252, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '身高',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        TextInput.create({ placeholder: 'cm', text: this.weightGoal.height > 0 ? this.weightGoal.height.toString() : '' });
                                                        TextInput.type(InputType.Number);
                                                        TextInput.width(100);
                                                        TextInput.height(36);
                                                        TextInput.backgroundColor('#F5F5F5');
                                                        TextInput.borderRadius(8);
                                                        TextInput.onChange((value) => {
                                                            let g2 = new WeightGoal();
                                                            g2.targetWeight = this.weightGoal.targetWeight;
                                                            g2.targetDate = this.weightGoal.targetDate;
                                                            g2.height = parseFloat(value) || 170;
                                                            this.weightGoal = g2;
                                                            this.saveWeightGoal();
                                                        });
                                                    }, TextInput);
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '身高'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 234, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '体重管理',
                            content: () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '目标体重',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        TextInput.create({ placeholder: 'kg', text: this.weightGoal.targetWeight > 0 ? this.weightGoal.targetWeight.toString() : '' });
                                                        TextInput.type(InputType.Number);
                                                        TextInput.width(100);
                                                        TextInput.height(36);
                                                        TextInput.backgroundColor('#F5F5F5');
                                                        TextInput.borderRadius(8);
                                                        TextInput.onChange((value) => {
                                                            let g = new WeightGoal();
                                                            g.targetWeight = parseFloat(value) || 0;
                                                            g.targetDate = this.weightGoal.targetDate;
                                                            g.height = this.weightGoal.height;
                                                            this.weightGoal = g;
                                                            this.saveWeightGoal();
                                                        });
                                                    }, TextInput);
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 235, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '目标体重',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            TextInput.create({ placeholder: 'kg', text: this.weightGoal.targetWeight > 0 ? this.weightGoal.targetWeight.toString() : '' });
                                                            TextInput.type(InputType.Number);
                                                            TextInput.width(100);
                                                            TextInput.height(36);
                                                            TextInput.backgroundColor('#F5F5F5');
                                                            TextInput.borderRadius(8);
                                                            TextInput.onChange((value) => {
                                                                let g = new WeightGoal();
                                                                g.targetWeight = parseFloat(value) || 0;
                                                                g.targetDate = this.weightGoal.targetDate;
                                                                g.height = this.weightGoal.height;
                                                                this.weightGoal = g;
                                                                this.saveWeightGoal();
                                                            });
                                                        }, TextInput);
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '目标体重'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '身高',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        TextInput.create({ placeholder: 'cm', text: this.weightGoal.height > 0 ? this.weightGoal.height.toString() : '' });
                                                        TextInput.type(InputType.Number);
                                                        TextInput.width(100);
                                                        TextInput.height(36);
                                                        TextInput.backgroundColor('#F5F5F5');
                                                        TextInput.borderRadius(8);
                                                        TextInput.onChange((value) => {
                                                            let g2 = new WeightGoal();
                                                            g2.targetWeight = this.weightGoal.targetWeight;
                                                            g2.targetDate = this.weightGoal.targetDate;
                                                            g2.height = parseFloat(value) || 170;
                                                            this.weightGoal = g2;
                                                            this.saveWeightGoal();
                                                        });
                                                    }, TextInput);
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 252, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '身高',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            TextInput.create({ placeholder: 'cm', text: this.weightGoal.height > 0 ? this.weightGoal.height.toString() : '' });
                                                            TextInput.type(InputType.Number);
                                                            TextInput.width(100);
                                                            TextInput.height(36);
                                                            TextInput.backgroundColor('#F5F5F5');
                                                            TextInput.borderRadius(8);
                                                            TextInput.onChange((value) => {
                                                                let g2 = new WeightGoal();
                                                                g2.targetWeight = this.weightGoal.targetWeight;
                                                                g2.targetDate = this.weightGoal.targetDate;
                                                                g2.height = parseFloat(value) || 170;
                                                                this.weightGoal = g2;
                                                                this.saveWeightGoal();
                                                            });
                                                        }, TextInput);
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '身高'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '体重管理'
                    });
                }
            }, { name: "SettingSection" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 数据管理
                    SettingSection(this, {
                        title: '数据管理',
                        content: () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '清除密码数据',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('');
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithChild();
                                                    Button.width(32);
                                                    Button.height(32);
                                                    Button.type(ButtonType.Circle);
                                                    Button.backgroundColor('transparent');
                                                    Button.onClick(() => {
                                                        this.clearPasswords();
                                                    });
                                                }, Button);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Shape.create();
                                                    Shape.width(22);
                                                    Shape.height(22);
                                                }, Shape);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Path.create();
                                                    Path.width(20);
                                                    Path.height(20);
                                                    Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                    Path.stroke('#FF4444');
                                                    Path.strokeWidth(1.2);
                                                    Path.fill('none');
                                                }, Path);
                                                Shape.pop();
                                                Button.pop();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 272, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '清除密码数据',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('');
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Button.createWithChild();
                                                        Button.width(32);
                                                        Button.height(32);
                                                        Button.type(ButtonType.Circle);
                                                        Button.backgroundColor('transparent');
                                                        Button.onClick(() => {
                                                            this.clearPasswords();
                                                        });
                                                    }, Button);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Shape.create();
                                                        Shape.width(22);
                                                        Shape.height(22);
                                                    }, Shape);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Path.create();
                                                        Path.width(20);
                                                        Path.height(20);
                                                        Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                        Path.stroke('#FF4444');
                                                        Path.strokeWidth(1.2);
                                                        Path.fill('none');
                                                    }, Path);
                                                    Shape.pop();
                                                    Button.pop();
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '清除密码数据'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '清除体重数据',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('');
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithChild();
                                                    Button.width(32);
                                                    Button.height(32);
                                                    Button.type(ButtonType.Circle);
                                                    Button.backgroundColor('transparent');
                                                    Button.onClick(() => {
                                                        this.clearWeights();
                                                    });
                                                }, Button);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Shape.create();
                                                    Shape.width(22);
                                                    Shape.height(22);
                                                }, Shape);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Path.create();
                                                    Path.width(20);
                                                    Path.height(20);
                                                    Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                    Path.stroke('#FF4444');
                                                    Path.strokeWidth(1.2);
                                                    Path.fill('none');
                                                }, Path);
                                                Shape.pop();
                                                Button.pop();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 296, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '清除体重数据',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('');
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Button.createWithChild();
                                                        Button.width(32);
                                                        Button.height(32);
                                                        Button.type(ButtonType.Circle);
                                                        Button.backgroundColor('transparent');
                                                        Button.onClick(() => {
                                                            this.clearWeights();
                                                        });
                                                    }, Button);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Shape.create();
                                                        Shape.width(22);
                                                        Shape.height(22);
                                                    }, Shape);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Path.create();
                                                        Path.width(20);
                                                        Path.height(20);
                                                        Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                        Path.stroke('#FF4444');
                                                        Path.strokeWidth(1.2);
                                                        Path.fill('none');
                                                    }, Path);
                                                    Shape.pop();
                                                    Button.pop();
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '清除体重数据'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '导出数据',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('');
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithChild();
                                                    Button.width(32);
                                                    Button.height(32);
                                                    Button.type(ButtonType.Circle);
                                                    Button.backgroundColor('transparent');
                                                    Button.onClick(() => {
                                                        this.exportData();
                                                    });
                                                }, Button);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Shape.create();
                                                    Shape.width(22);
                                                    Shape.height(22);
                                                }, Shape);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Path.create();
                                                    Path.width(20);
                                                    Path.height(20);
                                                    Path.commands('M8 2 L8 12 M4 8 L8 12 L12 8 M2 14 L14 14');
                                                    Path.stroke('#007DFF');
                                                    Path.strokeWidth(1.2);
                                                    Path.fill('none');
                                                }, Path);
                                                Shape.pop();
                                                Button.pop();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 320, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '导出数据',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('');
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Button.createWithChild();
                                                        Button.width(32);
                                                        Button.height(32);
                                                        Button.type(ButtonType.Circle);
                                                        Button.backgroundColor('transparent');
                                                        Button.onClick(() => {
                                                            this.exportData();
                                                        });
                                                    }, Button);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Shape.create();
                                                        Shape.width(22);
                                                        Shape.height(22);
                                                    }, Shape);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Path.create();
                                                        Path.width(20);
                                                        Path.height(20);
                                                        Path.commands('M8 2 L8 12 M4 8 L8 12 L12 8 M2 14 L14 14');
                                                        Path.stroke('#007DFF');
                                                        Path.strokeWidth(1.2);
                                                        Path.fill('none');
                                                    }, Path);
                                                    Shape.pop();
                                                    Button.pop();
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '导出数据'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 271, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '数据管理',
                            content: () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '清除密码数据',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('');
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Button.createWithChild();
                                                        Button.width(32);
                                                        Button.height(32);
                                                        Button.type(ButtonType.Circle);
                                                        Button.backgroundColor('transparent');
                                                        Button.onClick(() => {
                                                            this.clearPasswords();
                                                        });
                                                    }, Button);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Shape.create();
                                                        Shape.width(22);
                                                        Shape.height(22);
                                                    }, Shape);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Path.create();
                                                        Path.width(20);
                                                        Path.height(20);
                                                        Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                        Path.stroke('#FF4444');
                                                        Path.strokeWidth(1.2);
                                                        Path.fill('none');
                                                    }, Path);
                                                    Shape.pop();
                                                    Button.pop();
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 272, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '清除密码数据',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create('');
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Button.createWithChild();
                                                            Button.width(32);
                                                            Button.height(32);
                                                            Button.type(ButtonType.Circle);
                                                            Button.backgroundColor('transparent');
                                                            Button.onClick(() => {
                                                                this.clearPasswords();
                                                            });
                                                        }, Button);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Shape.create();
                                                            Shape.width(22);
                                                            Shape.height(22);
                                                        }, Shape);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Path.create();
                                                            Path.width(20);
                                                            Path.height(20);
                                                            Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                            Path.stroke('#FF4444');
                                                            Path.strokeWidth(1.2);
                                                            Path.fill('none');
                                                        }, Path);
                                                        Shape.pop();
                                                        Button.pop();
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '清除密码数据'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '清除体重数据',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('');
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Button.createWithChild();
                                                        Button.width(32);
                                                        Button.height(32);
                                                        Button.type(ButtonType.Circle);
                                                        Button.backgroundColor('transparent');
                                                        Button.onClick(() => {
                                                            this.clearWeights();
                                                        });
                                                    }, Button);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Shape.create();
                                                        Shape.width(22);
                                                        Shape.height(22);
                                                    }, Shape);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Path.create();
                                                        Path.width(20);
                                                        Path.height(20);
                                                        Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                        Path.stroke('#FF4444');
                                                        Path.strokeWidth(1.2);
                                                        Path.fill('none');
                                                    }, Path);
                                                    Shape.pop();
                                                    Button.pop();
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 296, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '清除体重数据',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create('');
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Button.createWithChild();
                                                            Button.width(32);
                                                            Button.height(32);
                                                            Button.type(ButtonType.Circle);
                                                            Button.backgroundColor('transparent');
                                                            Button.onClick(() => {
                                                                this.clearWeights();
                                                            });
                                                        }, Button);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Shape.create();
                                                            Shape.width(22);
                                                            Shape.height(22);
                                                        }, Shape);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Path.create();
                                                            Path.width(20);
                                                            Path.height(20);
                                                            Path.commands('M2 4 L4 4 L4 15 L12 15 L12 4 L14 4 M5 2 L5 4 M11 2 L11 4 M5 6 L5 11 M11 6 L11 11');
                                                            Path.stroke('#FF4444');
                                                            Path.strokeWidth(1.2);
                                                            Path.fill('none');
                                                        }, Path);
                                                        Shape.pop();
                                                        Button.pop();
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '清除体重数据'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '导出数据',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('');
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Button.createWithChild();
                                                        Button.width(32);
                                                        Button.height(32);
                                                        Button.type(ButtonType.Circle);
                                                        Button.backgroundColor('transparent');
                                                        Button.onClick(() => {
                                                            this.exportData();
                                                        });
                                                    }, Button);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Shape.create();
                                                        Shape.width(22);
                                                        Shape.height(22);
                                                    }, Shape);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Path.create();
                                                        Path.width(20);
                                                        Path.height(20);
                                                        Path.commands('M8 2 L8 12 M4 8 L8 12 L12 8 M2 14 L14 14');
                                                        Path.stroke('#007DFF');
                                                        Path.strokeWidth(1.2);
                                                        Path.fill('none');
                                                    }, Path);
                                                    Shape.pop();
                                                    Button.pop();
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 320, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '导出数据',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create('');
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Button.createWithChild();
                                                            Button.width(32);
                                                            Button.height(32);
                                                            Button.type(ButtonType.Circle);
                                                            Button.backgroundColor('transparent');
                                                            Button.onClick(() => {
                                                                this.exportData();
                                                            });
                                                        }, Button);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Shape.create();
                                                            Shape.width(22);
                                                            Shape.height(22);
                                                        }, Shape);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Path.create();
                                                            Path.width(20);
                                                            Path.height(20);
                                                            Path.commands('M8 2 L8 12 M4 8 L8 12 L12 8 M2 14 L14 14');
                                                            Path.stroke('#007DFF');
                                                            Path.strokeWidth(1.2);
                                                            Path.fill('none');
                                                        }, Path);
                                                        Shape.pop();
                                                        Button.pop();
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '导出数据'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '数据管理'
                    });
                }
            }, { name: "SettingSection" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 关于
                    SettingSection(this, {
                        title: '关于',
                        content: () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '版本',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('1.0.0');
                                                    Text.fontSize(14);
                                                    Text.fontColor('#999999');
                                                }, Text);
                                                Text.pop();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 347, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '版本',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('1.0.0');
                                                        Text.fontSize(14);
                                                        Text.fontColor('#999999');
                                                    }, Text);
                                                    Text.pop();
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '版本'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingItem(this, {
                                            label: '数据存储',
                                            content: () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('本地加密');
                                                    Text.fontSize(14);
                                                    Text.fontColor('#4CAF50');
                                                }, Text);
                                                Text.pop();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 353, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                label: '数据存储',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('本地加密');
                                                        Text.fontSize(14);
                                                        Text.fontColor('#4CAF50');
                                                    }, Text);
                                                    Text.pop();
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            label: '数据存储'
                                        });
                                    }
                                }, { name: "SettingItem" });
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 346, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '关于',
                            content: () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '版本',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('1.0.0');
                                                        Text.fontSize(14);
                                                        Text.fontColor('#999999');
                                                    }, Text);
                                                    Text.pop();
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 347, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '版本',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create('1.0.0');
                                                            Text.fontSize(14);
                                                            Text.fontColor('#999999');
                                                        }, Text);
                                                        Text.pop();
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '版本'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SettingItem(this, {
                                                label: '数据存储',
                                                content: () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('本地加密');
                                                        Text.fontSize(14);
                                                        Text.fontColor('#4CAF50');
                                                    }, Text);
                                                    Text.pop();
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/settings/SettingsPage.ets", line: 353, col: 13 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '数据存储',
                                                    content: () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create('本地加密');
                                                            Text.fontSize(14);
                                                            Text.fontColor('#4CAF50');
                                                        }, Text);
                                                        Text.pop();
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                label: '数据存储'
                                            });
                                        }
                                    }, { name: "SettingItem" });
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '关于'
                    });
                }
            }, { name: "SettingSection" });
        }
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SettingsPage";
    }
}
function SettingToggleItem(label: string, isOn: boolean, onChange: (value: boolean) => void, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Row.create();
        Row.width('100%');
        Row.height(52);
        Row.padding({ left: 16, right: 16 });
        Row.justifyContent(FlexAlign.SpaceBetween);
    }, Row);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(label);
        Text.fontSize(15);
        Text.fontColor('#333333');
        Text.layoutWeight(1);
    }, Text);
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Toggle.create({ type: ToggleType.Switch, isOn: isOn });
        Toggle.selectedColor('#007DFF');
        Toggle.onChange(onChange);
    }, Toggle);
    Toggle.pop();
    Row.pop();
}
class SettingSection extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__title = new SynchedPropertySimpleOneWayPU(params.title, this, "title");
        this.content = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingSection_Params) {
        if (params.title === undefined) {
            this.__title.set('');
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: SettingSection_Params) {
        this.__title.reset(params.title);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__title.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: SynchedPropertySimpleOneWayPU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __content;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(13);
            Text.fontColor('#999999');
            Text.padding({ left: 16, top: 16, bottom: 8 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(12);
            Column.padding({ top: 4, bottom: 4 });
            Column.margin({ left: 16, right: 16 });
        }, Column);
        this.content.bind(this)();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class SettingItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__label = new SynchedPropertySimpleOneWayPU(params.label, this, "label");
        this.content = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingItem_Params) {
        if (params.label === undefined) {
            this.__label.set('');
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: SettingItem_Params) {
        this.__label.reset(params.label);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__label.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__label.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __label: SynchedPropertySimpleOneWayPU<string>;
    get label() {
        return this.__label.get();
    }
    set label(newValue: string) {
        this.__label.set(newValue);
    }
    private __content;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(52);
            Row.padding({ left: 16, right: 16 });
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.label);
            Text.fontSize(15);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.content.bind(this)();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new SettingsPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/settings/SettingsPage", pageFullPath: "entry/src/main/ets/pages/settings/SettingsPage", integratedHsp: "false", moduleType: "followWithHap" });
