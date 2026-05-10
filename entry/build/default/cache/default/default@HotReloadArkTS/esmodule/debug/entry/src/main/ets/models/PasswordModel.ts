/**
 * 密码记录数据模型
 */
export class PasswordModel {
    id: number = -1;
    platform: string = ''; // 平台名称
    account: string = ''; // 账号
    password: string = ''; // 密码（加密存储）
    category: string = '其他'; // 分类：工作/社交/金融/其他
    website: string = ''; // 网站地址
    tags: string = ''; // 标签，逗号分隔
    notes: string = ''; // 备注
    createTime: number = 0; // 创建时间戳
    updateTime: number = 0; // 更新时间戳
}
/**
 * 密码分类枚举
 */
export enum PasswordCategory {
    WORK = "\u5DE5\u4F5C",
    SOCIAL = "\u793E\u4EA4",
    FINANCE = "\u91D1\u878D",
    OTHER = "\u5176\u4ED6"
}
/**
 * 密码生成器配置
 */
export class PasswordGeneratorConfig {
    length: number = 16;
    includeNumbers: boolean = true;
    includeLowercase: boolean = true;
    includeUppercase: boolean = true;
    includeSpecial: boolean = true;
    excludeAmbiguous: boolean = false; // 排除易混字符如 0/O, 1/l/I
    copy(): PasswordGeneratorConfig {
        let c = new PasswordGeneratorConfig();
        c.length = this.length;
        c.includeNumbers = this.includeNumbers;
        c.includeLowercase = this.includeLowercase;
        c.includeUppercase = this.includeUppercase;
        c.includeSpecial = this.includeSpecial;
        c.excludeAmbiguous = this.excludeAmbiguous;
        return c;
    }
}
