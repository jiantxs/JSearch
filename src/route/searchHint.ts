import { Router } from "express";
import { successResponse , errorResponse } from "../lib/webJson";
import SearchHint from "../lib/searchHint";
import Config from "../config";
import { JRequest } from "../lib/express";


const searchHintRouter = Router();

searchHintRouter.get("/",async (req, res) => {
    const jreq = req as JRequest;
    if(!req.query.q) {
        jreq.interval.set('error',jreq.interval.get('error')+1)
        jreq.log.error(JSON.stringify({
            name:"自动补全错误",
            r:"缺少参数q"
        }));
        res.status(200).json(errorResponse({message: "Query parameter 'q' is missing."}));

        return
    }

    if(jreq.interval.get('search-hint')>=Config.searchHintPerInterval){
        jreq.interval.set('error',jreq.interval.get('error')+1)
        jreq.log.error(JSON.stringify({
            name:"自动补全错误",
            r:"自动补全达到上限"
        }));
        res.status(200).json(errorResponse({message: "Search hint limit reached."}));

        return
    }


    const searchHint = new SearchHint(req.query.q as string);
    let ok = await searchHint.get();

    if(ok == Config.code.success){
        jreq.interval.set('search-hint',jreq.interval.get('search-hint')+1)
        res.status(200).json(successResponse({hints: searchHint.getHints()}));
    }else{
        jreq.interval.set('error',jreq.interval.get('error')+1)
        jreq.log.error(JSON.stringify({
            name:"自动补全错误",
            r:"获取自动补全失败",
            e:searchHint.getError()
        }))
        res.status(200).json(errorResponse({message: "Error while fetching search hints."}));
    }
});

export default searchHintRouter;