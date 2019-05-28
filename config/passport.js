const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require('bcryptjs');

module.exports = (passport, connection) => {
    passport.serializeUser((user, done) => {
        done(null, user.id, user.isAdmin);
    });

    passport.deserializeUser((id, done) => {
        if (id == 1) {
            connection.getConnection((err, connection) => {
                connection.query("SELECT * FROM user_account WHERE id = ?;", [id], (err, rows) => {
                    connection.release();
                    done(err, rows[0]);
                });
            });
        } else {
            connection.getConnection((err, connection) => {
                connection.query("SELECT ua.*, s.staff_id FROM user_account ua JOIN staff s ON ua.id = s.account_id WHERE id = ?;", [id], (err, rows) => {
                    connection.release();
                    done(err, rows[0]);
                });
            });
        }
    });

    passport.use(
        'local-login',
        new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
        }, (req, username, password, done) => {
            connection.getConnection((err, connection) => {
                connection.query("SELECT * FROM user_account WHERE username = ? ", [username], (err, rows) => {
                    connection.release();
                    if (err)
                        return done(err);
                    if (!rows.length)
                        return done(null, false, req.flash('loginMessage', 'No User Found'));
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Wrong Password'));
                    return done(null, rows[0]);
                });
            });
        })
    );
};
