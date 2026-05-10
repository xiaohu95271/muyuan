if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FormItem_Params {
    label?: string;
    content?: () => void;
}
interface WeightDetailPage_Params {
    weightId?: number;
    date?: number;
    time?: number;
    weight?: string;
    bodyFatRate?: string;
    notes?: string;
    isEdit?: boolean;
    userHeight?: number;
    bmiPreview?: number;
    isEditingHeight?: boolean;
    tempHeight?: string;
    useKg?: boolean;
    isShowDatePicker?: boolean;
    isShowTimePicker?: boolean;
    weightController?: TextInputController;
}
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import { WeightModel, WeightGoal } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
import { DateUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtil&";
import { ToastUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/ToastUtil&";
import { EventUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/EventUtil&";
import preferences from "@ohos:data.preferences";
interface DatePickerResult {
    year: number;
    month: number;
    day: number;
}
interface TimePickerResult {
    hour: number;
    minute: number;
}
class WeightDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__weightId = new ObservedPropertySimplePU(-1, this, "weightId");
        this.__date = new ObservedPropertySimplePU(DateUtil.getTodayStart(), this, "date");
        this.__time = new ObservedPropertySimplePU(Date.now(), this, "time");
        this.__weight = new ObservedPropertySimplePU('', this, "weight");
        this.__bodyFatRate = new ObservedPropertySimplePU('', this, "bodyFatRate");
        this.__notes = new ObservedPropertySimplePU('', this, "notes");
        this.__isEdit = new ObservedPropertySimplePU(false, this, "isEdit");
        this.__userHeight = new ObservedPropertySimplePU(0, this, "userHeight");
        this.__bmiPreview = new ObservedPropertySimplePU(0, this, "bmiPreview");
        this.__isEditingHeight = new ObservedPropertySimplePU(false, this, "isEditingHeight");
        this.__tempHeight = new ObservedPropertySimplePU('', this, "tempHeight");
        this.__useKg = new ObservedPropertySimplePU(true, this, "useKg");
        this.__isShowDatePicker = new ObservedPropertySimplePU(false, this, "isShowDatePicker");
        this.__isShowTimePicker = new ObservedPropertySimplePU(false, this, "isShowTimePicker");
        this.weightController = new TextInputController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeightDetailPage_Params) {
        if (params.weightId !== undefined) {
            this.weightId = params.weightId;
        }
        if (params.date !== undefined) {
            this.date = params.date;
        }
        if (params.time !== undefined) {
            this.time = params.time;
        }
        if (params.weight !== undefined) {
            this.weight = params.weight;
        }
        if (params.bodyFatRate !== undefined) {
            this.bodyFatRate = params.bodyFatRate;
        }
        if (params.notes !== undefined) {
            this.notes = params.notes;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
        if (params.userHeight !== undefined) {
            this.userHeight = params.userHeight;
        }
        if (params.bmiPreview !== undefined) {
            this.bmiPreview = params.bmiPreview;
        }
        if (params.isEditingHeight !== undefined) {
            this.isEditingHeight = params.isEditingHeight;
        }
        if (params.tempHeight !== undefined) {
            this.tempHeight = params.tempHeight;
        }
        if (params.useKg !== undefined) {
            this.useKg = params.useKg;
        }
        if (params.isShowDatePicker !== undefined) {
            this.isShowDatePicker = params.isShowDatePicker;
        }
        if (params.isShowTimePicker !== undefined) {
            this.isShowTimePicker = params.isShowTimePicker;
        }
        if (params.weightController !== undefined) {
            this.weightController = params.weightController;
        }
    }
    updateStateVars(params: WeightDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__weightId.purgeDependencyOnElmtId(rmElmtId);
        this.__date.purgeDependencyOnElmtId(rmElmtId);
        this.__time.purgeDependencyOnElmtId(rmElmtId);
        this.__weight.purgeDependencyOnElmtId(rmElmtId);
        this.__bodyFatRate.purgeDependencyOnElmtId(rmElmtId);
        this.__notes.purgeDependencyOnElmtId(rmElmtId);
        this.__isEdit.purgeDependencyOnElmtId(rmElmtId);
        this.__userHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__bmiPreview.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditingHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__tempHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__useKg.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowDatePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowTimePicker.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__weightId.aboutToBeDeleted();
        this.__date.aboutToBeDeleted();
        this.__time.aboutToBeDeleted();
        this.__weight.aboutToBeDeleted();
        this.__bodyFatRate.aboutToBeDeleted();
        this.__notes.aboutToBeDeleted();
        this.__isEdit.aboutToBeDeleted();
        this.__userHeight.aboutToBeDeleted();
        this.__bmiPreview.aboutToBeDeleted();
        this.__isEditingHeight.aboutToBeDeleted();
        this.__tempHeight.aboutToBeDeleted();
        this.__useKg.aboutToBeDeleted();
        this.__isShowDatePicker.aboutToBeDeleted();
        this.__isShowTimePicker.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __weightId: ObservedPropertySimplePU<number>;
    get weightId() {
        return this.__weightId.get();
    }
    set weightId(newValue: number) {
        this.__weightId.set(newValue);
    }
    private __date: ObservedPropertySimplePU<number>;
    get date() {
        return this.__date.get();
    }
    set date(newValue: number) {
        this.__date.set(newValue);
    }
    private __time: ObservedPropertySimplePU<number>;
    get time() {
        return this.__time.get();
    }
    set time(newValue: number) {
        this.__time.set(newValue);
    }
    private __weight: ObservedPropertySimplePU<string>;
    get weight() {
        return this.__weight.get();
    }
    set weight(newValue: string) {
        this.__weight.set(newValue);
    }
    private __bodyFatRate: ObservedPropertySimplePU<string>;
    get bodyFatRate() {
        return this.__bodyFatRate.get();
    }
    set bodyFatRate(newValue: string) {
        this.__bodyFatRate.set(newValue);
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
    private __userHeight: ObservedPropertySimplePU<number>;
    get userHeight() {
        return this.__userHeight.get();
    }
    set userHeight(newValue: number) {
        this.__userHeight.set(newValue);
    }
    private __bmiPreview: ObservedPropertySimplePU<number>;
    get bmiPreview() {
        return this.__bmiPreview.get();
    }
    set bmiPreview(newValue: number) {
        this.__bmiPreview.set(newValue);
    }
    private __isEditingHeight: ObservedPropertySimplePU<boolean>;
    get isEditingHeight() {
        return this.__isEditingHeight.get();
    }
    set isEditingHeight(newValue: boolean) {
        this.__isEditingHeight.set(newValue);
    }
    private __tempHeight: ObservedPropertySimplePU<string>;
    get tempHeight() {
        return this.__tempHeight.get();
    }
    set tempHeight(newValue: string) {
        this.__tempHeight.set(newValue);
    }
    private __useKg: ObservedPropertySimplePU<boolean>;
    get useKg() {
        return this.__useKg.get();
    }
    set useKg(newValue: boolean) {
        this.__useKg.set(newValue);
    }
    private __isShowDatePicker: ObservedPropertySimplePU<boolean>;
    get isShowDatePicker() {
        return this.__isShowDatePicker.get();
    }
    set isShowDatePicker(newValue: boolean) {
        this.__isShowDatePicker.set(newValue);
    }
    private __isShowTimePicker: ObservedPropertySimplePU<boolean>;
    get isShowTimePicker() {
        return this.__isShowTimePicker.get();
    }
    set isShowTimePicker(newValue: boolean) {
        this.__isShowTimePicker.set(newValue);
    }
    private weightController: TextInputController;
    aboutToAppear() {
        this.loadHeight();
        let params = this.getUIContext().getRouter().getParams() as object;
        if (params) {
            let p = params as Record<string, Object>;
            if (p['id'] !== undefined) {
                this.weightId = p['id'] as number;
                this.isEdit = true;
                this.loadWeightDetail();
            }
            else {
                this.updateBMIPreview();
            }
        }
        else {
            this.updateBMIPreview();
        }
    }
    async loadHeight() {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            // 优先从独立键读取身高
            const heightStr = pref.getSync('user_height', '') as string;
            if (heightStr) {
                this.userHeight = parseFloat(heightStr) || 0;
                return;
            }
            // 兼容旧数据
            const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
            if (goalStr) {
                let goal: WeightGoal = JSON.parse(goalStr) as WeightGoal;
                this.userHeight = goal.height || 0;
            }
        }
        catch (e) {
            console.error('Load height error:', JSON.stringify(e));
        }
    }
    async saveHeight() {
        const h = parseFloat(this.tempHeight);
        if (isNaN(h) || h <= 0) {
            ToastUtil.show('请输入有效的身高');
            return;
        }
        this.userHeight = h;
        this.isEditingHeight = false;
        this.updateBMIPreview();
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            // 保存身高到独立键，避免被设置页覆盖
            pref.putSync('user_height', h.toString());
            // 同时更新 WeightGoal 中的身高（兼容旧数据）
            const goalStr = pref.getSync(AppConstants.PREF_WEIGHT_GOAL, '') as string;
            let goal: WeightGoal = goalStr ? JSON.parse(goalStr) as WeightGoal : new WeightGoal();
            goal.height = h;
            pref.putSync(AppConstants.PREF_WEIGHT_GOAL, JSON.stringify(goal));
            await pref.flush();
            ToastUtil.show('身高已保存');
        }
        catch (e) {
            console.error('Save height error:', JSON.stringify(e));
        }
    }
    async loadWeightDetail() {
        if (this.weightId > 0) {
            const all = await DatabaseManager.getInstance().queryAllWeights();
            const found = all.find(w => w.id === this.weightId);
            if (found) {
                this.date = found.date || DateUtil.getTodayStart();
                this.time = found.createTime || Date.now();
                this.weightController.stopEditing();
                this.weight = this.useKg ? found.weight.toFixed(2) : (found.weight * 2).toFixed(2);
                this.bodyFatRate = found.bodyFatRate > 0 ? found.bodyFatRate.toString() : '';
                this.notes = found.notes;
                this.updateBMIPreview();
            }
        }
    }
    toggleUnit() {
        const current = parseFloat(this.weight);
        if (!isNaN(current) && current > 0) {
            if (this.useKg) {
                this.weight = (current * 2).toFixed(2);
            }
            else {
                this.weight = (current / 2).toFixed(2);
            }
            this.weightController.stopEditing();
        }
        this.useKg = !this.useKg;
    }
    adjustWeight(step: number) {
        this.weightController.stopEditing();
        const current = parseFloat(this.weight) || 0;
        let next = current + step;
        if (next < 0)
            next = 0;
        this.weight = next.toFixed(2);
        this.updateBMIPreview();
    }
    formatDisplayDate(): string {
        const d = new Date(this.date);
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    formatDisplayTime(): string {
        const t = new Date(this.time);
        return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    }
    updateBMIPreview() {
        const w = parseFloat(this.weight);
        if (!isNaN(w) && w > 0 && this.userHeight > 0) {
            this.bmiPreview = DateUtil.calculateBMI(w, this.userHeight);
        }
        else {
            this.bmiPreview = 0;
        }
    }
    async saveWeight() {
        const displayWeight = parseFloat(this.weight);
        const kgWeight = this.useKg ? displayWeight : displayWeight / 2;
        if (isNaN(kgWeight) || kgWeight <= 0) {
            ToastUtil.show('请输入有效的体重数值');
            return;
        }
        const bfr = parseFloat(this.bodyFatRate);
        const bmi = DateUtil.calculateBMI(kgWeight, this.userHeight);
        const model = new WeightModel();
        model.id = this.weightId;
        model.date = this.date;
        model.weight = kgWeight;
        model.bmi = bmi;
        model.bodyFatRate = isNaN(bfr) ? 0 : bfr;
        model.notes = this.notes.trim();
        const dateObj = new Date(this.date);
        const timeObj = new Date(this.time);
        model.createTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds()).getTime();
        model.updateTime = Date.now();
        try {
            if (this.isEdit) {
                await DatabaseManager.getInstance().updateWeight(model);
            }
            else {
                const existing = await DatabaseManager.getInstance().queryWeightByDate(this.date);
                if (existing) {
                    model.id = existing.id;
                    await DatabaseManager.getInstance().updateWeight(model);
                    ToastUtil.show('已更新当天记录');
                }
                else {
                    const insertId = await DatabaseManager.getInstance().insertWeight(model);
                    if (insertId > 0) {
                        ToastUtil.show('保存成功');
                    }
                    else {
                        ToastUtil.show('保存失败');
                        return;
                    }
                }
            }
            EventUtil.emitWeightSaved();
            this.getUIContext().getRouter().back();
        }
        catch (e) {
            console.error('Save weight error:', JSON.stringify(e));
            ToastUtil.show('保存出错，请重试');
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
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
            Text.create(this.isEdit ? '编辑记录' : '记录体重');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.fontSize(14);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor('#333333');
            Button.borderRadius(20);
            Button.height(36);
            Button.padding({ left: 20, right: 20 });
            Button.onClick(() => {
                this.saveWeight();
            });
        }, Button);
        Button.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 体重卡片
            Column.create({ space: 16 });
            // 体重卡片
            Column.width('100%');
            // 体重卡片
            Column.backgroundColor('#FFFFFF');
            // 体重卡片
            Column.borderRadius(16);
            // 体重卡片
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体重');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 0 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('公斤');
            Text.fontSize(13);
            Text.fontColor(this.useKg ? '#FFFFFF' : '#666666');
            Text.padding({ left: 12, right: 12, top: 4, bottom: 4 });
            Text.backgroundColor(this.useKg ? '#333333' : '#F0F0F0');
            Text.borderRadius({ topLeft: 12, bottomLeft: 12 });
            Text.onClick(() => {
                if (!this.useKg)
                    this.toggleUnit();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('斤');
            Text.fontSize(13);
            Text.fontColor(this.useKg ? '#666666' : '#FFFFFF');
            Text.padding({ left: 12, right: 12, top: 4, bottom: 4 });
            Text.backgroundColor(this.useKg ? '#F0F0F0' : '#333333');
            Text.borderRadius({ topRight: 12, bottomRight: 12 });
            Text.onClick(() => {
                if (this.useKg)
                    this.toggleUnit();
            });
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '0', text: this.weight, controller: this.weightController });
            TextInput.type(InputType.Normal);
            TextInput.fontSize(56);
            TextInput.fontWeight(FontWeight.Bold);
            TextInput.fontColor('#333333');
            TextInput.textAlign(TextAlign.Center);
            TextInput.width('100%');
            TextInput.height(80);
            TextInput.backgroundColor('transparent');
            TextInput.inputFilter('[0-9.]');
            TextInput.onChange((value: string) => {
                // 只允许数字和小数点，并确保最多一个小数点
                let filtered = value.replace(/[^0-9.]/g, '');
                const parts = filtered.split('.');
                if (parts.length > 2) {
                    filtered = parts[0] + '.' + parts.slice(1).join('');
                }
                this.weight = filtered;
                this.updateBMIPreview();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const step = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(step > 0 ? `+${step}` : `${step}`);
                    Button.fontSize(12);
                    Button.fontColor(step > 0 ? '#FF6B6B' : '#4CAF50');
                    Button.backgroundColor(step > 0 ? '#FFF0F0' : '#F0FFF0');
                    Button.height(32);
                    Button.padding({ left: 8, right: 8 });
                    Button.borderRadius(16);
                    Button.onClick(() => {
                        this.adjustWeight(step);
                    });
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, [-1, -0.5, -0.1, 0.1, 0.5, 1], forEachItemGenFunction, (step: number) => step.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 体重卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期时间卡片
            Row.create({ space: 16 });
            // 日期时间卡片
            Row.width('100%');
            // 日期时间卡片
            Row.backgroundColor('#FFFFFF');
            // 日期时间卡片
            Row.borderRadius(16);
            // 日期时间卡片
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.layoutWeight(2);
            Column.onClick(() => {
                this.isShowDatePicker = true;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('测量日期');
            Text.fontSize(13);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatDisplayDate());
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.padding({ left: 16, right: 16, top: 10, bottom: 10 });
            Text.backgroundColor('#F5F5F5');
            Text.borderRadius(8);
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.layoutWeight(1);
            Column.onClick(() => {
                this.isShowTimePicker = true;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('测量时间');
            Text.fontSize(13);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatDisplayTime());
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.maxLines(1);
            Text.padding({ left: 16, right: 16, top: 10, bottom: 10 });
            Text.backgroundColor('#F5F5F5');
            Text.borderRadius(8);
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
        // 日期时间卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 体脂率
            Column.create({ space: 8 });
            // 体脂率
            Column.width('100%');
            // 体脂率
            Column.backgroundColor('#FFFFFF');
            // 体脂率
            Column.borderRadius(16);
            // 体脂率
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体脂率 %（可选）');
            Text.fontSize(14);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '例如 22.5', text: { value: this.bodyFatRate, changeEvent: newValue => { this.bodyFatRate = newValue; } } });
            TextInput.type(InputType.Number);
            TextInput.height(48);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 16 });
        }, TextInput);
        // 体脂率
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 备注
            Column.create({ space: 8 });
            // 备注
            Column.width('100%');
            // 备注
            Column.backgroundColor('#FFFFFF');
            // 备注
            Column.borderRadius(16);
            // 备注
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('备注');
            Text.fontSize(14);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '例如 晨起空腹', text: { value: this.notes, changeEvent: newValue => { this.notes = newValue; } } });
            TextInput.height(48);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 16 });
        }, TextInput);
        // 备注
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // BMI 预览
            if (this.bmiPreview > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor(`${DateUtil.getBMIColor(this.bmiPreview)}10`);
                        Row.borderRadius(16);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`BMI: ${this.bmiPreview.toFixed(1)}`);
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(DateUtil.getBMIColor(this.bmiPreview));
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(DateUtil.getBMICategory(this.bmiPreview));
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 身高
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 身高
            if (this.isEditingHeight) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.width('100%');
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                        Column.padding(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请输入身高（cm）');
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '例如 170', text: { value: this.tempHeight, changeEvent: newValue => { this.tempHeight = newValue; } } });
                        TextInput.type(InputType.Number);
                        TextInput.height(48);
                        TextInput.backgroundColor('#F5F5F5');
                        TextInput.borderRadius(8);
                        TextInput.padding({ left: 16 });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 12 });
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.End);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(14);
                        Button.fontColor('#666666');
                        Button.backgroundColor('#F0F0F0');
                        Button.height(40);
                        Button.padding({ left: 20, right: 20 });
                        Button.borderRadius(8);
                        Button.onClick(() => {
                            this.isEditingHeight = false;
                            this.tempHeight = '';
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.fontSize(14);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#333333');
                        Button.height(40);
                        Button.padding({ left: 20, right: 20 });
                        Button.borderRadius(8);
                        Button.onClick(async () => {
                            await this.saveHeight();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.backgroundColor('#FFFFFF');
                        Row.borderRadius(16);
                        Row.padding(16);
                        Row.onClick(() => {
                            this.tempHeight = this.userHeight > 0 ? this.userHeight.toString() : '';
                            this.isEditingHeight = true;
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                        Column.alignItems(HorizontalAlign.Start);
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('身高');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#333333');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('用于计算 BMI');
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.userHeight > 0 ? `${this.userHeight} cm` : '点击输入');
                        Text.fontSize(16);
                        Text.fontColor(this.userHeight > 0 ? '#666666' : '#007DFF');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 日期选择器弹窗
            if (this.isShowDatePicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 16 });
                        Column.width('100%');
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                        Column.padding(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        DatePicker.create({
                            start: new Date('1970-1-1'),
                            end: new Date('2100-12-31'),
                            selected: new Date(this.date)
                        });
                        DatePicker.onDateChange((value: Date) => {
                            this.date = value.getTime();
                        });
                    }, DatePicker);
                    DatePicker.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.width('100%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#333333');
                        Button.borderRadius(12);
                        Button.onClick(() => {
                            this.isShowDatePicker = false;
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            // 时间选择器弹窗
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 时间选择器弹窗
            if (this.isShowTimePicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 16 });
                        Column.width('100%');
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                        Column.padding(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TimePicker.create({
                            selected: new Date(this.time)
                        });
                        TimePicker.onChange((value: TimePickerResult) => {
                            this.time = new Date(1970, 0, 1, value.hour, value.minute).getTime();
                        });
                    }, TimePicker);
                    TimePicker.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.width('100%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#333333');
                        Button.borderRadius(12);
                        Button.onClick(() => {
                            this.isShowTimePicker = false;
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WeightDetailPage";
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
registerNamedRoute(() => new WeightDetailPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/weight/WeightDetailPage", pageFullPath: "entry/src/main/ets/pages/weight/WeightDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
