const express = require('express')
const helmet = require('helmet')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const questionsRoutes = require('./routes/questions.routes')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(helmet())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.use('/questions', questionsRoutes)

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
