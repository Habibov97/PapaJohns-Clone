let api

export default  api = {
    getAllData : async () => await (await fetch("https://papaapi.yetim.me/food")).json()
}