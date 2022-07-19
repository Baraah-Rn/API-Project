// selection part
const searchBtn = document.getElementById("search-btn");
const searchBar = document.getElementById("search-input");
const closeBtn = document.getElementById("close-recipe-btn");
const mealsList = document.getElementById("meal");
const luckBtn = document.getElementById("luck-btn")
const mealDetails = document.querySelector(".meal-details-box")
const favoriteList = document.getElementById("favorite-container")


// event listener part
searchBtn.addEventListener("click", getTheMealList)
luckBtn.addEventListener("click", surpriseMe)
closeBtn.addEventListener("click", closeRecipes)
searchBar.addEventListener("keyup", pressEnter)
mealsList.addEventListener("click", getTheRecipe)

//Global value to store the favorite List
let favArray = [];
closeFavBtn = document.querySelector(".showFavList");
closeFavBtn.addEventListener("click", favoriteListHandler)



// functions

//reusable fetch function
function fetchMealById(id) {
    let idUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    let data = fetch(idUrl)
        .then((response) => {
            if (!response.ok) {
                alert("Error, 404.");
                throw new Error("There is a response problem ");
            }
            return response.json();
        })

    return data

}

//get the list of the meals based on the ingredient
function getTheMealList() {
    let searchInput = document.getElementById("search-input").value.trim();
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;

    if (searchInput.length === 0) {
        let error = "Please type an ingredient..."
        handelError(error)
    } else {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    alert("Error, 404.");
                    throw new Error("There is a response problem ");
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
                    <h2>${meal.strMeal}  <i title="Add to favorite" class="far fa-heart favorite-btn"></i> </h2>
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
                let error = "OOPS, some thing went wrong...."
                handelError(error)
            });
    }


}
//Open the card recipe function 
function getTheRecipe(event) {
    event.preventDefault();
    if (event.target.classList.contains("recipe-btn")) {
        let items = event.target.parentElement.parentElement
        fetchMealById(items.id)
            .then(data => recipeCard(data.meals))
            .catch(error => {
                handelError()
            });

        mealsList.classList.remove("not-found")


    } //working on Storage
    else if (event.target.classList.contains("favorite-btn")) {
        const mealId = event.target.parentElement.parentElement.parentElement.id;
        let loveButton = event.target

        if (favArray.includes(mealId)) {
            alert("This meal is already in favorite list.")
        } else {
            console.log(loveButton)
            loveButton.classList.add("love-btn")

            favArray.push(mealId);
            localStorage.setItem("favorite", favArray)
            favoriteListFunc(mealId)
        }


    }
}

// Display and manege the Recipe card 
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


//Get random recipe function 
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


//using this func inside surpriseMeFunc to get the Data
function surpriseData(meal) {
    meal = meal[0];
    let surprise = `<div class="meal-item" id="${meal.idMeal}">
 <section class="meal-img">
     <img src="${meal.strMealThumb}" alt="food">
 </section>
 <section class="meal-name">
     <h2>${meal.strMeal}  <i title="Add to favorite" class="far fa-heart favorite-btn"></i></h2>
     <a href="#" class="recipe-btn">Get Recipe</a>
 </section>
</div>`;

    mealsList.innerHTML = surprise;
    document.querySelector(".recipe-btn").addEventListener("click", getTheRecipe)

}



// Display the img of the favorite List function
function favoriteListFunc(id) {
    fetchMealById(id).then(data => {
        const meal = data.meals[0];
        if (meal) {
            favLi = `<img  class = "fav-img" src="${meal.strMealThumb}" alt="food">
                <i class="fas fa-times closeFav" id = "${id}"></i>`
            let ul = document.getElementById("fav-UL");
            let li = document.createElement("li");

            li.innerHTML = favLi
            ul.appendChild(li);


        }
    })
        .catch(() => {
            let error = "OOPS, some thing went wrong...."
            handelError(error)

        });
}

function favoriteListHandler(event) {
    event.preventDefault();
    //Delete element from favorite list
    if (event.target.classList.contains("closeFav")) {
        const deleteElement = event.target.id
        document.getElementById(deleteElement).parentElement.remove();

        let deleteFromArray = favArray.indexOf(deleteElement);

        favArray.splice(deleteFromArray)

        //show full recipe when click on the img
    } else if (event.target.classList.contains("fav-img")) {
        let id = event.target.parentElement.children[1].id
        fetchMealById(id)
            .then(data => recipeCard(data.meals))
            .catch(error => {
                handelError()
            });

    }

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
    searchBar.value = '';

}
