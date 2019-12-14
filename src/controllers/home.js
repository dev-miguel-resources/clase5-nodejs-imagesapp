const sidebar = require('../helpers/sidebar'); //me traje ese sidebar
const { Image } = require('../models');

const ctrl = {}; //objeto controller

ctrl.index = async(req, res) => {
    const images = await Image //espero el modelo
        .find()
        .sort({ timestamp: -1 }); //de mayor a menor
    let viewModel = { images: [] }; //primero parte vacio
    viewModel.images = images;
    viewModel = await sidebar(viewModel); //espero el view model con datos
    res.render('index', viewModel);
};

module.exports = ctrl; //lo exporto