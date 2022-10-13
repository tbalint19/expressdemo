const titleInput = document.getElementById("title")
const descInput = document.getElementById("description")
const pwInput = document.getElementById("password")
const addButton = document.getElementById("add")
const recipesSection = document.getElementById("recipes")

/* const getRecipesSync = (searchParam) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3000/api/recipes", false)
    xhr.onload = (e) => {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const data = xhr.responseText
            const recipes = JSON.parse(data)
            recipesSection.innerHTML = recipes.map(recipeComponent).join("")
        }
    }
    }
    xhr.send(null)
} */

const getRecipes = async (searchParam) => {
    let url = "http://localhost:3000/api/recipes"
    if (searchParam)
        url += `?filter=${searchParam}`
    const response = await fetch(url)
    const recipes = await response.json()
    return recipes
}

const postRecipe = async (title, description, password) => {
    const url = "http://localhost:3000/api/recipes"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "authcode": password,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
    })
    return response.status
}

const recipeComponent = (recipe) => {
    return `
        <article>
            <h2>${recipe.title}</h2>
            <p>${recipe.description}</p>
        </article>
    `
}

const resetForm = () => {
    titleInput.value = ""
    descInput.value = ""
    pwInput.value = ""
}

const loadRecipes = async () => {
    const recipes = await getRecipes()
    recipesSection.innerHTML = recipes.map(recipeComponent).join("")
    /* promiseOfRecipes.then(recipes => {
        recipesSection.innerHTML = recipes.map(recipeComponent).join("")
    }) */
}

const createRecipe = async () => {
    const resStatus = await postRecipe(titleInput.value, descInput.value, pwInput.value)
    if (resStatus === 204) {
        alert("Created!")
        resetForm()
        loadRecipes()
    } else {
        alert("Wrong password")
    }
}

const init = () => {
    addButton.addEventListener("click", createRecipe)
    document.getElementById("random").addEventListener("click", () => console.log("random"))
    loadRecipes()
}

init()
