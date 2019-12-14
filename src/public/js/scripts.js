$(function() {
    // Post Toggle View
    $('#post-comment').hide(); //oculta el formulario mientras yo no postee un formulario
    $('#btn-toggle-comment').click(e => {
        e.preventDefault();
        $('#post-comment').slideToggle(); //me despliga el slide toogle cuando ticlee el id de arriba de btn-toggle
    });

    // Like Button Request
    $('#btn-like').click(function(e) {
        e.preventDefault();
        let imgId = $(this).data('id'); //estoy obteniendo el id de la imagen
        console.log(imgId)
        $.post('/images/' + imgId + '/like') //petición post a esta ruta, esta ruta debe existir
            .done(data => { //done = cuando llegue la respuesta
                console.log('back:', data)
                $('.likes-count').text(data.likes); //ocupo el span likes-count de vista image y alteramos su texto
            });
    });

    // Delete Button Request
    $('#btn-delete').click(function(e) {
        e.preventDefault(); //cancelamos su comportamiento por defecto
        let $this = $(this); //guardamos el elemento
        const response = confirm('Are you sure you want to delete this image?');
        if (response) {
            let imgId = $(this).data('id');
            $.ajax({
                    url: '/images/' + imgId, //aqui es donde recibira esta petición en esta ruta
                    type: 'DELETE'
                })
                .done(function(result) { //done = cuando llegue la respuesta
                    $this.removeClass('btn-danger').addClass('btn-success'); //remuevo una clase agrego otra
                    $this.find('i').removeClass('fa-times').addClass('fa-check');
                    $this.append('<span>Deleted!</span>'); //cuando ya se procesa la info, aplica o agrega un nuevo estilo o cambio
                });
        }
    });
});