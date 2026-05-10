/**
 * 体重记录数据模型
 */
export class WeightModel {
  id: number = -1;
  date: number = 0;             // 日期时间戳（当天0点）
  weight: number = 0;           // 体重，单位kg
  bmi: number = 0;              // BMI指数
  bodyFatRate: number = 0;      // 体脂率（可选，0表示未填写）
  notes: string = '';           // 备注（饮食/运动）
  createTime: number = 0;       // 记录创建时间
  updateTime: number = 0;       // 记录更新时间
}

/**
 * 体重趋势统计结果
 */
export class WeightStatistics {
  averageWeight: number = 0;    // 平均体重
  maxWeight: number = 0;        // 最大体重
  minWeight: number = 0;        // 最小体重
  weightChange: number = 0;     // 体重变化（最新-最早）
  averageBmi: number = 0;       // 平均BMI
  recordCount: number = 0;      // 记录数量
  startDate: number = 0;        // 统计开始日期
  endDate: number = 0;          // 统计结束日期
}

/**
 * 体重目标设置
 */
export class WeightGoal {
  targetWeight: number = 0;     // 目标体重
  targetDate: number = 0;       // 目标日期
  height: number = 0;           // 身高(cm)，用于计算BMI
}
