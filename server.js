if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const nodemailer = require('nodemailer');

// const mailer = require("./mailer")
const { connect } = require("./dbConnection")
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path');
const PORT = process.env.PORT || 3000;
const { Users } = require("./models/Users")
const { Comments } = require("./models/Comments")
const { CertiNbee101 } = require("./models/CertiNbee101")
const { DeviceLog } = require("./models/DeviceLog")
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const mongoose = require("mongoose")
var cors = require('cors')
var macaddress = require('macaddress');

// import getMAC, { isMAC } from 'getmac'


connect(); //db connection



const initializePassport = require('./passport-config')
const initialPass = async () => {
  let userData = await Users.find().sort();
  try {
    initializePassport(
      passport,
      email => userData.find(user => user.email === email),
      id => userData.find(user => user.id === id)
    )
  }
  catch (err) {
    console.log(err);
  }

}

setInterval(() => { initialPass(); }, 2000)
//passport start

// const users = []


app.set('view-engine', 'ejs')
app.set('views', path.join(__dirname, './views'));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 86400000 * 90 // 3 months
  }
}))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
// require('./path/to/passport/config/file')(passport);
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

let macAddress = 0;


// if (arr[0] !== macAddress) {
//   console.log("New Device")
//   arr.push(macAddress)
// }
// if (arr[0] === macAddress) {
//   console.log("Your Device 1")
// }
// if (arr[1] === macAddress) {
//   console.log("Your Device 2")
// }
// else {
//   console.log("You can not Enter")
// }


// const macAdd = async () => {
//   // let DLog = await new DeviceLog(req.body);
//   var new_user = new DeviceLog({
//     name: 'suvra',
//     email: "kar.suvra",
//     device1: mac
//   })

//   new_user.save(function (err, result) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log(result)
//     }


//   })
let nameUser;


app.post('/comment', checkAuthenticated, async (req, res) => {
  let userName = await Users.find({ name: req.user.name });

  let name = {
    name: userName[0].name
  }
  let comment = await new Comments(req.body);
  const finalResult = await Object.assign(comment, name);
  await finalResult.save();
  res.redirect('/thanks')
  // res.send("Comment hyse")
})


app.get('/comment', checkNotAuthenticated, async (req, res) => {
  const comment = await Comments.find()
  res.send(comment);
})


app.get('/reviewsnumber', checkNotAuthenticated, async (req, res) => {
  const comment = await Comments.find()
  res.send("" + comment.length);
})

app.get('/thanks', checkAuthenticated, (req, res) => {
  res.render('thnxforcomment.ejs')
})

app.get('/nbee101enrolled', checkNotAuthenticated, async (req, res) => {
  const userNbee = await Users.find()

  const EnrolledNbee101 = userNbee.filter(x => x.paymentStatus === "true");
  console.log(EnrolledNbee101.length);
  res.send("" + EnrolledNbee101.length);
})


app.get('/givereview', checkAuthenticated, (req, res) => {
  res.render('giveReview.ejs')
})

app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('home.ejs')
})


app.get('/reset', checkNotAuthenticated, (req, res) => {
  res.render('reset.ejs')
})

const a = 0;

