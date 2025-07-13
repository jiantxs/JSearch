import JRequestMacker from "../lib/express";
import { Router } from "express";

let reqRouter = Router();

reqRouter.use((req, res, next) => {
    JRequestMacker.make(req)
    next()
})


export default reqRouter;