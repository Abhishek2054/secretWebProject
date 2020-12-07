//jshint esversion:6

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


var encKey = process.env.SOME_32BYTE_BASE64_STRING;
var sigKey = process.env.SOME_64BYTE_BASE64_STRING;


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret:  process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req, res){
    res.render("home");
});

app.get("/secrets",function(req, res){
    res.render("secrets");
});

app.get("/logout", function(req, res){
    res.render("home");
})
app.route("/submit")
.get(function(req, res){
    res.render("submit");
})
.post(function(req, res){
    const userSecret = req.body.secret;
    console.log(req.body.secret);
})


app.route("/register")
    .get(function(req, res){
        res.render("register");
    })
    .post(function(req, res){
        const newUser = new User ({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });


app.route("/login")
    .get(function(req, res){
        res.render("login");
    })
    .post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else {
            if (foundUser) {
                if ( foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});


app.listen(3000, function(req, res){
    console.log("Server started at port 3000.......")
});