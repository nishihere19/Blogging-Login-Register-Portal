const express = require('express');
const User = require('../core/user');
const Blog = require('../core/blogs');
const router = express.Router();

// create an object from the class User in the file core/user.js
const user = new User();
const blogs = new Blog();
var userdata;
var date =new Date().toISOString()


// Get the index page
router.get('/', (req, res, next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    if(user) {
        res.redirect('/home');
        return;
    }
    // IF not we just send the index page.
    res.render('index', {title:"My application"});
})
router.get('/profile', (req, res, next) => {
    let user1 = req.session.user;
    // Check if the session is exist
    var followers,following;
    user.followers(user1.id,function(result){
        result=JSON.stringify(result);
        console.log(result);
        followers=result;
    });
    user.following(user1.id,function(result){
        result=JSON.stringify(result);
        console.log(result);
        following=result;
    });
    

    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
            //console.log(user.fullname);
            
            blogs.myblogs(user1.id,function(result){
            req.result= JSON.stringify(result);
            //console.log("articles:", result);
            res.render('profile',{name:user1.fullname, articles:result, followers:followers,following:following});
            return;
            });
            return;
            
           
    
    }
    res.redirect('/');
})
// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;
    

    if(user) {
        blogs.allblogs(function(result){
            req.result= JSON.stringify(result);
            //console.log("articles:", result);
        res.render('home', {opp:req.session.opp, name:user.fullname,articles:result});
        return;
    });
    return;
}
    res.redirect('/');
});

// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    user.login(req.body.username, req.body.password, function(result) {
        userdata=result;
        //console.log(userdata);
        if(result) {
            // Store the user data in a session.
            req.session.user = result;
            req.session.opp = 1;
            // redirect the user to the home page.
            res.redirect('/home');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    })

});
router.post('/search',(req,res,next)=>{
    user.findsearch(req.body.searchbar, function(result){
        if(result){
        req.result=JSON.stringify(result);
        console.log(result);
        
        res.render('searchresults',{articles: result});
        return;
        }
        else{
            res.send("NO SUCH USER");
            return;
        }        
    });

})
router.post('/follow/:usersid',(req,res,next)=>{
    console.log("follow");
    console.log(req.params.usersid);
    req.userid=req.params.usersid;
    var userid=parseInt(req.userid);
    user.find(userid,function(result){
        //req.result=JSON.stringify(result);
        //console.log(result);
        user.follow(userid,req.session.user.id,function(result2){
            console.log("worked",result2);
            blogs.find(userid,function(result1){
                blogs.myblogs(userid,function(result){
                    req.result= JSON.stringify(result);
                    //console.log("articles:", result);
                    req.result1=JSON.stringify(result1);
                    console.log(result1);
                    res.render('userprofile',{id: userid, name:result1.fullname, articles:result , follow:result2});
                    return;
                    
                });
                return;
            });
    
        })
        
        
        return;
    });
})
router.post('/status',(req,res,next) =>{
    //console.log(req.session.user);
    //console.log(req.body.BOLD);
   // console.log(req.body.ITALIC);
    user.updatestatus(req.body.Heading,req.body.Status,req.session.user,function(check){
        if(check){
            console.log("success");
           
        }else{
            console.log("failed");
            
        }
    })
    res.redirect('/home');

})

// Post register data
router.post('/register', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastId) {
            // Get the user data by it's id. and store it in a session.
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });

        }else {
            console.log('Error creating a new user ...');
        }
    });

});


// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            
        });
    }
    res.redirect('/');
});
router.get("/userprofile/:userid", (req, res, next) => {
    var user1=req.session.user;
    console.log(req.params.userid);
    console.log("entered");
    clickeduser=req.params.userid;
    console.log("user:",clickeduser);
    clickeduser=parseInt(clickeduser);
    if(clickeduser==user1.id){
        res.redirect("/profile");
        return;
    }
    else{
    var follow;
    user.check(clickeduser,req.session.user.id,function(result3){
        
        follow=result3;
    });
    if(req.session.user) {
        blogs.find(clickeduser,function(result1){
            blogs.myblogs(clickeduser,function(result){
                req.result= JSON.stringify(result);
                //console.log("articles:", result);
                req.result1=JSON.stringify(result1);
                console.log(result1);
                res.render('userprofile',{id: req.params.userid, name:result1.fullname, articles:result,follow: follow});
                return;
                
            });
            return;
        });
        
        
       
            return;
    }
}
    res.redirect('/');
});

module.exports = router;