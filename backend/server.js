const express = require('express')
const fileSystem = require('fs')
const cors = require("cors")
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    setTimeout(() => next(), 5000)
})

app.get('/api/recipes', (req, res) => {

    const searchParam = req.query.filter

    const data = fileSystem.readFileSync("./database.json")
    const recipes = JSON.parse(data)

    if (searchParam) {
        return res.json(recipes.filter(recipe => recipe.title.includes(searchParam)))
    }

    res.json(recipes)
})

app.post('/api/recipes', (req, res) => {
    const auth = req.headers.authcode
    if (auth !== "12345") {
        return res.sendStatus(401)
    }

    const title = req.body.title
    const description = req.body.description
    const newRecipe = {
        "title": title,
        "description": description
    }

    const data = fileSystem.readFileSync("./database.json")
    const recipes = JSON.parse(data)
    recipes.push(newRecipe)
    const newData = JSON.stringify(recipes)
    fileSystem.writeFileSync("./database.json", newData)

    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})