if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PasswordCard_Params {
    item?: PasswordModel;
    isShowPassword?: boolean;
    onTogglePassword?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    decryptedPassword?: string;
}
interface PasswordListPage_Params {
    passwordList?: PasswordModel[];
    searchKeyword?: string;
    selectedCategory?: string;
    isLoading?: boolean;
    showPasswordIds?: Set<number>;
    swipeDeleteId?: number;
    categories?: string[];
    collapsedCategories?: Set<string>;
    groupedMode?: boolean;
    passwordEventId?: number;
}
import { AppConstants, PASSWORD_CATEGORIES } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
import type { PasswordModel } from '../../models/PasswordModel';
import { CryptoUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/CryptoUtil&";
import { ToastUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/ToastUtil&";
import { EventUtil } from "@normalized:N&&&entry/src/main/ets/common/utils/EventUtil&";
import pasteboard from "@ohos:pasteboard";
import preferences from "@ohos:data.preferences";
class PasswordListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__passwordList = new ObservedPropertyObjectPU([], this, "passwordList");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__selectedCategory = new ObservedPropertySimplePU('全部', this, "selectedCategory");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showPasswordIds = new ObservedPropertyObjectPU(new Set(), this, "showPasswordIds");
        this.__swipeDeleteId = new ObservedPropertySimplePU(-1, this, "swipeDeleteId");
        this.__categories = new ObservedPropertyObjectPU(['全部'], this, "categories");
        this.__collapsedCategories = new ObservedPropertyObjectPU(new Set(), this, "collapsedCategories");
        this.__groupedMode = new ObservedPropertySimplePU(true, this, "groupedMode");
        this.passwordEventId = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PasswordListPage_Params) {
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
        if (params.showPasswordIds !== undefined) {
            this.showPasswordIds = params.showPasswordIds;
        }
        if (params.swipeDeleteId !== undefined) {
            this.swipeDeleteId = params.swipeDeleteId;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.collapsedCategories !== undefined) {
            this.collapsedCategories = params.collapsedCategories;
        }
        if (params.groupedMode !== undefined) {
            this.groupedMode = params.groupedMode;
        }
        if (params.passwordEventId !== undefined) {
            this.passwordEventId = params.passwordEventId;
        }
    }
    updateStateVars(params: PasswordListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__passwordList.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showPasswordIds.purgeDependencyOnElmtId(rmElmtId);
        this.__swipeDeleteId.purgeDependencyOnElmtId(rmElmtId);
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
        this.__collapsedCategories.purgeDependencyOnElmtId(rmElmtId);
        this.__groupedMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__passwordList.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__selectedCategory.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showPasswordIds.aboutToBeDeleted();
        this.__swipeDeleteId.aboutToBeDeleted();
        this.__categories.aboutToBeDeleted();
        this.__collapsedCategories.aboutToBeDeleted();
        this.__groupedMode.aboutToBeDeleted();
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
    private __showPasswordIds: ObservedPropertyObjectPU<Set<number>>;
    get showPasswordIds() {
        return this.__showPasswordIds.get();
    }
    set showPasswordIds(newValue: Set<number>) {
        this.__showPasswordIds.set(newValue);
    }
    private __swipeDeleteId: ObservedPropertySimplePU<number>;
    get swipeDeleteId() {
        return this.__swipeDeleteId.get();
    }
    set swipeDeleteId(newValue: number) {
        this.__swipeDeleteId.set(newValue);
    }
    private __categories: ObservedPropertyObjectPU<string[]>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: string[]) {
        this.__categories.set(newValue);
    }
    private __collapsedCategories: ObservedPropertyObjectPU<Set<string>>;
    get collapsedCategories() {
        return this.__collapsedCategories.get();
    }
    set collapsedCategories(newValue: Set<string>) {
        this.__collapsedCategories.set(newValue);
    }
    private __groupedMode: ObservedPropertySimplePU<boolean>;
    get groupedMode() {
        return this.__groupedMode.get();
    }
    set groupedMode(newValue: boolean) {
        this.__groupedMode.set(newValue);
    }
    private passwordEventId: number;
    aboutToAppear() {
        this.categories = ['全部'].concat(PASSWORD_CATEGORIES);
        this.checkAppLock();
        this.loadPasswords();
        this.passwordEventId = EventUtil.onPasswordSaved(() => {
            this.loadPasswords();
        });
    }
    aboutToDisappear() {
        EventUtil.offPasswordSaved(this.passwordEventId);
    }
    onPageShow() {
        this.loadPasswords();
    }
    checkAppLock(): void {
        try {
            const context = this.getUIContext().getHostContext();
            const pref = preferences.getPreferencesSync(context, { name: 'app_prefs' });
            const enabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
            if (enabled) {
                const pin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
                if (pin) {
                    this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_APP_LOCK_VERIFY });
                }
            }
        }
        catch (e) {
            console.error('Check app lock error:', JSON.stringify(e));
        }
    }
    async loadPasswords(): Promise<void> {
        if (this.isLoading) {
            return;
        }
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
    async deletePassword(id: number): Promise<void> {
        await DatabaseManager.getInstance().deletePassword(id);
        this.loadPasswords();
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
                this.scheduleClipboardClear();
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
    toggleShowPassword(id: number): void {
        const newSet = new Set(this.showPasswordIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        }
        else {
            newSet.add(id);
        }
        this.showPasswordIds = newSet;
    }
    toggleCategory(category: string): void {
        const newSet = new Set(this.collapsedCategories);
        if (newSet.has(category)) {
            newSet.delete(category);
        }
        else {
            newSet.add(category);
        }
        this.collapsedCategories = newSet;
    }
    getGroupedPasswords(): Map<string, PasswordModel[]> {
        const groups = new Map<string, PasswordModel[]>();
        for (const pwd of this.passwordList) {
            const cat = pwd.category || '其他';
            if (!groups.has(cat)) {
                groups.set(cat, []);
            }
            const arr = groups.get(cat);
            if (arr) {
                arr.push(pwd);
            }
        }
        return groups;
    }
    getCategoryKeys(): string[] {
        const keys: string[] = [];
        const groups = this.getGroupedPasswords();
        groups.forEach((value, key) => {
            keys.push(key);
        });
        return keys;
    }
    getPasswordsForCategory(category: string): PasswordModel[] {
        const groups = this.getGroupedPasswords();
        return groups.get(category) || [];
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.BottomEnd });
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
            // 顶部搜索栏
            Row.create({ space: 12 });
            // 顶部搜索栏
            Row.width('100%');
            // 顶部搜索栏
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Search.create({ value: this.searchKeyword, placeholder: '搜索平台、账号或标签...' });
            Search.layoutWeight(1);
            Search.height(44);
            Search.backgroundColor('#F5F5F5');
            Search.borderRadius(22);
            Search.onChange((value: string) => {
                this.searchKeyword = value;
                this.groupedMode = (this.selectedCategory === '全部' && !value.trim());
                this.loadPasswords();
            });
        }, Search);
        Search.pop();
        // 顶部搜索栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类筛选
            Row.create({ space: 8 });
            // 分类筛选
            Row.width('100%');
            // 分类筛选
            Row.padding({ left: 16, right: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category);
                    Text.fontSize(13);
                    Text.fontColor(this.selectedCategory === category ? '#FFFFFF' : '#666666');
                    Text.padding({ left: 16, right: 16, top: 6, bottom: 6 });
                    Text.backgroundColor(this.selectedCategory === category ? '#007DFF' : '#F0F0F0');
                    Text.borderRadius(16);
                    Text.onClick(() => {
                        this.selectedCategory = category;
                        this.groupedMode = (category === '全部' && !this.searchKeyword.trim());
                        this.loadPasswords();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, (category: string) => category, false, false);
        }, ForEach);
        ForEach.pop();
        // 分类筛选
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 列表内容
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(48);
                        LoadingProgress.height(48);
                        LoadingProgress.color('#007DFF');
                        LoadingProgress.margin({ top: 100 });
                    }, LoadingProgress);
                });
            }
            else if (this.passwordList.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 16 });
                        Column.margin({ top: 100 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无密码记录');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('添加第一条记录');
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor('#007DFF');
                        Button.onClick(() => {
                            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else if (this.groupedMode && this.selectedCategory === '全部' && !this.searchKeyword.trim()) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分组折叠模式
                        List.create({ space: 8 });
                        // 分组折叠模式
                        List.width('100%');
                        // 分组折叠模式
                        List.layoutWeight(1);
                        // 分组折叠模式
                        List.padding({ left: 16, right: 16 });
                        // 分组折叠模式
                        List.edgeEffect(EdgeEffect.Spring);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const cat = _item;
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
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 分组头部
                                        Row.create();
                                        // 分组头部
                                        Row.width('100%');
                                        // 分组头部
                                        Row.padding({ left: 16, right: 16, top: 10, bottom: 10 });
                                        // 分组头部
                                        Row.backgroundColor('#F8F8F8');
                                        // 分组头部
                                        Row.borderRadius(8);
                                        // 分组头部
                                        Row.onClick(() => {
                                            this.toggleCategory(cat);
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(cat);
                                        Text.fontSize(14);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.fontColor('#333333');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${this.getPasswordsForCategory(cat).length}`);
                                        Text.fontSize(12);
                                        Text.fontColor('#999999');
                                        Text.margin({ left: 8 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Blank.create();
                                    }, Blank);
                                    Blank.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(this.collapsedCategories.has(cat) ? '▶' : '▼');
                                        Text.fontSize(12);
                                        Text.fontColor('#999999');
                                    }, Text);
                                    Text.pop();
                                    // 分组头部
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        // 分组内容
                                        if (!this.collapsedCategories.has(cat)) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Column.create({ space: 12 });
                                                    Column.padding({ top: 8 });
                                                }, Column);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    ForEach.create();
                                                    const forEachItemGenFunction = _item => {
                                                        const item = _item;
                                                        {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                if (isInitialRender) {
                                                                    let componentCall = new PasswordCard(this, {
                                                                        item: item,
                                                                        isShowPassword: this.showPasswordIds.has(item.id),
                                                                        onTogglePassword: (): void => { this.toggleShowPassword(item.id); },
                                                                        onEdit: (): void => {
                                                                            this.getUIContext().getRouter().pushUrl({
                                                                                url: AppConstants.PAGE_PASSWORD_DETAIL,
                                                                                params: { id: item.id }
                                                                            });
                                                                        },
                                                                        onDelete: (): void => { this.deletePassword(item.id); },
                                                                        onCopy: (): void => { this.copyPassword(item.password); }
                                                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordListPage.ets", line: 261, col: 25 });
                                                                    ViewPU.create(componentCall);
                                                                    let paramsLambda = () => {
                                                                        return {
                                                                            item: item,
                                                                            isShowPassword: this.showPasswordIds.has(item.id),
                                                                            onTogglePassword: (): void => { this.toggleShowPassword(item.id); },
                                                                            onEdit: (): void => {
                                                                                this.getUIContext().getRouter().pushUrl({
                                                                                    url: AppConstants.PAGE_PASSWORD_DETAIL,
                                                                                    params: { id: item.id }
                                                                                });
                                                                            },
                                                                            onDelete: (): void => { this.deletePassword(item.id); },
                                                                            onCopy: (): void => { this.copyPassword(item.password); }
                                                                        };
                                                                    };
                                                                    componentCall.paramsGenerator_ = paramsLambda;
                                                                }
                                                                else {
                                                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                                                        item: item,
                                                                        isShowPassword: this.showPasswordIds.has(item.id)
                                                                    });
                                                                }
                                                            }, { name: "PasswordCard" });
                                                        }
                                                    };
                                                    this.forEachUpdateFunction(elmtId, this.getPasswordsForCategory(cat), forEachItemGenFunction, (item: PasswordModel) => item.id.toString() + '_' + item.updateTime, false, false);
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
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.getCategoryKeys(), forEachItemGenFunction, (cat: string) => cat, false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 分组折叠模式
                    List.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
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
                                                let componentCall = new PasswordCard(this, {
                                                    item: item,
                                                    isShowPassword: this.showPasswordIds.has(item.id),
                                                    onTogglePassword: (): void => { this.toggleShowPassword(item.id); },
                                                    onEdit: (): void => {
                                                        this.getUIContext().getRouter().pushUrl({
                                                            url: AppConstants.PAGE_PASSWORD_DETAIL,
                                                            params: { id: item.id }
                                                        });
                                                    },
                                                    onDelete: (): void => { this.deletePassword(item.id); },
                                                    onCopy: (): void => { this.copyPassword(item.password); }
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/password/PasswordListPage.ets", line: 290, col: 17 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        item: item,
                                                        isShowPassword: this.showPasswordIds.has(item.id),
                                                        onTogglePassword: (): void => { this.toggleShowPassword(item.id); },
                                                        onEdit: (): void => {
                                                            this.getUIContext().getRouter().pushUrl({
                                                                url: AppConstants.PAGE_PASSWORD_DETAIL,
                                                                params: { id: item.id }
                                                            });
                                                        },
                                                        onDelete: (): void => { this.deletePassword(item.id); },
                                                        onCopy: (): void => { this.copyPassword(item.password); }
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    item: item,
                                                    isShowPassword: this.showPasswordIds.has(item.id)
                                                });
                                            }
                                        }, { name: "PasswordCard" });
                                    }
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 右下角浮动添加按钮（列表有数据时显示）
            if (this.passwordList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(56);
                        Button.height(56);
                        Button.backgroundColor('#007DFF');
                        Button.type(ButtonType.Circle);
                        Button.margin({ right: 24, bottom: 24 });
                        Button.shadow({ radius: 8, color: 'rgba(0,0,0,0.2)' });
                        Button.onClick(() => {
                            this.getUIContext().getRouter().pushUrl({ url: AppConstants.PAGE_PASSWORD_DETAIL });
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('+');
                        Text.fontSize(32);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Button.pop();
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
                    this.deletePassword(this.swipeDeleteId);
                    this.swipeDeleteId = -1;
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
        return "PasswordListPage";
    }
}
class PasswordCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__item = new SynchedPropertyObjectOneWayPU(params.item, this, "item");
        this.__isShowPassword = new SynchedPropertySimpleOneWayPU(params.isShowPassword, this, "isShowPassword");
        this.onTogglePassword = () => { };
        this.onEdit = () => { };
        this.onDelete = () => { };
        this.onCopy = () => { };
        this.__decryptedPassword = new ObservedPropertySimplePU('', this, "decryptedPassword");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PasswordCard_Params) {
        if (params.onTogglePassword !== undefined) {
            this.onTogglePassword = params.onTogglePassword;
        }
        if (params.onEdit !== undefined) {
            this.onEdit = params.onEdit;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
        if (params.onCopy !== undefined) {
            this.onCopy = params.onCopy;
        }
        if (params.decryptedPassword !== undefined) {
            this.decryptedPassword = params.decryptedPassword;
        }
    }
    updateStateVars(params: PasswordCard_Params) {
        this.__item.reset(params.item);
        this.__isShowPassword.reset(params.isShowPassword);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__item.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__decryptedPassword.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__item.aboutToBeDeleted();
        this.__isShowPassword.aboutToBeDeleted();
        this.__decryptedPassword.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __item: SynchedPropertySimpleOneWayPU<PasswordModel>;
    get item() {
        return this.__item.get();
    }
    set item(newValue: PasswordModel) {
        this.__item.set(newValue);
    }
    private __isShowPassword: SynchedPropertySimpleOneWayPU<boolean>;
    get isShowPassword() {
        return this.__isShowPassword.get();
    }
    set isShowPassword(newValue: boolean) {
        this.__isShowPassword.set(newValue);
    }
    private onTogglePassword: () => void;
    private onEdit: () => void;
    private onDelete: () => void;
    private onCopy: () => void;
    private __decryptedPassword: ObservedPropertySimplePU<string>;
    get decryptedPassword() {
        return this.__decryptedPassword.get();
    }
    set decryptedPassword(newValue: string) {
        this.__decryptedPassword.set(newValue);
    }
    async aboutToAppear() {
        if (this.item.password) {
            this.decryptedPassword = await CryptoUtil.decrypt(this.item.password);
        }
    }
    getCategoryColor(): string {
        switch (this.item.category) {
            case '工作': return '#007DFF';
            case '社交': return '#00C853';
            case '金融': return '#FF6B00';
            default: return '#9E9E9E';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(12);
            Column.shadow({ radius: 4, color: '#0D000000', offsetY: 2 });
            Column.onClick(() => {
                this.onEdit();
            });
            globalThis.Gesture.create(GesturePriority.Low);
            LongPressGesture.create({ repeat: false });
            LongPressGesture.onAction(() => {
                this.onCopy();
            });
            LongPressGesture.pop();
            globalThis.Gesture.pop();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧：平台图标和名称
            Row.create({ space: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.item.platform.substring(0, 1));
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.width(44);
            Text.height(44);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(this.getCategoryColor());
            Text.borderRadius(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.item.platform);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.item.account);
            Text.fontSize(13);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Column.pop();
        // 左侧：平台图标和名称
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧：分类标签
            Text.create(this.item.category);
            // 右侧：分类标签
            Text.fontSize(11);
            // 右侧：分类标签
            Text.fontColor(this.getCategoryColor());
            // 右侧：分类标签
            Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
            // 右侧：分类标签
            Text.backgroundColor(`${this.getCategoryColor()}15`);
            // 右侧：分类标签
            Text.borderRadius(8);
        }, Text);
        // 右侧：分类标签
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 密码显示区域
            if (this.decryptedPassword) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                        Row.padding({ top: 8 });
                        Row.border({ width: { top: 1 }, color: '#F0F0F0' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.isShowPassword ? this.decryptedPassword : '••••••••');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.fontFamily('monospace');
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(44);
                        Button.height(44);
                        Button.type(ButtonType.Circle);
                        Button.backgroundColor('transparent');
                        Button.onClick(() => {
                            this.onTogglePassword();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Shape.create();
                        Shape.width(24);
                        Shape.height(24);
                    }, Shape);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Path.create();
                        Path.width(24);
                        Path.height(24);
                        Path.commands('M2 10 Q10 4 18 10 Q10 16 2 10 Z M10 7 A3 3 0 1 0 10 13 A3 3 0 1 0 10 7');
                        Path.stroke('#999999');
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
                        Button.backgroundColor('transparent');
                        Button.onClick(() => {
                            this.onCopy();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Shape.create();
                        Shape.width(24);
                        Shape.height(24);
                    }, Shape);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Path.create();
                        Path.width(24);
                        Path.height(24);
                        Path.commands('M6 4 L16 4 L16 14 M4 6 L14 6 L14 20 L4 20 Z');
                        Path.stroke('#999999');
                        Path.strokeWidth(1.5);
                        Path.fill('none');
                    }, Path);
                    Shape.pop();
                    Button.pop();
                    Row.pop();
                });
            }
            // 标签和备注
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 标签和备注
            if (this.item.tags || this.item.notes) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.item.tags) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const tag = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(tag.trim());
                                            Text.fontSize(11);
                                            Text.fontColor('#007DFF');
                                            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                            Text.backgroundColor('#E3F2FD');
                                            Text.borderRadius(6);
                                        }, Text);
                                        Text.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.item.tags.split(',').filter((t: string): boolean => t.trim() !== ''), forEachItemGenFunction, (tag: string) => tag, false, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
registerNamedRoute(() => new PasswordListPage(undefined, {}), "", { bundleName: "com.gyhgt.tools", moduleName: "entry", pagePath: "pages/password/PasswordListPage", pageFullPath: "entry/src/main/ets/pages/password/PasswordListPage", integratedHsp: "false", moduleType: "followWithHap" });
