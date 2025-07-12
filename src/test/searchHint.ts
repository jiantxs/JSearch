import SearchHint from "../lib/searchHint"

const searchHint = new SearchHint("hello")
searchHint.get().then(data => {
    console.log(data)

    let r = searchHint.getHints();

    console.log(r)
})