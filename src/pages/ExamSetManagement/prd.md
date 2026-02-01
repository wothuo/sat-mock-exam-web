# 需求描述：
这是一个套题管理页面，页面展示了一个套题列表，右上角有一个新增题库按钮：
1、点击新增题库会进入新增题库页面
2、点击套题列表内的编辑按钮会复用新增题库页面组件，仅回填该题库数据。

# 原则：
1、不要大改现有DOM逻辑。
2、符合软件工程的设计思路。
3、不要过度设计。

# 接口：
## 1.套题列表查询
- 接口描述：按考试类型、年份、地区、类别筛选套题，支持分页查询（套题模考页面筛选功能）
- 请求方式：GET
- 接口路径：/api/exam/task/set/list
- 查询参数（优化：新增examCategory筛选，补充分页默认值）：
### 接口参数说明
| 参数名        | 类型   | 必填 | 说明           |  枚举/约束  |
|---------------|--------|------|----------------|--------|
| examType      | string | 是   | 考试类型       | SAT/IELTS/TOEFL|
| examCategory  | string | 否   | 套题类别       | 官方样题/历年考题 |
| examYear      | string | 否   | 套题年份       | 2025/2024/... |
| examRegion    | string | 否   | 套题地区       | 北美/亚太 |
| pageNum       | int    | 否   | 页码（分页用） | 默认1 |
| pageSize      | int    | 否   | 每页条数（分页用） | 默认10|

### 响应参数示例（优化：补充status说明，返回分页总条数）：
- 整体结构
{
  "success": true,
  "code": 200,
  "msg": "查询成功",
  "data": { /* 分页数据 */ },
  "timestamp": 1735689600000
}

- 字段说明
| 字段名      | 类型    | 说明 |
|-------------|---------|------|
| `success`   | boolean | 请求是否成功（`true` 表示成功） |
| `code`      | number  | 业务状态码（200 表示成功） |
| `msg`       | string  | 返回消息（如“查询成功”） |
| `data`      | object  | 实际业务数据（含分页信息） |
| `timestamp` | number  | 响应时间戳（毫秒，UTC+8 示例：2025-01-01 00:00:00） |

- data 对象结构（分页结果）
| 字段名      | 类型   | 说明 |
|-------------|--------|------|
| `total`     | number | 总记录数（用于前端计算总页数） |
| `pageNum`   | number | 当前页码（从 1 开始） |
| `pageSize`  | number | 每页条数 |
| `list`      | array  | 当前页的数据列表 |

- list 中每项任务对象字段说明
| 字段名           | 类型   | 说明 |
|------------------|--------|------|
| `taskId`         | number | 任务唯一 ID |
| `taskName`       | string | 任务名称（如“2025北美SAT官方样题”） |
| `taskType`       | string | 任务类型（固定值 `"exam_set"` 表示套题） |
| `examType`       | string | 考试类型（如 `"SAT"`） |
| `examCategory`   | string | 套题类别（如“官方样题”、“历年考题”） |
| `examYear`       | string | 考试年份（如 `"2025"`） |
| `examRegion`     | string | 考试地区（如“北美”、“亚太”） |
| `questionCount`  | number | 题目总数 |
| `status`         | number | 状态码：<br>• `1` = 可用<br>• `0` = 已下线/不可用 |
| `statusDesc`     | string | 状态描述（如“可用”） |

- 示例数据（JSON 片段）
{
  "taskId": 20001,
  "taskName": "2025北美SAT官方样题",
  "taskType": "exam_set",
  "examType": "SAT",
  "examCategory": "官方样题",
  "examYear": "2025",
  "examRegion": "北美",
  "questionCount": 154,
  "status": 1,
  "statusDesc": "可用"
}
### 总结特点
✅ 支持分页查询，通过 total + pageSize 可计算总页数。
✅ status 字段使用 数字编码，同时提供 statusDesc 便于展示。
✅ 所有考试信息（年份、地区、类别）均为字符串类型，适合多语言扩展。
✅ taskType 固定为 "exam_set"，未来可扩展其他类型（如 "homework"）。
## 2.新增SAT题目

