var modulo_subnaturalezas = {
    init: () => {
        modulo_subnaturalezas.putEventsOnButtons();
    },
    loadData: () => {
        modulo_subnaturalezas.loadNaturalezas();
        modulo_subnaturalezas.getSubnaturalezas();
    },
    putEventsOnButtons: () => {
        $("#btn_nueva_subnaturaleza").on("click", function (e) {
            e.preventDefault();
            $("#operacion").val("INSERT");
            $("#identificador").val("");
            $("#cod_subnaturaleza").val("");
            $("#nombre_subnaturaleza").val("");
            $("#tipo_naturaleza").val("");
            $("#modal_subnaturalezas").modal("show");
        })
        $("#btn_modal_subnaturaleza").on("click", function (e) {
            e.preventDefault();
            modulo_subnaturalezas.guardarSubnaturaleza();
        })
    },
    guardarSubnaturaleza: () => {
        if ($("#nombre_subnaturaleza").val() != "" && $("#cod_subnaturaleza").val() != "" && $("#tipo_naturaleza").val() != "null") {
            var data = {
                operacion: $("#operacion").val(),
                identificador: $("#identificador").val(),
                cod_subnaturaleza: $("#cod_subnaturaleza").val(),
                nombre: $("#nombre_subnaturaleza").val(),
                naturaleza: $("#tipo_naturaleza").val()
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_SUBNATURALEZA";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    modulo_subnaturalezas.getSubnaturalezas();
                    helper.cerrarModal();
                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        } else {
            helper.mostrarAlertaError("Faltan Datos");
        }
        
    },
    borrar_subnaturaleza: (identificador) => {
        if (confirm("¿Estás seguro de querer borrar está subnaturaleza?")) {
            var data = {
                operacion: "DELETE",
                identificador: identificador
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_SUBNATURALEZA";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    modulo_subnaturalezas.getSubnaturalezas();
                    helper.cerrarModal();
                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        }

    },
    editar_subnaturaleza: (subnaturaleza) => {
        $("#operacion").val("UPDATE");
        $("#identificador").val(subnaturaleza.id);
        $("#cod_subnaturaleza").val(subnaturaleza.cod_subnaturaleza);
        $("#nombre_subnaturaleza").val(subnaturaleza.nombre);
        $("#tipo_naturaleza").val(subnaturaleza.num_naturaleza);
        $("#modal_subnaturalezas").modal("show");
    },
    getSubnaturalezas: () => {
        var url = helper.baseUrl + "/Configuracion/getSubnaturalezas";
        helper.ajax(url, "GET").then(result => {
            var subnaturalezas = JSON.parse(result.subnaturalezas);
            modulo_subnaturalezas.loadDatatable(subnaturalezas);
        });

    },
    loadNaturalezas: () => {
        var url = helper.baseUrl + "/Configuracion/getNaturalezas";
        helper.ajax(url, "GET").then(result => {
            var naturalezas = JSON.parse(result.naturalezas);

            var naturalezas = JSON.parse(result.naturalezas);

            $("#tipo_naturaleza option").remove();
            $('#tipo_naturaleza').append(new Option("Selecciona Naturaleza", null));
            naturalezas.forEach((naturaleza) => {
                $('#tipo_naturaleza').append(new Option(naturaleza.cod_naturaleza + "-" + naturaleza.nombre, naturaleza.id));
            });
        });
    },
    loadDatatable: (subnaturalezas) => {
        if ($.fn.DataTable.isDataTable("#tabla_subnaturalezas")) {
            $("#tabla_subnaturalezas").DataTable().destroy();
        }

        $('#tabla_subnaturalezas').DataTable({
            "dom": "frtip",
            data: subnaturalezas,
            "paging": false,
            "ordering": true,
            order: [[0, 'desc']],
            "columns": [
                { "data": "cod_subnaturaleza" },
                { "data": "nombre" },
                { "data": "naturaleza" },
                {
                    render: function (data, type, row, meta) {
                        return `<a href="#" class="btn btn-light btn-sm" onclick='modulo_subnaturalezas.editar_subnaturaleza(` + JSON.stringify(row) + `);'><i class="fa fa-edit"></i></a>
                            <a href="#" class="btn btn-light btn-sm" onclick='modulo_subnaturalezas.borrar_subnaturaleza("` + row.id + `");'><i class="fa fa-trash"></i></a>`;
                    }
                }
            ]
        });
    }
}