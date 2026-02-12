# 专项训练模块

## 模块概述
专项训练模块提供阅读、语法、数学三个科目的专项练习功能，支持多维度筛选和个性化配置。

## 目录结构
```
src/pages/SpecialTraining/
├── index.jsx              # 主入口组件
├── TrainingConfig.jsx     # 训练配置组件
├── FilterSection.jsx      # 筛选区域组件
├── constants.js           # 配置常量
├── api.js                 # API接口封装
└── README.md             # 使用文档
```

## 核心功能

### 1. 科目切换
- 支持阅读、语法、数学三个科目
- 切换科目时自动重置配置

### 2. 多维度筛选
- **题目类型**：根据不同科目显示对应的题型
- **题目来源**：历年真题、官方样题、Question Bank考题
- **题目维度**：未练习、做错次数、最近错题
- **题目难度**：随机、Hard、Medium、Easy
- **练习题数**：5题、10题、20题
- **查看模式**：随时查看 / 做完再看

### 3. 配置管理
所有筛选配置统一管理，便于扩展和维护。

## 组件说明

### index.jsx - 主入口组件
负责：
- 科目切换
- 配置状态管理
- 开始训练逻辑
- API调用入口

### TrainingConfig.jsx - 训练配置组件
负责：
- 渲染所有筛选区域
- 配置项统一管理
- 配置变更处理

### FilterSection.jsx - 筛选区域组件
负责：
- 单个筛选区域的渲染
- 支持图标模式和普通模式
- 选中状态管理

### constants.js - 配置常量
包含：
- 科目配置
- 题目类型配置（按科目分类）
- 题目来源、维度、难度等配置
- 所有可配置项的数据结构

### api.js - API接口封装
提供：
- 获取训练题目接口
- 提交答案接口
- 获取训练记录接口
- 获取错题集接口

## 使用示例

### 添加新科目
在 `constants.js` 中添加：
```javascript
export const TRAINING_SUBJECTS = [
  // ... 现有科目
  { id: '写作', name: '写作', icon: 'fas fa-pen' }
];

export const QUESTION_TYPES = {
  // ... 现有配置
  '写作': [
    { id: '全部', name: '全部', icon: 'fas fa-th-large', color: 'bg-gray-100 text-gray-600' },
    { id: '议论文', name: '议论文', icon: 'fas fa-comment', color: 'bg-blue-100 text-blue-600' },
    // ... 更多题型
  ]
};
```

### 添加新的筛选维度
在 `constants.js` 中添加配置：
```javascript
export const NEW_FILTER = [
  { id: 'option1', name: '选项1' },
  { id: 'option2', name: '选项2' }
];
```

在 `TrainingConfig.jsx` 中添加筛选区域：
```javascript
const filterSections = [
  // ... 现有配置
  {
    id: 'newFilter',
    title: '新筛选项',
    icon: 'fas fa-filter',
    color: 'from-blue-500 to-cyan-600',
    options: NEW_FILTER,
    value: config.newFilter
  }
];
```

### API接口对接
在 `index.jsx` 中调用API：
```javascript
import { fetchTrainingQuestions } from './api';

const handleStartTraining = async () => {
  try {
    const params = {
      subject: activeSubject,
      ...trainingConfig
    };
    
    const response = await fetchTrainingQuestions(params);
    // 处理返回的题目数据
    navigate('/training-exercise', { 
      state: { questions: response.data } 
    });
  } catch (error) {
    console.error('获取题目失败:', error);
    // 错误处理
  }
};
```

## 扩展性设计

### 1. 配置驱动
所有筛选项通过配置文件管理，新增功能只需修改配置。

### 2. 组件复用
FilterSection 组件高度可复用，支持不同的展示模式。

### 3. API解耦
API接口独立封装，便于替换和测试。

### 4. 状态管理
配置状态集中管理，便于扩展和维护。

## 后端接口规范

### 获取训练题目
```
POST /api/training/questions
Content-Type: application/json

Request:
{
  "subject": "阅读",
  "questionType": "词汇题",
  "source": "历年真题",
  "dimension": "未练习",
  "difficulty": "Medium题目",
  "count": "10题",
  "viewMode": "随时查看答案和解析"
}

Response:
{
  "code": 0,
  "message": "success",
  "data": {
    "trainingId": "xxx",
    "questions": [...]
  }
}
```

### 提交训练答案
```
POST /api/training/submit
Content-Type: application/json

Request:
{
  "trainingId": "xxx",
  "answers": [
    {
      "questionId": "q1",
      "answer": "A"
    }
  ]
}

Response:
{
  "code": 0,
  "message": "success",
  "data": {
    "score": 85,
    "correctCount": 8,
    "totalCount": 10
  }
}
```

## 注意事项

1. **配置一致性**：确保 constants.js 中的配置与后端接口保持一致
2. **错误处理**：API调用需要完善的错误处理机制
3. **加载状态**：开始训练时应显示加载状态
4. **数据验证**：提交前验证配置的完整性
5. **用户体验**：切换科目时给予适当的过渡动画

## 待优化项

1. 添加配置预设功能（保存常用配置）
2. 添加训练历史记录查看
3. 优化移动端适配
4. 添加题目预览功能
5. 支持自定义题目数量

