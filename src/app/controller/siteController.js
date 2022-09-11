

class SiteController {
    //[GET] /
    test(req, res, next) {
        res.send('Hello Guys!')
    }
}

module.exports = new SiteController
