import { Router } from "express";
import { get } from "axios";


const imgProxyRouter = Router();

imgProxyRouter.get("/", (req, res) => {
    if (req.query.q) {
        const q = "https://" + req.query.q;
        get(q, {
            responseType: 'arraybuffer', //这里只能是arraybuffer，不能是json等其他项，blob也不行
        }).then(response => {
            res.set(response.headers) //把整个的响应头塞入更优雅一些
            res.end(response.data.toString('binary'), 'binary') //这句是关键，有两次的二进制转换
        }).catch(error => {
            res.send(null)
        })
    }else{
        res.send(null)
    }
});

export default imgProxyRouter;