const moment = require('moment');
const helpers = {};

helpers.timeago = timestamp => {
    return moment(timestamp).startOf('minute').fromNow(); //quiero que me muestre ahora en minutos el tiempo que ha pasado
};

module.exports = helpers;