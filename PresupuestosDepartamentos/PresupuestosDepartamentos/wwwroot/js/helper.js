var array_ajax = []
var helper = {
    baseUrl: '',
    ajax: async (url, type, data = null) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url, // Url
                data: data,
                type: "POST",
                dataType: "json",
                beforeSend: function (jqXHR, settings) {
                    array_ajax.push(jqXHR);
                },
                cache: false
            })
                .done(function (result) {
                    resolve(result)
                })
                .fail(function (error) {
                    resolve(error)
                })
        })
    },
    mostrarLoader: () => {
        $("#AjaxLoader").show();
    },
    quitarLoader: () => {
        $("#AjaxLoader").hide();
    },
    cerrarModal: () => {
        $(".modal").modal('hide');
    },
    mostrarAlertaOk: (mensaje) => {
        Swal.fire({
            icon: 'success',
            text: mensaje
        })
    },
    mostrarAlertaError: (mensaje) => {
        Swal.fire({
            icon: 'error',
            text: mensaje
        })
    }


}



