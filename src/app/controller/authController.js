const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return (jwt.sign({
        id: user.id,
        admin: user.isAdmin
    }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '10d' }))
}

const generateRefreshToken = (user) => {
    return (jwt.sign({
        id: user.id,
        admin: user.isAdmin
    }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '365d' }))
}

let refreshTokens = []

class AuthController {

    //[POST] /auth/register
    register = async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            })

            newUser.save()
                .then((user) => res.status(200).json(user))
                .catch(next)

        } catch (error) {
            res.status(403).json("Error", error)
        }
    }

    //[POST] /auth/login
    login = async (req, res, next) => {
        try {
            User.findOne({ email: req.body.email })
                .then(async (user) => {
                    let errorDetail = {}
                    if (!user) {
                        errorDetail.message = 'Email is incorrect!',
                            errorDetail.type = 'email'
                        return res.status(403).json(errorDetail)
                    }
                    const validPassword = await bcrypt.compare(
                        req.body.password,
                        user.password
                    )
                    if (!validPassword) {
                        errorDetail.message = 'Password is incorrect!'
                        errorDetail.type = 'password'
                        return res.status(403).json(errorDetail)
                    }
                    if (user && validPassword) {
                        // Create access token
                        const accessToken = generateAccessToken(user)
                        // Create refresh token
                        const refreshToken = generateRefreshToken(user)
                        refreshTokens.push(refreshToken)
                        // Add cookies
                        await res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: true, // Produc -> True
                            path: '/',
                            sameSite: 'None'
                        })
                        console.log('Cookies added!')
                        const { password, ...others } = user._doc

                        res.status(200).json({ ...others, accessToken })
                    }
                })
        } catch (error) {
            res.status(403).json(error)
        }
    }

    //[POST] /auth/refresh
    refresh = async (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(403).json('You are not authenticated')
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json('Token is not valid')
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                console.log(err)
            } else {
                refreshTokens.filter(token => token !== refreshToken)
                // Create new access token
                const newAccessToken = generateAccessToken(user)
                // Create new refresh token
                const newRefreshToken = generateRefreshToken(user)
                res.cookie('newAccessToken', newAccessToken, {
                    httpOnly: true,
                    secure: true, // Produc -> True
                    path: '/',
                    sameSite: 'None'
                })
                refreshTokens.push(newRefreshToken)
                res.status(200).json({ accessToken: newAccessToken })
            }
        })
    }

    //[POST] /auth/logout
    logout(req, res, next) {
        refreshTokens.filter(token => token !== req.cookies.refreshTokens)
        res.clearCookie('refreshToken')
        res.status(200).json('Logout success!')
    }
}

module.exports = new AuthController
