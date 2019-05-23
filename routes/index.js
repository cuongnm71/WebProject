var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports = function(app, passport) {
    // index page
    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    // contact page
    app.get('/contact', function(req, res) {
        res.render('pages/contact');
    });
    app.get('/login',function(req,res){
        res.render('pages/login', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            console.log(req);
            // if (req.body.remember) {
            //     req.session.cookie.maxAge = 1000 * 10;
            // } else {
            //     req.session.cookie.expires = false;
            // }
            if (req.user.isAdmin === 1) {
              res.redirect('pages/admin');
            }
            if (req.user.isAdmin === 0) {
              res.redirect('/profile');
            }
        }
    );
    // for admin
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
    var fakeDatabase;
    var sql = "SELECT * FROM division ORDER BY division_id ASC";
    connection.query(sql, function(err, results, fields) {
        if (err) throw err;
        fakeDatabase = results;
    })
    app.get('/units',(req,res)=>{
        
        console.log('running app.get /units get data: ', allDV);
        //res.send(allDV);
        res.send(fakeDatabase);
    });
    app.get('/officers',(req,res)=>{
        //res.send(allDV);
        let fakeDataOfficer = {
            'dt': {
                staff_id : '1',
                staff_number: 'asdf',
                full_name: 'Lê Minh Tiến',
                account_id: "adsfasdf",
                vnu_email: 'tienle@vnu.edu.vn',
                staff_type: 'Giảng viên',
                degree_level: 'Tiến sĩ',
                address: 'Bộ môn khoa học máy tính'
            }
        };
        var allDV = Object.keys(fakeDataOfficer);
        console.log('running app.get /officers get data: ', allDV);
        res.send(fakeDataOfficer);
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

    const bodyParser = require('body-parser');
    app.use( bodyParser.urlencoded({extended: true}));
    app.post('/units/:command',(req,res)=>{
        var command = req.params.command;
        console.log(command);
        console.log(req.body);
        console.log(req.body.id);
        // lenh gi do cho database

        // kiem tra neu thuc hien than cong thay doi dtb thi:
            res.send({message:'success'});
        // khong thi
        // res.send({message:'error gi do'})
    });
    app.post('/officers/:command',(req,res)=>{
        var command = req.params.command;
        console.log(command);
        console.log(req.body);
        console.log(req.body.id);
        // lenh gi do cho database

        // kiem tra neu thuc hien than cong thay doi dtb thi:
            res.send({message:'success'});
        // khong thi
        // res.send({message:'error gi do'})
    });

    // app.get('/login', function(req, res) {
    //     res.render('login.ejs', {
    //         message: req.flash('loginMessage')
    //     });
    // });
    //

    //
    // app.get('/admin', function(req, res) {
    //     res.render('pages/index.ejs');
    // });

//     app.get('/signup', function(req, res) {
//         res.render('signup.ejs', {
//             message: req.flash('signupMessage')
//         });
//     });
//
//     app.post('/signup', passport.authenticate('local-signup', {
//         successRedirect: '/profile',
//         failureRedirect: '/signup',
//         failureFlash: true
//     }));
//
//     app.get('/profile', isLoggedIn, function(req, res) {
//         res.render('profile.ejs', {
//             user: req.user
//         });
//     });
//
//     app.get('/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     })
};
//
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//
//     res.redirect('/');
// }
