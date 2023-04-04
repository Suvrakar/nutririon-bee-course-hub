const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const nodemailer = require('nodemailer');


router.get('/successreg', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('successReg.ejs')
})

router.get('/failedreg', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('failReg.ejs')
})


router.get('/preresigter', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('preregister.ejs')
})

router.get('/register', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', commonFunc.checkNotAuthenticated, async (req, res) => {
    try {
        let paymentStatus = {
            paymentStatus: false,
            quiz1: 0

        }
        let userData = new Users(req.body);
        const finalResult = Object.assign(userData, paymentStatus);
        await finalResult.save();
        var email = req.body.email;
        var name = req.body.name;
        var regEmailConfrim = email;

        var mailTransporter = nodemailer.createTransport({

            host: "nutritionbee.net",
            port: 465,
            auth: {
                user: "info@nutritionbee.net",
                pass: process.env.MAIL_PASS
            }

        });

        const sendRegMail = async () => {
            const mailOptions = {
                from: '"Nutrition Bee" <info@nutritionbee.net>',
                to: `${regEmailConfrim}`,
                subject: 'Thanks for registering into Nutrition Bee course hub',
                html: `<p>Dear ${name}</p><p>Thanks for registering into Nutrition Bee course hub. You can choose your desired courses. For more info visit: https://www.facebook.com/nutritionbee</p><p>Best regards</p><p>Nutrition Bee</p>`,
            };
            await mailTransporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent successfully');
                }
            });
        }
        res.redirect('/registration/successreg')
        await sendRegMail()
    } catch (error) {
        console.log(err)
        res.redirect('/registration/failedreg')
    }
})


module.exports = router;