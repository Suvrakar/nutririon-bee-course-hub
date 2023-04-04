const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const passport = require('passport')
const app = express()

app.use(passport.initialize())
app.use(passport.session())

router.get('/login', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})


router.post('/login', commonFunc.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}),
    function (req, res) {
        res.redirect('/login');
    })


module.exports = router;   