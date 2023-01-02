require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//crear el servidro de express
const app = express();

//configurar CORS
app.use(cors());

//lectura y paseo del body
app.use(express.json());

//base de datos
dbConnection();

//123456789.Ma
//main_user
//alvaro

//rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/login', require('./routes/auth') );

app.listen( process.env.PORT, () =>{
    console.log('funcionando ' + process.env.PORT);
});