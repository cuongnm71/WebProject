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
        res.render('pages/login');
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
