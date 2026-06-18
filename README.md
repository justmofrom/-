# 客服质量评估工具

这是一个用于评估智能客服对话质量的Web应用工具。支持逐条浏览对话记录，标注客服回复的质量，并导出评估结果。

## 功能特性

✨ **核心功能**
- 📋 逐条浏览对话记录，清晰显示用户与客服的交互
- ⭐ 5级评分系统，量化整体回复质量
- 🏷️ 多维度质量标签：
  - ✓ 准确无误 - 回复内容准确正确
  - ✗ 存在跑题 - 回复偏离用户问题
  - ✗ 存在编造 - 虚构或编造了信息
- 📝 补充备注字段，记录详细意见
- 📊 实时统计，显示评估进度和分布
- 💾 本地保存，浏览器自动保存所有评估数据
- 📥 灵活导出，支持CSV和JSON两种格式

## 快速开始

### 方法 1：直接打开 HTML 文件（最简便）

1. 下载项目文件
2. 用浏览器直接打开 `index.html` 文件
3. 开始评估

**优点**：无需安装任何依赖，完全离线工作

### 方法 2：使用 Node.js 服务器

**系统要求**：Node.js 14+

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 浏览器访问
http://localhost:3000
```

### 方法 3：使用 Docker 部署

**系统要求**：Docker 已安装

```bash
# 构建镜像
docker build -t customer-service-evaluator .

# 运行容器
docker run -p 3000:3000 customer-service-evaluator

# 浏览器访问
http://localhost:3000
```

### 方法 4：使用 Docker Compose（推荐生产环境）

```bash
# 创建 docker-compose.yml 文件（见下方）
# 启动服务
docker-compose up -d

# 浏览器访问
http://localhost:3000
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  evaluator:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data.json:/app/data.json:ro
```

## 使用指南

### 界面说明

#### 左侧面板：对话内容
- 显示当前对话的用户问题和客服回复
- 上一条/下一条按钮用于在对话间导航
- 状态指示器显示该对话是否已评估
- 进度统计显示整体评估进展

#### 右侧面板：质量评估
- **整体评分**（1-5星）：点击星号快速评分
  - ⭐⭐⭐⭐⭐ (5星)：优秀
  - ⭐⭐⭐⭐ (4星)：良好
  - ⭐⭐⭐ (3星)：一般
  - ⭐⭐ (2星)：差
  - ⭐ (1星)：很差

- **质量标签**：勾选适用的标签
  - ✓ 准确无误：回复内容符合实际
  - ✗ 存在跑题：回复偏离用户问题主题
  - ✗ 存在编造：客服虚构或杜撰了信息

- **补充备注**：输入任何需要记录的备注信息

### 工作流程

1. **浏览对话**：查看左侧的用户问题和客服回复
2. **评分**：点击右侧星号给出1-5分评分
3. **标注**：根据实际勾选相应的质量标签
4. **备注**：如需要，输入补充意见
5. **保存**：自动保存（完成标注即可）
6. **导航**：点击"下一条"或"上一条"进入下个对话
7. **导出**：完成评估后点击"导出结果"获取报告

### 数据导出

点击"导出结果"按钮，选择导出格式：

**CSV 格式**
- 兼容 Excel、Google Sheets 等表格应用
- 便于数据进一步分析和统计
- 文件名格式：`客服质量评估_YYYY-MM-DD.csv`

**JSON 格式**
- 包含完整的评估数据和元数据
- 便于与其他系统集成
- 文件名格式：`客服质量评估_YYYY-MM-DD.json`

### 统计功能

点击"统计信息"按钮查看：
- 总对话数和完成度百分比
- 评分分布（各星级数量）
- 标签统计（各标签被标注的频次）

## 数据管理

### 加载自己的数据

编辑 `data.json` 文件，按以下格式添加对话：

```json
[
  {
    "id": "001",
    "turns": [
      {"role": "user", "content": "用户的问题"},
      {"role": "assistant", "content": "客服的回复"}
    ]
  }
]
```

### 导入评估结果

导出的 JSON 文件可以重新导入。在浏览器控制台执行：

```javascript
const data = /* 粘贴导出的JSON内容 */;
localStorage.setItem('evaluations', JSON.stringify(data.evaluations));
location.reload();
```

### 备份数据

定期导出评估结果作为备份：
- 点击"导出结果" → 选择 JSON 格式
- 保存文件到安全位置

### 清空数据

如需清空所有评估数据，在浏览器控制台执行：

```javascript
localStorage.removeItem('evaluations');
location.reload();
```

## 技术栈

- **前端**：纯 HTML5 + CSS3 + JavaScript（ES6+）
- **后端**：Node.js (可选)
- **存储**：浏览器 localStorage
- **部署**：Docker / Docker Compose

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器（响应式设计）

## 常见问题

**Q: 数据保存在哪里？**
A: 所有评估数据保存在浏览器的 localStorage 中。关闭浏览器后数据仍然存在。建议定期导出作为备份。

**Q: 能否在多个设备上同步？**
A: 当前版本不支持跨设备同步。建议在一个设备上完成评估后导出数据，再在其他设备导入。

**Q: 如何修改已保存的评估？**
A: 回到对应的对话重新编辑即可，修改会自动保存。

**Q: CSV 导出乱码问题？**
A: 在 Excel 中打开时，选择"GB2312"或"UTF-8"编码格式即可。

**Q: 如何添加更多对话？**
A: 编辑 `data.json` 文件，按格式添加新的对话记录，刷新页面即可加载。

## 部署建议

### 开发环境
```bash
npm start
# 或直接打开 index.html
```

### 生产环境（使用 Docker）
```bash
docker build -t customer-service-evaluator:latest .
docker run -d -p 3000:3000 customer-service-evaluator:latest
```

### Nginx 反向代理
```nginx
upstream evaluator {
    server localhost:3000;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://evaluator;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 项目结构

```
.
├── index.html           # 主应用（包含所有 CSS 和 JavaScript）
├── data.json            # 对话数据文件
├── server.js            # Node.js 服务器（可选）
├── package.json         # Node.js 依赖配置
├── Dockerfile           # Docker 镜像配置
├── docker-compose.yml   # Docker Compose 配置（可选）
└── README.md            # 本文件
```

## 许可证

MIT License

## 支持

如有问题或建议，欢迎反馈。
