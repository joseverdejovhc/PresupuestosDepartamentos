var modulo_naturaleza = {
    init: () => {
        modulo_naturaleza.putEventsOnButtons();     
    },
    loadData: () => {
        modulo_naturaleza.loadTiposCuenta();
        modulo_naturaleza.loadTiposCuenta();
        modulo_naturaleza.getNaturalezas();
    },
    putEventsOnButtons: () => {
        $("#btn_nueva_naturaleza").on("click", function (e) {
            e.preventDefault();
            $("#operacion").val("INSERT");
            $("#cod_naturaleza").val("");
            $("#nombre").val("");
            $("#tipo_cuenta").val("");
            $("#info_extracontable").val("");

            $("#modal_naturalezas").modal("show");
        })

        $("#btn_modal_naturaleza").on("click", function (e) {
            e.preventDefault();

            modulo_naturaleza.guardarNaturaleza();
        })
    },
    loadTiposCuenta: () => {
        var url = helper.baseUrl + "/Configuracion/getTiposCuenta";
        helper.ajax(url, "GET").then(result => {
            var tipos_cuentas = JSON.parse(result.tipos_cuenta);

            $("#tipo_cuenta option").remove();
            $('#tipo_cuenta').append(new Option("Selecciona tipo de cuenta", null));
            tipos_cuentas.forEach((tipo) => {
                $('#tipo_cuenta').append(new Option(tipo.cod_tipo_cuenta + "-" + tipo.nombre, tipo.id));
            });

        });
    },
    guardarNaturaleza: () => {

        if ($("#cod_naturaleza").val() != "" && $("#nombre").val() != "" && $("#tipo_cuenta").val() != null && $("#tipo_cuenta").val() != "null") {
            var data = {
                operacion: $("#operacion").val(),
                identificador: $("#identificador").val(),
                cod_naturaleza: $("#cod_naturaleza").val(),
                nombre: $("#nombre").val(),
                tipo: $("#tipo_cuenta").val(),
                info: $("#info_extracontable_naturaleza").val()
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_NATURALEZA";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    modulo_naturaleza.getNaturalezas();
                    helper.cerrarModal();
                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        } else {
            helper.mostrarAlertaError("Faltan datos");
        }
        

    },
    getNaturalezas: () => {
        var url = helper.baseUrl + "/Configuracion/getNaturalezas";
        helper.ajax(url, "GET").then(result => {
            var naturalezas = JSON.parse(result.naturalezas);
            modulo_naturaleza.loadDatatable(naturalezas);
        });
    },
    borrar_naturaleza: (identificador) => {
        if (confirm("¿Estás seguro de querer borrar está naturaleza?")) {
            var data = {
                operacion: "DELETE",
                identificador: identificador
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_NATURALEZA";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    modulo_naturaleza.getNaturalezas();
                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        }
    },
    editar_naturaleza: (naturaleza) => {
        $("#operacion").val("UPDATE");
        $("#cod_naturaleza").val(naturaleza.cod_naturaleza);
        $("#nombre").val(naturaleza.nombre);
        $("#tipo_cuenta").val(naturaleza.cod_tipo);
        $("#info_extracontable").val(naturaleza.info);
        $("#identificador").val(naturaleza.id);

        $("#modal_naturalezas").modal("show");
    },
    loadDatatable: (naturalezas) => {
        if ($.fn.DataTable.isDataTable("#tabla_naturalezas")) {
            $("#tabla_naturalezas").DataTable().destroy();
        }

        $('#tabla_naturalezas').DataTable({
            "dom": "frtip",
            data: naturalezas,
            "paging": false,
            "ordering": true,
            order: [[0, 'desc']],
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