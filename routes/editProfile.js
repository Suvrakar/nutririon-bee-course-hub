const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const mongoose = require("mongoose");

router.get('/', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await Users.find({ email: req.user.email })
    const mail = user[0].email;
    const pass = user[0].password;
    res.render('edit_profile.ejs', { mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, pass })
})


// router.put('/', commonFunc.checkAuthenticated, async (req, res) => {
//     const user = await Users.findOne({ email: req.body.email })

//     const id = user._id.valueOf().toString();
//     try {
//         let updateResult = await Users.updateOne({
//             _id: mongoose.Types.ObjectId(id)
//         }, req.body);

//         if (updateResult.modifiedCount !== 0) {
//             return res.send('Yes');
//         }
//     } catch (error) {
//         console.error(error);
//     }

//     res.send('No');
// });


router.put('/', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await Users.find({ email: req.body.email })

    const id = user[0]._id.valueOf().toString();
    try {
        let check = await Users.updateOne({
            _id: mongoose.Types.ObjectId(id)
        }, {
            $set: req.body
        });
        if (check.modifiedCount !== 0) {
            res.redirect("/profile")
        }
    } catch (error) {
        res.redirect("/edit")
    }
})

module.exports = router;