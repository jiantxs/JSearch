import { Request } from 'express';
import Interval from './interval';

export interface JRequest extends Request {
    log:{
        info:Function,
        error:Function,
        warn:Function,
        log:Function
    },
    interval:Interval<any>
}


class JRequestMacker {
    static make(req:Request):JRequest {
        const jreq:JRequest = req as JRequest;
        jreq.log = {
            info: () => {},
            error: () => {},
            warn: () => {},
            log: () => {}
        };
        jreq.interval = new Interval(0);
        return jreq;
    }
}



export default JRequestMacker
