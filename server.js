if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const mongoose = require("mongoose")



// setInterval(() => {
//   connect()
// }, 500);

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
app.use(passport.initialize())
app.use(passport.session())
// require('./path/to/passport/config/file')(passport);
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())


// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// });

// var upload = multer({ storage: storage });



app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('home.ejs')
})

app.get('/reset', checkNotAuthenticated, (req, res) => {
  res.render('reset.ejs')
})

app.get('/profile', checkAuthenticated, async (req, res) => {
  const user = await Users.find({ email: req.user.email })
  const mail = user[0].email;
  res.render('index.ejs', { mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
})

// nbee classes 

app.get('/mycourses', checkAuthenticated, (req, res) => {
  res.render('mycourses.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname })
})

app.get('/nbee101_1', checkAuthenticated, (req, res) => {
  res.render('nbee101_1.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})

app.get('/nbee101_2', checkAuthenticated, (req, res) => {
  res.render('nbee101_2.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})

app.get('/nbee101_3', checkAuthenticated, (req, res) => {
  res.render('nbee101_3.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})
app.get('/nbee101_4', checkAuthenticated, (req, res) => {
  res.render('nbee101_4.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})
app.get('/nbee101_5', checkAuthenticated, (req, res) => {
  res.render('nbee101_5.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})
app.get('/nbee101_6', checkAuthenticated, (req, res) => {
  res.render('nbee101_6.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})
app.get('/nbee101_7', checkAuthenticated, (req, res) => {
  res.render('nbee101_7.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})
app.get('/nbee101_8', checkAuthenticated, (req, res) => {
  res.render('nbee101_8.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})
app.get('/nbee101_9', checkAuthenticated, (req, res) => {
  res.render('nbee101_9.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1:req.user.quiz1_1 })
})

app.get('/nbee101_quiz1', checkAuthenticated, (req, res) => {
  res.render('nbee_quiz1.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1:req.user.quiz1_1 })
})

app.get('/nbee101_quiz2', checkAuthenticated, (req, res) => {
  res.render('nbee_quiz2.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, email: req.body.email, quiz1_1:req.user.quiz1_1 })
})




app.get('/edit', checkAuthenticated, async (req, res) => {
  const user = await Users.find({ email: req.user.email })
  const mail = user[0].email;
  res.render('edit_profile.ejs', { mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password })
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
  res.render('nbee101.ejs')
})

app.get('/nbee101_certificate', checkAuthenticated, (req, res) => {
  res.render('nbee101_certificate.ejs', { name: req.user.name, unvname: req.user.unvname } )
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}),
  function (req, res) {
    res.redirect('/login');
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
    // res.send(userData);
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // users.push({
    //   id: Date.now().toString(),
    //   name: req.body.name,
    //   email: req.body.email,
    //   phone: req.body.phone,
    //   unvname: req.body.unvname,
    //   password: req.body.password,
    //   : true
    // })
    res.redirect('/successreg')
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
      // _id: mongoose.Types.ObjectId("62716ab51b79cc655dc244b9")
      // _id: mongoose.Types.ObjectId(req.body._id)
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

app.put('/quiz1', checkNotAuthenticated, async (req, res) => {
  const user = await Users.find({ email: req.body.email })
  const id = user[0]._id.valueOf().toString();
  console.log(id);
  console.log(req.body.quiz1);
  const a = {
    "quiz1": req.body.quiz1
  }
  try {
    let check = await Users.updateOne({
      _id: mongoose.Types.ObjectId(id)
    }, {
      $set: a

    });

    if (check.modifiedCount !== 0) {
      res.send("Success")
      // res.redirect("/quiz1")
      // console.log(check.modifiedCount);

    }
  } catch (error) {
    res.send("No")
    // res.redirect("/quiz1")
    // console.log(check.modifiedCount);

  }
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

app.listen(PORT, () => {
  console.log("Running app");
})