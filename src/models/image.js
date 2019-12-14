const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');

const ImageSchema = new Schema({
    title: { type: String },
    description: { type: String },
    filename: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

ImageSchema.virtual('uniqueId') //se va a generar cuando llamemos a nuestro modelo, para devolver el nombre de la imagen sin su extensión
    .get(function() {
        return this.filename.replace(path.extname(this.filename), ''); //me devuelve la imagen sin la extensión
    });

module.exports = mongoose.model('Image', ImageSchema);