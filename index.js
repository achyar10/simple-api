const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const md5 = require('md5')
const compression = require('compression')
const model = require('./models')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(compression())

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
model.sequelize.sync({ force: false, alter: true })

app.get('/', (req, res) => {
    res.send('Welcome to server POS')
})
app.use(routes)
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page not found!</h2>')
})

app.listen(5001, async () => {
    try {
        const check = await model.user.findOne({ where: { username: 'admin' } })
        if (!check) {
            Promise.resolve(model.user.create({ username: 'admin', password: md5('admin'), role: 1, fullname: 'Administrator' }))
        }
        console.log('Server running on port 5001')
    } catch (error) {
        console.log(error)
    }
})
