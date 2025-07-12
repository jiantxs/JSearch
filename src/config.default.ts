import { join } from "path"

export default class Config {
    public static readonly searchApiKey = ""
    public static readonly searchPath = ""
    public static readonly searchCx = ""
    public static readonly searchHint = ""
    
    
    
    
    
    public static readonly port = 3000
    public static readonly logPath = join(__dirname, "..","logs")


    public static readonly log = true



    public static code = {
        success : "success",
        error : "error"
    }
}