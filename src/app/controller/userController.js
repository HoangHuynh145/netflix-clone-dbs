const User = require('../models/User')

class UserController {
    //[DELETE] /user/:id
    delete(req, res, next) {
        User.findById(req.params.id)
            .then((user) => res.status(200).json('Delete success!!'))
            .catch(err => res.status(403).json(err))
    }

    //[GET] /user/:id
    getAllUser = async (req, res, next) => {
        const page = +req.query.page
        const limit = req.query.limit
        const indexStart = (page - 1) * limit
        const indexEnd = page * limit
        const total_results = await User.countDocuments()
        const result = {}

        if (indexEnd < total_results) {
            result.next = {
                page: page + 1,
                limit
            }
        }

        if (indexStart > 0) {
            result.previous = {
                page: page - 1,
                limit
            }
        }

        result.total_results = total_results
        result.total_pages = Math.ceil(total_results / limit)
        result.page = page

        User.find({}).limit(limit).skip(indexStart)
            .then(users => {
                result.results = users
                res.status(200).json(result)
            })
            .catch(err => res.status(403).json(err))
    }

    //[POST] /user/find-user
    findUser = async (req, res, next) => {
        try {
            let results = {
                user: false,
                email: false,
            }
            let findByName = User.find({ username: req.body.username })
            let findByEmail = User.find({ email: req.body.email })

            Promise.all([findByName, findByEmail])
                .then(([username, useremail]) => {
                    if (username.length || useremail.length) {
                        if (username.length) {
                            results.user = true
                        }
                        if (useremail.length) {
                            results.email = true
                        }
                        res.status(403).json(results)
                    } else {
                        username.length === 0 ? results.user = false : results.user = true
                        useremail.length === 0 ? results.email = false : results.email = true
                        res.status(200).json(results)
                    }
                })
        } catch (error) {
            res.status(403).json("Error", error)
        }
    }

}

module.exports = new UserController
