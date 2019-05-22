var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var app = express();
var path = require('path');

var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/public",express.static(__dirname + '/public'));

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// contact page
app.get('/contact', function(req, res) {
    res.render('pages/contact');
});

app.get('/unit_a',function(req,res){
    res.render('pages/unit_management');
});
app.get('/off_a',function(req,res){
    res.render('pages/officier_management');
});
app.get('/res_a',function(req,res){
    res.render('pages/research_area_management');
});

var random_id = function  ()
{
    var id_num = Math.random().toString(9).substr(2,3);
    var id_str = Math.random().toString(36).substr(2);
    return id_num + id_str;
}
var fakeDatabase = {
    'dv1':{
        name:'Bộ môn truyền thông mạng máy tính'
        ,type:'Bộ môn'
        ,add:'406-E3'
        ,phone:''
        ,site:''
    },
    'dv2':{
        name:'Bộ môn khoa học máy tính'
        ,type:'Bộ môn'
        ,add:''
        ,phone:''
        ,site:''
    }
};
app.get('/units',(req,res)=>{
    var allDV = Object.keys(fakeDatabase);
    console.log('running app.get /units get data: ', allDV);
    //res.send(allDV);
    res.send(fakeDatabase);
});
/*
var counttt  = 9;
app.post('/units',(req,res)=>{
    console.log(req.body);
    var comd = res.body.command;
    if("insert_row".equal(comd))
    {
        var s = '' + ++counttt;
        res.send({id:s})
    }
});*/

app.get('/units/:unitid',(req,res)=>{
    var nameToLookup = req.params.unitid;
    console.log(nameToLookup);
    var value = fakeDatabase[nameToLookup];
    console.log(nameToLookup,'->',value);
    if(value){
        res.send(value);
    } else {
        res.send({});
    }
    /*delete fakeDatabase.dv1;
    console.log(fakeDatabase);*/
});
app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// require('./routes/index.js')(app, passport);

app.listen(port);
console.log("Port: " + port);
