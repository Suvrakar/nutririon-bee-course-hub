const express = require("express");
const router = express.Router();
const commonFunc = require("../commonFunctions");
const { Users } = require("../models/Users");
const { CertiNbee101 } = require("../models/CertiNbee101");
const { Users_Nbee102 } = require("../models/Users_Nbee102");

router.get("/nbee102_1", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_1 = process.env.Nbee102_Pregnancy_01;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_1.ejs", {
    Nbee102_QuizMarks,
    nbee_102_1,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_2", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_2 = process.env.Nbee102_1st_Trimister_02;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_2.ejs", {
    Nbee102_QuizMarks,
    nbee_102_2,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_3", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_3 = process.env.Nbee102_2nd_Trimister_03;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_3.ejs", {
    Nbee102_QuizMarks,
    nbee_102_3,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_5", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_5 = process.env.Nbee102_3rd_Trimister_05;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_5.ejs", {
    Nbee102_QuizMarks,
    nbee_102_5,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_6", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_6 = process.env.Nbee102_Animea_06;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_6.ejs", {
    Nbee102_QuizMarks,
    nbee_102_6,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_7", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_7 = process.env.Nbee102_Eclampsia_07;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_7.ejs", {
    Nbee102_QuizMarks,
    nbee_102_7,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_8", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_8 = process.env.Nbee102_GDM_08;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_8.ejs", {
    Nbee102_QuizMarks,
    nbee_102_8,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102_9", commonFunc.checkAuthenticated, async (req, res) => {
  const nbee_102_9 = process.env.Nbee102_Psychological_Changes_09;
  const nbee102 = await Users_Nbee102.find({ email: req.user.email });
  const user = await CertiNbee101.find({ name: req.user.name });
  let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  let Nbee102_QuizMarks =
    user[0] === undefined ? null : nbee102[0].quiz2_nbee102;
  res.render("nbee102_9.ejs", {
    Nbee102_QuizMarks,
    nbee_102_9,
    Nbee101_QuizMarks,
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get(
  "/nbee102_quiz1",
  commonFunc.checkAuthenticated,
  async (req, res) => {
    const user = await CertiNbee101.find({ name: req.user.name });
    let Nbee101_QuizMarks = user[0] === undefined ? null : user[0].quiz2;
    res.render("nbee102_quiz1.ejs", {
      Nbee101_QuizMarks,
      paymentStatus: req.user.paymentStatus,
      name: req.user.name,
      unvname: req.user.unvname,
      phone: req.user.phone,
      password: req.body.password,
      email: req.body.email,
      quiz1_1: req.user.quiz1_1,
    });
  }
);

router.post(
  "/nbee102_quiz2",
  commonFunc.checkAuthenticated,
  async (req, res) => {
    const user = await Users_Nbee102.find({ email: req.user.email });
    const user_id = user[0]._id.toString();
    console.log(req.body);
    const quiz2mark = Users_Nbee102.findByIdAndUpdate(
      user_id,
      req.body,
      (err, updatedUser) => {
        if (err) {
          console.log(err);
        } else {
          console.log(updatedUser);
          console.log(quiz2mark);
        }
      }
    );
    res.redirect("/nbee102/nbee102_certificate");
  }
);

router.get("/nbee102_quiz2", commonFunc.checkAuthenticated, (req, res) => {
  res.render("nbee102_quiz2.ejs", {
    paymentStatus: req.user.paymentStatus,
    name: req.user.name,
    unvname: req.user.unvname,
    phone: req.user.phone,
    password: req.body.password,
    email: req.body.email,
    quiz1_1: req.user.quiz1_1,
  });
});

router.get("/nbee102details", commonFunc.checkNotAuthenticated, (req, res) => {
  res.render("nbee102.ejs");
});

router.get(
  "/nbee102_certificate",
  commonFunc.checkAuthenticated,
  async (req, res) => {
    const user = await Users.find({ email: req.user.email });
    const mail = user[0].email;
    res.render("nbee102_certificate.ejs", {
      mail,
      name: req.user.name,
      unvname: req.user.unvname,
    });
  }
);

router.post(
  "/nbee102quiz1",
  commonFunc.checkNotAuthenticated,
  async (req, res) => {
    let userName = await Users.find({ name: req.user.name });
    let name = {
      name: userName[0].name,
    };
    res.send("kam hyse");
  }
);

router.get(
  "/nbee102enrolled",
  commonFunc.checkNotAuthenticated,
  async (req, res) => {
    const userNbee = await Users_Nbee102.find();
    const EnrolledNbee102 = userNbee.filter(
      (x) => x.nbee102_paymentStatus === "true"
    );
    res.send("" + EnrolledNbee102.length);
  }
);

router.get("/nbee102users", async (req, res) => {
  const getUserInfo = await Users_Nbee102.find({});
  console.log(getUserInfo);
  res.send("ok");
});

router.post(
  "/nbee102users",
  commonFunc.checkAuthenticated,
  async (req, res) => {
    try {
      const getUser = await Users.findOne({ name: req.user.name });
      console.log(getUser, "getiiinggggggggggg users");

      const { name, email } = getUser;

      let nbee = {
        user_name: name,
        user_email: email,
        nbee102_paymentStatus: "false",
        quiz1_nbee102: null,
        quiz2_nbee102: null,
      };

      let nbee102 = await new Users_Nbee102(nbee);

      await nbee102.save();
    } catch (err) {
      console.log(err);
    }

    res.redirect("/profile");
  }
);

module.exports = router;
