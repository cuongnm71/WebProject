const bcrypt = require('bcryptjs');
const querystring = require('querystring');

module.exports = (app, passport, connection) => {
    // Search page
    app.get('/', (req, res) => {
        if (req.flash('userMessage').length == 0 && req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
            } else req.flash('userMessage', 'staff');
        }
        res.render('pages/index', {userMessage: req.flash('userMessage')});
    });

    app.get('/search/:command', function(req, res) {
        if (req.params.command == 'division') {
            connection.getConnection((err, connection) => {
                var sql = "SELECT d.division_id id, '#' parent, d.name 'text' FROM division d;";
                connection.query(sql, (err, results, fields) => {
                    connection.release();
                    if (err)
                        throw err;
                    res.send(results);
                });
            });
        }
    });

    app.post('/result/:command', function(req, res) {
        if (req.params.command == 'division') {
            connection.getConnection((err, connection) => {
                var sql = "SELECT s.staff_id, s.degree_level, s.full_name, d.name  FROM staff s JOIN division d ON s.division_id = d.division_id WHERE d.division_id = ?;";
                connection.query(sql, [req.body.division_id], (err, results, fields) => {
                    connection.release();
                    if (err)
                        throw err;
                    res.send(results);
                });
            });
        } else if (req.params.command == 'field') {
            connection.getConnection((err, connection) => {
                var sql = "SELECT s.staff_id, s.degree_level, s.full_name, d.name  FROM staff s JOIN division d ON s.division_id = d.division_id JOIN research_staff rs ON s.staff_id = rs.staff_id JOIN research_field rf ON rs.field_id = rf.field_id WHERE rf.field_id = ?";
                connection.query(sql, [req.body.field_id], (err, results, fields) => {
                    connection.release();
                    if (err)
                        throw err;
                    res.send(results);
                });
            });
        }});


    // Login page
    app.get('/login',(req,res) => {
        res.render('pages/login', {loginMessage: req.flash('loginMessage'), userMessage: req.flash('userMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
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
        connection.getConnection((err, connection) => {
            connection.query("SELECT field_id 'id', parent_id as 'parent', name as 'text' FROM research_field;", (err, results, fields) => {
                connection.release();
                if (err) throw err;
                res.send(results);
            });
        });
    });

    // Admin command
    app.post('/division/:command', (req,res) => {
        if (req.isAuthenticated() == 1 && req.user.isAdmin == 1) {
            connection.getConnection((err, connection) => {
                console.log(req.body)
                if (req.body.username == '' |
                    req.body.name == '' |
                    req.body.type == '') res.send({message:'Chưa điền đủ trường'});
                else {
                    if (req.params.command == 'insert') {
                        console.log(req.body);
                        var sql = "INSERT INTO division(division_id, name, type, address, phone_number, website) VALUES (?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.division_id, req.body.name, req.body.type, req.body.address, req.body.phone_number, req.body.website], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'Thêm không thành công'});
                            } else res.send({message:'success'});
                        });
                    } else if (req.params.command == 'edit') {
                        var sql = "UPDATE division SET name = ?, type = ?, address = ?, phone_number = ?, website = ? WHERE division_id = ?;";
                        connection.query(sql, [req.body.name, req.body.type, req.body.address, req.body.phone_number, req.body.website, req.body.division_id], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'Sửa không thành công'});
                            } else res.send({message:'success'});
                        });
                    } else if (req.params.command == 'delete') {
                        var sql = "DELETE FROM division WHERE division_id = ?;";
                        connection.query(sql, [req.body.division_id, ], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'Xóa không thành công'});
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
                    req.body.vnu_email == '' |
                    req.body.address == '') res.send({message:'Chưa điền đủ trường'});
                else {
                    if (req.params.command == 'insert') {
                        var sql = "INSERT INTO user_account(username) VALUES (?);";
                        connection.query(sql, [req.body.username], (err) => {
                            if (err) {
                                // throw err;
                                res.send({message:'Thêm không thành công'});
                            } else {
                                var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; SELECT @account_id := id FROM user_account WHERE username = ?; INSERT INTO staff(staff_id, full_name, vnu_email, degree_level, staff_type, division_id, account_id) VALUES (?, ?, ?, ?, ?, @division_id, @account_id);";
                                connection.query(sql, [req.body.address, req.body.address, req.body.address, req.body.username, req.body.staff_id, req.body.full_name, req.body.vnu_email, req.body.degree_level, req.body.staff_type], (err) => {
                                    if (err) {
                                        throw err;
                                        var sql = "DELETE FROM user_account WHERE username = ?;";
                                        connection.query(sql, [req.body.username], (err) => {
                                            connection.release();
                                            if (err)
                                                throw err;
                                        });
                                        res.send({message:'Thêm không thành công'});
                                    } else {
                                        connection.release();
                                        res.send({message:'success'});
                                    }

                                });
                            }
                        });
                    } else if (req.params.command == 'edit') {
                        var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; UPDATE staff SET staff_type = ?, degree_level = ?, staff_address = ?, division_id = @division_id WHERE staff_id = ?;";
                        connection.query(sql, [req.body.address, req.body.address, req.body.address, req.body.staff_type, req.body.degree_level, req.body.address, req.body.staff_id], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'Sửa không thành công'});
                            } else res.send({message:'success'});
                        });
                    } else if (req.params.command == 'delete') {
                        var sql = "DELETE FROM research_staff WHERE staff_id = ?; DELETE FROM user_account WHERE username = ?; DELETE FROM staff WHERE staff_id = ?;";
                        connection.query(sql, [req.body.staff_id, req.body.username, req.body.staff_id], (err) => {
                            connection.release();
                            if (err) {
                                // throw err;
                                res.send({message:'Xóa không thành công'});
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
                    var sql = "INSERT INTO research_field(field_id, name, parent_id) VALUES(?, ?, ?);";
                    connection.query(sql, [req.body.id, req.body.text, req.body.parent_id], (err) => {
                        connection.release();
                        if (err) throw err;
                    });
                } else if (req.params.command == 'rename') {
                    var sql = "UPDATE research_field SET name = ? WHERE field_id = ?;";
                    connection.query(sql, [req.body.text,  req.body.id], (err) => {
                        connection.release();
                        if (err) throw err;
                    });
                } else if (req.params.command == 'delete') {
                    var sql = "DELETE FROM research_field WHERE field_id = ?;";
                    connection.query(sql, [req.body.id], (err) => {
                        connection.release();
                        if (err) throw err;
                    })
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
                    req.body.division_name == '') res.send({message:'Chưa điền đủ trường'});
                else {
                    var sql = "INSERT INTO user_account(username, password) VALUES(?, ?);";
                    connection.query(sql, [req.body.username, bcrypt.hashSync(req.body.password, 10)], (err) => {
                        if (err) {
                            throw(err);
                        } else {
                            var sql = "INSERT INTO division(name) SELECT * FROM (SELECT ?) tmp WHERE NOT EXISTS (SELECT name FROM division WHERE name = ?) LIMIT 1; SELECT @division_id := division_id FROM division WHERE name = ?; SELECT @account_id := id FROM user_account WHERE username = ?; INSERT INTO staff(staff_id, full_name, vnu_email, division_id, account_id) VALUES (?, ?, ?, @division_id, @account_id);";
                            connection.query(sql, [req.body.division_name, req.body.division_name, req.body.division_name, req.body.username, req.body.staff_id, req.body.full_name, req.body.vnu_email], (err) => {
                                if (err) {
                                    var sql = "DELETE FROM user_account WHERE username = ?;";
                                    connection.query(sql, [req.body.username], (err) => {
                                        connection.release();
                                        if (err) throw err;
                                    });
                                } else {
                                    connection.release();
                                    res.send({message:'success'});
                                }
                            });
                        }
                    });
                }
            });
        }
    });


    // Staff page
    app.get('/profile(/:id)?', (req, res) => {
        if (req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 1) {
                req.flash('userMessage', 'admin');
                if (req.query.id === undefined)
                    res.redirect('/');
                else
                    res.render('pages/staff_information', {userMessage: req.flash('userMessage')});
            } else {
                if( req.query.id === undefined) {
                    let url = ('/profile/?' + querystring.stringify({id:req.user.staff_id}));
                    res.redirect(url);
                } else {
                    req.flash('userMessage', 'staff');
                    if (req.user.staff_id === req.query.id){
                        res.render('pages/lecturer_information', {userMessage: req.flash('userMessage')});
                    } else {
                        res.render('pages/staff_information', {userMessage: req.flash('userMessage')});
                    }
                }
            }
        } else {
            if( req.query.id === undefined){
                res.redirect('/');
            } else {
                res.render('pages/staff_information', {userMessage: req.flash('userMessage')});
            }
        }
    });

    app.get('/lecturer_info/:id', (req, res) => {
        connection.getConnection((err, connection) => {
            var sql = "SELECT s.full_name, s.staff_type, s.degree_level, s.phone_number, s.vnu_email, s.other_email, s.website, s.staff_address, s.interested_field, d.name as address FROM staff s JOIN division d ON s.division_id = d.division_id WHERE s.staff_id = ?;";
            connection.query(sql, [req.params.id], (err, results, fields) => {
                connection.release();
                if (err)
                    throw(err);
                else res.send(results);
            });
        });
    });

    app.post('/lecturer_info/:id/:command', (req,res) => {
        if (req.isAuthenticated() == 1) {
            if (req.user.staff_id == req.params.id) {
                connection.getConnection((err, connection) => {
                    if (req.params.command == 'editPhoneNumber') {
                        var sql = "UPDATE staff SET phone_number = ? WHERE staff_id = ?;";
                        connection.query(sql, [req.body.phone_number, req.body.staff_id], (err) => {
                            connection.release();
                            if (err)
                                throw err;
                        })
                    } else if (req.params.command == 'editVnuEmail') {
                        var sql = "UPDATE staff SET vnu_email = ? WHERE staff_id = ?;";
                        connection.query(sql, [req.body.vnu_email, req.body.staff_id], (err) => {
                            connection.release();
                            if (err)
                                throw err;
                        })
                    } else if (req.params.command == 'editOtherEmail') {
                        var sql = "UPDATE staff SET other_email = ? WHERE staff_id = ?;";
                        connection.query(sql, [req.body.other_email, req.body.staff_id], (err) => {
                            connection.release();
                            if (err)
                                throw err;
                        })
                    } else if (req.params.command == 'editWebsite') {
                        var sql = "UPDATE staff SET website = ? WHERE staff_id = ?;";
                        connection.query(sql, [req.body.website, req.body.staff_id], (err) => {
                            connection.release();
                            if (err)
                                throw err;
                        })
                    } else if (req.params.command == 'editStaffAddress') {
                        var sql = "UPDATE staff SET staff_address = ? WHERE staff_id = ?;";
                        connection.query(sql, [req.body.staff_address, req.body.staff_id], (err) => {
                            connection.release();
                            if (err)
                                throw err;
                        })
                    } else if (req.params.command == 'editInterestedField') {
                        var sql = "UPDATE staff SET interested_field = ? WHERE staff_id = ?;";
                        connection.query(sql, [req.body.interested_field, req.body.staff_id], (err) => {
                            connection.release();
                            if (err)
                                throw err;
                        })
                    }
                });
            }
        }

    });

    // Staff interest command
    app.get('/lecturer_interests/:id', (req,res) => {
        connection.getConnection((err, connection) => {
            var sql = "SELECT rf.name FROM research_staff rs JOIN research_field rf ON rs.field_id = rf.field_id WHERE rs.staff_id = ?;";
            connection.query(sql, [req.params.id], (err, results, fields) => {
                connection.release();
                if (err)
                    throw(err);
                else res.send(results);
            });
        });
    });

    app.post('/lecturer_interests/:id', (req,res) => {
        if (req.isAuthenticated() == 1) {
            if (req.user.isAdmin == 0) {
                if (req.params.id == req.user.staff_id) {
                    var length = req.body.IDs.length;
                    var sql;
                    connection.getConnection((err, connection) => {
                        sql = "DELETE FROM research_staff WHERE staff_id = ?;";
                        connection.query(sql, [req.params.id], (err) => {
                            if (err)
                                throw err;
                        });
                        for (var i = 0; i < length; i++) {
                            sql = "INSERT INTO research_staff(field_id, staff_id) VALUES (?, ?);";
                            connection.query(sql, [req.body.IDs[i] ,req.params.id], (err, results, fields) => {
                                if (err)
                                    throw err;
                            });
                        }
                    });
                }
            }
        }
    });

};
