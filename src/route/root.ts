import { Router, Request, Response } from 'express'
import Config from '../config'

import Search from '../lib/searchApi'
import { JRequest } from '../lib/express'
import { getData } from '../test/data';

let rootRouter = Router();

rootRouter.get('/', async (req: Request, res: Response) => {
    let ua = req.headers['user-agent'] as string || 'Windows NT';
    let platfrom = ua.includes("Android") || ua.includes("iPhone") || ua.includes("iPad")
    let jreq = req as JRequest;
    let postMessage = {
        snum: jreq.interval.get('search'),
        hnum: jreq.interval.get('search-hint'),
        iprnum: jreq.interval.get('image-proxy'),
        enum: jreq.interval.get('error'),
        rnum: jreq.interval.get('request'),

        slim: Config.searchPerInterval,
        hlim: Config.searchHintPerInterval,
        itime: Config.intervalTime
    }

    if (req.query.q) {
        let obj = {}
        let ok = false



        if (jreq.interval.get('search') >= Config.searchPerInterval) {
            res.render('error', { obj })

            jreq.interval.set('error', jreq.interval.get('error') + 1)
            jreq.log.error(JSON.stringify({
                name: '搜索错误-超出次数上限',
                q: jreq.query.q,
                err: null
            }));
            return
        }



        let search = new Search(req.query.q as string, req.query.page ? parseInt(req.query.page as string) : 1);

        if ((await search.get()) == Config.code.success) {
            obj = {
                q: req.query.q,
                ok: true,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                results: search.getResults(),
                error: search.getError(),
                title: 'JSearch--' + req.query.q
            }

            ok = true

        } else {
            obj = {
                q: req.query.q,
                ok: false,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                results: [],
                error: search.getError(),
                title: 'JSearch--' + req.query.q
            }
        }

        /*         obj = getData();
                ok = true */

        if (!ok) {
            res.render('error', { obj })

            jreq.interval.set('error', jreq.interval.get('error') + 1)
            jreq.log.error(JSON.stringify({
                name: '搜索错误',
                q: jreq.query.q,
                err: search.getError()
            }));
            return
        }

        jreq.interval.set('search', jreq.interval.get('search') + 1)

        if (platfrom) {
            res.render('mobile/search', {
                obj,
                postMessage
            })
        } else {
            res.render('search', {
                obj,
                postMessage
            })
        }
        return;


    }
    if (platfrom) {
        res.render('mobile/index', {
            title: 'JSearch',
            postMessage
        });
    } else {
        res.render('index', {
            title: 'JSearch',
            postMessage
        });
    }


});


export default rootRouter;