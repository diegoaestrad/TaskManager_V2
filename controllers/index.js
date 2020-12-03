//Link to Express Package
var express = require('express');
var router = express.Router();

//ref for Auth
const passport = require('passport')
const User = require('../models/user')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Task Manager',
  user: req.user});
});

/*GET/about*/
router.get('/about',(req, res) => {
  res.render('about', {
    message: 'Content from the controller goes here',
    user: req.user
  })
})

//GET /register
router.get('/register',(req, res, next) => {
  res.render('register')
})

//POST /Register
router.post('/register', (req, res, next) => {
  //Use the User model with passport to try a new user
  //passport-local-mongoose will salt and has password
  User.register(new User({
    username: req.body.username
  }), req.body.password, (err, user) => {
    if(err){
      console.log(err)
      res.end(err)
    }
    else
    {
      //Log the User in and redirect to /tasks
      req.login(user, (err) =>{
        res.redirect('/tasks')
      })
    }
  })
})


//GET/login
router.get('/login',(req, res, next) => {
  //Check for Invalid Login message and pass to the view to display
  let messages = req.session.messages || []

  //Clear the Session Message
req.session.messages = []
  //Pass Local Message variable to the view for display
  res.render('login', {
    messages: messages
  })
})

//POST /Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/tasks',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'
}))

//GET /Logout
router.get('/logout', (req, res, next) => {
  //Call passport built-in logout method
  req.logout()
  res.redirect('/login')
})

// GET / Google /
// Check if the User is already logged into/with Google, if not invoke then Google Signin
router.get('/google', passport.authenticate('google', {
  scope:['profile']
}),
    (req, res) => {})

//Get / google/callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}),
    (req,res) =>{
  res.redirect('/tasks')
    })

// GET / Facebook/
// Check if the User is already logged into/with Facebook, if not invoke then Facebook Signin
router.get('/facebook', passport.authenticate('facebook' ),
    (req, res) => {}
    )

//Get / facebook/callback
router.get('/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    (req,res) =>{
      res.redirect('/tasks')
    })

module.exports = router;
