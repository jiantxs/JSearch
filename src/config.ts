import { join } from "path"

export default class Config {
    public static readonly searchApiKey = process.env.SEARCH_API_KEY as string
    public static readonly searchPath = "https://www.googleapis.com/customsearch/v1"
    public static readonly searchCx = process.env.SEARCH_CX as string
    public static readonly searchHint = process.env.SEARCH_HINT as string

    
    
    
    
    public static readonly port =process.env.PORT || 3000


    public static readonly log = true
    public static readonly logPath = join(__dirname, "..","logs","log")
    public static readonly logOnConsole = false
    public static readonly logToFile = true


    public static readonly intervalTime = 3
    public static readonly searchPerInterval = 300
    public static readonly searchHintPerInterval = 900
    public static readonly intervalSave = true
    public static readonly intervalPath = join(__dirname, "..","logs","data")




    public static code = {
        success : "success",
        error : "error"
    }


}