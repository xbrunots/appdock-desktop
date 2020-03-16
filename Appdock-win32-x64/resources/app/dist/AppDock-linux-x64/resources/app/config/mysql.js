//d
const mysql = require('mysql');

NODE_ENV = 'debug'
PASSWORD = 'pwdHmg'
BYPASS_TOKEN = true

MYSQL_HOST = 'mysql669.umbler.com'
MYSQL_DEBUG_PORT = 41890
MYSQL_USER = 'appdock_user'
MYSQL_PASSWORD = 'ana010118'
MYSQL_DB = 'appdock_db'


TABLES_HOST = 'mysql669.umbler.com'
TABLES_DEBUG_PORT = 41890
TABLES_USER = 'appdock_tables'
TABLES_PASSWORD = 'ana010118'
TABLES_DB = 'appdock_tables'


TOKEN_DEBUG = 'xxx'
ERROR_TOKEN = 'Token inválido!'
SECRET = 'zdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0'


var prod = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    multipleStatements: true
});

var debug = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_DEBUG_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    multipleStatements: true
});

function initPool() {
    return debug
}

module.exports = {
    query: function(sql, callback) {
        initPool().getConnection(function(err, connection) {
            if (NODE_ENV != 'prod') {
                console.log(sql)
            }
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            connection.query(sql, function(error, results, fields) {
                connection.release();
                if (error) {
                    if (NODE_ENV != 'prod') {
                        console.log(error)
                        return
                    }
                    callback({ success: false, error: error })
                } else {
                    callback({ success: true, data: results[0] })
                }

            });
        });
    },
    select: function(sql, res, callback) {
        initPool().getConnection(function(err, connection) {
            if (NODE_ENV != 'prod') {
                console.log(sql)
            }
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            connection.query(sql, function(error, results, fields) {

                retorno = { success: false };
                if (error) {
                    retorno = { success: false, error: { message: error.sqlMessage } };
                } else {
                    retorno = { success: true, data: JSON.parse(JSON.stringify(results)) };
                }
                if (NODE_ENV != 'prod') {
                    console.log(retorno)
                }
                connection.end();
                callback(retorno)

            });
        });
    },
    insert: function(sql, res, callback) {
        initPool().getConnection(function(err, connection) {
            if (NODE_ENV != 'prod') {
                console.log(sql)
            }
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            connection.query(sql, function(error, results, fields) {
                retorno = { success: false };
                if (error) {
                    retorno = { success: false, error: { message: error.sqlMessage } };
                } else {
                    retorno = { success: true, data: { insertId: results.insertId } };
                }
                if (NODE_ENV != 'prod') {
                    console.log(retorno)
                }
                connection.end();
                callback(retorno)
            });
        });
    },
    update: function(sql, res, callback) {
        initPool().getConnection(function(err, connection) {
            if (NODE_ENV != 'prod') {
                console.log(sql)
            }
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            connection.query(sql, function(error, results, fields) {
                retorno = { success: false };
                if (error) {
                    retorno = { success: false, error: { message: error.sqlMessage } };
                } else {
                    retorno = { success: true };
                }
                if (NODE_ENV != 'prod') {
                    console.log(retorno)
                }
                connection.end();
                callback(retorno)
            });
        });
    }
}