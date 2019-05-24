module.exports = function(app, passport, connection) {
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
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            console.log(req.user.isAdmin);
            // if (req.body.remember) {
            //     req.session.cookie.maxAge = 1000 * 10;
            // } else {
            //     req.session.cookie.expires = false;
            // }
            // if (req.user.isAdmin === 1) {
            //   res.redirect('pages/admin');
            // }
            // if (req.user.isAdmin === 0) {
            //   res.redirect('/profile');
            // }
        }
    );
    // for admin
    app.get('/division_admin',function(req,res){
        if (req.isAuthenticated()) {
            //console.log(req.user.isAdmin)
            res.render('pages/division_management');
        } else {
            //console.log(req.user.isAdmin)
            // console.log(req);
            req.flash('loginMessage', 'You have to login first.');
            res.redirect('/login');
        }
    });
    app.get('/staff_admin',function(req,res){
        res.render('pages/staff_management');
    });
    app.get('/reserch_field_admin',function(req,res){
        res.render('pages/research_field_management');
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
        var allDV = Object.keys(fakeDatabase);
        console.log('running app.get /units get data: ', allDV);
        //res.send(allDV);
        res.send(fakeDatabase);
    });
    app.get('/officers',(req,res)=>{
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
    app.post('/officers/:command',(req,res)=>{
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
    app.post('/units/:command',(req,res)=>{
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
};
//
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//
//     res.redirect('/');
// }
