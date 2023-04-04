const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const { CertiNbee101 } = require("../models/CertiNbee101")


router.get('/nbee102_1', commonFunc.checkAuthenticated, async (req, res) => {
    const nbee_101_1 = process.env.Balance_Diet;
    const user = await CertiNbee101.find({ name: req.user.name })
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_1.ejs', { nbee_101_1, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee102_2', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_2 = process.env.Nutritional_Assessment;
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_2.ejs', { nbee_101_2, QuizMarks, quiz2: req.user.quiz2, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee102_3', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_3 = process.env.Food_Caloric;
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_3.ejs', { nbee_101_3, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee103_4', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_5.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee104_5', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_5 = process.env.Caloric_Calculation;
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_5.ejs', { nbee_101_5, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee105_6', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_6 = process.env.Diet_Plan;
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_6.ejs', { nbee_101_6, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee106_7', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_7 = process.env.Practice_Class_1;
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_7.ejs', { nbee_101_7, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee107_8', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_8 = process.env.Practice_Class_2;
    let QuizMarks = user[0] === [] ? user[0].quiz2 : "undefined"
    res.render('nbee102_8.ejs', { nbee_101_8, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee108_9', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    const nbee_101_9 = process.env.Counselling;
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_9.ejs', { nbee_101_9, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

router.get('/nbee102_quiz1', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name })
    let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render('nbee102_quiz1.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


router.post('/nbee102_quiz2', commonFunc.checkAuthenticated, async (req, res) => {
    let userName = await Users.find({ name: req.user.name });
    let quiz2 = await new CertiNbee101(req.body)
    let name = {
        name: userName[0].name,
        email: userName[0].email
    }
    const finalResult = await Object.assign(quiz2, name);
    await finalResult.save();
    res.render('nbee102_certificate.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee102_quiz2', commonFunc.checkAuthenticated, (req, res) => {
    res.render('nbee102_quiz2.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


router.get('/nbee102details', commonFunc.checkNotAuthenticated, (req, res) => {
    res.render('nbee102.ejs')
})

router.get('/nbee102_certificate', commonFunc.checkAuthenticated, async (req, res) => {
    const user = await Users.find({ email: req.user.email })
    const mail = user[0].email;
    res.render('nbee102_certificate.ejs', { mail, name: req.user.name, unvname: req.user.unvname })
})

router.post('/nbee102quiz1', commonFunc.checkNotAuthenticated, async (req, res) => {
    let userName = await Users.find({ name: req.user.name });
    let name = {
        name: userName[0].name
    }
    res.send("kam hyse")
})

router.get('/nbee102enrolled', commonFunc.checkNotAuthenticated, async (req, res) => {
    const userNbee = await Users.find()
    const EnrolledNbee101 = userNbee.filter(x => x.paymentStatus === "true");
    res.send("" + EnrolledNbee101.length);
})


module.exports = router;