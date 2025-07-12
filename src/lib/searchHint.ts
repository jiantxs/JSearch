import Config from '../config'


class SearchHint {
    private path = Config.searchHint
    private data:string = ""
    private error:Error| null = null

    constructor(private query: string){

    }


    async get() : Promise<string> {
        const url = `${this.path}&q=${this.query}`
        try{
            const response = await fetch(url)
            const data = await response.text()
            this.data = data
            return Config.code.success
        }catch(e){
            this.error = e as Error
            return Config.code.error
        }
    }


    getHints() : string[] {
        let re1 = this.data.replace("call && call(","")
        re1 = re1.substring(0, re1.length - 1)
        try{
            let arr = JSON.parse(re1)[1]
            arr = arr.map((element: any) => {
                return element[0]
            });
            return arr
        }catch(e){
            return []
        }

    }


    getError() : Error| null {
        return this.error
    }
}


export default SearchHint