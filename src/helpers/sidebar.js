const Stats = require('./stats');
const Images = require('./images');
const Comments = require('./comments');

module.exports = async viewModel => { //espero el view model del home controler

    const results = await Promise.all([
        Stats(), //ejecuta stats
        Images.popular(),
        Comments.newest() //comentarios mas novedosos
    ]);

    viewModel.sidebar = {
        stats: results[0],
        popular: results[1],
        comments: results[2],
    };

    return viewModel;

};