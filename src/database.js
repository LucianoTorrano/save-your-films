 const mysql = require('mysql');

//como el modulo mysql no soporta promesas utilizo el siguiente modulo
//para poder usar promesas y no usar callbacks. De esta forma puedo usar
//async await

const {promisify} = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,conection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
            return;
        }
    }
    if(conection) conection.release();
    console.log('DB is connected');
    return;
});

//Promisify pool query --> con esto transformo callbaks en promesas
promisify(pool.query);

module.exports = pool;