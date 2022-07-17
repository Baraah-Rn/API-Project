// selection part
const searchBtn = document.getElementById("search-btn");
const cancelBtn = document.getElementById("close-recipe-btn");
const mealsList = document.getElementById("meal");
const mealDetails = document.querySelector(".meal-details-box")

// event listener part
searchBtn.addEventListener("click", getTheMealList)
mealsList.addEventListener("click", getTheRecipe)



// functions
function getTheMealList() {
    let searchInput = document.getElementById("search-input").value.trim();
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let itemsList = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    itemsList += `
                <div class="meal-item" id="${meal.idMeal}">
                <section class="meal-img">
                    <img src="${meal.strMealThumb}" alt="food">
                </section>
                <section class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                </section>
            </div>`
                });
                mealsList.classList.remove("not-found")
            } else if (data.meals === null) {
                itemsList = "Sorry, we couldn't find result for you"
                mealsList.classList.add("not-found")
            }
            mealsList.innerHTML = itemsList;
        })

        .catch(error => {
            handelError()
        });

}

function getTheRecipe(event) {
    event.preventDefault();
    if (event.target.classList.contains("recipe-btn")) {
        let items = event.target.parentElement.parentElement
        let urlDetails = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${items.id}`
        fetch(urlDetails)
            .then(response => response.json())
            .then(data => console.log(data))
            // .catch(error => console.log(error));


            mealsList.classList.remove("not-found")
    } else {
        handelError()
    }
}




function handelError() {
    let error = "OOPS, some thing went wrong."
    mealsList.classList.add("not-found");
    mealsList.innerHTML = error;
}