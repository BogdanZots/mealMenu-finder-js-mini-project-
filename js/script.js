import {getRandomMeal} from './service.js'
import {getFullMenu} from './service.js'

const searchBtn = document.getElementById('search-btn')
const meal = document.getElementById('search')
const mealsArea = document.getElementById('meals')
const randomBtn = document.getElementById('random')
let content = document.createElement('div')
content.classList.add('ingidietsContainer')


const getSertainMeal = () => {
    const gif = document.createElement('img')
    gif.src = "assets/giphy.gif"
    mealsArea.append(gif)
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal.value}`).then((res) => res.json())
}

const createHTML = (mealName, mealImg, mealIndex, mealInstruction, mealIngredeants, showFullInfo, receiptsArray) => {
        const mealItem = document.createElement('div')
        showFullInfo ? mealItem.classList.add('showFullInfo') : null
        let concatedArray = []
        let anotherArrray = []
        return mealItem.innerHTML =
        `
        ${showFullInfo ? 
            
            `<div class="showFullInfo">
            <div class="mealFullName">${mealName}</div>
             <img class="mealFullImg" src=${mealImg}>
             <div class="mealFullInfo">${mealInstruction}</div>
             <div class="mealIngridients">Ingridients</div>
             <div class="mealIngridients-hidden">
             Ingridients
             ${receiptsArray.forEach((item,i)=>{
                concatedArray = Array.from(
                { length: receiptsArray.length / 2 },
                (n, i) => ({ ...receiptsArray[i], ...receiptsArray[i + receiptsArray.length / 2] })
              )
              try{
                if(concatedArray[i].ingridient!='' && concatedArray[i].measures){
                    anotherArrray.push(concatedArray[i].ingridient + concatedArray[i].measures)
                    content.innerHTML +=`<div class="inline">${anotherArrray[i]}</div>`;
                              mealsArea.insertAdjacentElement('afterend', content)
              }
             }
             catch {
                 return
             }
             })
             } `:
             `<div class=${mealInstruction ? "mealFull" : "meal"}>
            <img src="${mealImg}" class=${mealInstruction ? "meal-infoFull" : "meal-img"}>
            <div class=${mealInstruction ? '' : "meal-info"} data-mealid="${mealIndex}">${mealName}</div>
            ${mealInstruction ? `<div>${mealInstruction}</div>` : ''}
            ${mealIngredeants ? `<div>${mealIngredeants}</div>` : ''}
            </div>`
             }
             `
             }
        const render = data => {
            mealsArea.innerHTML = ''
            data.forEach(meal => {
                mealsArea.insertAdjacentHTML('beforeend', createHTML(meal.strMeal, meal.strMealThumb, meal.idMeal))
            });
            const testArray = Array.from(mealsArea.children)
            testArray.forEach(item => {
                item.addEventListener('click', function (e) {
                    showFullInfo(e.target.dataset.mealid)
                })
            })
        }

        function showFullInfo(dataId) {
           getFullMenu(dataId).then((res)=> {
                let mealFullInfoArray = Object.entries(res.meals[0])
                let arrayOfIngridients = [];
                let arrayOfMeasures = [];
                mealFullInfoArray.forEach((item) => {
                    item.forEach((strIngridient) => {
                        if (/^strIngredient\d+$/.test(strIngridient)) {
                            arrayOfIngridients.push({
                                ingridient: item[1]
                            })
                        }
                        if (/^strMeasure\d+$/.test(strIngridient)) {
                            arrayOfMeasures.push({
                                measures: item[1]
                            })
                        }
                    })
                })
                const receiptsArray = arrayOfIngridients.concat(arrayOfMeasures)
                mealsArea.innerHTML = ''
                const meal = res.meals[0]
                mealsArea.insertAdjacentHTML('beforeend', createHTML(meal.strMeal, meal.strMealThumb, meal.idMeal, meal.strInstructions, null, true, receiptsArray))
            })
        }
        searchBtn.addEventListener('click', e => {
            content.innerHTML = ''
            e.preventDefault()
            getSertainMeal()
                .then(data => {
                    render(data.meals)
                })
        })
        randomBtn.addEventListener('click', () => {
            getRandomMeal().then(data => data).then(meal => {
                showFullInfo(meal.idMeal)
            })
        })