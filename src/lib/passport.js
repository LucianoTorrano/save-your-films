const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.sigin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password,done)=>{
       pool.query('SELECT * FROM users WHERE username = ?', [username],async(err,userValidation)=>{
        const user = userValidation[0];
        if(!err && userValidation.length > 0){
           const validPassword = await helpers.matchPassword(password,user.password);
           console.log(validPassword); 
           if(validPassword){
                console.log(1);
                done(null,user,req.flash('success','Welcome ' + user.username));
            }else{
                console.log(2);
                done(null,false,req.flash('message','Invalid password'));
            }
        }else{
            console.log(3);
           return done(null,false,req.flash('message','The User does not exists'));
       }
   });
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req,username,password,done)=>{
    const { fullname } = req.body
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    console.log("el hash es :", newUser.password);
    pool.query('INSERT INTO users SET ?', [newUser],(err,userState)=>{
        if(!err){
            newUser.id = userState.insertId;
            return done(null,newUser);
        }else{
            console.log(err);
        }
    });
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    pool.query('SELECT * FROM users WHERE id = ?', [id] , (err,user)=>{
        if(!err){
            done(null,user);
        }else{
            console.log(err);
        }
    })
})