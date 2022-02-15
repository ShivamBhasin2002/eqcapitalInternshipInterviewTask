const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const User = require('./models/user.js');

mongoose.connect(
	'mongodb+srv://shivam:bhasin@cluster0.cslul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({ secret: 'NotAGoodSecret', resave: false, saveUninitialized: true })
);

const requireLogin = (req, res, next) => {
	if (!req.session.user_id) return res.redirect('/user/login');
	next();
};

app.get('/', requireLogin, async (req, res) => {
	const user = await User.findById(req.session.user_id),
		selectCourses = (courses) => {
			let res = [];
			if (courses !== 'noCourses' && courses !== 'course2')
				res.push({
					title: 'Course 1',
					author: 'Shivam Bhasin',
					about: 'Web Development',
					duration: '64hrs',
					access: 'previewOnly' !== courses ? 'true' : 'false'
				});
			if (courses !== 'noCourses' && courses !== 'course1')
				res.push({
					title: 'Course 2',
					author: 'Shivam Bhasin',
					about: 'Blockchain',
					duration: '32hrs',
					access: 'previewOnly' !== courses ? 'true' : 'false'
				});
			return res;
		};
	res.render('secret', {
		username: user.username,
		courses: selectCourses(user.courses)
	});
});

app.get('/courses/:title', (req, res) => {
	res.send(`You have reached to ${req.params.title}`);
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
	if (user && (await bcrypt.compare(password, user.password))) {
		req.session.user_id = user._id;
		res.redirect('/');
	} else res.redirect('/user/login');
});

app.post('/user/register', async (req, res) => {
	const { username, password, courses } = req.body.user;
	const hash = await bcrypt.hash(password, 12);
	const user = new User({
		username,
		password: hash,
		courses: courses
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
	console.log('Server Started');
});
