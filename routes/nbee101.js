const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const { CertiNbee101 } = require("../models/CertiNbee101")


router.get('/nbee101_1', commonFunc.checkAuthenticated, async (req, res) => {
    const nbee_101_1 = process.env.Balance_Diet;
    const user = await CertiNbee101.find({ name: req.user.name })
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_1.ejs', { nbee_101_1, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee101_2', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_2 = process.env.Nutritional_Assessment;
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_2.ejs', { nbee_101_2, Nbee101_QuizMarks, quiz2: req.user.quiz2, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee101_3', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_3 = process.env.Food_Caloric;
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_3.ejs', { nbee_101_3, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee101_4', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_5.ejs', { Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee101_5', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_5 = process.env.Caloric_Calculation;
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_5.ejs', { nbee_101_5, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee101_6', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_6 = process.env.Diet_Plan;
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_6.ejs', { nbee_101_6, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee101_7', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_7 = process.env.Practice_Class_1;
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_7.ejs', { nbee_101_7, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee101_8', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_8 = process.env.Practice_Class_2;
    let Nbee101_QuizMarks = user[0] === [] ? user[0].quiz2 : "undefined"
    res.render('nbee101_8.ejs', { nbee_101_8, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee101_9', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_9 = process.env.Counselling;
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee101_9.ejs', { nbee_101_9, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee101_quiz1', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee_quiz1.ejs', { Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


router.post('/nbee101_quiz2', commonFunc.checkAuthenticated, async (req, res) => {
    let userName = await Users.find({ name: req.user.name });
    let quiz2 = await new CertiNbee101(req.body)
    let name = {
        name: userName[0].name,
        email: userName[0].email
    }
    const finalResult = await Object.assign(quiz2, name);
    await finalResult.save();
    res.render('nbee101_certificate.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee101_quiz2', commonFunc.checkAuthenticated, (req, res) => {
    res.render('nbee_quiz2.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee101details', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('nbee101.ejs')
})

router.get('/nbee101_certificate', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await Users.find({ email: req.user.email })
    const mail = user[0].email;
    res.render('nbee101_certificate.ejs', { mail, name: req.user.name, unvname: req.user.unvname })
})

router.post('/quiz1', commonFunc.checkNotAuthenticated, async (req, res) => {
    let userName = await Users.find({ name: req.user.name });
    let name = {
        name: userName[0].name
    }
    res.send("kam hyse")
})

router.get('/nbee101enrolled', commonFunc.checkNotAuthenticated, async (req, res) => {
    const userNbee = await Users.find()
    const EnrolledNbee101 = userNbee.filter(x => x.paymentStatus === "true");
    res.send("" + EnrolledNbee101.length);
})


module.exports = router;