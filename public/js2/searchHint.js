export async function searchHint(searchInput) {
    try {
        let res = await fetch(`/searchHint?q=${encodeURI(searchInput)}`)
        if(res.ok){
            let data = await res.json()
            if(data.ok){
                return data.data.hints
            }
        }

        return []
    }catch(err){
        return []
    }
}