const express = require('express');
const { Passport } = require('passport');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn,isNotLoggedIn } = require('../lib/auth');

// log in

router.get('/signin',isNotLoggedIn,(req,res) =>{
    res.render('auth/signin');
})

router.post('/signin',isNotLoggedIn, (req,res)=>{
    passport.authenticate('local.sigin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res);
});

// sign up

router.get('/signup', isNotLoggedIn, (req,res) =>{
    res.render('auth/signup')

})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));


// profile

router.get('/profile', isLoggedIn ,(req,res)=>{

    res.render('profile');
})

module.exports = router;

// logout

router.get('/logout', isLoggedIn,(req,res)=>{
    req.logOut();
    res.redirect('/');
})