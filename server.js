if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { connect } = require("./dbConnection")
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path');
const PORT = process.env.PORT || 3000;
const { Users } = require("./models/Users")
const { ProfileImage } = require("./models/ProfileImage")
const { CertiNbee101 } = require("./models/CertiNbee101")
const { Payment } = require("./models/Payment")
const bodyParser = require('body-parser');
const cors = require('cors')
const passportOneSessionPerUser = require('passport-one-session-per-user')
const commonFunc = require("./commonFunctions")
const initializePassport = require('./passport-config')
const multer = require('multer');
const nodemailer = require('nodemailer');


connect(); //db connection


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
passport.use(new passportOneSessionPerUser())
app.use(passport.authenticate('passport-one-session-per-user'))
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

let nameUser;




// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create multer instance with specified storage
const upload = multer({ storage: storage })

//Main Page
app.get('/', commonFunc.checkNotAuthenticated, (req, res) => {
  res.render('home.ejs')
})

//Comment API
const commentRoute = require('./routes/comment')
app.use("/comment", commentRoute)

//Courses API
const coursesRoute = require('./routes/courses')
app.use("/courses", coursesRoute)

// ProPic API
const proPicRoute = require('./routes/proPic')
app.use("/propic", proPicRoute)


//Nbee101 API
const nbee101Route = require('./routes/nbee101')
app.use("/nbee101", nbee101Route)

//Nbee102 API
const nbee102Route = require('./routes/nbee102')
app.use("/nbee102", nbee102Route)


//Registration API
const registrationRoute = require('./routes/register')
app.use("/registration", registrationRoute)


//Login API
const loginRoute = require('./routes/login')
app.use("/nbee", loginRoute)


//Reset Password API
const resetPassRoute = require('./routes/resetpass')
app.use("/reset", resetPassRoute)


//Edit Profile API
const editProfileRoute = require('./routes/editProfile')
app.use("/edit", editProfileRoute)


//Common API
const commonRoute = require('./routes/nbeeCommon')
const { Users_Nbee102 } = require('./models/Users_Nbee102')
app.use("/nbeecommon", commonRoute)

app.get('/profile', commonFunc.checkAuthenticated, async (req, res) => {
  nameUser = await Users.find({ email: req.user.email })
  const nbee102_user = await Users_Nbee102.findOne({ user_email: req.user.email })
  const mail = nameUser[0]?.email;
  var currentdate = new Date().toLocaleDateString();
  var currenttime = new Date().toLocaleTimeString();
  const image = await ProfileImage.find({ email: req.user.email })
  const id = image[0]?.id;
  const nbee102_paymentStatus = nbee102_user?.nbee102_paymentStatus
  const proPicLink = id == undefined ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" : `https://course.nutritionbee.net/propic/${id}`
  res.render('index.ejs', {nbee102_paymentStatus, proPicLink, id, currenttime, currentdate, mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
})
// app.get('/profile', commonFunc.checkAuthenticated, async (req, res) => {
//   const [user, image] = await Promise.all([
//     Users.findOne({ email: req.user.email }, { email: 1, name: 1, unvname: 1, phone: 1, paymentStatus: 1 }),
//     ProfileImage.findOne({ email: req.user.email }, { id: 1 })
//   ]);

//   const mail = user?.email;
//   const currentdate = new Date().toLocaleDateString();
//   const currenttime = new Date().toLocaleTimeString();
//   const id = image?._id.toString();
//   console.log(id)

//   const proPicLink = id == null ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" : `https://course.nutritionbee.net/image/${id}`;

//   res.render('index.ejs', { 
//     proPicLink, 
//     id, 
//     currenttime, 
//     currentdate, 
//     mail, 
//     paymentStatus: user.paymentStatus, 
//     name: user.name, 
//     unvname: user.unvname, 
//     phone: user.phone 
//   });
// });


// nbee courses 
app.get('/mycourses', commonFunc.checkAuthenticated, async (req, res) => {
  try {
    const user = await CertiNbee101.find({ email: req.user.email })
    const nbee102_user = await Users_Nbee102.findOne({ user_email: req.user.email })
    const Nbee101_QuizMarks = user[0]?.quiz2;
    const Nbee102_QuizMarks = nbee102_user?.quiz2_nbee102;
    const nbee102_paymentStatus = nbee102_user?.nbee102_paymentStatus
    res.render('mycourses.ejs', { nbee102_paymentStatus, Nbee102_QuizMarks, Nbee101_QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname })
  }
  catch (err) {
    res.redirect("/profile")
    console.log(err)
  }
})

app.post('/payment', commonFunc.checkAuthenticated, async (req, res) => {
  console.log("Payment 1")
  const { email, name } = req.user;
  try {
    const user_payment = await new Payment(req.body);
    await user_payment.save();
    console.log("Payment 2")
    var mailTransporter = nodemailer.createTransport({
      host: "nutritionbee.net",
      port: 465,
      auth: {
        user: "info@nutritionbee.net",
        pass: process.env.MAIL_PASS
      }

    });

    const sendPaymentMail = async () => {
      const mailOptions = {
        from: '"Nutrition Bee" <info@nutritionbee.net>',
        to: `${email}`,
        subject: 'We recieved your payment request',
        html: `<p>Dear ${name}</p><p>We recieved your payment request. Very soon, after verifying we will add you to your desired course.</p><p>Best regards</p><p>Nutrition Bee</p>`,
      };
      await mailTransporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent successfully');
        }
      });
    }
    await sendPaymentMail()
  }
  catch (err) {
    console.log(err)
  }
  res.redirect('/profile');
})


app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/nbee/login')
})


app.listen(PORT, () => {
  console.log(`Running app on ${PORT}`);
})