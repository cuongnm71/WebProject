module.exports = {
    'connection': {
        connectionLimit: 100,
        host: 'k61iotlab.duckdns.org',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        multipleStatements: true,
        database: 'uFaculties_test3',
    },
}
// module.exports = {
//     'connection': {
//         host: 'localhost',
//         user: 'root',
//         password: '12345678'
//     },
//     database: 'ufaculties',
//     'user_table': 'user_account'
// }
