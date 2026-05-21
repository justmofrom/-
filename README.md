# Customer Service Conversation Quality Annotator

一个轻量的网页工具，用于逐条查看智能客服对话并打质量标签，支持导出标注结果为 JSON / CSV。

## 功能

- 逐条浏览对话（显示会话 ID、用户消息、客服回复）
- 对每条客服回复打质量标签（可多选）
- 可填写标注备注
- 自动记录标注时间戳
- 导出标注结果为 `JSON` 或 `CSV`
- 支持加载你自己的对话 JSON 文件

## 输入数据格式

工具支持加载如下结构的 JSON 数组：

```json
[
  {
    "id": "001",
    "turns": [
      { "role": "user", "content": "..." },
      { "role": "assistant", "content": "..." }
    ]
  }
]
```

## 标注标签（内置）

- ✓ Accurate（准确）
- ✗ Inaccurate（不准确）
- ✗ Off-topic（跑题）
- ✗ Fabricated info（编造信息）
- ✓ Helpful（有帮助）
- ✓ Empathetic（有同情心）
- ✗ Poor attitude（态度差）
- ✗ Unclear（不清楚）
- ✓ Complete answer（完整回答）

## 安装与运行

本工具是纯前端页面，无需安装依赖。

### 1) 安装

克隆仓库即可：

```bash
git clone <repo-url>
cd -- -
```

### 2) 运行应用

启动本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：`http://localhost:8000`

### 3) 加载对话数据

- 页面默认会加载 `sample-data.json`
- 也可点击“加载 JSON 文件”上传你自己的数据文件

### 4) 导出标注结果

完成标注后可点击：

- **导出 JSON**
- **导出 CSV**

导出字段包含：

- Conversation ID
- User message
- Assistant response
- Quality tags applied
- Timestamp of annotation
- Annotator notes（可选）

## 文件说明

- `index.html`：页面结构
- `styles.css`：样式
- `app.js`：标注逻辑、导出逻辑
- `sample-data.json`：示例输入数据

## AI 工具使用说明（简要）

本项目开发时可使用 GitHub Copilot / Copilot Coding Agent 辅助完成：

- 用途：快速搭建页面结构、生成导出逻辑、补全样板代码
- 用法：描述需求（浏览、打标、导出），让 AI 生成初稿，再人工验证与修改
