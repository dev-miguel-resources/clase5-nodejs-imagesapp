const { Image } = require('../models'); //me traigo el modelo de la imagen

module.exports = {

    async popular() {
        const images = await Image.find()
            .limit(9)
            .sort({ likes: -1 }); //quiero en orden de mas popular a menos popular
        return images;
    }

};