require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//crear el servidro de express
const app = express();

//configurar CORS
app.use(cors());

//base de datos
dbConnection();

//123456789.Ma
//main_user
//alvaro

//rutas
app.get( '/', (req, res) => {
    res.json({
        ok: true,
        msg: 'hola mundo'
    });
});

app.listen( process.env.PORT, () =>{
    console.log('funcionando ' + process.env.PORT);
});