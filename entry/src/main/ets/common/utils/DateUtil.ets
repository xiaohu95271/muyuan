/**
 * 日期时间工具类
 */
export class DateUtil {
  /**
   * 获取当天0点时间戳
   */
  static getTodayStart(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  /**
   * 获取本周开始时间戳（周一）
   */
  static getWeekStart(): number {
    const now = new Date();
    const day = now.getDay() || 7;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1).getTime();
  }

  /**
   * 获取本月开始时间戳
   */
  static getMonthStart(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  }

  /**
   * 获取本年开始时间戳
   */
  static getYearStart(): number {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1).getTime();
  }

  /**
   * 格式化日期为 yyyy-MM-dd
   */
  static formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 格式化日期时间为 yyyy-MM-dd HH:mm
   */
  static formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${DateUtil.formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  /**
   * 格式化相对时间（如：今天、昨天、3天前）
   */
  static formatRelativeDate(timestamp: number): string {
    const today = DateUtil.getTodayStart();
    const diff = today - timestamp;
    const oneDay = 24 * 60 * 60 * 1000;
    if (diff >= 0 && diff < oneDay) {
      return '今天';
    } else if (diff >= oneDay && diff < 2 * oneDay) {
      return '昨天';
    } else if (diff >= 2 * oneDay && diff < 7 * oneDay) {
      return `${Math.floor(diff / oneDay)}天前`;
    } else {
      return DateUtil.formatDate(timestamp);
    }
  }

  /**
   * 计算 BMI
   * @param weight 体重 kg
   * @param height 身高 cm
   */
  static calculateBMI(weight: number, height: number): number {
    if (height <= 0) {
      return 0;
    }
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  /**
   * 获取 BMI 等级描述
   */
  static getBMICategory(bmi: number): string {
    if (bmi <= 0) return '未知';
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '偏胖';
    return '肥胖';
  }

  /**
   * 获取 BMI 对应颜色
   */
  static getBMIColor(bmi: number): string {
    if (bmi <= 0) return '#757575';
    if (bmi < 18.5) return '#FFA500';
    if (bmi < 24) return '#4CAF50';
    if (bmi < 28) return '#FF9800';
    return '#F44336';
  }
}
