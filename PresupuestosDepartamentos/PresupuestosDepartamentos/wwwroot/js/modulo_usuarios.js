var modulo_usuarios = {
    init: () => {
        modulo_usuarios.putEventsOnButtons();
    },
    putEventsOnButtons: () => {
        $("#btn_nuevo_usuario").on("click", function (e) {
            e.preventDefault();
            $("#identificador").val("");
            $("#operacion").val("INSERT");
            $("#nombre").val("");
            $("#usuario").val("");
            $("#mail").val("");
            $("#perfil").val("");
            $("#sel_centros_coste").val("");
            $("#modal_usuarios").modal("show");
        })

        $('#sel_centros_coste').multiSelect()
    },
    loadDatatable: () => {

    }
}