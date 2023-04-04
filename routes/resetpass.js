const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const nodemailer = require('nodemailer');


router.get('/', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('reset.ejs')
})

router.post('/', commonFunc.checkNotAuthenticated, async (req, res) => {
    const user = await Users.find({ email: req.body.email })
    const password = user[0].password;
    const mail = user[0].email;
    const name = user[0].name;

    var mailTransporter = nodemailer.createTransport({
        host: "nutritionbee.net",
        port: 465,
        auth: {
            user: "info@nutritionbee.net",
            pass: process.env.MAIL_PASS
        }

    });

    const sendMail = async () => {
        //Default Mail
        const mailOptions = {
            from: '"Nutrition Bee" <info@nutritionbee.net>',
            to: `${mail}`,
            subject: 'Password of Nutrition Bee Course Hub',
            html: `<p>Dear ${name}, <br> You have requested for your password. Your password is : <b> ${password} </b> <br><br> Best Regards<br>Nutrition Bee</p>`
        };
        await mailTransporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent successfully');
            }
        });
    }

    try {
        res.render("reset.ejs");
        await sendMail()
    }
    catch (err) {
        console.log(err);
    }

})


module.exports = router;