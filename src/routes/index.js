const siteRoutes = require('./site')
const authRoutes = require('./auth')
const userRoutes = require('./user')

const route = (app) => {
    
    app.use('/auth', authRoutes)
    app.use('/user', userRoutes)

    app.use('/', siteRoutes)
}

module.exports = route
