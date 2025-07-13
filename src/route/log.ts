import { Router, Request, NextFunction } from 'express';
import  { JRequest } from '../lib/express';
import Logger from '../lib/logger';
import Config from '../config';
import { LoggerHandler } from '../log/loggerHandler';


let logger = new Logger()
new LoggerHandler(logger)

let createLogRouter = function (logger: Logger): Router {
    const logRouter = Router();
    logRouter.use('/*', (req: Request, res, next) => {
        let jreq = req as JRequest

        jreq.log.info = (message: string) => {
            logger.info( message);
        }

        jreq.log.error = (message: string) => {
            logger.error( message);
        }

        jreq.log.warn = (message: string) => {
            logger.warn(message);
        }

        jreq.log.log = (key: string, message: string) => {
            logger.log(key, message);
        }

        jreq.interval.set('request',jreq.interval.get('request')+1)

        next();
    })
    
    logRouter.get('/', (req, res, next) => {
        let jreq = req as JRequest

        if (jreq.query.q) {
            jreq.log.info(JSON.stringify({
                name: '用户正在搜索',
                query: jreq.query.q,
                ua: req.headers['user-agent']
            }))
        } else {
            jreq.log.info(JSON.stringify({
                name: '主页被访问',
                ua: req.headers['user-agent']
            }))
        }


        next()
    })
    
    logRouter.get('/imgp/*', (req, res, next) => {
        let jreq = req as JRequest

        jreq.log.info(JSON.stringify({
            name: '图片代理',
            target:req.query.q,
            ua: req.headers['user-agent']
        }))

        next()
    })
    
    logRouter.get('/searchHint', (req, res, next) => {
        let jreq = req as JRequest

        jreq.log.info(JSON.stringify({
            name: '自动补全',
            query: req.query.q,
            ua: req.headers['user-agent']
        }))

        next()
    })


    let rlog = (req: Request, res : any , next: NextFunction): void => {
        let jreq = req as JRequest

        jreq.log.info(JSON.stringify({
            name: '静态资源',
            url: req.path
        }))

        next()
    }

    logRouter.get('/css/*', rlog)
    logRouter.get('/js2/*', rlog)
    logRouter.get('/image/*', rlog)
    logRouter.get('/icon.ico', rlog)
    logRouter.get('test', rlog)



    return logRouter;
}

if (!Config.log) {
    createLogRouter = (logger: Logger): Router => {
        let logRouter = Router();
        logRouter.use('/*', (req, res, next) => {
            let jreq = req as JRequest
            jreq.interval.set('request',jreq.interval.get('request')+1)
            next();
        })
        return logRouter;
    }
}


let logRouter = createLogRouter(logger)

export default logRouter