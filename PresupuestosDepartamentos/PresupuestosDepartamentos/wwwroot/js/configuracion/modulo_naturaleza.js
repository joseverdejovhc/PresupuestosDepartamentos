var modulo_naturaleza = {
    init: () => {
        modulo_naturaleza.putEventsOnButtons();      

    },    
    putEventsOnButtons: () => {
        $("#btn_new_centro").on("click", function (e) {
            e.preventDefault();
            $("#operacion").val("INSERT");
            $("#cod_naturaleza").val("");
            $("#nombre").val("");
            $("#tipo_cuenta").val("");
            $("#info_extracontable").val("");

            $("#modal_centros_coste").modal("show");
        })

        $("#btn_modal_naturaleza").on("click", function (e) {
            e.preventDefault();

            modulo_naturaleza.guardarNaturaleza();
        })
    },
    guardarNaturaleza: () => {
        var data = {
            operacion: $("#operacion").val(),
            identificador: $("#identificador").val(),
            cod_naturaleza: $("#cod_naturaleza").val(),
            nombre: $("#nombre").val(),
            tipo: $("#tipo_cuenta").val(),
            info: $("#info_extracontable").val()
        }


    },

    getNaturalezas: () => {
        var url = helper.baseUrl + "/Configuracion/getNaturalezas";
        helper.ajax(url, "GET").then(result => {
            var naturalezas = JSON.parse(result.naturalezas);
            modulo_naturaleza.loadDatatable(naturalezas);
        });
    },
    loadDatatable: (naturalezas) => {
        if ($.fn.DataTable.isDataTable("#tabla_naturalezas")) {
            $("#tabla_naturalezas").DataTable().destroy();
        }

        $('#tabla_naturalezas').DataTable({
            "dom": "frtip",
            data: naturalezas,
            "paging": false,
            "columns": [
                { "data": "cod_naturaleza" },
                { "data": "nombre" },
                { "data": "tipo" },
                { "data": "info_extracontable" },
                {
                    render: function (data, type, row, meta) {
                        return `<a href="#" class="btn btn-light btn-sm" onclick='modulo_naturaleza.editar_naturaleza(` + JSON.stringify(row) + `);'><i class="fa fa-edit"></i></a>
                            <a href="#" class="btn btn-light btn-sm" onclick='modulo_naturaleza.borrar_naturaleza("` + row.id + `");'><i class="fa fa-trash"></i></a>`;
                    }
                }
            ],
            "ordering": false
        });
    }
}