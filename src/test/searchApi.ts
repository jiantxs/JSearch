import Search from '../lib/searchApi';
import { Result } from '../lib/SearchResponseParser'
import Config from '../config'

const search = new Search('test',2);

async function test(){
    const data = await search.get();
    console.log(data);

    if(data != Config.code.error){
        let results:Result[] = search.getResults();
        console.log(JSON.stringify(results[0]));
    }else{
        console.log(search.getError());
    }
}

test();