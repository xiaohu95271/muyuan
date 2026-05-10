if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AppLockVerifyPage_Params {
    pinCode?: string;
    verifyStatus?: number;
}
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import preferences from "@ohos:data.preferences";
import { ToastUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/ToastUtil&";
class AppLockVerifyPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__pinCode = new ObservedPropertySimplePU('', this, "pinCode");
        this.__verifyStatus = new ObservedPropertySimplePU(0, this, "verifyStatus");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AppLockVerifyPage_Params) {
        if (params.pinCode !== undefined) {
            this.pinCode = params.pinCode;
        }
        if (params.verifyStatus !== undefined) {
            this.verifyStatus = params.verifyStatus;
        }
    }
    updateStateVars(params: AppLockVerifyPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__pinCode.purgeDependencyOnElmtId(rmElmtId);
        this.__verifyStatus.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__pinCode.aboutToBeDeleted();
        this.__verifyStatus.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __pinCode: ObservedPropertySimplePU<string>;
    get pinCode() {
        return this.__pinCode.get();
    }
    set pinCode(newValue: string) {
        this.__pinCode.set(newValue);
    }
    private __verifyStatus: ObservedPropertySimplePU<number>; // 0: 待验证 1: 验证中 2: 成功
    get verifyStatus() {
        return this.__verifyStatus.get();
    }
    set verifyStatus(newValue: number) {
        this.__verifyStatus.set(newValue);
    }
    aboutToAppear() {
        // 检查是否设置了 PIN 码
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            const pin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
            if (!pin) {
                // 未设置 PIN 码，直接返回
                this.getUIContext().getRouter().back();
            }
        }
        catch (e) {
            console.error('Check lock pin error:', JSON.stringify(e));
        }
    }
    verifyPin() {
        if (this.pinCode.length < 4) {
            ToastUtil.show('请输入至少 4 位数字');
            return;
        }
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            const storedPin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
            if (this.pinCode === storedPin) {
                this.verifyStatus = 2;
                ToastUtil.show('验证成功');
                // 通知密码列表页验证通过
                this.getUIContext().getRouter().back();
            }
            else {
                this.verifyStatus = 0;
                this.pinCode = '';
                ToastUtil.show('PIN 码错误，请重试');
            }
        }
        catch (e) {
            console.error('Verify pin error:', JSON.stringify(e));
            ToastUtil.show('验证失败');
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 24 });
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#FFFFFF');
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
            Row.justifyContent(FlexAlign.SpaceBetween);
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
            Text.create('应用锁验证');
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
            Column.create({ space: 32 });
            Column.layoutWeight(1);
            Column.padding({ top: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Shape.create();
            Shape.width(64);
            Shape.height(64);
        }, Shape);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(48);
            Path.height(48);
            Path.commands('M14 24 L14 16 A10 10 0 1 1 34 16 L34 24 M10 24 L38 24 L38 42 L10 42 Z M24 30 A2 2 0 1 0 24 36 A2 2 0 1 0 24 30');
            Path.stroke('#007DFF');
            Path.strokeWidth(2);
            Path.fill('none');
        }, Path);
        Shape.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('请输入应用锁密码');
            Text.fontSize(16);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // PIN 显示区域
            Row.create({ space: 12 });
            // PIN 显示区域
            Row.height(40);
            // PIN 显示区域
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const index = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width(16);
                    Row.height(16);
                    Row.backgroundColor(index < this.pinCode.length ? '#007DFF' : '#E0E0E0');
                    Row.borderRadius(8);
                }, Row);
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, [0, 1, 2, 3, 4, 5], forEachItemGenFunction, (index: number) => index.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        // PIN 显示区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数字键盘
            Column.create({ space: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 24 });
        }, Row);
        PinButton.bind(this)('1', (v) => { this.appendPin(v); });
        PinButton.bind(this)('2', (v) => { this.appendPin(v); });
        PinButton.bind(this)('3', (v) => { this.appendPin(v); });
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 24 });
        }, Row);
        PinButton.bind(this)('4', (v) => { this.appendPin(v); });
        PinButton.bind(this)('5', (v) => { this.appendPin(v); });
        PinButton.bind(this)('6', (v) => { this.appendPin(v); });
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 24 });
        }, Row);
        PinButton.bind(this)('7', (v) => { this.appendPin(v); });
        PinButton.bind(this)('8', (v) => { this.appendPin(v); });
        PinButton.bind(this)('9', (v) => { this.appendPin(v); });
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(64);
        }, Blank);
        Blank.pop();
        PinButton.bind(this)('0', (v) => { this.appendPin(v); });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(64);
            Button.height(64);
            Button.type(ButtonType.Circle);
            Button.backgroundColor('#F5F5F5');
            Button.onClick(() => {
                if (this.pinCode.length > 0) {
                    this.pinCode = this.pinCode.substring(0, this.pinCode.length - 1);
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Shape.create();
            Shape.width(28);
            Shape.height(28);
        }, Shape);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(24);
            Path.height(24);
            Path.commands('M14 3 L5 10 L14 17 M5 10 L16 10');
            Path.stroke('#666666');
            Path.strokeWidth(2);
            Path.fill('none');
        }, Path);
        Shape.pop();
        Button.pop();
        Row.pop();
        // 数字键盘
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确认');
            Button.width('80%');
            Button.height(48);
            Button.fontSize(16);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor('#007DFF');
            Button.borderRadius(24);
            Button.margin({ bottom: 40 });
            Button.onClick(() => {
                this.verifyPin();
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    appendPin(value: string) {
        if (this.pinCode.length < 6) {
            this.pinCode = this.pinCode + value;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AppLockVerifyPage";
    }
}
function PinButton(value: string, onClick: (v: string) => void, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Button.createWithLabel(value);
        Button.width(64);
        Button.height(64);
        Button.fontSize(24);
        Button.fontColor('#333333');
        Button.backgroundColor('#F5F5F5');
        Button.borderRadius(32);
        Button.onClick(() => {
            onClick(value);
        });
    }, Button);
    Button.pop();
}
registerNamedRoute(() => new AppLockVerifyPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/password/AppLockVerifyPage", pageFullPath: "entry/src/main/ets/pages/password/AppLockVerifyPage", integratedHsp: "false", moduleType: "followWithHap" });
