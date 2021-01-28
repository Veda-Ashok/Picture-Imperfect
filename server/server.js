const express = require('express')

const app = express()
const server = app.listen(58901)

app.use(express.static('public'))

console.log('server is running')