# JSearch

JSearch是一个基于nodejs和google custom search api的开源搜索引擎。

## 使用

1.docker安装

```
docker run -p 3000:3000 -e SEARCH_API_KEY='' -e SEARCH_CX='' -e SEARCH_HINT='' -e PORT=3000 --name jsearch --restart=unless-stopped -d jiantxs/jsearch
```

2.本地安装

（先在/src/config.js中配置好SEARCH_API_KEY，SEARCH_CX，SEARCH_HINT）

```
npm install
npm start
```

