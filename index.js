// Loadin Screen

$(document).ready(() => {
    allName("").then(() => {
        $(".loading-screen").fadeOut(200)
        $("body").css("overflow", "visible")
    })
})

// Close,Open SideNav

$(".side-nav-menu i.open").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        close()
    } else {
        open()
    }
})
function open() {
    $(".side-nav-menu").animate({
        left: 0
    },800)
    $(".open").removeClass("fa-align-justify");
    $(".open").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5)*200)
    }
}

function close() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    },800)
    $(".open").removeClass("fa-x");
    $(".open").addClass("fa-align-justify");
    $(".links li").animate({
        top: 500
    },800)
}
close()

// Search

function search() {
    Search.innerHTML = `
    <div class="row py-4 mt-5">
    <div class="col-md-6 ">
    <input onkeyup="allName(this.value)"id="in" class="form-control bg-transparent text-light" type="text" placeholder="Search By Name"> </div>
    <div class="col-md-6">
    <input onkeyup="letter(this.value)" id="inn" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter"></div>
    </div>`
    document.getElementById("rowData").innerHTML=""
}
async function allName(srch) {
    close()
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${srch}`)
    response = await response.json()
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)
}
async function letter(srch) {
    close()
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    srch == "" ? srch = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${srch}`)
    response = await response.json()
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)
}

// MealDetails

function displayMealDetails(meal) {
    document.getElementById("Search").innerHTML = "";
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
    tagsStr += `
    <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let pack = `
    <div class="col-md-4">
    <img class="w-100 rounded-3" src="${meal.strMealThumb}">
    <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
    <h2>Instructions</h2>
    <p>${meal.strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap"> ${tagsStr}</ul>
    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`
    document.getElementById("rowData").innerHTML = pack
}

async function getMealDetails(mealID) {
    close()
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    document.getElementById("Search").innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
     displayMealDetails(respone.meals[0])
    $(".inner-loading-screen").fadeOut(300)
}

function displayMeals(m) {
    let pack = "";
    for (let i = 0; i < m.length; i++) {
        pack += `
        <div class="col-md-3">
        <div onclick="getMealDetails('${m[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
        <img class="w-100" src="${m[i].strMealThumb}" alt="" srcset="">
        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
        <h3>${m[i].strMeal}</h3>
        </div>
        </div>
        </div>`
    }
    document.getElementById("rowData").innerHTML = pack
}

// categories

async function categories() {
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    document.getElementById("Search").innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    displayCategories(response.categories)
    $(".inner-loading-screen").fadeOut(300)
}

function displayCategories(m) {
    let pack = "";
    for (let i = 0; i < m.length; i++) {
        pack += `
        <div class="col-md-3">
        <div onclick="categoryMeals('${m[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
        <img class="w-100" src="${m[i].strCategoryThumb}" alt="" srcset="">
        <div class="meal-layer position-absolute text-center text-black p-2">
        <h3>${m[i].strCategory}</h3>
        <p>${m[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
        </div>
        </div>`
    }
    document.getElementById("rowData").innerHTML=pack
}

async function categoryMeals(category) {
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

// Area

async function area() {
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    document.getElementById("Search").innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);
    displayArea(respone.meals)
    $(".inner-loading-screen").fadeOut(300)
}
function displayArea(m) {
    let pack = "";
    for (let i = 0; i < m.length; i++) {
        pack += `
        <div class="col-md-3">
        <div onclick="areaMeals('${m[i].strArea}')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${m[i].strArea}</h3>
        </div>
        </div> `
    }
    document.getElementById("rowData").innerHTML=pack
}
async function areaMeals(area) {
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

// Ingredients

async function ingredients() {
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    document.getElementById("Search").innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);
    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}
function displayIngredients(m) {
    let pack = "";
    for (let i = 0; i < m.length; i++) {
        pack += `
        <div class="col-md-3">
        <div onclick="ingredientsMeals('${m[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${m[i].strIngredient}</h3>
        <p>${m[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
        </div>`
    }
    document.getElementById("rowData").innerHTML=pack
}
async function ingredientsMeals(ingredients) {
    document.getElementById("rowData").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

// Contact

function contact() {
    document.getElementById("rowData").innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
    <div class="row g-4">
    <div class="col-md-6">
    <input id="nameInput" onkeyup="span()" type="text" class="form-control" placeholder="Enter Your Name">
    <div id="spanName" class="alert alert-danger w-100 mt-2 d-none"> Special characters and numbers not allowed </div>
    </div>
    <div class="col-md-6">
    <input id="emailInput" onkeyup="span()" type="email" class="form-control " placeholder="Enter Your Email">
    <div id="spanEmail" class="alert alert-danger w-100 mt-2 d-none"> Email not valid *exemple@yyy.zzz</div>
    </div>
    <div class="col-md-6">
    <input id="phoneInput" onkeyup="span()" type="text" class="form-control " placeholder="Enter Your Phone">
    <div id="spanPhone" class="alert alert-danger w-100 mt-2 d-none"> Enter valid Phone Number </div>
    </div>
    <div class="col-md-6">
    <input id="ageInput" onkeyup="span()" type="number" class="form-control " placeholder="Enter Your Age">
    <div id="spanAge" class="alert alert-danger w-100 mt-2 d-none">  Enter valid age </div>
    </div>
    <div class="col-md-6">
    <input  id="passwordInput" onkeyup="span()" type="password" class="form-control " placeholder="Enter Your Password">
    <div id="spanPassword" class="alert alert-danger w-100 mt-2 d-none"> Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
    </div>
    <div class="col-md-6">
    <input  id="repasswordInput" onkeyup="span()" type="password" class="form-control " placeholder="Repassword">
    <div id="spanReset" class="alert alert-danger w-100 mt-2 d-none"> Enter valid repassword </div>
    </div>
    </div>
    <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
    </div> `

let submitBtn;

    submitBtn = document.getElementById("submitBtn")
    document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched= true
    })
    document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true
    })
    document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true
    })
    document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true
    })
    document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true
    })
    document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true
    })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;


function span() {
    if (nameInputTouched) {
        if (namvalid()) {
            document.getElementById("spanName").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("spanName").classList.replace("d-none", "d-block")
        }
    }

    if (emailInputTouched) {
        if (emailvalid()) {
            document.getElementById("spanEmail").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("spanEmail").classList.replace("d-none", "d-block")
      }
    }

    if (phoneInputTouched) {
        if (phvalid()) {
            document.getElementById("spanPhone").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("spanPhone").classList.replace("d-none", "d-block")
        }
    }

    if (ageInputTouched) {
        if (agevalid()) {
            document.getElementById("spanAge").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("spanAge").classList.replace("d-none", "d-block")
        }
    }

    if (passwordInputTouched) {
        if (passvalid()) {
            document.getElementById("spanPassword").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("spanPassword").classList.replace("d-none", "d-block")
        }
    }

    if (repasswordInputTouched) {
        if (resetvalid()) {
            document.getElementById("spanReset").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("spanReset").classList.replace("d-none", "d-block")
        }
    }

    if (namvalid() &&
        emailvalid() &&
        phvalid() &&
        agevalid() &&
        passvalid() &&
        resetvalid()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function namvalid() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}
function emailvalid() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}
function phvalid() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}
function agevalid() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}
function passvalid() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}
function resetvalid() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}