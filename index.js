const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');

// Connect to DB
mongoose.connect('mongodb://localhost/url-shortener', {
    useNewUrlParser:true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to database..')
})

// Set EJS View Engine.
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

// Basic Routing 
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls});
})

// Routing
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl}).save();
    res.redirect('/')
})

app.get('/shortUrl', async(req, res) => { 
    const shortUrl = await ShortUrl.findone({ short: req.params.shortUrl})
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

// Start the Server
app.listen(3000, () => {
    console.log(`Server started on port 3000!`)
})