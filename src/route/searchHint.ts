import { Router } from "express";
import { successResponse , errorResponse } from "../lib/webJson";
import SearchHint from "../lib/searchHint";
import Config from "../config";


const searchHintRouter = Router();

searchHintRouter.get("/",async (req, res) => {
    if(!req.query.q) {
        res.status(200).json(errorResponse({message: "Query parameter 'q' is missing."}));
    }


    const searchHint = new SearchHint(req.query.q as string);
    let ok = await searchHint.get();

    if(ok == Config.code.success){
        res.status(200).json(successResponse({hints: searchHint.getHints()}));
    }else{
        res.status(200).json(errorResponse({message: "Error while fetching search hints."}));
    }
});

export default searchHintRouter;