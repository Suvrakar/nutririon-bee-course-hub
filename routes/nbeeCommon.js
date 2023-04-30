const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { CertiNbee101 } = require("../models/CertiNbee101")
const { Comments } = require("../models/Comments")


router.get('/payments', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('payments.ejs')
})

router.get('/support', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('support.ejs')
})

router.get('/reviewsnumber', commonFunc.checkNotAuthenticated, async (req, res) => {
    const comment = await Comments.find()
    res.send("" + comment.length);
})

router.get('/givereview', commonFunc.checkAuthenticated, (req, res) => {
    res.render('giveReview.ejs')
})



module.exports = router;