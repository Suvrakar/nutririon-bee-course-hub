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




connect(); //db connection

const initializePassport = require('./passport-config')
const initialPass = async () => {
  let userData = await Users.find().sort();
  console.log(userData);
  initializePassport(
    passport,
    email => userData.find(user => user.email === email),
    id => userData.find(user => user.id === id)
  )
}

initialPass(); //passport start

// const users = []

app.set('view-engine', 'ejs')
app.set('views', path.join(__dirname, './views'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(express.static("public"));
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('home.ejs')
})

app.get('/profile', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { email: req.body.email, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone })
})
app.get('/edit', checkAuthenticated, (req, res) => {
  res.render('edit_profile.ejs', { email: req.body.email, paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname, phone: req.user.phone, password: req.body.password, })
})
app.get('/profile2', checkAuthenticated, (req, res) => {
  res.render('index2.ejs', { paymentStatus: req.user.paymentStatus, name: req.user.name, unvname: req.user.unvname })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/payments', checkNotAuthenticated, (req, res) => {
  res.render('payments.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    let paymentStatus = { 
      paymentStatus: false
    }
    let userData = new Users(req.body);
    const finalResult = Object.assign(userData,paymentStatus);
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
    res.redirect('/profile')
  } catch {
    res.redirect('/register')
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
    return res.redirect('/')
  }
  next()
}

app.listen(PORT, () => {
  console.log("Running app");
})