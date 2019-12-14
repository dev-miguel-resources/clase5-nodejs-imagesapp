const express = require('express');
const config = require('./server/config');
const app = config(express()); //en config tengo toda la configuración

// database
require('./database');

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});