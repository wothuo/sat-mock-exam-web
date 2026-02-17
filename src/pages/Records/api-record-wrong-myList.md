# 错题列表接口：GET /record/wrong/myList

> 供 AI / 前端联调使用。分页查询**当前登录用户**的错题记录列表，支持按题目类别、难度、答题时间范围筛选。

---

## 基本信息

| 项目 | 说明 |
|------|------|
| **请求方式** | `GET` |
| **路径** | `/record/wrong/myList` |
| **鉴权** | 需要登录，依赖 Session（Cookie 携带 SessionId） |
| **Content-Type** | 无需请求体，参数为 Query |

---

## 请求参数（Query，均为可选）

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `questionCategory` | string | 否 | - | 题目类别。不传或传 `"全部"` 表示不筛选。可选：`全部`、`阅读`、`语法`、`数学` |
| `difficulty` | string | 否 | - | 题目难度。不传或传 `"全部"` 表示不筛选。可选：`全部`、`Easy`、`Medium`、`Hard` |
| `timeRange` | string | 否 | - | 答题试卷时间范围（按作答题集的开始时间）。不传或传 `"全部"` 表示不筛选。可选：`全部`、`最近一个月`、`最近三个月`、`最近半年` |
| `pageNum` | number | 否 | 1 | 当前页码 |
| `pageSize` | number | 否 | 10 | 每页条数 |

---

## 响应结构

### 统一包装：Result\<PageVO\<WrongRecordItemVO\>\>

```json
{
  "code": 200,
  "message": "SUCCESS",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "total": 100,
    "pages": 10,
    "list": [ /* WrongRecordItemVO[] */ ]
  }
}
```

### data 分页字段（PageVO）

| 字段 | 类型 | 说明 |
|------|------|------|
| `pageNum` | number | 当前页码 |
| `pageSize` | number | 每页条数 |
| `total` | number | 总记录数 |
| `pages` | number | 总页数 |
| `list` | array | 当前页的错题列表，每项为 WrongRecordItemVO |

### 列表项 WrongRecordItemVO

| 字段 | 类型 | 说明 |
|------|------|------|
| `questionCategory` | string | 题目类别（如：阅读 / 语法 / 数学） |
| `difficulty` | string | 题目难度（如：Easy / Medium / Hard） |
| `answer` | string | 正确答案 |
| `questionContent` | string | 题干内容 |
| `answerId` | number | 作答明细唯一 ID（answer_detail.answer_id） |
| `userAnswer` | string | 用户作答答案 |
| `timeConsuming` | number | 作答耗时（秒） |
| `startTime` | string | 开始答题时间（作答题集的开始时间，ISO 日期时间格式） |
| `taskName` | string | 作答题集名称 |

---

## 响应示例

### 成功（200）

```json
{
  "code": 200,
  "message": "SUCCESS",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "total": 25,
    "pages": 3,
    "list": [
      {
        "questionCategory": "阅读",
        "difficulty": "Medium",
        "answer": "C",
        "questionContent": "<p>题干内容...</p>",
        "answerId": 101,
        "userAnswer": "A",
        "timeConsuming": 45,
        "startTime": "2025-02-01T10:00:00",
        "taskName": "套题模考-1"
      }
    ]
  }
}
```

### 未登录（401）

```json
{
  "code": 401,
  "message": "请先登录",
  "data": null
}
```

---

## 请求示例

```http
GET /record/wrong/myList?pageNum=1&pageSize=10
GET /record/wrong/myList?questionCategory=阅读&difficulty=Easy&pageNum=1&pageSize=20
GET /record/wrong/myList?timeRange=最近一个月&pageNum=1&pageSize=10
```

**注意：** 请求需携带当前域的 Cookie（Session），否则返回 401。

---

## 联调要点

1. **用户身份**：当前用户由服务端从 Session 解析，前端无需传 `userId`。
2. **筛选**：`questionCategory`、`difficulty`、`timeRange` 不传或传 `"全部"` 时，该维度不做筛选。
3. **时间范围**：`timeRange` 按「作答题集」的 `start_time` 过滤（该次答题任务开始时间）。
4. **排序**：列表按作答明细创建时间倒序（`create_time desc`），即最新错题在前。
5. **空列表**：无错题时 `list` 为 `[]`，`total` 为 0，`pages` 为 0。
