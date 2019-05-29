const bcrypt = require('bcryptjs');

module.exports = (app, passport, connection) => {
    // Index page
    app.get('/', (req, res) => {
        if (req.flash('userMessage').length == 0 && req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
            } else req.flash('userMessage', 'staff');
        }
        res.render('pages/index', {userMessage: req.flash('userMessage')});
    });


    // Contact page
    app.get('/contact', (req, res) => {
        res.render('pages/contact');
    });


    // Login page
    app.get('/login',(req,res) => {
        res.render('pages/login', {loginMessage: req.flash('loginMessage'), userMessage: req.flash('userMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }), (req, res) => {
            // if (req.body.remember) {
            //     req.session.cookie.maxAge = 1000 * 10;
            // } else {
            //     req.session.cookie.expires = false;
            // }
        }
    );


    // Logout
    app.get('/logout',(req, res) => {
        req.logout();
        req.session.destroy(err => {
            res.clearCookie();
            res.redirect('/');
        });
    })


    // Admin page
    app.get('/division_admin',(req,res) => {
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

    app.get('/staff_admin',(req,res) => {
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

    app.get('/research_field_admin', (req,res) => {
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
            connection.getConnection((err, connection) => {
                connection.query("SELECT * FROM division", (err, results, fields) => {
                    connection.release();
                    if (err) throw err;
                    res.send(results);
                });
            });
        }
    });

    app.get('/staff', (req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                connection.query("SELECT s.staff_id, s.full_name, ua.username, s.vnu_email, s.staff_type, s.degree_level, d.name address FROM staff s LEFT JOIN user_account ua ON s.account_id = ua.id LEFT JOIN division d ON s.division_id = d.division_id;", (err, results, fields) => {
                    connection.release();
                    if (err) throw err;
                    res.send(results);
                });
            });
        }
    });

    app.get('/research', (req, res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                connection.query("SELECT field_id 'id', parent_id as 'parent', name as 'text' FROM research_field;", (err, results, fields) => {
                    connection.release();
                    if (err) throw err;
                    res.send(results);
                });
            });
        }
    });


    // Admin command
    app.post('/division/:command', (req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                if (req.body.username == '' |
                    req.body.name == '' |
                    req.body.type == '' ) res.send({message:'emptyField'});
                else {
                    if (req.params.command == 'insert') {
                        console.log(req.body);
                        var sql = "INSERT INTO division(division_id, name, type, address, phone_number, website) VALUES (?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.division_id, req.body.name, req.body.type, req.body.address, req.body.phone_number, req.body.website], (err) => {
                            connection.release();
                            if (err) {
                                throw err;
                                res.send({message:'error'});
                            } else res.send({message:'success'});
                        });
                    } else if (req.params.command == 'edit') {
                        var sql = "UPDATE division SET name = ?, type = ?, address = ?, phone_number = ?, website = ? WHERE division_id = ?;";
                        connection.query(sql, [req.body.name, req.body.type, req.body.address, req.body.phone_number, req.body.website, req.body.division_id], (err) => {
                            connection.release();
                            if (err) {
                                throw err;
                                res.send({message:'error'});
                            } else res.send({message:'success'});
                        });
                    } else if (req.params.command == 'delete') {
                        var sql = "DELETE FROM division WHERE division_id = ?;";
                        connection.query(sql, [req.body.division_id, ], (err) => {
                            connection.release();
                            if (err) {
                                throw err;
                                res.send({message:'error'});
                            } else res.send({message:'success'});
                        });
                    }
                }
            });
        }
    });

    app.post('/staff/:command', (req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                if (req.body.staff_id == '' |
                    req.body.username == '' |
                    req.body.full_name == '' |
                    req.body.vnu_email == '') res.send({message:'emptyField'});
                else {
                    if (req.params.command == 'insert') {
                        var sql = "INSERT INTO user_account(username) VALUES (?);";
                        connection.query(sql, [req.body.username], (err) => {
                            if (err) {
                                throw err;
                                res.send({message:'error'});
                            } else {
                                var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; SELECT @account_id := id FROM user_account WHERE username = ?; INSERT INTO staff(staff_id, full_name, vnu_email, degree_level, staff_type, division_id, account_id) VALUES (?, ?, ?, ?, ?, ?, @division_id, @account_id);";
                                connection.query(sql, [req.body.address, req.body.address, req.body.address, req.body.username, req.body.staff_id, req.body.full_name, req.body.vnu_email, req.body.degree_level, req.body.staff_type], (err) => {
                                    connection.release();
                                    if (err) {
                                        throw err;
                                        res.send({message:'error'});
                                    } else res.send({message:'success'});
                                });
                            }
                        });
                    } else if (req.params.command == 'edit') {
                        var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; UPDATE staff SET staff_type = ?, degree_level = ?, address = ?, division_id = @division_id WHERE staff_id = ?;";
                        connection.query(sql, [req.body.address, req.body.address, req.body.address, req.body.staff_type, req.body.degree_level, req.body.address, req.body.staff_id], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'error'});
                            } else res.send({message:'success'});
                        });
                    } else if (req.params.command == 'delete') {
                        var sql = "DELETE FROM user_account WHERE username = ?; DELETE FROM staff WHERE staff_id = ?;";
                        connection.query(sql, [req.body.username, req.body.staff_id], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'error'});
                            } else res.send({message:'success'});
                        });
                    }
                }
            });
        }
    });

    app.post('/research/:command', (req, res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                if (req.params.command == 'create') {
                    connection.query("SELECT field_id 'id', parent_id as 'parent', name as 'text' FROM research_field;", (err, results, fields) => {
                        connection.release();
                        if (err) throw err;
                        res.send(results);
                    });
                } else if (req.params.command == 'rename') {
                    console.log(req.body);
                    res.send({message:"renamed"});
                } else if (req.params.command == 'delete') {
                    console.log(req.body);
                    res.send({message:"deleted"});
                }
            });
        }
    });

    app.post('/account/excel',(req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                if (req.body.staff_id == '' |
                    req.body.username == '' |
                    req.body.password == '' |
                    req.body.full_name == '' |
                    req.body.vnu_email == '' |
                    req.body.division_name == '') res.send({message:'emptyField'});
                else {
                    var sql = "INSERT INTO user_account(username, password) VALUES(?, ?);";
                    connection.query(sql, [req.body.username, bcrypt.hashSync(req.body.password, 10)], (err) => {
                        if (err) {
                            throw(err);
                            res.send({message:'error'});
                        } else {
                            var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; SELECT @account_id := id FROM user_account WHERE username = ?; INSERT INTO staff(staff_id, full_name, vnu_email, division_id, account_id) VALUES (?, ?, ?, @division_id, @account_id);";
                            connection.query(sql, [req.body.division_name, req.body.division_name, req.body.division_name, req.body.username, req.body.staff_id, req.body.full_name, req.body.vnu_email], (err) => {
                                connection.release();
                                if (err)
                                    throw(err);
                                else res.send({message:'success'});
                            });
                        }
                    });
                }
            });
        }
    });


    // Staff page
    app.get('/lecturer_info', (req, res) => {
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

    app.get('/profile',function(req,res){
        res.send({
            "full_name": "Lê Đình Thanh",
            "staff_id":"9",
            "staff_type": "",
            "address":"qưe",
            "degree_level":"qe",
            "phone_number":"9",
            "vnu_email":"9",
            "other_email":"9",
            "website":"9",
            "staff_address":"9",
            "text_area":
            "- Chủ đề \n- toán \n- lý luận\n"
            /*
            du lieu cay
            */
        });
    });
    app.post('/profile/basicInfo/edit',function(req,res){
        console.log(req.body);
    });
    app.post('/profile/interestedField/edit',function(req,res){
        console.log(req.body);
    });
    app.post('/profile/researchField/:command',function(req,res){
    });
};
