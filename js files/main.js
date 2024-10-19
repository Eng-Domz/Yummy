window.onload = function () {
    document.getElementById('loading').style.display = 'flex';
    const currentPage = window.location.pathname.split('/').pop();
    let loadingDuration = 3000;
    setTimeout(function () {
        document.getElementById('loading').style.display = 'none';
    }, loadingDuration);
};

const size = $(".slider .content").outerWidth(true);

$(".slider").animate({ left: -size }, 0);
$(".content .top a").slideUp(0);
let flag = true;

$("#close").on('click', function () {

    if (flag == true) {
        $(".slider").animate({ left: 0 }, 500);
        $(".content .top a").slideDown(500);
        $("#one").addClass("d-none");
        $("#two").removeClass("d-none");
        flag = false
    } else {
        flag = true
        $(".slider").animate({ left: -size }, 500);
        $(".content .top a").slideUp(500);
        $("#one").removeClass("d-none");
        $("#two").addClass("d-none");

    }
});




function putLoad() {
    $(".loader").addClass("loader-active");
}
function removeLoad() {
    $(".loader").removeClass("loader-active");
}



let res;
let data;


// index
let input = document.getElementById("input");
if (input != null) {
    for (var i = 0; i < 25; i++) {
        getMeal();
    }
}

async function getMeal() {
    try {
        res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        data = await res.json();
        await putPic(input, 0);
        getIdData();
    } catch (error) {
        console.log("Error getting meals");
    }

}





// search
let inputSearch = document.getElementById("input-search");
let nameInput = document.getElementById("byName");
let inLoop = 1;
if (inputSearch != null) {
    nameInput.addEventListener("input", function () {

        getMealsByName(nameInput.value);
    })
}
async function getMealsByName(test) {
    res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${test}`);
    data = await res.json();


    for (var i = 0; i < data.meals.length; i++) {
        await putPic(inputSearch, i);
    }
    inLoop = 0;
    getIdData();
}


let letterInput = document.getElementById("byLetter");
if (letterInput != null) {
    letterInput.addEventListener("input", function () {
        getMealsByletter(letterInput.value);
    })
}
async function getMealsByletter(test) {

    res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${test}`);
    data = await res.json();
    if (letterInput.value == "") {
        inputSearch.innerHTML = "";
    } else {
        for (var i = 0; i < data.meals.length; i++) {
            await putPic(inputSearch, i);
        }
        inLoop = 0;

    }
    getIdData();

}





// both

async function putPic(dummy, x) {

    if (inLoop == 1) {

        dummy.innerHTML += (`<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
            <div id="${data.meals[x].idMeal}" class="inner border-0 rounded-2">
                <div class="image-container border-0 rounded-2">
                    <img src="${data.meals[x].strMealThumb}"  alt="Sushi" class="img-fluid">
                   <a href="../html files/details.html" > <div class="overlay border-0 rounded-2">
                        <div class="info  fs-2">${data.meals[x].strMeal}</div>
                    </div></a>
                </div>
            </div>
    </div>`)
    }
    else {
        dummy.innerHTML = "";
        inLoop = 1;
        dummy.innerHTML += (`<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
            <div id="${data.meals[x].idMeal}" class="inner border-0 rounded-2">
                <div  class="image-container border-0 rounded-2">
                    <img src="${data.meals[x].strMealThumb}" alt="Sushi" class="img-fluid">
                    <a href="../html files/details.html" > <div  class="overlay border-0 rounded-2">
                        <div class="info  fs-2">${data.meals[x].strMeal}</div>
                    </div></a>
                </div>
            </div>
    </div>`)
    }



}




function getIdData() {

    $(".inner").on("click", function () {
        importantId = $(this).attr("id");
        localStorage.setItem("id", importantId);

    })
};
let imgCover = document.getElementById("image-container");
let mealName = document.getElementById("mealName");
let recipe = document.getElementById("instructions");
let info = document.getElementById("info");
let tagHtml = document.getElementById("tags");
var buttons = document.getElementById("buttons");

if (imgCover != null) {
    let temp = localStorage.getItem("id");
    parseInt(temp);
    getMealInfo(temp);
}
async function getMealInfo(id) {
    try {
        res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        data = await res.json();

        printInfo(data);

    } catch (error) {
        console.log("erorrr");

    }
}

