import { join } from "path"

export default class Config {
    public static readonly searchApiKey = process.env.SEARCH_API_KEY as string
    public static readonly searchPath = "https://www.googleapis.com/customsearch/v1"
    public static readonly searchCx = process.env.SEARCH_CX as string
    public static readonly searchHint = process.env.SEARCH_HINT as string
    
    
    
    
    
    public static readonly port =process.env.PORT || 3000
    public static readonly logPath = join(__dirname, "..","logs")


    public static readonly log = false 



    public static code = {
        success : "success",
        error : "error"
    }


}