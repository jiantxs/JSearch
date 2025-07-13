FROM node:22-alpine

WORKDIR /app
COPY . /app


# 持久化日志目录
VOLUME /app/logs

RUN mkdir /app/logs
RUN mkdir /app/logs/log
RUN mkdir /app/logs/data

# 暴露端口并启动应用
EXPOSE 3000
CMD ["npm", "run" ,"startOnServer"]
