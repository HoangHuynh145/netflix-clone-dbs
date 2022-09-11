const User = require('../models/User')

const findUserMiddleware = (req, res, next) => {
    let findByName = User.find({ username: req.body.username })
    let findByEmail = User.find({ email: req.body.email })

    Promise.all([findByName, findByEmail])
        .then(([username, useremail]) => {
            if (username.length || useremail.length) {
                res.status(403).json({ username, useremail })
            } else {
                next()
            }
        })
}

module.exports = findUserMiddleware