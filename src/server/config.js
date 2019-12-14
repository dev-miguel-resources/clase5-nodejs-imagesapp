const path = require('path');
const morgan = require('morgan'); //ver que lo que está pidiendo el usuario, pinta por consola lo que está pidiendo el usuario, tiempos, etc
const express = require('express');
const errorHandler = require('errorhandler'); //si visita una ruta desconocida al usuario le pinta un error por pantalla
const exphbs = require('express-handlebars');
const multer = require('multer'); //modulo para subir imagenes de un formulario de html

const routes = require('../routes/index');
//const routes = require('../routes');

module.exports = app => {
    // Settings
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        helpers: require('./helpers'), //funciones dentro de handlebars
        extname: '.hbs' //nuestros archivos se llamaran así
    }));
    app.set('view engine', '.hbs'); //establezco el motor de plantilla
    app.use(multer({ dest: path.join(__dirname, '../public/upload/temp') }).single('image')); //el single me permite obtener la información de las imagenes

    // middlewares
    app.use(morgan('dev')); //ver por consola la info del usuario
    app.use(express.urlencoded({ extended: false })); //recibir datos desde formularios
    app.use(express.json());

    // Routes
    routes(app);

    // Static files
    app.use('/public', express.static(path.join(__dirname, '../public'))); //habilito la carpeta public desde los navegadores

    // Error Handling
    if ('development' === app.get('env')) {
        app.use(errorHandler()); //dejo activado en desarrollo esta libreria
    }
    return app;
};