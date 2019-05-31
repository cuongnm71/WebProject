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
