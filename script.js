// selection part
const searchBtn = document.getElementById("search-btn");
const searchBar = document.getElementById("search-input");
const cancelBtn = document.getElementById("close-recipe-btn");
const mealsList = document.getElementById("meal");
const luckBtn = document.getElementById("luck-btn")
const mealDetails = document.querySelector(".meal-details-box")
const favoriteLi = document.getElementById("favorite-container")

// event listener part
searchBtn.addEventListener("click", getTheMealList)
luckBtn.addEventListener("click", surpriseMe)
mealsList.addEventListener("click", getTheRecipe)
cancelBtn.addEventListener("click", closeRecipes)
searchBar.addEventListener("keyup", pressEnter)



// functions
function getTheMealList() {
    let searchInput = document.getElementById("search-input").value.trim();
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;

    if (searchInput.length === 0) {
        let error = "Please type an ingredient or a meal..."
        handelError(error)
    } else {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    alert("No Results found.");
                    throw new Error("No Results found");
                }
                return response.json();
            })
            .then(data => {
                let itemsListHTML = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        itemsListHTML += `
                <div class="meal-item" id="${meal.idMeal}">
                <section class="meal-img">
                    <img src="${meal.strMealThumb}" alt="food">
                </section>
                <section class="meal-name">
                    <h2>${meal.strMeal} <a href="#" type="submit" title="Add to favorite" class=" favorite-btn">
                    <i class="far fa-heart"></i>
                </a></h2>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                   
                </section>
            </div>`
                    });
                    mealsList.classList.remove("not-found")
                } else if (data.meals === null) {
                    itemsListHTML = "Sorry, we couldn't find any results for you"
                    mealsList.classList.add("not-found")
                }
                mealsList.innerHTML = itemsListHTML;
            })

            .catch(() => {
                let error = "OOPS, some thing went wrong."
                handelError(error)
            });
    }
}

function getTheRecipe(event) {
    event.preventDefault();
    if (event.target.classList.contains("recipe-btn")) {
        let items = event.target.parentElement.parentElement
        let urlDetails = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${items.id}`
        fetch(urlDetails)
            .then((response) => {
                if (!response.ok) {
                    alert("No Recipe found.");
                    throw new Error("No Recipefound");
                }
                return response.json();
            })
            .then(data => recipeCard(data.meals))
            .catch(error => {
                handelError()
            });

        mealsList.classList.remove("not-found")
    } else {
        let error = "OOPS, some thing went wrong."
        handelError(error)
    }
}

function recipeCard(meal) {
    meal = meal[0]
    let mealCardHTML = `
                   <h1 class="meal-title">${meal.strMeal}</h1>
                    <p class="recipe-category">Meal category :${meal.strCategory}</p>
                    <p class="recipe-category"> Meal Area : ${meal.strArea}</p>
                    <div class="recipe-instruct">
                        <h3> The Instructors :</h3>
                        <p class= "meal-instruct">${meal.strInstructions}</p>
                    </div>
                    <div class="recipe-link">
                        <a href="${meal.strYoutube}" target="_blank">Watch Video Here</a>
                    </div>
                `;
    mealDetails.innerHTML = mealCardHTML;
    mealDetails.parentElement.classList.add("showRecipes");
}


function surpriseMe() {
    let surpriseUrl = " https://www.themealdb.com/api/json/v1/1/random.php"
    fetch(surpriseUrl)
        .then((response) => {
            if (!response.ok) {
                alert("No Results found.");
                throw new Error("No Results found");
            }
            return response.json();
        })
        .then(data => surpriseData(data.meals))
        .catch(error => {
         error = "Sorry, We think you aren't lucky today."
        handelError(error)
        });
    }

function surpriseData(meal) {
    meal = meal[0];

    let surprise = `<div class="meal-item" id="${meal.idMeal}">
 <section class="meal-img">
     <img src="${meal.strMealThumb}" alt="food">
 </section>
 <section class="meal-name">
     <h2>${meal.strMeal}</h2>
     <a href="#" class="recipe-btn">Get Recipe</a>
 </section>
</div>`;

    mealsList.innerHTML = surprise;
}



function closeRecipes() {
    mealDetails.parentElement.classList.remove("showRecipes")
}

function pressEnter(event) {
    if (event.key == "Enter") {
        getTheMealList()
    }
}


function handelError(message) {
    mealsList.classList.add("not-found");
    mealsList.innerHTML = message;
}

window.onunload = function () {
    searchBar.value = ' ';
}



