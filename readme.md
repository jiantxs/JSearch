# JSearch

JSearch是一个基于nodejs和google custom search api的开源搜索引擎。

## 使用

1.docker安装

```
docker run -v /app/logs:path_to_your_dir/logs -v /app/js:path_to_your_dir/js -p 3000:3000 -e SEARCH_API_KEY='' -e SEARCH_CX='' -e SEARCH_HINT='' -e PORT=3000 --name jsearch --restart=unless-stopped -d jiantxs/jsearch
```

2.本地安装

（先在/src/config.js中配置好SEARCH_API_KEY，SEARCH_CX，SEARCH_HINT）
提示：SEARCH_HINT需要自行点击进入自己可编程搜索引擎界面显示的引擎网址，然后通过F12查看自动补全的请求，把回调改为call，去掉q后放入即可

1.在文件夹下创建`logs/log` `logs/data`文件夹（默认设置情况下）
2.
```
npm install
npm start
```

