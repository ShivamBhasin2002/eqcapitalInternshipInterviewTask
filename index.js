const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const User = require('./models/user.js');

mongoose.connect('mongodb://localhost:27017/user', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "NotAGoodSecret", resave: false, saveUninitialized: true }));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id)
        return res.redirect('/user/login');
    next();
}

app.get('/', requireLogin, (req, res) => {
    res.render('secret');
});

app.get('/user/login', (req, res) => {
    res.render('login');
});

app.get('/user/register', (req, res) => {
    res.render('register');
});

app.post('/user/login', async (req, res) => {
    const { username, password } = req.body.user;
    const user = await User.findOne({ username: username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user_id = user._id;
        res.redirect('/');
    }
    else
        res.redirect('/user/login');
});

app.post('/user/register', async (req, res) => {
    const { username, password } = req.body.user;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/user/login');
});

app.post('/user/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
});

app.listen(3000, () => {
    console.log("Server Started");
});