const fs = require('fs-extra');
const path = require('path');

const md5 = require('md5');

const ctrl = {};

const sidebar = require('../helpers/sidebar');
const { randomNumber } = require('../helpers/libs');
const { Image, Comment } = require('../models');

ctrl.index = async(req, res) => {
    let viewModel = { image: {}, comments: [] };
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } }); //me devuelve la imagen de acuerdo a ese request param, el regex permite pasar una expresión regular y en este caso detecta una coincidencia apenas la detecte
    if (image) { //si existe
        image.views = image.views + 1; //incremento las vistas
        viewModel.image = image; //guardo el videomodel la imagen
        image.save(); //guardo la imagen
        const comments = await Comment.find({ image_id: image._id }) //me trae los comentarios relacionados solo a esta imagen
            .sort({ 'timestamp': 1 });
        viewModel.comments = comments; //guardo los comentarios de la imagen
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel);
    } else {
        res.redirect('/'); //si no existe me voy a la página principal
    }
};

ctrl.create = (req, res) => {
    const saveImage = async() => {
        const imgUrl = randomNumber();
        const images = await Image.find({ filename: imgUrl });
        if (images.length > 0) {
            saveImage() //aplico recursividad cuando se repite sino sigue bien en el guardado de imagen
        } else {
            // Image Location
            const imageTempPath = req.file.path; //guardo el path de la imagen
            const ext = path.extname(req.file.originalname).toLowerCase(); //obtengo el nombre con su extensión
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`); //dirección donde quiero dejar la imagen

            // Validate Extension
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                // you wil need the public/temp path or this will throw an error
                await fs.rename(imageTempPath, targetPath); //muevo la imagen temporal a mi carpeta objetivo
                const newImg = new Image({
                    title: req.body.title,
                    filename: imgUrl + ext, //nombre de imagen con su extensión
                    description: req.body.description
                });
                const imageSaved = await newImg.save(); //lo guardo en la bdd
                res.redirect('/images/' + imageSaved.uniqueId);
            } else {
                await fs.unlink(imageTempPath); //si sucede un error la elimino con un await ya que demora unos segundos
                res.status(500).json({ error: 'Only Images are allowed' });
            }
        }
    };

    saveImage();
};

ctrl.like = async(req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } }); //busca la imagen con ese id
    console.log(image)
    if (image) {
        image.likes = image.likes + 1; //si la pilla la incrementa
        await image.save(); //la guarda 
        res.json({ likes: image.likes }) //entrega la respuesta, con los likes obtenidos
    } else {
        res.status(500).json({ error: 'Internal Error' });
    }
};

ctrl.comment = async(req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } }); //busco el id de la imagen del comentario
    if (image) { //si viene la imagen
        const newComment = new Comment(req.body); //creo un nuevo comentario
        newComment.gravatar = md5(newComment.email); //convertir el correo en un hash
        newComment.image_id = image._id; //asigno el valor del id de la bdd al nuevo comentario
        await newComment.save(); //guardo el nuevo comentario
        res.redirect('/images/' + image.uniqueId + '#' + newComment._id);
    } else {
        res.redirect('/');
    }
};

ctrl.remove = async(req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
    if (image) {
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename)); //remuevo el dato a partir del directorio
        await Comment.deleteOne({ image_id: image._id }); //quiero eliminar todos los comentarios de esta imagen
        await image.remove(); //elimino la imagen de la bdd
        res.json(true);
    } else {
        res.json({ response: 'Bad Request.' })
    }
};

module.exports = ctrl;