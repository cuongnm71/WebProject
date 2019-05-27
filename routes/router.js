module.exports = function(app, passport, connection) {
    // Index page
    app.get('/', (req, res) => {

        res.render('pages/index', {userMessage: req.flash('userMessage')});
    });


    // Contact page
    app.get('/contact', function(req, res) {
        res.render('pages/contact');
    });


    // Login page
    app.get('/login',function(req,res){
        res.render('pages/login', {loginMessage: req.flash('loginMessage'), userMessage: req.flash('userMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            // if (req.body.remember) {
            //     req.session.cookie.maxAge = 1000 * 10;
            // } else {
            //     req.session.cookie.expires = false;
            // }
        }
    );


    // Logout
    app.get('/logout', (req, res) => {
        req.logout();
        req.session.destroy(err => {
            res.clearCookie();
            res.redirect('/');
        });
    })


    // Admin page
    app.get('/division_admin', function(req,res){
        if (req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
                res.render('pages/division_management', {userMessage: req.flash('userMessage')});
            } else {
                req.flash('userMessage', 'staff');
                res.redirect('/');
            }
        } else res.redirect('/');
    });

    app.get('/staff_admin', function(req,res){
        if (req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
                res.render('pages/staff_management', {userMessage: req.flash('userMessage')});
            } else {
                req.flash('userMessage', 'staff');
                res.redirect('/');
            }
        } else res.redirect('/');
    });

    app.get('/research_field_admin', function(req,res){
        if (req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
                res.render('pages/research_field_management', {userMessage: req.flash('userMessage')});
            } else {
                req.flash('userMessage', 'staff');
                res.redirect('/');
            }
        } else res.redirect('/');
    });


    // Get data and send back
    app.get('/division',(req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.query("SELECT * FROM division ORDER BY division_id ASC;", (err, results, fields) => {
                if (err) throw err;
                res.send(results);
            });
        }
    });

    app.get('/staff',(req,res)=>{
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.query("SELECT s.staff_id, s.full_name, ua.username, s.vnu_email, s.staff_type, s.degree_level, s.address FROM staff s JOIN user_account ua ON s.account_id = ua.id ORDER BY username ASC;", (err, results, fields) => {
                if (err) throw err;
                res.send(results);
            });
        }
    });


    // Admin CRUD command
    app.post('/staff/:command', (req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            if (req.body.staff_id == '' |
                req.body.username == '' |
                req.body.vnu_email == '' |
                req.body.staff_type == '' |
                req.body.degree_level == '' |
                req.body.address == '') res.send({message:'error'});
            else {
                if (req.params.command == 'insert') {
                    var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; INSERT INTO user_account(username) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT username FROM user_account WHERE username = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; SELECT @account_id := id FROM user_account WHERE username = ?; INSERT INTO staff(staff_id, full_name, vnu_email, degree_level, address, staff_type, division_id, account_id) VALUES (?, ?, ?, ?, ?, ?, @division_id, @account_id);";
                    connection.query(sql, [req.body.address, req.body.address, req.body.username, req.body.username, req.body.address, req.body.username, req.body.staff_id, req.body.full_name, req.body.vnu_email, req.body.degree_level, req.body.address, req.body.staff_type], (err) => {
                        if (err) {
                            // throw err;
                            res.send({message:'error'});;
                        } else res.send({message:'success'});
                    });
                } else if (req.params.command == 'edit') {
                    var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; UPDATE staff SET staff_type = ?, degree_level = ?, address = ?, division_id = @division_id WHERE staff_id = ?;";
                    connection.query(sql, [req.body.address, req.body.address, req.body.address, req.body.staff_type, req.body.degree_level, req.body.address, req.body.staff_id], (err) => {
                        if (err) {
                            throw err;
                            res.send({message:'error'});;
                        } else res.send({message:'success'});
                    });
                } else if (req.params.command == 'delete') {
                    var sql = "DELETE FROM user_account WHERE username = ?; DELETE FROM staff WHERE staff_id = ?";
                    connection.query(sql, [req.body.username, req.body.staff_id], (err) => {
                        if (err) {
                            throw err;
                            res.send({message:'error'});;
                        } else res.send({message:'success'});
                    });
                }
            }
        }
    });
    app.post('/division/:command',(req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
        }
    });


    // Staff page
    app.get('/lecturer_info', function(req, res) {
        if (req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
                res.redirect('/');
            } else {
                req.flash('userMessage', 'staff');
                res.render('pages/lecturer_information', {userMessage: req.flash('userMessage')});
            }
        } else res.redirect('/');
    });

};
