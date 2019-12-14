const { Comment, Image } = require('../models'); //me traigo el modelo de comentarios e imagenes

async function imageCounter() { //contador de imagenes
    return await Image.countDocuments();
};


async function commentsCounter() { //contador de comentarios
    return await Comment.countDocuments(); //este metodo es propio de los esquemas de mongo
}

async function imageTotalViewsCounter() { //contador de las vistas de las imagenes
    const result = await Image.aggregate([{ //agrega propiedades a la performance de la colection
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' } //suma cada views de la colection Image
        }
    }]);
    let viewsTotal = 0;
    if (result.length > 0) {
        viewsTotal += result[0].viewsTotal; //el result 0 me está trayendo por ejemplo: {_id:'1', viewsTotal:'133'}
    }
    return viewsTotal;
}

async function likesTotalCounter() { //total de likes de las imagenes

    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes' } //suma de los likes
        }
    }]);

    let likesTotal = 0;
    if (result.length > 0) {
        likesTotal += result[0].likesTotal;
    }
    return likesTotal;
}

module.exports = async() => {

    const results = await Promise.all([ //ejecuta una cantidad de funciones al mismo tiempo
        imageCounter(),
        commentsCounter(),
        imageTotalViewsCounter(),
        likesTotalCounter()
    ]);

    return {
        images: results[0], //el 0,1,2,3 recuerda la posición de la función en el arreglo
        comments: results[1],
        views: results[2],
        likes: results[3]
    }
};