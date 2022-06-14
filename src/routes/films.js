const express = require('express');
const router = express.Router();

const pool = require('../database.js');
const { isLoggedIn } = require('../lib/auth.js');

router.get('/add',isLoggedIn,(req,res)=>{
    res.render('films/add');
});

router.post('/add',isLoggedIn,(req,res)=>{
    const{ title,url,description} = req.body;
    const newFilm = {
        title,
        url,
        description,
        user_id: req.user[0].id
    };
    console.log(newFilm);
    pool.query('INSERT INTO films set ?',[newFilm],()=>{
        req.flash('success', 'Film saved succesfully');
        res.redirect('/films');
    });
});

// with '/' I refer to '/films'
router.get('/', isLoggedIn,(req,res) =>{
    pool.query('SELECT * FROM films WHERE user_id = ?',[req.user[0].id],(err,films)=>{
        if(!err){
            res.render('films/list',{films});    
        }
        else
        console.log(err);
    });
});

// Delete film from list

router.get('/delete/:id',isLoggedIn, (req,res)=>{
    const {id} = req.params;
    pool.query('DELETE FROM films WHERE ID = ?',[id],()=>{
        req.flash('success','The film has been removed from your list')
        res.redirect('/films');
    });

});

// Edit film from list

router.get('/edit/:id',isLoggedIn, (req,res)=>{
    const {id} = req.params;
    pool.query('SELECT * FROM films WHERE id = ?', [id],(err,films)=>{
        if(!err){
            const filmEdit = films[0];
            res.render('films/edit',{filmEdit});
        }
        else{
            console.log(err);
        }
    });
})

router.post('/edit/:id',isLoggedIn, (req,res)=>{
    const {id} = req.params;
    const {title,url,description} = req.body;
    const newFilm = {
        title,
        url,
        description
    }
    pool.query('UPDATE films set ? WHERE id = ?', [newFilm,id],()=>{
        req.flash('success','The film has been modified correctly')
        res.redirect('/films');
    })
})


module.exports = router;