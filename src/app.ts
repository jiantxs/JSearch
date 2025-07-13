import express, { Express} from 'express';
import path from 'path';
import fs from 'fs';
import artTemplate from 'art-template';
import Config from './config';


import reqRouter from './route/reqRouter';
import logRouter from './route/log';
import intervalRouter from './route/interval';


import searchHintRouter from './route/searchHint';
import imgProxyRouter from './route/imgProxy';
import errHandler from './route/errHandler';
import rootRouter from './route/root';


if(!(Config.searchApiKey && Config.searchCx && Config.searchHint))throw new Error("Please provide all the required environment variables")


const app: Express = express()



app.use(reqRouter)
app.use(intervalRouter)
app.use(logRouter)



artTemplate.defaults.root = path.join(__dirname,"../", 'views');

// 设置 art-template 模板引擎
app.engine('art', (filePath: string, options: any, callback: (err: Error | null, rendered?: string) => void) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) return callback(err)
        try {
            const rendered = artTemplate.render(content, options);
            return callback(null, rendered)
        } catch (e) {
            return callback(e as Error)
        }
    });
});
app.set('view engine', 'art');
app.set('views', path.join(__dirname,"../", 'views'));


// 设置静态资源目录
app.use(express.static(path.join(__dirname,"../", 'public')));


// 路由示例：渲染主页
app.use(rootRouter);
app.use('/searchHint', searchHintRouter);
app.use('/imgp',imgProxyRouter)
app.use(errHandler)


// 启动服务器
const port= Config.port;
app.listen(port, () => {
    console.log(`服务器在端口 ${port} 上运行`);
});
