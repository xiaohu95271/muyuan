import relationalStore from "@ohos:data.relationalStore";
import type { ValuesBucket } from "@ohos:data.ValuesBucket";
import type { Context } from "@ohos:abilityAccessCtrl";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { PasswordModel } from "@normalized:N&&&entry/src/main/ets/models/PasswordModel&";
import { WeightModel } from "@normalized:N&&&entry/src/main/ets/models/WeightModel&";
interface ExportData {
    passwords: PasswordModel[];
    weights: WeightModel[];
    exportTime: number;
}
/**
 * 数据库表名
 */
const TABLE_PASSWORD = 'password_table';
const TABLE_WEIGHT = 'weight_table';
/**
 * 数据库管理单例类
 */
export class DatabaseManager {
    private static instance: DatabaseManager;
    private rdbStore: relationalStore.RdbStore | null = null;
    private initPromise: Promise<void> | null = null;
    static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    /**
     * 初始化数据库
     */
    async init(context: Context): Promise<void> {
        if (this.rdbStore) {
            return;
        }
        if (this.initPromise) {
            return this.initPromise;
        }
        this.initPromise = this.doInit(context);
        return this.initPromise;
    }
    private async doInit(context: Context): Promise<void> {
        try {
            const config: relationalStore.StoreConfig = {
                name: AppConstants.DB_NAME,
                securityLevel: relationalStore.SecurityLevel.S3, // 加密存储
            };
            this.rdbStore = await relationalStore.getRdbStore(context, config);
            await this.createTables();
        }
        catch (err) {
            console.error('Database init error:', JSON.stringify(err));
        }
    }
    /**
     * 创建数据表
     */
    private async createTables(): Promise<void> {
        if (!this.rdbStore) {
            return;
        }
        try {
            // 密码记录表
            const passwordTableSql = `
        CREATE TABLE IF NOT EXISTS ${TABLE_PASSWORD} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          platform TEXT NOT NULL,
          account TEXT NOT NULL,
          password TEXT NOT NULL,
          category TEXT DEFAULT '其他',
          website TEXT DEFAULT '',
          tags TEXT DEFAULT '',
          notes TEXT DEFAULT '',
          createTime INTEGER DEFAULT 0,
          updateTime INTEGER DEFAULT 0
        )
      `;
            // 体重记录表
            const weightTableSql = `
        CREATE TABLE IF NOT EXISTS ${TABLE_WEIGHT} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date INTEGER NOT NULL UNIQUE,
          weight REAL NOT NULL,
          bmi REAL DEFAULT 0,
          bodyFatRate REAL DEFAULT 0,
          notes TEXT DEFAULT '',
          createTime INTEGER DEFAULT 0,
          updateTime INTEGER DEFAULT 0
        )
      `;
            await this.rdbStore.executeSql(passwordTableSql);
            await this.rdbStore.executeSql(weightTableSql);
        }
        catch (err) {
            console.error('Create tables error:', JSON.stringify(err));
        }
    }
    // ==================== 密码记录操作 ====================
    /**
     * 插入密码记录
     */
    async insertPassword(model: PasswordModel): Promise<number> {
        if (!this.rdbStore) {
            return -1;
        }
        try {
            const now = Date.now();
            const values: ValuesBucket = {
                platform: model.platform,
                account: model.account,
                password: model.password,
                category: model.category,
                website: model.website,
                tags: model.tags,
                notes: model.notes,
                createTime: now,
                updateTime: now,
            };
            return await this.rdbStore.insert(TABLE_PASSWORD, values);
        }
        catch (err) {
            console.error('Insert password error:', JSON.stringify(err));
            return -1;
        }
    }
    /**
     * 更新密码记录
     */
    async updatePassword(model: PasswordModel): Promise<number> {
        if (!this.rdbStore) {
            return -1;
        }
        try {
            const now = Date.now();
            const values: ValuesBucket = {
                platform: model.platform,
                account: model.account,
                password: model.password,
                category: model.category,
                website: model.website,
                tags: model.tags,
                notes: model.notes,
                updateTime: now,
            };
            const predicates = new relationalStore.RdbPredicates(TABLE_PASSWORD);
            predicates.equalTo('id', model.id);
            return await this.rdbStore.update(values, predicates);
        }
        catch (err) {
            console.error('Update password error:', JSON.stringify(err));
            return -1;
        }
    }
    /**
     * 删除密码记录
     */
    async deletePassword(id: number): Promise<number> {
        if (!this.rdbStore) {
            return -1;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_PASSWORD);
            predicates.equalTo('id', id);
            return await this.rdbStore.delete(predicates);
        }
        catch (err) {
            console.error('Delete password error:', JSON.stringify(err));
            return -1;
        }
    }
    /**
     * 查询所有密码记录
     */
    async queryAllPasswords(): Promise<PasswordModel[]> {
        if (!this.rdbStore) {
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_PASSWORD);
            predicates.orderByDesc('updateTime');
            const resultSet = await this.rdbStore.query(predicates);
            return this.parsePasswordResultSet(resultSet);
        }
        catch (err) {
            console.error('Query all passwords error:', JSON.stringify(err));
            return [];
        }
    }
    /**
     * 按分类筛选密码
     */
    async queryPasswordsByCategory(category: string): Promise<PasswordModel[]> {
        if (!this.rdbStore) {
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_PASSWORD);
            predicates.equalTo('category', category);
            predicates.orderByDesc('updateTime');
            const resultSet = await this.rdbStore.query(predicates);
            return this.parsePasswordResultSet(resultSet);
        }
        catch (err) {
            console.error('Query passwords by category error:', JSON.stringify(err));
            return [];
        }
    }
    /**
     * 模糊搜索密码记录
     */
    async searchPasswords(keyword: string): Promise<PasswordModel[]> {
        if (!this.rdbStore || !keyword.trim()) {
            return this.queryAllPasswords();
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_PASSWORD);
            const kw = keyword.trim();
            predicates.contains('platform', kw)
                .or()
                .contains('account', kw)
                .or()
                .contains('tags', kw)
                .or()
                .contains('notes', kw);
            predicates.orderByDesc('updateTime');
            const resultSet = await this.rdbStore.query(predicates);
            return this.parsePasswordResultSet(resultSet);
        }
        catch (err) {
            console.error('Search passwords error:', JSON.stringify(err));
            return [];
        }
    }
    /**
     * 根据ID查询密码
     */
    async queryPasswordById(id: number): Promise<PasswordModel | null> {
        if (!this.rdbStore) {
            return null;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_PASSWORD);
            predicates.equalTo('id', id);
            const resultSet = await this.rdbStore.query(predicates);
            const list = this.parsePasswordResultSet(resultSet);
            return list.length > 0 ? list[0] : null;
        }
        catch (err) {
            console.error('Query password by id error:', JSON.stringify(err));
            return null;
        }
    }
    private parsePasswordResultSet(resultSet: relationalStore.ResultSet): PasswordModel[] {
        const list: PasswordModel[] = [];
        try {
            while (resultSet.goToNextRow()) {
                let item = new PasswordModel();
                item.id = resultSet.getLong(resultSet.getColumnIndex('id'));
                item.platform = resultSet.getString(resultSet.getColumnIndex('platform'));
                item.account = resultSet.getString(resultSet.getColumnIndex('account'));
                item.password = resultSet.getString(resultSet.getColumnIndex('password'));
                item.category = resultSet.getString(resultSet.getColumnIndex('category'));
                item.website = resultSet.getString(resultSet.getColumnIndex('website'));
                item.tags = resultSet.getString(resultSet.getColumnIndex('tags'));
                item.notes = resultSet.getString(resultSet.getColumnIndex('notes'));
                item.createTime = resultSet.getLong(resultSet.getColumnIndex('createTime'));
                item.updateTime = resultSet.getLong(resultSet.getColumnIndex('updateTime'));
                list.push(item);
            }
        }
        catch (err) {
            console.error('Parse password result error:', JSON.stringify(err));
        }
        finally {
            try {
                resultSet.close();
            }
            catch (closeErr) {
                console.error('Close resultSet error:', JSON.stringify(closeErr));
            }
        }
        return list;
    }
    // ==================== 体重记录操作 ====================
    /**
     * 插入体重记录
     */
    async insertWeight(model: WeightModel): Promise<number> {
        if (!this.rdbStore) {
            return -1;
        }
        try {
            const now = Date.now();
            const values: ValuesBucket = {
                date: model.date,
                weight: model.weight,
                bmi: model.bmi,
                bodyFatRate: model.bodyFatRate,
                notes: model.notes,
                createTime: now,
                updateTime: now,
            };
            return await this.rdbStore.insert(TABLE_WEIGHT, values);
        }
        catch (err) {
            console.error('Insert weight error:', JSON.stringify(err));
            return -1;
        }
    }
    /**
     * 更新体重记录
     */
    async updateWeight(model: WeightModel): Promise<number> {
        if (!this.rdbStore) {
            return -1;
        }
        try {
            const now = Date.now();
            const values: ValuesBucket = {
                weight: model.weight,
                bmi: model.bmi,
                bodyFatRate: model.bodyFatRate,
                notes: model.notes,
                updateTime: now,
            };
            const predicates = new relationalStore.RdbPredicates(TABLE_WEIGHT);
            predicates.equalTo('id', model.id);
            return await this.rdbStore.update(values, predicates);
        }
        catch (err) {
            console.error('Update weight error:', JSON.stringify(err));
            return -1;
        }
    }
    /**
     * 删除体重记录
     */
    async deleteWeight(id: number): Promise<number> {
        if (!this.rdbStore) {
            return -1;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_WEIGHT);
            predicates.equalTo('id', id);
            return await this.rdbStore.delete(predicates);
        }
        catch (err) {
            console.error('Delete weight error:', JSON.stringify(err));
            return -1;
        }
    }
    /**
     * 查询所有体重记录（按日期升序）
     */
    async queryAllWeights(): Promise<WeightModel[]> {
        if (!this.rdbStore) {
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_WEIGHT);
            predicates.orderByAsc('date');
            const resultSet = await this.rdbStore.query(predicates);
            return this.parseWeightResultSet(resultSet);
        }
        catch (err) {
            console.error('Query all weights error:', JSON.stringify(err));
            return [];
        }
    }
    /**
     * 按日期范围查询体重记录
     */
    async queryWeightsByDateRange(startDate: number, endDate: number): Promise<WeightModel[]> {
        if (!this.rdbStore) {
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_WEIGHT);
            predicates.between('date', startDate, endDate);
            predicates.orderByAsc('date');
            const resultSet = await this.rdbStore.query(predicates);
            return this.parseWeightResultSet(resultSet);
        }
        catch (err) {
            console.error('Query weights by date range error:', JSON.stringify(err));
            return [];
        }
    }
    /**
     * 查询某天体重记录
     */
    async queryWeightByDate(date: number): Promise<WeightModel | null> {
        if (!this.rdbStore) {
            return null;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(TABLE_WEIGHT);
            predicates.equalTo('date', date);
            const resultSet = await this.rdbStore.query(predicates);
            const list = this.parseWeightResultSet(resultSet);
            return list.length > 0 ? list[0] : null;
        }
        catch (err) {
            console.error('Query weight by date error:', JSON.stringify(err));
            return null;
        }
    }
    private parseWeightResultSet(resultSet: relationalStore.ResultSet): WeightModel[] {
        const list: WeightModel[] = [];
        try {
            while (resultSet.goToNextRow()) {
                let item = new WeightModel();
                item.id = resultSet.getLong(resultSet.getColumnIndex('id'));
                item.date = resultSet.getLong(resultSet.getColumnIndex('date'));
                item.weight = resultSet.getDouble(resultSet.getColumnIndex('weight'));
                item.bmi = resultSet.getDouble(resultSet.getColumnIndex('bmi'));
                item.bodyFatRate = resultSet.getDouble(resultSet.getColumnIndex('bodyFatRate'));
                item.notes = resultSet.getString(resultSet.getColumnIndex('notes'));
                item.createTime = resultSet.getLong(resultSet.getColumnIndex('createTime'));
                item.updateTime = resultSet.getLong(resultSet.getColumnIndex('updateTime'));
                list.push(item);
            }
        }
        catch (err) {
            console.error('Parse weight result error:', JSON.stringify(err));
        }
        finally {
            try {
                resultSet.close();
            }
            catch (closeErr) {
                console.error('Close resultSet error:', JSON.stringify(closeErr));
            }
        }
        return list;
    }
    /**
     * 清除所有密码记录
     */
    async clearAllPasswords(): Promise<void> {
        if (!this.rdbStore) {
            return;
        }
        try {
            await this.rdbStore.executeSql(`DELETE FROM ${TABLE_PASSWORD}`);
        }
        catch (err) {
            console.error('Clear all passwords error:', JSON.stringify(err));
        }
    }
    /**
     * 清除所有体重记录
     */
    async clearAllWeights(): Promise<void> {
        if (!this.rdbStore) {
            return;
        }
        try {
            await this.rdbStore.executeSql(`DELETE FROM ${TABLE_WEIGHT}`);
        }
        catch (err) {
            console.error('Clear all weights error:', JSON.stringify(err));
        }
    }
    /**
     * 导出所有数据为 JSON 字符串
     */
    async exportAllData(): Promise<string> {
        try {
            const passwords = await this.queryAllPasswords();
            const weights = await this.queryAllWeights();
            const data: ExportData = {
                passwords: passwords,
                weights: weights,
                exportTime: Date.now()
            };
            return JSON.stringify(data);
        }
        catch (err) {
            console.error('Export data error:', JSON.stringify(err));
            return '';
        }
    }
    /**
     * 导入数据
     */
    async importData(jsonStr: string): Promise<boolean> {
        try {
            const parsed = JSON.parse(jsonStr) as Record<string, object>;
            const passwords = parsed['passwords'] as PasswordModel[];
            const weights = parsed['weights'] as WeightModel[];
            if (passwords && passwords.length > 0) {
                for (const pwd of passwords) {
                    pwd.id = 0;
                    await this.insertPassword(pwd);
                }
            }
            if (weights && weights.length > 0) {
                for (const w of weights) {
                    w.id = 0;
                    await this.insertWeight(w);
                }
            }
            return true;
        }
        catch (err) {
            console.error('Import data error:', JSON.stringify(err));
            return false;
        }
    }
    /**
     * 关闭数据库
     */
    async close(): Promise<void> {
        if (this.rdbStore) {
            try {
                await this.rdbStore.close();
            }
            catch (err) {
                console.error('Close database error:', JSON.stringify(err));
            }
            this.rdbStore = null;
        }
    }
}
