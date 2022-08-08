const meals = document.getElementById("meals");
const favMealsContainer = document.getElementById("fav-meals");
const meh = document.getElementById("mine");
const mealInfo = document.getElementById("meals-info");
const searchTerm = document.getElementById("search-name");
const searchBtn = document.getElementById("search");
const mealPopup= document.getElementById("meal-popup");
const popInfo = document.getElementById("popup-info");
const closePopupBtn = document.getElementById("close-popup");

getRandomMeal();
fetchFavMeals();
flag=0;
async function getMealBySearch(name){
    const searchedMeal= await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+name);
    const mealArray=await searchedMeal.json();
    const meals =  mealArray.meals;
    return meals;
}
async function getMealByID(id){
    const response=await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const mealArray=await response.json();
    const meal = mealArray.meals[0];
    return meal;
}
async function getRandomMeal(){
    const response=await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const randomMealArray =await response.json();
    const randomMeal=randomMealArray.meals[0];
    // console.log(randomMeal);

    addRandomMeal(randomMeal,true,flag);
}

function addRandomMeal(mealData,random,flag){
    // console.log(mealData);
    
    const meal=document.createElement("div");
    meal.innerHTML="";
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
            ${
                random
                ? `
                <span class="random"> Random Recipe </span>`
                    : ""
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
            <div class="refresh">
                <button class="next">
                <i class="fa-solid fa-circle-arrow-right"></i>
                </button>
            </div>
        </div>
        `;
    const fbtn = meal.querySelector(".fav-btn");
    const mh=meal.querySelector(".meal-header");
    const next=meal.querySelector(".refresh .next");
    next.addEventListener("click",()=>{
        location.reload();
    });
    fbtn.addEventListener("click",()=>{
        if(fbtn.classList.contains('active')){
            removeMealFromLocalStorage(mealData.idMeal);
            fbtn.classList.remove('active');
        }
        else{
            addMealToLocalStorage(mealData.idMeal);
            fbtn.classList.add('active');
            // console.log(mealData.idMeal);
        }
        fetchFavMeals();
        location.reload();
    });

    mh.addEventListener('click',()=>{
        showMealInfo(mealData);
    })
    if(flag==1){
        flag = 0;
        fbtn.classList.remove('active');
        console.log(flag);
        location.reload();
    }
    else{
        meals.appendChild(meal);
    }
}
function addMealToLocalStorage(mealId) {
    const mealIds=getMealFromLocalStorage();

    window.localStorage.setItem("mealIds",JSON.stringify([...mealIds,mealId ]));
}
function getMealFromLocalStorage() {
    
    return JSON.parse(window.localStorage.getItem("mealIds"))==null?[]:JSON.parse(localStorage.getItem("mealIds"));
}
function removeMealFromLocalStorage(mealId) {
    const mealIds=getMealFromLocalStorage();

    window.localStorage.setItem("mealIds",JSON.stringify(mealIds.filter((x) =>x!==mealId)));

}

async function fetchFavMeals(mealData,flag) {
    favMealsContainer.innerHTML=`
            <li>
                <img src="./pic.jpeg" alt="" srcset="">
                <span>me :')</span>
            </li>
        `;
    const mealIds=getMealFromLocalStorage();

    const meals = [];
    for(let i=0;i<mealIds.length;i++) {
        const mealId =mealIds[i];
        meal = await getMealByID(mealId);
        addMealToFav(meal);
        meals.push(meal);
    }
    // console.log(meals);
    if(flag==1){
        addRandomMeal(mealData,true,flag);
    }
}

function addMealToFav(mealData){
    // console.log(mealData);
    const favMeal=document.createElement("li");

    favMeal.innerHTML = `
        <img class="fav-img""
            src="${mealData.strMealThumb}" alt="${mealData.strMeal}" srcset="">
        <span>${mealData.strMeal}</span>
        <button class = "clear">
            <i class = "fas fa-window-close"></i>
        </button>
    `;
    const btn = favMeal.querySelector(".clear");
    const favImg=favMeal.querySelector(".fav-img");
    btn.addEventListener("click", () =>{
        removeMealFromLocalStorage(mealData.idMeal);
        flagf=1;
        fetchFavMeals(mealData,flagf);
    });
    favImg.addEventListener("click",()=>{
        showMealInfo(mealData);
    });
    favMealsContainer.appendChild(favMeal);
}

function showMealInfo(meal){
    popInfo.innerHTML='';
    const mealEl=document.createElement("div");
    mealEl.innerHTML=`
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <p class="description">${meal.strInstructions}</p>
    `;
    popInfo.appendChild(mealEl);
    mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async() =>{
    const search=searchTerm.value;
    meals.innerHTML='';
    // console.log(await getMealBySearch(search));
    const smeals=await getMealBySearch(search);
    if(smeals){
        smeals.forEach(meal =>{
            addRandomMeal(meal,false,flag);
        });
    }
    else{
        alert("Oops! No match found! Try another keyword.");
        location.reload();
    }
});

closePopupBtn.addEventListener('click',()=>{
    mealPopup.classList.add("hidden");
});