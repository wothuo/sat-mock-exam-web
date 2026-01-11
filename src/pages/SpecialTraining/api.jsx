/**
 * 专项训练相关API接口
 * 已迁移到统一的service层，建议使用 @/services/training
 * 保留此文件以保持向后兼容，新代码请使用 services/training.js
 */

// 向后兼容：重新导出services中的方法
export {
  fetchTrainingQuestions,
  submitTrainingAnswers,
  fetchTrainingRecords,
  fetchWrongQuestions
} from '../../services/training';

