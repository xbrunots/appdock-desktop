var mysql = require('mysql')

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


var debug = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_DEBUG_PORT, // remove port para acessar em produção,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    multipleStatements: true
});

function initPool() {
    return debug
}

function querySql(q, callback) {
    initPool().getConnection(function(error, connection) {
        if (error) {
            console.log(error);
            callback({ success: false, error: error })
            return;
        }
        connection.query(q, function(error, results, fields) {
            retorno = { success: false };
            if (error) {
                console.log(error);
                retorno = { success: false, error: { message: error.sqlMessage } };
            } else {
                retorno = { success: true, data: JSON.parse(JSON.stringify(results)) };
            }
            connection.end();
            callback(retorno)
        });
    });
}