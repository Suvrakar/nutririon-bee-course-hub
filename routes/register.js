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
        const { email, name, } = req.body;

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
                to: `${email}`,
                subject: 'Thanks for registering into Nutrition Bee course hub',
                html: `<p>Dear ${name}</p><p>Thanks for registering into Nutrition Bee course hub. You can choose your desired courses. For more info visit: https://www.facebook.com/nutritionbee</p><p>Best regards</p><p>Nutrition Bee</p>`,
            };
            mailTransporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent successfully');
                }
            });
        }
        await sendRegMail();
        // res.redirect('/registration/successreg');
        res.render('successReg.ejs');
    } catch (error) {
        console.log(error)
        res.send(error)
        // res.redirect('/registration/failedreg');
        // res.render('failReg.ejs');
    }
})


module.exports = router;