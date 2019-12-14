const helpers = {};

helpers.randomNumber = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'; //caracteres para generar nombre aleatorio
    let randomNumber = 0;
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length)); //math floor es para redondear el número hacia abajo
    }
    return randomNumber; //palabra de 7 caracteres entre números y letras
};

module.exports = helpers;