a === 1 ?
  app.get('/noentry', checkAuthenticated, async (req, res) => {
    res.send("Magi Mehedi")
  })
  :
  app.get('/profile', checkAuthenticated, async (req, res) => {
    nameUser = await Users.find({ email: req.user.email })
    const mail = nameUser[0].email;
    await macAdd()
    res.render('index.ejs', { mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
  })

// nbee classes 
app.get('/mycourses', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('mycourses.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname })
})

app.get('/nbee101_1', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  console.log(user[0]);
  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;

  console.log(QuizMarks);
  res.render('nbee101_1.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_2', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_2.ejs', { QuizMarks, quiz2: req.user.quiz2, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_3', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;




  res.render('nbee101_3.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_4', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;



  res.render('nbee101_4.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_5', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_5.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_6', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_6.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_7', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_7.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_8', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === [] ? user[0].quiz2 : "undefined"

  res.render('nbee101_8.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_9', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;



  res.render('nbee101_9.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_quiz1', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee_quiz1.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})



app.post('/nbee101_quiz2', checkAuthenticated, async (req, res) => {
  let userName = await Users.find({ name: req.user.name });

  let quiz2 = await new CertiNbee101(req.body)

  let name = {
    name: userName[0].name,
    email: userName[0].email
  }

  console.log(req.body)

  const finalResult = await Object.assign(quiz2, name);
  console.log(finalResult)

  await finalResult.save();
  res.render('nbee101_certificate.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_quiz2', checkAuthenticated, (req, res) => {
  res.render('nbee_quiz2.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1: req.user.quiz1_1 })
})


app.get('/edit', checkAuthenticated, async (req, res) => {
  const user = await Users.find({ email: req.user.email })
  const mail = user[0].email;
  const pass = user[0].password;
  res.render('edit_profile.ejs', { mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, pass })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/payments', checkNotAuthenticated, (req, res) => {
  res.render('payments.ejs')
})

app.get('/support', checkNotAuthenticated, (req, res) => {
  res.render('support.ejs')
})

app.get('/successreg', checkNotAuthenticated, (req, res) => {
  res.render('successReg.ejs')
})

app.get('/failedreg', checkNotAuthenticated, (req, res) => {
  res.render('failReg.ejs')
})

app.get('/nbee101', checkNotAuthenticated, (req, res) => {
  // const user = await Users.find({ email: req.user.email })
  // const mail = user[0].email;
  res.render('nbee101.ejs')
})

app.get('/nbee101_certificate', checkAuthenticated, async (req, res) => {
  const user = await Users.find({ email: req.user.email })
  const mail = user[0].email;
  res.render('nbee101_certificate.ejs', { mail, name: req.user.name, unvname: req.user.unvname })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: a === 1 ? "/noentry" : '/profile',
  failureRedirect: '/login',
  failureFlash: true
}),
  function (req, res) {
    res.redirect('/login');
  })



app.get('/preresigter', checkNotAuthenticated, (req, res) => {
  res.render('preregister.ejs')
})
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    let paymentStatus = {
      paymentStatus: false,
      quiz1: 0

    }
    let userData = new Users(req.body);
    const finalResult = Object.assign(userData, paymentStatus);
    await finalResult.save();
    var email = req.body.email;
    var regEmailConfrim = email;

    var mailTransporter = nodemailer.createTransport({

      host: "nutritionbee.net",
      port: 465,
      auth: {
        user: "info@nutritionbee.net",
        pass: "01770677688Suv"
      }

    });

    const sendRegMail = async () => {
      //Default Mail
      const mailOptions = {
        from: '"Nutrition Bee" <info@nutritionbee.net>',
        to: `${regEmailConfrim}`,
        subject: 'Thanks for registering into Nutrition Bee course hub',
        html: "<p>Dear participant</p><p>Thanks for registering into Nutrition Bee course hub. You can choose your desired courses. For more info visit: https://www.facebook.com/nutritionbee</p><p>Best regards</p><img src=`https://course.nutritionbee.net/mainlogo.png` width=`100px`>",
      };
      await mailTransporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent successfully');
        }
      });
    }
    res.redirect('/successreg')
    await sendRegMail()
  } catch (error) {
    res.redirect('/failedreg')
    // console.log(res.send("Failed"))

  }
})

app.put('/edit', checkAuthenticated, async (req, res) => {
  const user = await Users.find({ email: req.body.email })
  console.log(user[0]._id.valueOf());
  const mail = user[0].email;
  const id = user[0]._id.valueOf().toString();
  try {
    let check = await Users.updateOne({
      _id: mongoose.Types.ObjectId(id)
    }, {
      $set: req.body
    });
    if (check.modifiedCount !== 0) {
      // res.send("Success")
      res.redirect("/profile")
    }
  } catch (error) {
    res.redirect("/edit")
  }
})

app.post('/quiz1', checkNotAuthenticated, async (req, res) => {
  let userName = await Users.find({ name: req.user.name });

  let name = {
    name: userName[0].name
  }
  console.log(userName);
  // let comment = await new Comments(req.body);
  // const finalResult = await Object.assign(comment, name);
  // await finalResult.save();
  // res.redirect('/thanks')
  res.send("kam hyse")
})

app.post('/quiz1', checkNotAuthenticated, async (req, res) => {
  let userName = await Users.find({ name: req.user.name });

  let name = {
    name: userName[0].name
  }
  console.log(userName);
  // let comment = await new Comments(req.body);
  // const finalResult = await Object.assign(comment, name);
  // await finalResult.save();
  // res.redirect('/thanks')
  res.send("kam hyse")
})






app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/mycourses')
  }
  next()
}


const macAdd = async () => {
  let mail = nameUser[0].email;

  let userName = await DeviceLog.find({ mail });

  macaddress.one(function (err, mac) {
    console.log("Mac address for this host: %s", mac);
    macAddress = mac;

    // console.log(nameUser, "nfdskjndfsfdnsfsjnkjfsnokjfd");

    // let device1 = "00:d8:61:37:32:a8";
    let device1 = userName[0] === undefined ? undefined : userName[0].device1;
    // let device2 = "00:d8:61:37:32:a9";
    let device2 = userName[0] === undefined ? undefined : userName[0].device2;

    if (device1 === undefined && device2 === undefined) {
      console.log("New Device 1 logged");

      console.log(userName, "Sala madari");

      const new_user = new DeviceLog({
        name: nameUser[0].name,
        email: nameUser[0].email,
        device1: mac,
        device2: "undefined",
      })
      new_user.save(function (err, result) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(result)
        }
      })
    }
    else if (macAddress === device1) {
      console.log("Device 1 Running");
    }
    else if (macAddress === device2) {
      console.log("Device 2 Running");
    }
    else if (device1 !== null && device2 !== device1 && device2==="undefined") {
      console.log("New Device 2 logged");
      const Log =  DeviceLog.updateOne({ email: nameUser[0].email }, { email: 'Will Riker' })
      // await Character.updateOne(filter, { name: 'Will Riker' });
      // const new_user = new DeviceLog({
      //   name: nameUser[0].name,
      //   email: nameUser[0].email,
      //   device2: mac
      // })
      // new_user.save(function (err, result) {
      //   if (err) {
      //     console.log(err);
      //   }
      //   else {
      //     console.log(result)
      //   }
      // })

    }
    else if (macAddress !== device2 && macAddress !== device1) {
      console.log(device1, "device1");
      console.log(device2, "device2");
      console.log("You can not enter");
    }


  })
}


app.listen(PORT, () => {
  console.log("Running app");
})