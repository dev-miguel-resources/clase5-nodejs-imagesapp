const { Comment, Image } = require('../models');

module.exports = {
    async newest() {

        const comments = await Comment.find()
            .limit(5) //quiero los 5 comentarios mas novedosos
            .sort({ timestamp: -1 }); //ordena de mas reciente a menos reciente

        for (const comment of comments) { //alternativa al populate
            const image = await Image.findOne({ _id: comment.image_id }); //busco la imagen que le pertenece a mi comentario
            comment.image = image; //le paso la imagen al comentario individual que estoy obteniendo del for
        }

        return comments;
    }
};