function printInfo(data) {
    imgCover.innerHTML = `<img src="${data.meals[0].strMealThumb}" alt="Sushi" class=" w-100 img-fluid">
    <h2 class="mt-4 text-white">${data.meals[0].strMeal}</h2>`;

    recipe.innerHTML = `<h2>Instructions</h2>
                <p>${data.meals[0].strInstructions}</p>`;

    info.innerHTML = `<p>
                <h5>Area : <span class="fw-light">${data.meals[0].strArea}</span></h5>
                <h5>Category : <span class="fw-light">${data.meals[0].strCategory}</span></h5>
                <h5>Receipes : </span></h5>
                </p>`

    var flag2 = true;
    var index = 1;

    while (flag2) {
        var d1 = data.meals[0][`strIngredient${index}`];
        var d2 = data.meals[0][`strMeasure${index}`];

        if (!d1) {
            flag2 = false;
        } else {
            info.innerHTML += `
                            <span class="badge p-2 m-1 fs-6 text-bg-secondary">
                                <span class="badge text-bg-info">${d2}</span> ${d1} 
                            </span>
                        `;
            index++;
        }
    }
    var tags = data.meals[0].strTags;
    if (tags != null) {
        var tagsArray = tags.split(",");

        for (let i = 0; i < tagsArray.length; i++) {

            tagHtml.innerHTML += `<span class="badge p-3 me-3 fs-6 text-bg-secondary">${tagsArray[i]}</span>`;
        }
    } else {
        tagHtml.innerHTML += `<span class="badge p-3 me-3 fs-6 text-bg-secondary">No Tags available!</span>`;
    }

    if (buttons != null) {
        buttons.innerHTML += ` <button class="btn me-2 btn-outline-success" id="btnSorce"><a class="text-white" href="${data.meals[0].strSource}">Source</a></button>
              <button class="btn me-2 btn-outline-danger" id="btnYou"><a class="text-white" href="${data.meals[0].strYoutube}">Youtube</a></button>`;

    }


}



// category
var cats = document.getElementById("input-cats");
if (cats != null) {
    getCats();
}

async function getCats() {
    try {
        res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        data = await res.json();
        putCat(data.categories);
        getIdData();
    } catch (error) {
        console.log("Error getting meals");
    }
}

async function putCat(arr) {

    for (var i = 0; i < arr.length; i++) {
        cats.innerHTML += `<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
                    <div class="inner border-0 rounded-2" id="${arr[i].strCategory}">
                        <div class="image-container border-0 rounded-2">
                            <img src="${arr[i].strCategoryThumb}"  alt="Sushi" class="img-fluid">
                           <a href="../html files/catresult.html" > <div class="overlay text-center d-flex flex-column border-0 rounded-2">
                                <div class="info  fs-4">${arr[i].strCategory}</div>
                                <div class="info  fs-6">${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</div>
                            </div></a>
                        </div>
                    </div>
            </div>`;
    }
}

var catsRes = document.getElementById("input-cats-res");
if (catsRes != null) {
    getCatsRes();

}

async function getCatsRes() {
    try {
        var name = localStorage.getItem("id");
        res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
        data = await res.json();
        putCatRes(data.meals);
        getIdData();
    } catch (error) {
        console.log("eror");
    }
}

async function putCatRes(data) {


    for (var i = 0; i < data.length; i++) {
        catsRes.innerHTML += `<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
                    <div class="inner border-0 rounded-2" id="${data[i].idMeal}">
                        <div class="image-container border-0 rounded-2">
                            <img src="${data[i].strMealThumb}"  alt="Sushi" class="img-fluid">
                           <a href="../html files/details.html" > <div class="overlay text-center d-flex flex-column border-0 rounded-2">
                                <div class="info  fs-4">${data[i].strMeal}</div>
                            </div></a>
                        </div>
                    </div>
            </div>`;
    }
}



var area = document.getElementById("input-area");
if (area != null) {
    getArea();
}

async function getArea() {
    try {
        res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        data = await res.json();
        putArea(data.meals);
        getIdData();
    } catch (error) {
        console.log("Error getting meals");
    }
}

async function putArea(data) {
    for (let i = 0; i < 29; i++) {
        area.innerHTML += `<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
                    <div class="inner border-0 rounded-2" id="${data[i].strArea}">
                        <div class="image-container border-0 rounded-2 flex-column mt-2 d-flex text-center g-4">
                           <a href="../html files/areares.html" class="text-white " >  
                           <i class="fas big fa-house-laptop" ></i> 
                           <h2>${data[i].strArea}</h2>
                           </a>
                        </div>
                    </div>
            </div>
        `;

    }
}



var areaRes = document.getElementById("input-area-res");
if (areaRes != null) {
    getAreaRes();
}

