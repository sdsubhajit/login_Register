const usermodel = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const home=(req, res)=>{
    res.render('home')
}

const register=(req,res)=>{
    res.render('register', {
        message : req.flash('message'),
        message2 : req.flash('message2')
    })
}

const register_create=(req,res)=>{
    usermodel({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    }).save((err,data)=>{
        if(!err){
            req.flash('message' , 'User Add')
            res.redirect('/login')
            console.log(data);
        }else{
            console.log(err);
        }
    })
}

const login=(req,res)=>{
    logindata = {}
    logindata.email = (req.cookies.email) ? req.cookies.email : undefined
    logindata.password = (req.cookies.password) ? req.cookies.password : undefined
    res.render('login',{
        message : req.flash('message'),
        data : logindata
    })
}

const login_create=(req,res)=>{
    usermodel.findOne({
        email: req.body.email
    },(err,data)=>{
        console.log(data);
        if(data){
            const haspassword = data.password
            if(bcrypt.compareSync(req.body.password, haspassword)){
                const token = jwt.sign({
                    id: data._id,
                    name: data.name
                }, "helloworld@2406" ,{expiresIn:'10s'})
                res.cookie('userToken' , token)
                if(req.body.rememberme) {
                    res.cookie('email' , req.body.email)
                    res.cookie('password' , req.body.password)
                }
                console.log(data);
                res.redirect('/dashboard')
            }else{
                req.flash('message2' , 'Invalide Password')
                res.redirect('/login')
            }
        }else{
            req.flash('message2' , 'Invalide Email')
            res.redirect('/login')
        }
    })
}

const dashboard=(req,res)=>{
    if(req.user){
        usermodel.find({},(err, userDetails)=>{
            if(!err){
                res.render('dashboard', {
                    data : req.user,
                    details : userDetails
                })
            }else{
                console.log(err);
            }
        })
    }
}

const userAuther=(req,res,next)=>{
    if(req.user){
        console.log(req.user);
        next()
    }else{
        console.log(req.user);
        res.redirect('/login')
    }
}


const logout=(req,res)=>{
    res.clearCookie('userToken')
    res.redirect('/login')
}

module.exports = {
    home, 
    register,
    register_create,
    login,
    login_create,
    dashboard,
    userAuther,
    logout
}