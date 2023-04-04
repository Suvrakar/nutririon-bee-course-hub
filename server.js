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
const bodyParser = require('body-parser');
const cors = require('cors')
const passportOneSessionPerUser = require('passport-one-session-per-user')
const commonFunc = require("./commonFunctions")
const initializePassport = require('./passport-config')
const multer = require('multer');


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
app.use("/nbeecommon", commonRoute)


app.get('/profile', commonFunc.checkAuthenticated, async (req, res) => {
  nameUser = await Users.find({ email: req.user.email })
  const mail = nameUser[0]?.email;
  var currentdate = new Date().toLocaleDateString();
  var currenttime = new Date().toLocaleTimeString();
  const image = await ProfileImage.find({ email: req.user.email })
  const id = image[0]?.id;
  const proPicLink = id == undefined ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" : `https://course.nutritionbee.net/image/${id}`
  res.render('index.ejs', { proPicLink, id, currenttime, currentdate, mail, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
})

// nbee courses 
app.get('/mycourses', commonFunc.checkAuthenticated, async (req, res) => {
  const user = await CertiNbee101.find({ name: req.user.name })
  let QuizMarks = user[0] === undefined ? null : user[0].quiz2;
  res.render('mycourses.ejs', { QuizMarks, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname })
})


app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('nbee/login')
})


app.listen(PORT, () => {
  console.log(`Running app on ${PORT}`);
})