async function getAreaRes() {
    try {
        var op = localStorage.getItem("id");
        res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${op}`);
        data = await res.json();
        putAreaRes(data.meals);
        getIdData();
    } catch (error) {
        console.log("Error getting meals");
    }
}

async function putAreaRes(data) {
    for (let i = 0; i < data.length; i++) {
        areaRes.innerHTML += `<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
            <div id="${data[i].idMeal}" class="inner border-0 rounded-2">
                <div  class="image-container border-0 rounded-2">
                    <img src="${data[i].strMealThumb}" alt="Sushi" class="img-fluid">
                    <a href="../html files/details.html" > <div  class="overlay border-0 rounded-2">
                        <div class="info  fs-2">${data[i].strMeal}</div>
                    </div></a>
                </div>
            </div>
    </div>
        `;

    }
}



var ingredients = document.getElementById("input-ingredients");
if (ingredients != null) {
    getIngredients();
}

async function getIngredients() {
    try {
        res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        data = await res.json();
        putIngredients(data.meals);
        getIdData();
    } catch (error) {
        console.log("Error getting meals");
    }
}

async function putIngredients(data) {
    for (let i = 0; i < 25; i++) {
        ingredients.innerHTML += `<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
                    <div class="inner border-0 rounded-2" id="${data[i].strIngredient}">
                        <div class="image-container border-0 rounded-2 flex-column mt-2 d-flex text-center g-4">
                           <a href="../html files/ingredientsres.html" class="text-white " >  
                           <i class="fas big fa-utensils" ></i> 
                           <h2>${data[i].strIngredient}</h2>
                           <p>${data[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                           </a>
                        </div>
                    </div>
            </div>
        `;

    }
}


var ingredientRes = document.getElementById("input-ingredients-res");
if (ingredientRes != null) {
    getIngredientsRes();
}

async function getIngredientsRes() {
    try {
        var op = localStorage.getItem("id");
        res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${op}`);
        data = await res.json();
        putIngredientsRes(data.meals);
        getIdData();
    } catch (error) {
        console.log("Error getting meals");
    }
}

async function putIngredientsRes(data) {
    for (let i = 0; i < data.length; i++) {
        ingredientRes.innerHTML += `<div class="col-lg-3 col-md-4 col-12 overflow-hidden rounded-4">
            <div id="${data[i].idMeal}" class="inner border-0 rounded-2">
                <div  class="image-container border-0 rounded-2">
                    <img src="${data[i].strMealThumb}" alt="Sushi" class="img-fluid">
                    <a href="../html files/details.html" > <div  class="overlay border-0 rounded-2">
                        <div class="info  fs-2">${data[i].strMeal}</div>
                    </div></a>
                </div>
            </div>
    </div>
        `;

    }
}


document.getElementById("nameInput").addEventListener("input", function () {
    validateName();
    validateForm();

});
document.getElementById("emailInput").addEventListener("input", function () {
    validateEmail();
    validateForm();

});
document.getElementById("phoneInput").addEventListener("input", function () {
    validatePhone();
    validateForm();

});
document.getElementById("ageInput").addEventListener("input", function () {
    validateAge();
    validateForm();

});
document.getElementById("passwordInput").addEventListener("input", function () {
    validatePassword();
    validateForm();

});
document.getElementById("repasswordInput").addEventListener("input", function () {
    validateRepassword();
    validateForm();

});

function validateName() {
    const name = document.getElementById("nameInput").value;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        return false;
    } else {
        document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        return true;
    }

}

function validateEmail() {
    const email = document.getElementById("emailInput").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        return false;
    } else {
        document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        return true;
    }
}

function validatePhone() {
    const phone = document.getElementById("phoneInput").value;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        return false;
    } else {
        document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        return true;
    }
}

function validateAge() {
    const age = document.getElementById("ageInput").value;
    const ageRegex = /^(?:1[89]|[2-9]\d)$/; 
    if (!ageRegex.test(age)) {
        document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        return false;
    } else {
        document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        return true;
    }
}

function validatePassword() {
    const password = document.getElementById("passwordInput").value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    if (!passwordRegex.test(password)) {
        document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        return false;
    } else {
        document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        return true;
    }
}

function validateRepassword() {
    const password = document.getElementById("passwordInput").value;
    const repassword = document.getElementById("repasswordInput").value;
    if (password !== repassword) {
        document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        return false;
    } else {
        document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        return true;
    }
}

function validateForm() {

    const submitButton = document.getElementById("submitBtn");

    if (validateName() && validateEmail() && validatePhone() && validateAge() && validatePassword() && validateRepassword()) {
        submitButton.classList.remove("disabled");

    } else {
        submitButton.classList.add("disabled");

    }
}
