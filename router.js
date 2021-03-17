
let loginRoutes = require('./routes/loginUser-route')
let loginTest = require('./routes/loginTest-route')


module.exports = (app) => {

    app.use('/login', loginRoutes)
    app.use('/loginTest', loginTest)

}