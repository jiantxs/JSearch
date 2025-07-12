import express, { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import artTemplate from 'art-template';
import Config from './config';


import Search from './lib/searchApi';



import searchHintRouter from './route/searchHint';
import imgProxyRouter from './route/imgProxy';
import logRouter from './route/logs';

import { getData } from './test/data';



if(!(Config.searchApiKey && Config.searchCx && Config.searchHint))throw new Error("Please provide all the required environment variables")

const app: Express = express();


app.use(logRouter)


artTemplate.defaults.root = path.join(__dirname,"../", 'views');

// 设置 art-template 模板引擎
app.engine('art', (filePath: string, options: any, callback: (err: Error | null, rendered?: string) => void) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) return callback(err);
        try {
            const rendered = artTemplate.render(content, options);
            return callback(null, rendered);
        } catch (e) {
            return callback(e as Error);
        }
    });
});
app.set('view engine', 'art');
app.set('views', path.join(__dirname,"../", 'views'));






// 设置静态资源目录
app.use(express.static(path.join(__dirname,"../", 'public')));






// 路由示例：渲染主页
app.get('/',async (req: Request, res: Response) => {
    if(req.query.q){
        let obj = {}
        let ok = false

        let search = new Search(req.query.q as string,req.query.page? parseInt(req.query.page as string) : 1);

        if((await search.get()) == Config.code.success){
            obj = {
                q: req.query.q,
                ok: true,
                page: req.query.page? parseInt(req.query.page as string) : 1,
                results: search.getResults(),
                error: search.getError(),
                title: 'JSearch--' + req.query.q
            }

            ok = true
            
        }else{
            obj = {
                q: req.query.q,
                ok: false,
                page: req.query.page? parseInt(req.query.page as string) : 1,
                results: [],
                error: search.getError(),
                title: 'JSearch--' + req.query.q
            }
        }
        
        /* obj = getData(); */

        if(!ok){
            res.render('error', {obj})
            return
        }


        
        res.render('search', {obj})
        return;


    }
    res.render('index', { title: 'JSearch' });
});


app.use('/searchHint', searchHintRouter);
app.use('/imgp',imgProxyRouter)






// 启动服务器
const port= Config.port;
app.listen(port, () => {
    console.log(`服务器在端口 ${port} 上运行`);
});
