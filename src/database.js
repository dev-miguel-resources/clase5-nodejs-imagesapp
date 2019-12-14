const mongoose = require('mongoose');

const { database } = require('./keys'); //quiero database de ese archivo

mongoose.connect(database.URI, {
        useNewUrlParser: true
            //useCreateIndex: true
    })
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));