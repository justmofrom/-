FROM node:18-alpine

WORKDIR /app

# 复制应用文件
COPY index.html .
COPY data.json .
COPY server.js .

# 安装依赖
RUN npm install --production

# 暴露端口
EXPOSE 3000

# 启动服务器
CMD ["node", "server.js"]
