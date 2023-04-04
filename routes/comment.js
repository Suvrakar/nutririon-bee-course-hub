const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const { Comments } = require("../models/Comments")


router.post('/', commonFunc.checkAuthenticated, async (req, res) => {
    let userName = await Users.find({ name: req.user.name });
    let name = {
        name: userName[0].name
    }
    let comment = await new Comments(req.body);
    const finalResult = await Object.assign(comment, name);
    await finalResult.save();
    res.redirect('comment/thanks')
})


router.get('/', commonFunc.checkNotAuthenticated, async (req, res) => {
    const comment = await Comments.find()
    res.send(comment);
})

router.get('/thanks', commonFunc.checkAuthenticated, (req, res) => {
    res.render('thnxforcomment.ejs')
})

module.exports = router;
