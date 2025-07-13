import { Router } from "express";
import { get } from "axios";
import { JRequest } from "../lib/express";


const imgProxyRouter = Router();

imgProxyRouter.get("/", (req, res) => {
    let jreq = req as JRequest;
    if (req.query.q) {
        const q = "https://" + req.query.q;
        get(q, {
            responseType: 'arraybuffer', //这里只能是arraybuffer，不能是json等其他项，blob也不行
        }).then(response => {
            res.set(response.headers) //把整个的响应头塞入更优雅一些
            res.end(response.data.toString('binary'), 'binary') //这句是关键，有两次的二进制转换
            jreq.interval.set('image-proxy',jreq.interval.get('image-proxy')+1)
        }).catch(error => {
            jreq.log.error(JSON.stringify({
                name:"图片代理错误",
                r:"其他原因",
                err:error
            }))
            jreq.interval.set('error',jreq.interval.get('error')+1)
            res.send(null)
        })
    }else{
        jreq.log.error(JSON.stringify({
                name:"图片代理错误",
                r:"缺少参数q"
            }))
        jreq.interval.set('error',jreq.interval.get('error')+1)
        res.send(null)
    }
});

export default imgProxyRouter;