/**
 * 应用全局常量
 */
export class AppConstants {
  // 数据库名称
  static readonly DB_NAME: string = 'privacy_tools.db';
  // 数据库版本
  static readonly DB_VERSION: number = 1;

  // 数据存储相关Key
  static readonly PREF_WEIGHT_GOAL: string = 'weight_goal';
  static readonly PREF_APP_LOCK_ENABLED: string = 'app_lock_enabled';
  static readonly PREF_AUTO_LOCK_TIMEOUT: string = 'auto_lock_timeout';
  static readonly PREF_CLIPBOARD_CLEAR: string = 'clipboard_clear_enabled';
  static readonly PREF_APP_LOCK_PIN: string = 'app_lock_pin';

  // 默认自动锁定时间（分钟）
  static readonly DEFAULT_AUTO_LOCK_MINUTES: number = 5;
  // 剪贴板清除延迟（秒）
  static readonly CLIPBOARD_CLEAR_DELAY: number = 30;

  // 页面路由名称
  static readonly PAGE_INDEX: string = 'pages/Index';
  static readonly PAGE_PASSWORD_LIST: string = 'pages/password/PasswordListPage';
  static readonly PAGE_PASSWORD_DETAIL: string = 'pages/password/PasswordDetailPage';
  static readonly PAGE_PASSWORD_GENERATOR: string = 'pages/password/PasswordGeneratorPage';
  static readonly PAGE_WEIGHT_LIST: string = 'pages/weight/WeightListPage';
  static readonly PAGE_WEIGHT_DETAIL: string = 'pages/weight/WeightDetailPage';
  static readonly PAGE_WEIGHT_STATISTICS: string = 'pages/weight/WeightStatisticsPage';
  static readonly PAGE_SETTINGS: string = 'pages/settings/SettingsPage';
  static readonly PAGE_APP_LOCK_VERIFY: string = 'pages/password/AppLockVerifyPage';
  static readonly PAGE_NOTIFICATION: string = 'pages/notification/NotificationPage';
  static readonly PAGE_NOTIFICATION_DETAIL: string = 'pages/notification/NotificationDetailPage';

  // 消息通知相关Key
  static readonly PREF_NOTIFICATION_READ: string = 'notification_read_ids';

  // 密码生成器历史记录Key
  static readonly PREF_PASSWORD_HISTORY: string = 'password_generator_history';
}

/**
 * 密码分类选项
 */
export const PASSWORD_CATEGORIES: string[] = ['工作', '社交', '金融', '其他'];

/**
 * 默认身高（cm）
 */
export const DEFAULT_HEIGHT: number = 170;
