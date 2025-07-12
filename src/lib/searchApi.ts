import Config from "../config"
import { SearchResponseParser , Result } from "./SearchResponseParser"

class Search{
    private apiKey:string = Config.searchApiKey
    private path:string = Config.searchPath
    private cx:string = Config.searchCx
    private error:Error | null = null

    private data:SearchResponseParser | null = null


    constructor(private query:string , private page:number = 1){
        
    }


    async get():Promise<string>{
        try {
            const url = `${this.path}?key=${this.apiKey}&cx=${this.cx}&q=${this.query}&start=${(this.page - 1) * 10}&num=10&gl=cn&hl=zh-CN`
            const response = await fetch(url)
            const data = await response.json()

            if(data.error){
                this.error = data.error
                return Config.code.error
            }


            this.data = new SearchResponseParser(data)
            return Config.code.success
        } catch (error) {
            this.error = error as Error
            return Config.code.error
        }
    }


    getResults():Result[] {
        return this?.data?.items || []
    }



    getError():Error | null {
        return this.error
    }
}


export default Search