import { Router } from "express"
import Interval from "../lib/interval"
import Config from "../config"
import { JRequest } from "../lib/express"
import { writeFile } from "fs"
import { join } from "path"


let interval = new Interval<number>(Config.intervalTime)
interval.set('search', 0)
interval.set('search-hint', 0)
interval.set('image-proxy', 0)
interval.set('error', 0)
interval.set('request', 0)
if (Config.intervalSave) {
    interval.registerCallback((interval: Interval<number>) => {
        let obj: any = {}
        interval.listKeys().forEach(key => {
            obj[key] = interval.get(key)
        })
        writeFile(join(Config.intervalPath, Date.now().toString() + ".json"), JSON.stringify(obj), () => { })
    })
}

let intervalRouter = Router()

intervalRouter.use((req, res, next) => {
    let jreq = req as JRequest
    jreq.interval = interval
    next()
})

export default intervalRouter