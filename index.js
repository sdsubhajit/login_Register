const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')


const userRoute = require('./route/userRoute')
const userAuth = require('./middleware/userAuthentication')


const app = express()
const port = process.env.PORT || 3000
const dbcon = "mongodb+srv://sdsubhajit24:w0hUsqRkmdYlbmRf@cluster0.uyhkjgq.mongodb.net/login_register"


app.use(express.urlencoded({extended : true}))
app.use(flash())
app.use(cookieParser())
app.use(session({
    cookie:{maxAge:30000},
    secret:'subhajit',
    resave:false,
    saveUninitialized:false
}))
app.set('view engine' , 'ejs')
app.set('views' , 'views')

app.use(userAuth.authjwt)
app.use(userRoute)


mongoose.connect(dbcon , ({useNewUrlParser:true , useUnifiedTopology:true}))
.then(result =>{
    app.listen(port , ()=>{
        console.log(`server listening at http://localhost:${port}`);
        console.log(`DataBase Connected....`);
    })
}).catch(error =>{
    console.log(error);
})