import { Router , Request, Response } from "express"
import { JRequest } from "../lib/express"

let errHandler = Router()


errHandler.use((req: Request, res: Response) => {
    let jreq = req as JRequest;
    jreq.interval.set('error',jreq.interval.get('error')+1)
    jreq.log.error(JSON.stringify({
        name:'资源不存在',
        res:jreq.path
    }));
    res.status(404).send('Not Found');
})


export default errHandler