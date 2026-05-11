if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FormItem_Params {
    label?: string;
    content?: () => void;
}
interface PasswordDetailPage_Params {
    passwordId?: number;
    platform?: string;
    account?: string;
    password?: string;
    category?: string;
    website?: string;
    tags?: string;
    notes?: string;
    isEdit?: boolean;
    passwordStrength?: number;
    isWeakPassword?: boolean;
    weakPasswordReason?: string;
    weakPasswordDict?: string[];
}
import { AppConstants, PASSWORD_CATEGORIES } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { PasswordModel } from "@normalized:N&&&entry/src/main/ets/models/PasswordModel&";
import { CryptoUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/CryptoUtil&";
import { ToastUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/ToastUtil&";
import { EventUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/EventUtil&";
import pasteboard from "@ohos:pasteboard";
import preferences from "@ohos:data.preferences";
class PasswordDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__passwordId = new ObservedPropertySimplePU(-1, this, "passwordId");
        this.__platform = new ObservedPropertySimplePU('', this, "platform");
        this.__account = new ObservedPropertySimplePU('', this, "account");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__category = new ObservedPropertySimplePU('其他', this, "category");
        this.__website = new ObservedPropertySimplePU('', this, "website");
        this.__tags = new ObservedPropertySimplePU('', this, "tags");
        this.__notes = new ObservedPropertySimplePU('', this, "notes");
        this.__isEdit = new ObservedPropertySimplePU(false, this, "isEdit");
        this.__passwordStrength = new ObservedPropertySimplePU(0, this, "passwordStrength");
        this.__isWeakPassword = new ObservedPropertySimplePU(false, this, "isWeakPassword");
        this.__weakPasswordReason = new ObservedPropertySimplePU('', this, "weakPasswordReason");
        this.weakPasswordDict = [
            '123456', '123456789', '12345678', '1234567', '12345', '1234567890',
            'password', 'qwerty', 'abc123', '111111', '123123', 'admin',
            'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
            'princess', 'qwerty123', 'passw0rd', 'shadow', 'sunshine',
            '000000', '666666', '888888', 'iloveyou', 'trustno1',
            'football', 'baseball', 'access', 'hello', 'charlie',
            'qwer1234', 'asdf1234', 'zxcv1234', 'password1', 'password123',
            'a123456', 'aaa111', 'qaz123', 'abcd1234', '123abc',
            'p@ssw0rd', 'P@ssword1', 'Aa123456', 'aa123456'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PasswordDetailPage_Params) {
        if (params.passwordId !== undefined) {
            this.passwordId = params.passwordId;
        }
        if (params.platform !== undefined) {
            this.platform = params.platform;
        }
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.category !== undefined) {
            this.category = params.category;
        }
        if (params.website !== undefined) {
            this.website = params.website;
        }
        if (params.tags !== undefined) {
            this.tags = params.tags;
        }
        if (params.notes !== undefined) {
            this.notes = params.notes;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
        if (params.passwordStrength !== undefined) {
            this.passwordStrength = params.passwordStrength;
        }
        if (params.isWeakPassword !== undefined) {
            this.isWeakPassword = params.isWeakPassword;
        }
        if (params.weakPasswordReason !== undefined) {
            this.weakPasswordReason = params.weakPasswordReason;
        }
        if (params.weakPasswordDict !== undefined) {
            this.weakPasswordDict = params.weakPasswordDict;
        }
    }
    updateStateVars(params: PasswordDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__passwordId.purgeDependencyOnElmtId(rmElmtId);
        this.__platform.purgeDependencyOnElmtId(rmElmtId);
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__category.purgeDependencyOnElmtId(rmElmtId);
        this.__website.purgeDependencyOnElmtId(rmElmtId);
        this.__tags.purgeDependencyOnElmtId(rmElmtId);
        this.__notes.purgeDependencyOnElmtId(rmElmtId);
        this.__isEdit.purgeDependencyOnElmtId(rmElmtId);
        this.__passwordStrength.purgeDependencyOnElmtId(rmElmtId);
        this.__isWeakPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__weakPasswordReason.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__passwordId.aboutToBeDeleted();
        this.__platform.aboutToBeDeleted();
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__category.aboutToBeDeleted();
        this.__website.aboutToBeDeleted();
        this.__tags.aboutToBeDeleted();
        this.__notes.aboutToBeDeleted();
        this.__isEdit.aboutToBeDeleted();
        this.__passwordStrength.aboutToBeDeleted();
        this.__isWeakPassword.aboutToBeDeleted();
        this.__weakPasswordReason.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __passwordId: ObservedPropertySimplePU<number>;
    get passwordId() {
        return this.__passwordId.get();
    }
    set passwordId(newValue: number) {
        this.__passwordId.set(newValue);
    }
    private __platform: ObservedPropertySimplePU<string>;
    get platform() {
        return this.__platform.get();
    }
    set platform(newValue: string) {
        this.__platform.set(newValue);
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __category: ObservedPropertySimplePU<string>;
    get category() {
        return this.__category.get();
    }
    set category(newValue: string) {
        this.__category.set(newValue);
    }
    private __website: ObservedPropertySimplePU<string>;
    get website() {
        return this.__website.get();
    }
    set website(newValue: string) {
        this.__website.set(newValue);
    }
    private __tags: ObservedPropertySimplePU<string>;
    get tags() {
        return this.__tags.get();
    }
    set tags(newValue: string) {
        this.__tags.set(newValue);
    }
    private __notes: ObservedPropertySimplePU<string>;
    get notes() {
        return this.__notes.get();
    }
    set notes(newValue: string) {
        this.__notes.set(newValue);
    }
    private __isEdit: ObservedPropertySimplePU<boolean>;
    get isEdit() {
        return this.__isEdit.get();
    }
    set isEdit(newValue: boolean) {
        this.__isEdit.set(newValue);
    }
    private __passwordStrength: ObservedPropertySimplePU<number>; // 0-3
    get passwordStrength() {
        return this.__passwordStrength.get();
    }
    set passwordStrength(newValue: number) {
        this.__passwordStrength.set(newValue);
    }
    private __isWeakPassword: ObservedPropertySimplePU<boolean>;
    get isWeakPassword() {
        return this.__isWeakPassword.get();
    }
    set isWeakPassword(newValue: boolean) {
        this.__isWeakPassword.set(newValue);
    }
    private __weakPasswordReason: ObservedPropertySimplePU<string>;
    get weakPasswordReason() {
        return this.__weakPasswordReason.get();
    }
    set weakPasswordReason(newValue: string) {
        this.__weakPasswordReason.set(newValue);
    }
    // 常见弱密码字典
    private weakPasswordDict: string[];
    aboutToAppear() {
        let params = this.getUIContext().getRouter().getParams() as object;
        if (params) {
            let p = params as Record<string, Object>;
            if (p['id'] !== undefined) {
                this.passwordId = p['id'] as number;
                this.isEdit = true;
                this.loadPasswordDetail();
            }
        }
    }
    async loadPasswordDetail() {
        const model = await DatabaseManager.getInstance().queryPasswordById(this.passwordId);
        if (model) {
            this.platform = model.platform;
            this.account = model.account;
            this.password = await CryptoUtil.decrypt(model.password);
            this.category = model.category;
            this.website = model.website;
            this.tags = model.tags;
            this.notes = model.notes;
            this.checkPasswordStrength();
        }
    }
    checkPasswordStrength() {
        const pwd = this.password;
        if (!pwd) {
            this.passwordStrength = 0;
            this.isWeakPassword = false;
            this.weakPasswordReason = '';
            return;
        }
        // 弱密码字典检查
        const lowerPwd = pwd.toLowerCase();
        if (this.weakPasswordDict.some(w => w.toLowerCase() === lowerPwd)) {
            this.isWeakPassword = true;
            this.weakPasswordReason = '此密码在常见泄露密码字典中，极易被破解';
            this.passwordStrength = 0;
            return;
        }
        // 检查纯数字密码
        if (/^\d+$/.test(pwd) && pwd.length <= 8) {
            this.isWeakPassword = true;
            this.weakPasswordReason = '纯数字短密码容易被暴力破解';
            this.passwordStrength = 0;
            return;
        }
        // 检查连续字符（如 aaaaaa）
        if (/^(.)\1+$/.test(pwd)) {
            this.isWeakPassword = true;
            this.weakPasswordReason = '密码全是相同字符，安全性极低';
            this.passwordStrength = 0;
            return;
        }
        // 检查顺序键盘模式
        const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', '123456', '654321', 'abcdef'];
        if (keyboardPatterns.some(p => lowerPwd.includes(p))) {
            this.isWeakPassword = true;
            this.weakPasswordReason = '包含键盘顺序模式，容易被猜测';
            this.passwordStrength = 1;
            return;
        }
        this.isWeakPassword = false;
        this.weakPasswordReason = '';
        // 强度评分
        let score = 0;
        if (pwd.length >= 8)
            score++;
        if (pwd.length >= 12)
            score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd))
            score++;
        if (/\d/.test(pwd))
            score++;
        if (/[^a-zA-Z0-9]/.test(pwd))
            score++;
        this.passwordStrength = Math.min(3, Math.floor(score / 2));
    }
    async savePassword() {
        if (!this.platform.trim() || !this.account.trim() || !this.password.trim()) {
            ToastUtil.show('请填写必填项');
            return;
        }
        const encryptedPwd = await CryptoUtil.encrypt(this.password);
        if (!encryptedPwd) {
            ToastUtil.show('密码加密失败，请重试');
            return;
        }
        const model = new PasswordModel();
        model.id = this.passwordId;
        model.platform = this.platform.trim();
        model.account = this.account.trim();
        model.password = encryptedPwd;
        model.category = this.category;
        model.website = this.website.trim();
        model.tags = this.tags.trim();
        model.notes = this.notes.trim();
        try {
            let result: number = -1;
            if (this.isEdit) {
                result = await DatabaseManager.getInstance().updatePassword(model);
            }
            else {
                result = await DatabaseManager.getInstance().insertPassword(model);
            }
            if (result < 0) {
                ToastUtil.show('保存失败，数据库写入异常');
                return;
            }
            EventUtil.emitPasswordSaved();
            ToastUtil.show(this.isEdit ? '修改成功' : '保存成功');
            this.getUIContext().getRouter().back();
        }
        catch (e) {
            console.error('Save password error:', JSON.stringify(e));
            ToastUtil.show('保存失败，请重试');
        }
    }
    getStrengthText(): string {
        switch (this.passwordStrength) {
            case 0: return '弱';
            case 1: return '中';
            case 2: return '强';
            case 3: return '极强';
            default: return '';
        }
    }
    getStrengthColor(): string {
        switch (this.passwordStrength) {
            case 0: return '#F44336';
            case 1: return '#FF9800';
            case 2: return '#4CAF50';
            case 3: return '#2196F3';
            default: return '#999999';
        }
    }
    async copyCurrentPassword(): Promise<void> {
        if (!this.password) {
            ToastUtil.show('密码为空');
            return;
        }
        try {
            const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.password);
            const systemPasteboard = pasteboard.getSystemPasteboard();
            await systemPasteboard.setData(pasteData);
            ToastUtil.show('密码已复制到剪贴板');
            this.scheduleClipboardClear();
        }
        catch (e) {
            console.error('Copy password error:', JSON.stringify(e));
            ToastUtil.show('复制失败');
        }
    }
    scheduleClipboardClear(): void {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            const enabled = pref.getSync(AppConstants.PREF_CLIPBOARD_CLEAR, true) as boolean;
            if (enabled) {
                setTimeout(() => {
                    try {
                        const pb = pasteboard.getSystemPasteboard();
                        pb.clearData();
                        ToastUtil.show('剪贴板已自动清除');
                    }
                    catch (err) {
                        console.error('Clear clipboard error:', JSON.stringify(err));
                    }
                }, AppConstants.CLIPBOARD_CLEAR_DELAY * 1000);
            }
        }
        catch (e) {
            console.error('Schedule clipboard clear error:', JSON.stringify(e));
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
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
            Text.create(this.isEdit ? '编辑密码' : '新增密码');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.fontSize(14);
            Button.fontColor('#007DFF');
            Button.backgroundColor('transparent');
            Button.onClick(async () => {
                await this.savePassword();
            });
        }, Button);
        Button.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表单内容
            Scroll.create();
            // 表单内容
            Scroll.width('100%');
            // 表单内容
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.padding(16);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 平台名称
                    FormItem(this, {
                        label: '平台名称 *',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextInput.create({ placeholder: '如：微信、GitHub', text: { value: this.platform, changeEvent: newValue => { this.platform = newValue; } } });
                                TextInput.height(48);
                                TextInput.backgroundColor('#F5F5F5');
                                TextInput.borderRadius(8);
                            }, TextInput);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 258, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '平台名称 *',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    TextInput.create({ placeholder: '如：微信、GitHub', text: { value: this.platform, changeEvent: newValue => { this.platform = newValue; } } });
                                    TextInput.height(48);
                                    TextInput.backgroundColor('#F5F5F5');
                                    TextInput.borderRadius(8);
                                }, TextInput);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '平台名称 *'
                    });
                }
            }, { name: "FormItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 账号
                    FormItem(this, {
                        label: '账号 *',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextInput.create({ placeholder: '用户名/手机号/邮箱', text: { value: this.account, changeEvent: newValue => { this.account = newValue; } } });
                                TextInput.height(48);
                                TextInput.backgroundColor('#F5F5F5');
                                TextInput.borderRadius(8);
                            }, TextInput);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 266, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '账号 *',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    TextInput.create({ placeholder: '用户名/手机号/邮箱', text: { value: this.account, changeEvent: newValue => { this.account = newValue; } } });
                                    TextInput.height(48);
                                    TextInput.backgroundColor('#F5F5F5');
                                    TextInput.borderRadius(8);
                                }, TextInput);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '账号 *'
                    });
                }
            }, { name: "FormItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 密码
                    FormItem(this, {
                        label: '密码 *',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 8 });
                                Row.width('100%');
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextInput.create({ placeholder: '输入密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
                                TextInput.type(InputType.Password);
                                TextInput.height(48);
                                TextInput.backgroundColor('#F5F5F5');
                                TextInput.borderRadius(8);
                                TextInput.layoutWeight(1);
                                TextInput.onChange(() => {
                                    this.checkPasswordStrength();
                                });
                            }, TextInput);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithChild();
                                Button.width(44);
                                Button.height(44);
                                Button.type(ButtonType.Circle);
                                Button.backgroundColor('#E8F5E9');
                                Button.onClick(() => {
                                    this.copyCurrentPassword();
                                });
                            }, Button);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Shape.create();
                                Shape.width(24);
                                Shape.height(24);
                            }, Shape);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Path.create();
                                Path.width(22);
                                Path.height(22);
                                Path.commands('M5 3 L13 3 L13 11 M3 5 L13 5 L13 15 L3 15 Z');
                                Path.stroke('#4CAF50');
                                Path.strokeWidth(1.5);
                                Path.fill('none');
                            }, Path);
                            Shape.pop();
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithChild();
                                Button.width(44);
                                Button.height(44);
                                Button.type(ButtonType.Circle);
                                Button.backgroundColor('#E3F2FD');
                                Button.onClick(() => {
                                    this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
                                });
                            }, Button);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Shape.create();
                                Shape.width(24);
                                Shape.height(24);
                            }, Shape);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Path.create();
                                Path.width(22);
                                Path.height(22);
                                Path.commands('M14 4 A8 8 0 1 0 16 10 M16 2 L16 6 L12 6');
                                Path.stroke('#007DFF');
                                Path.strokeWidth(1.5);
                                Path.fill('none');
                            }, Path);
                            Shape.pop();
                            Button.pop();
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 密码强度指示
                                if (this.password.length > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create({ space: 8 });
                                            Row.width('100%');
                                            Row.margin({ top: 4 });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.width(120);
                                            Row.justifyContent(FlexAlign.SpaceBetween);
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            ForEach.create();
                                            const forEachItemGenFunction = _item => {
                                                const index = _item;
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Row.create();
                                                    Row.width(22);
                                                    Row.height(4);
                                                    Row.backgroundColor(index <= this.passwordStrength ? this.getStrengthColor() : '#E0E0E0');
                                                    Row.borderRadius(2);
                                                }, Row);
                                                Row.pop();
                                            };
                                            this.forEachUpdateFunction(elmtId, [0, 1, 2, 3], forEachItemGenFunction, (index: number) => index.toString(), false, false);
                                        }, ForEach);
                                        ForEach.pop();
                                        Row.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(this.getStrengthText());
                                            Text.fontSize(12);
                                            Text.fontColor(this.getStrengthColor());
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            If.create();
                                            // 弱密码风险提示
                                            if (this.isWeakPassword) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Row.create({ space: 8 });
                                                        Row.width('100%');
                                                        Row.padding(8);
                                                        Row.backgroundColor('#FFF0F0');
                                                        Row.borderRadius(6);
                                                        Row.margin({ top: 4 });
                                                    }, Row);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('⚠');
                                                        Text.fontSize(16);
                                                    }, Text);
                                                    Text.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create(this.weakPasswordReason);
                                                        Text.fontSize(12);
                                                        Text.fontColor('#F44336');
                                                        Text.layoutWeight(1);
                                                    }, Text);
                                                    Text.pop();
                                                    Row.pop();
                                                });
                                            }
                                            else {
                                                this.ifElseBranchUpdateFunction(1, () => {
                                                });
                                            }
                                        }, If);
                                        If.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 274, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '密码 *',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 8 });
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    TextInput.create({ placeholder: '输入密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
                                    TextInput.type(InputType.Password);
                                    TextInput.height(48);
                                    TextInput.backgroundColor('#F5F5F5');
                                    TextInput.borderRadius(8);
                                    TextInput.layoutWeight(1);
                                    TextInput.onChange(() => {
                                        this.checkPasswordStrength();
                                    });
                                }, TextInput);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild();
                                    Button.width(44);
                                    Button.height(44);
                                    Button.type(ButtonType.Circle);
                                    Button.backgroundColor('#E8F5E9');
                                    Button.onClick(() => {
                                        this.copyCurrentPassword();
                                    });
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Shape.create();
                                    Shape.width(24);
                                    Shape.height(24);
                                }, Shape);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Path.create();
                                    Path.width(22);
                                    Path.height(22);
                                    Path.commands('M5 3 L13 3 L13 11 M3 5 L13 5 L13 15 L3 15 Z');
                                    Path.stroke('#4CAF50');
                                    Path.strokeWidth(1.5);
                                    Path.fill('none');
                                }, Path);
                                Shape.pop();
                                Button.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild();
                                    Button.width(44);
                                    Button.height(44);
                                    Button.type(ButtonType.Circle);
                                    Button.backgroundColor('#E3F2FD');
                                    Button.onClick(() => {
                                        this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_GENERATOR });
                                    });
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Shape.create();
                                    Shape.width(24);
                                    Shape.height(24);
                                }, Shape);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Path.create();
                                    Path.width(22);
                                    Path.height(22);
                                    Path.commands('M14 4 A8 8 0 1 0 16 10 M16 2 L16 6 L12 6');
                                    Path.stroke('#007DFF');
                                    Path.strokeWidth(1.5);
                                    Path.fill('none');
                                }, Path);
                                Shape.pop();
                                Button.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    // 密码强度指示
                                    if (this.password.length > 0) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create({ space: 8 });
                                                Row.width('100%');
                                                Row.margin({ top: 4 });
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width(120);
                                                Row.justifyContent(FlexAlign.SpaceBetween);
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                ForEach.create();
                                                const forEachItemGenFunction = _item => {
                                                    const index = _item;
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Row.create();
                                                        Row.width(22);
                                                        Row.height(4);
                                                        Row.backgroundColor(index <= this.passwordStrength ? this.getStrengthColor() : '#E0E0E0');
                                                        Row.borderRadius(2);
                                                    }, Row);
                                                    Row.pop();
                                                };
                                                this.forEachUpdateFunction(elmtId, [0, 1, 2, 3], forEachItemGenFunction, (index: number) => index.toString(), false, false);
                                            }, ForEach);
                                            ForEach.pop();
                                            Row.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.getStrengthText());
                                                Text.fontSize(12);
                                                Text.fontColor(this.getStrengthColor());
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                If.create();
                                                // 弱密码风险提示
                                                if (this.isWeakPassword) {
                                                    this.ifElseBranchUpdateFunction(0, () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Row.create({ space: 8 });
                                                            Row.width('100%');
                                                            Row.padding(8);
                                                            Row.backgroundColor('#FFF0F0');
                                                            Row.borderRadius(6);
                                                            Row.margin({ top: 4 });
                                                        }, Row);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create('⚠');
                                                            Text.fontSize(16);
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create(this.weakPasswordReason);
                                                            Text.fontSize(12);
                                                            Text.fontColor('#F44336');
                                                            Text.layoutWeight(1);
                                                        }, Text);
                                                        Text.pop();
                                                        Row.pop();
                                                    });
                                                }
                                                else {
                                                    this.ifElseBranchUpdateFunction(1, () => {
                                                    });
                                                }
                                            }, If);
                                            If.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '密码 *'
                    });
                }
            }, { name: "FormItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 分类
                    FormItem(this, {
                        label: '分类',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 8 });
                                Row.width('100%');
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const cat = _item;
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(cat);
                                        Text.fontSize(13);
                                        Text.fontColor(this.category === cat ? '#FFFFFF' : '#666666');
                                        Text.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                        Text.backgroundColor(this.category === cat ? '#007DFF' : '#F0F0F0');
                                        Text.borderRadius(8);
                                        Text.onClick(() => {
                                            this.category = cat;
                                        });
                                    }, Text);
                                    Text.pop();
                                };
                                this.forEachUpdateFunction(elmtId, PASSWORD_CATEGORIES, forEachItemGenFunction, (cat: string) => cat, false, false);
                            }, ForEach);
                            ForEach.pop();
                            Row.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 372, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '分类',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 8 });
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const cat = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(cat);
                                            Text.fontSize(13);
                                            Text.fontColor(this.category === cat ? '#FFFFFF' : '#666666');
                                            Text.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                            Text.backgroundColor(this.category === cat ? '#007DFF' : '#F0F0F0');
                                            Text.borderRadius(8);
                                            Text.onClick(() => {
                                                this.category = cat;
                                            });
                                        }, Text);
                                        Text.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, PASSWORD_CATEGORIES, forEachItemGenFunction, (cat: string) => cat, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '分类'
                    });
                }
            }, { name: "FormItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 网站
                    FormItem(this, {
                        label: '网站地址',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextInput.create({ placeholder: 'https://...', text: { value: this.website, changeEvent: newValue => { this.website = newValue; } } });
                                TextInput.height(48);
                                TextInput.backgroundColor('#F5F5F5');
                                TextInput.borderRadius(8);
                            }, TextInput);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 390, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '网站地址',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    TextInput.create({ placeholder: 'https://...', text: { value: this.website, changeEvent: newValue => { this.website = newValue; } } });
                                    TextInput.height(48);
                                    TextInput.backgroundColor('#F5F5F5');
                                    TextInput.borderRadius(8);
                                }, TextInput);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '网站地址'
                    });
                }
            }, { name: "FormItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 标签
                    FormItem(this, {
                        label: '标签',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextInput.create({ placeholder: '多个标签用逗号分隔', text: { value: this.tags, changeEvent: newValue => { this.tags = newValue; } } });
                                TextInput.height(48);
                                TextInput.backgroundColor('#F5F5F5');
                                TextInput.borderRadius(8);
                            }, TextInput);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 398, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '标签',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    TextInput.create({ placeholder: '多个标签用逗号分隔', text: { value: this.tags, changeEvent: newValue => { this.tags = newValue; } } });
                                    TextInput.height(48);
                                    TextInput.backgroundColor('#F5F5F5');
                                    TextInput.borderRadius(8);
                                }, TextInput);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '标签'
                    });
                }
            }, { name: "FormItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 备注
                    FormItem(this, {
                        label: '备注',
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextArea.create({ placeholder: '额外信息...', text: { value: this.notes, changeEvent: newValue => { this.notes = newValue; } } });
                                TextArea.height(100);
                                TextArea.backgroundColor('#F5F5F5');
                                TextArea.borderRadius(8);
                            }, TextArea);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordDetailPage.ets", line: 406, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            label: '备注',
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    TextArea.create({ placeholder: '额外信息...', text: { value: this.notes, changeEvent: newValue => { this.notes = newValue; } } });
                                    TextArea.height(100);
                                    TextArea.backgroundColor('#F5F5F5');
                                    TextArea.borderRadius(8);
                                }, TextArea);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        label: '备注'
                    });
                }
            }, { name: "FormItem" });
        }
        Column.pop();
        // 表单内容
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PasswordDetailPage";
    }
}
class FormItem extends ViewPU {
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
    setInitiallyProvidedValue(params: FormItem_Params) {
        if (params.label === undefined) {
            this.__label.set('');
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: FormItem_Params) {
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
            Column.create({ space: 8 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.label);
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.content.bind(this)();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new PasswordDetailPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/password/PasswordDetailPage", pageFullPath: "entry/src/main/ets/pages/password/PasswordDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
