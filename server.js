if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const nodemailer = require('nodemailer');
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

connect(); //db connection
const a = 0;


// Define schema for uploaded files
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  email: String
});

const Image = mongoose.model('Image', imageSchema);

// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create multer instance with specified storage
const upload = multer({ storage: storage })


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
var passportOneSessionPerUser = require('passport-one-session-per-user')
passport.use(new passportOneSessionPerUser())

app.use(passport.authenticate('passport-one-session-per-user'))

// require('./path/to/passport/config/file')(passport);
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

let macAddress;
let nameUser;


// Define route to handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  nameUser = await Users.find({ email: req.user.email })
  const mail = nameUser[0]?.email;
  const newImage = new Image();
  newImage.name = req.file.originalname;
  newImage.data = req.file.buffer;
  newImage.email = mail;
  newImage.contentType = req.file.mimetype;
  newImage.save()
    .then(image => {
      res.redirect('/profile');
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Define route to display image by ID
app.get('/image/:id', async (req, res) => {
  const imageId = req.params.id;
  Image.findById(imageId)
    .then(image => {
      if (!image) {
        return res.status(404).send('Image not found');
      }
      res.set('Content-Type', image.contentType);
      res.send(image.data);

    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Define route to delete image by ID
app.delete('/image/:id', async (req, res) => {
  const imageId = req.params.id;
  nameUser = await Users.find({ email: req.user.email })
  Image.findByIdAndDelete(imageId)
    .then(image => {
      if (!image) {
        return res.status(404).send('Image not found');
      }
      // res.send("Done")
      res.redirect("/profile")
      // res.render('index.ejs', {id, proPicLink, currenttime, currentdate, mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
    })
    .catch(err => {
      res.status(500).send(err);
    });
});



app.post('/comment', checkAuthenticated, async (req, res) => {
  let userName = await Users.find({ name: req.user.name });

  let name = {
    name: userName[0].name
  }
  let comment = await new Comments(req.body);
  const finalResult = await Object.assign(comment, name);
  await finalResult.save();
  res.redirect('/thanks')
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

app.post('/reset', checkNotAuthenticated, async (req, res) => {
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


app.get('/profile', checkAuthenticated, async (req, res) => {
  nameUser = await Users.find({ email: req.user.email })
  const mail = nameUser[0]?.email;
  var currentdate = new Date().toLocaleDateString();
  var currenttime = new Date().toLocaleTimeString();
  const image = await Image.find({ email: req.user.email })
  const id = image[0]?.id;
  const proPicLink = id == undefined ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" : `https://course.nutritionbee.net/image/${id}`
  await macaddress.one(function (err, mac) {
    console.log("Mac address for this host: %s", mac);
    macAddress = mac;
  })
  await macAdd()
  res.render('index.ejs', {id, proPicLink, currenttime, currentdate, mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
})

// nbee classes 
app.get('/mycourses', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('mycourses.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname })
})

app.get('/nbee101_1', checkAuthenticated, async (req, res) => {
  const nbee_101_1 = process.env.Balance_Diet;
  const user = await CertiNbee101.find({ name: req.user.name })
  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  res.render('nbee101_1.ejs', { nbee_101_1, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_2', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_2 = process.env.Nutritional_Assessment;
  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_2.ejs', { nbee_101_2, QuizMarks, quiz2: req.user.quiz2, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_3', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_3 = process.env.Food_Caloric;
  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;

  res.render('nbee101_3.ejs', { nbee_101_3, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_4', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;

  res.render('nbee101_5.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})

app.get('/nbee101_5', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_5 = process.env.Caloric_Calculation;

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_5.ejs', { nbee_101_5, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_6', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_6 = process.env.Diet_Plan;

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_6.ejs', { nbee_101_6, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_7', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_7 = process.env.Practice_Class_1;

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;


  res.render('nbee101_7.ejs', { nbee_101_7, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_8', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_8 = process.env.Practice_Class_2;

  let QuizMarks = user[0] === [] ? user[0].quiz2 : "undefined"

  res.render('nbee101_8.ejs', { nbee_101_8, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
})
app.get('/nbee101_9', checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  const nbee_101_9 = process.env.Counselling;

  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;



  res.render('nbee101_9.ejs', { nbee_101_9, QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, quiz1_1: req.user.quiz1_1 })
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
  const finalResult = await Object.assign(quiz2, name);
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
  successRedirect: '/profile',
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
    var name = req.body.name;
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
    res.redirect('/successreg')
    await sendRegMail()
  } catch (error) {
    res.redirect('/failedreg')
  }
})

app.put('/edit', checkAuthenticated, async (req, res) => {
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



app.post('/quiz1', checkNotAuthenticated, async (req, res) => {
  let userName = await Users.find({ name: req.user.name });

  let name = {
    name: userName[0].name
  }
  console.log(userName);
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
  let mail = nameUser.map(x => x.email);

  let Device = await DeviceLog.find({ email: mail });

  let n = nameUser[0].name;


  let device1 = Device[0] === undefined ? undefined : Device[0].device1;
  let device2 = Device[0] === undefined ? undefined : Device[0].device2;



  if (device1 === undefined && device2 === undefined) {
    console.log("New Device 1 logged");
    const new_user = await new DeviceLog({
      name: nameUser[0].name,
      email: nameUser[0].email,
      device1: macAddress,
      device2: "undefined",
    })
    await new_user.save(function (err, result) {
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
  else if (device1 !== null && device2 !== device1 && device2 === "undefined") {
    console.log("New Device 2 logged");

    var mailTransporter = nodemailer.createTransport({

      host: "nutritionbee.net",
      port: 465,
      auth: {
        user: "info@nutritionbee.net",
        pass: "01770677688Suv"
      }

    });

    const sendMail = async () => {
      //Default Mail
      const mailOptions = {
        from: '"Nutrition Bee" <info@nutritionbee.net>',
        to: `${mail}`,
        subject: 'Nutrition Bee Course Hub - Warning',
        html: `<p>Dear ${n}, <br> Your second device has been detected. From now, can not now log in from any third device otherwise your account can be suspended. You can only log in from your first and second device. </b> <br><br> Best Regards<br>Nutrition Bee</p>`
      };
      await mailTransporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent successfully');
        }
      });
    }
    await sendMail();

    const Log = await DeviceLog.updateOne({ email: nameUser[0].email }, { device2: macAddress })
    console.log(Log, "Log");
  }
  else if (macAddress !== device2 && macAddress !== device1 && device1 !== undefined && device2 !== undefined) {
    console.log(device1, "device1");
    console.log(device2, "device2");
    a = a + 1;
    console.log(macAddress, "macAddress");
    console.log("You can not enter");
  }
}


app.listen(PORT, () => {
  console.log("Running app");
})