import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3003

app.use(bodyParser.json())

// TODO: implement...

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
