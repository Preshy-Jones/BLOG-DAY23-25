const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')
const app = express();
const passport = require('passport')
const methodOverride = require('method-override')
//const db = require('./config').mongoURI
//const articleRouter = require('./controllers/article')

//passport config
require('./config/passport')(passport)
const dotenv = require('dotenv');
const port = process.env.PORT || 8009



// mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
//     console.log('mongoDB connected')
// })


dotenv.config();
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log('connected to mongodb')

);
//ejs template engine
app.set('view engine', 'ejs');


//body parser
app.use(express.urlencoded({ extended: false }));
//Express session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }

}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
app.use(methodOverride('_method'))
//routes
app.use('/', require('./controllers/index'))
app.use('/users', require('./controllers/users'))
app.use('/articles', require('./controllers/articles'))

app.use(express.static('./public'))



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})