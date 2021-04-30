export const getRandomMeal = ()=>{
    return fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(data=>data.json()).then(r=>r.meals[0])
}
export const getFullMenu = (dataId) =>{
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dataId}`).then(data=>data.json())
}