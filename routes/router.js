module.exports = function(app, passport, connection) {
    // index page
    app.get('/', function(req, res) {
        res.render('pages/index', {userMessage: req.flash('userMessage')});
    });

    // contact page
    app.get('/contact', function(req, res) {
        res.render('pages/contact');
    });
    app.get('/login',function(req,res){
        res.render('pages/login', {loginMessage: req.flash('loginMessage'), userMessage: req.flash('userMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/',
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
        }
    );
    app.get('/logout', (req, res) => {
        console.log('logging out');
        req.logout();
        req.session.destroy(err => {
            res.clearCookie();
            res.redirect('/');
        });
    })

    // for admin
    app.get('/division_admin', function(req,res){
        if (req.isAuthenticated() == 1) {
            req.flash('userMessage', 'User logged in');
            if (req.user.isAdmin == 1) {
                res.render('pages/division_management', {userMessage: req.flash('userMessage')});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
    app.get('/staff_admin', function(req,res){
        if (req.isAuthenticated() == 1) {
            req.flash('userMessage', 'User logged in');
            if (req.user.isAdmin == 1) {
                res.render('pages/staff_management', {userMessage: req.flash('userMessage')});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
    app.get('/reserch_field_admin', function(req,res){
        if (req.isAuthenticated() == 1) {
            req.flash('userMessage', 'User logged in');
            if (req.user.isAdmin == 1) {
                res.render('pages/research_field_management', {userMessage: req.flash('userMessage')});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });

    var fakeDatabase;
    var sql = "SELECT * FROM division ORDER BY division_id ASC";
    connection.query(sql, function(err, results, fields) {
        if (err) throw err;
        fakeDatabase = results;
    })
    app.get('/division',(req,res)=>{
        var allDV = Object.keys(fakeDatabase);
        console.log('running app.get /units get data: ', allDV);
        //res.send(allDV);
        res.send(fakeDatabase);
    });
    app.get('/staff',(req,res)=>{
        //res.send(allDV);
        var fakeDataOfficer =
        [
            {
                staff_id : '2492',
                full_name: 'Lê Minh Tiến',
                username: "adsfasdf",
                vnu_email: 'tienle@vnu.edu.vn',
                staff_type: 'Giảng viên',
                degree_level: 'Tiến sĩ',
                address: 'Bộ môn khoa học máy tính'
            }
        ]
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
    app.post('/staff/:command',(req,res)=>{
        var command = req.params.command;
        console.log(command);
        console.log(req.body);
        console.log(req.body.staff_id);
        // lenh gi do cho database

        // kiem tra neu thuc hien than cong thay doi dtb thi:
            res.send({message:'success'});
        // khong thi
        // res.send({message:'error gi do'})
    });
    app.post('/division/:command',(req,res)=>{
        var command = req.params.command;
        console.log(command);
        console.log(req.body);
        console.log(req.body.division_id);
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
    var loggedIn = 0;
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            loggedIn = 0;
        else loggedIn = 1;
    }
};
//
