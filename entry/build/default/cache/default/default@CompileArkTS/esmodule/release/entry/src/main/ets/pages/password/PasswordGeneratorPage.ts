if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PasswordGeneratorPage_Params {
    config?: PasswordGeneratorConfig;
    generatedPassword?: string;
    historyList?: string[];
}
import { CryptoUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/CryptoUtil&";
import { PasswordGeneratorConfig } from "@normalized:N&&&entry/src/main/ets/models/PasswordModel&";
import pasteboard from "@ohos:pasteboard";
class PasswordGeneratorPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__config = new ObservedPropertyObjectPU(new PasswordGeneratorConfig(), this, "config");
        this.__generatedPassword = new ObservedPropertySimplePU('', this, "generatedPassword");
        this.__historyList = new ObservedPropertyObjectPU([], this, "historyList");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PasswordGeneratorPage_Params) {
        if (params.config !== undefined) {
            this.config = params.config;
        }
        if (params.generatedPassword !== undefined) {
            this.generatedPassword = params.generatedPassword;
        }
        if (params.historyList !== undefined) {
            this.historyList = params.historyList;
        }
    }
    updateStateVars(params: PasswordGeneratorPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__config.purgeDependencyOnElmtId(rmElmtId);
        this.__generatedPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__historyList.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__config.aboutToBeDeleted();
        this.__generatedPassword.aboutToBeDeleted();
        this.__historyList.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __config: ObservedPropertyObjectPU<PasswordGeneratorConfig>;
    get config() {
        return this.__config.get();
    }
    set config(newValue: PasswordGeneratorConfig) {
        this.__config.set(newValue);
    }
    private __generatedPassword: ObservedPropertySimplePU<string>;
    get generatedPassword() {
        return this.__generatedPassword.get();
    }
    set generatedPassword(newValue: string) {
        this.__generatedPassword.set(newValue);
    }
    private __historyList: ObservedPropertyObjectPU<string[]>;
    get historyList() {
        return this.__historyList.get();
    }
    set historyList(newValue: string[]) {
        this.__historyList.set(newValue);
    }
    aboutToAppear() {
        this.generatePassword();
    }
    generatePassword() {
        this.generatedPassword = CryptoUtil.generateRandomPassword(this.config.length, this.config.includeNumbers, this.config.includeLowercase, this.config.includeUppercase, this.config.includeSpecial, this.config.excludeAmbiguous);
        // 添加到历史
        if (this.generatedPassword && !this.historyList.includes(this.generatedPassword)) {
            this.historyList = [this.generatedPassword].concat(this.historyList).slice(0, 10);
        }
    }
    async copyToClipboard(text: string) {
        try {
            const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
            const systemPasteboard = pasteboard.getSystemPasteboard();
            await systemPasteboard.setData(pasteData);
        }
        catch (e) {
            console.error('Copy to clipboard error:', JSON.stringify(e));
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
            Text.create('密码生成器');
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
            Column.create({ space: 20 });
            Column.width('100%');
            Column.padding({ left: 16, right: 16, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 生成的密码展示
            Column.create({ space: 16 });
            // 生成的密码展示
            Column.width('100%');
            // 生成的密码展示
            Column.padding(24);
            // 生成的密码展示
            Column.backgroundColor('#FFFFFF');
            // 生成的密码展示
            Column.borderRadius(16);
            // 生成的密码展示
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.generatedPassword);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.fontFamily('monospace');
            Text.textAlign(TextAlign.Center);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('重新生成');
            Button.fontSize(14);
            Button.fontColor('#007DFF');
            Button.backgroundColor('#E3F2FD');
            Button.height(40);
            Button.borderRadius(20);
            Button.onClick(() => {
                this.generatePassword();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('复制');
            Button.fontSize(14);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor('#007DFF');
            Button.height(40);
            Button.borderRadius(20);
            Button.onClick(() => {
                this.copyToClipboard(this.generatedPassword);
            });
        }, Button);
        Button.pop();
        Row.pop();
        // 生成的密码展示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 配置选项
            Column.create({ space: 16 });
            // 配置选项
            Column.width('100%');
            // 配置选项
            Column.padding(20);
            // 配置选项
            Column.backgroundColor('#FFFFFF');
            // 配置选项
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('生成规则');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 长度滑块
            Row.create();
            // 长度滑块
            Row.width('100%');
            // 长度滑块
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码长度');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.config.length}`);
            Text.fontSize(14);
            Text.fontColor('#007DFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 长度滑块
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.config.length,
                min: 4,
                max: 64,
                step: 1
            });
            Slider.width('100%');
            Slider.selectedColor('#007DFF');
            Slider.onChange((value: number) => {
                this.config.length = Math.floor(value);
                this.generatePassword();
            });
        }, Slider);
        // 选项设置
        ToggleOption.bind(this)('包含数字', this.config.includeNumbers, (value) => {
            let c = this.config.copy();
            c.includeNumbers = value;
            this.config = c;
            this.generatePassword();
        });
        ToggleOption.bind(this)('包含小写字母', this.config.includeLowercase, (value) => {
            let c = this.config.copy();
            c.includeLowercase = value;
            this.config = c;
            this.generatePassword();
        });
        ToggleOption.bind(this)('包含大写字母', this.config.includeUppercase, (value) => {
            let c = this.config.copy();
            c.includeUppercase = value;
            this.config = c;
            this.generatePassword();
        });
        ToggleOption.bind(this)('包含特殊字符', this.config.includeSpecial, (value) => {
            let c = this.config.copy();
            c.includeSpecial = value;
            this.config = c;
            this.generatePassword();
        });
        ToggleOption.bind(this)('排除易混字符', this.config.excludeAmbiguous, (value) => {
            let c = this.config.copy();
            c.excludeAmbiguous = value;
            this.config = c;
            this.generatePassword();
        });
        // 配置选项
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 历史记录
            if (this.historyList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.width('100%');
                        Column.padding(20);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('历史记录');
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
                        Text.create('清除');
                        Text.fontSize(13);
                        Text.fontColor('#FF4444');
                        Text.onClick(() => {
                            this.historyList = [];
                        });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const pwd = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 8 });
                                Row.width('100%');
                                Row.height(44);
                                Row.padding({ left: 12, right: 12 });
                                Row.backgroundColor('#F8F8F8');
                                Row.borderRadius(8);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(pwd);
                                Text.fontSize(14);
                                Text.fontColor('#666666');
                                Text.fontFamily('monospace');
                                Text.layoutWeight(1);
                                Text.maxLines(1);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithChild();
                                Button.width(32);
                                Button.height(32);
                                Button.type(ButtonType.Circle);
                                Button.backgroundColor('transparent');
                                Button.onClick(() => {
                                    this.copyToClipboard(pwd);
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
                                Path.commands('M5 3 L13 3 L13 11 M3 5 L13 5 L13 15 L3 15 Z');
                                Path.stroke('#999999');
                                Path.strokeWidth(1.2);
                                Path.fill('none');
                            }, Path);
                            Shape.pop();
                            Button.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.historyList, forEachItemGenFunction, (pwd: string, index: number) => index.toString(), true, true);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
        return "PasswordGeneratorPage";
    }
}
function ToggleOption(label: string, isOn: boolean, onChange: (value: boolean) => void, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Row.create();
        Row.width('100%');
        Row.height(44);
        Row.justifyContent(FlexAlign.SpaceBetween);
    }, Row);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(label);
        Text.fontSize(14);
        Text.fontColor('#666666');
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
registerNamedRoute(() => new PasswordGeneratorPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/password/PasswordGeneratorPage", pageFullPath: "entry/src/main/ets/pages/password/PasswordGeneratorPage", integratedHsp: "false", moduleType: "followWithHap" });
