var modulo_cuentas = {
    init: () => {
        modulo_cuentas.putEventsOnButtons();
    },
    loadData: () => {
        modulo_cuentas.getNaturalezas();
        modulo_cuentas.getCuentasConfiguradas();
        modulo_cuentas.getCuentasNoConfiguradas();
    },
    putEventsOnButtons: () => {
        $("#btn_nueva_cuenta").on("click", function (e) {
            e.preventDefault();
            $("#operacion").val("INSERT");
            $("#num_cuenta").val("");
            $("#nombre_cuenta").val("");
            $("#aux_2").val("");
            $("#aux_3").val("");
            $("#aux_3").val("");
            $("#ventana_add_cuenta").modal("show");
        })

        $("#btn_modal_cuenta").on("click", function (e) {
            e.preventDefault();
            modulo_cuentas.guardarCuenta();
        });

    },
    guardarCuenta: () => {
        if ($("#naturaleza").val() != null && $("#naturaleza").val() != "null") {

            var data = {
                operacion: $("#operacion").val(),
                num_cuenta: $("#num_cuenta").val(),
                nombre: $("#nombre_cuenta").val(),
                naturaleza: $("#naturaleza").val(),
                identificador: $("#identificador").val(),
                aux2: $("#aux_2").val(),
                aux3: $("#aux_3").val()
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_CUENTA";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    helper.cerrarModal();
                    modulo_cuentas.getCuentasConfiguradas();
                    modulo_cuentas.getCuentasNoConfiguradas()
                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        } else {
            helper.mostrarAlertaError("Debes de seleccionar una naturaleza");
        }
        

    },
    getCuentasNoConfiguradas: () => {
        var url = helper.baseUrl + "/Configuracion/getCuentasNoConfiguradas";
        helper.ajax(url, "GET").then(result => {
            var cuentas = JSON.parse(result.cuentas);
            modulo_cuentas.loadDatatableModal(cuentas);
        });
    },
    getNaturalezas: () => {
        var url = helper.baseUrl + "/Configuracion/getNaturalezas";
        helper.ajax(url, "GET").then(result => {
            var naturalezas = JSON.parse(result.naturalezas);

            $("#naturaleza option").remove();
            $('#naturaleza').append(new Option("Selecciona Naturaleza", null));
            naturalezas.forEach((naturaleza) => {
                $('#naturaleza').append(new Option(naturaleza.cod_naturaleza + "-" + naturaleza.nombre, naturaleza.id));
            });

        });
    },
    getCuentasConfiguradas: () => {
        var url = helper.baseUrl + "/Configuracion/getCuentasConfiguradas";
        helper.ajax(url, "GET").then(result => {
            var cuentas = JSON.parse(result.cuentas);
            modulo_cuentas.loadDatatable(cuentas);
        });
    },
    add_cuenta: (row) => {
        $("#num_cuenta").val(row.NUM_CUENTA);
        $("#nombre_cuenta").val(row.NOMBRE);
        $("#aux_2").val(row.AUX2);
        $("#aux_3").val(row.AUX3);

        helper.cerrarModal();
        $("#modal_conf_cuenta").modal("show");
    },
    borrar_cuenta: (id) => {
        if (confirm("Estás seguro de querer borrar esta cuenta")) {
            var data = {
                operacion: "DELETE",
                identificador: id
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_CUENTA";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    helper.cerrarModal();
                    modulo_cuentas.getCuentasConfiguradas();

                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        }
        
    },
    editar_cuenta: (row) => {
        $("#operacion").val("UPDATE");
        $("#identificador").val(row.id);
        $("#num_cuenta").val(row.num_cuenta);
        $("#nombre_cuenta").val(row.descripcion);
        $("#aux_2").val(row.aux_2);
        $("#aux_3").val(row.aux_3);
        $("#naturaleza").val(row.num_naturaleza);
        $("#modal_conf_cuenta").modal("show");
    },
    loadDatatable: (cuentas) => {
        if ($.fn.DataTable.isDataTable("#tabla_cuenta")) {
            $("#tabla_cuenta").DataTable().destroy();
        }

        $('#tabla_cuenta').DataTable({
            "dom": "frtip",
            data: cuentas,
            "paging": true,
            "ordering": true,
            order: [[0, 'desc']],
            "columns": [
                { "data": "num_cuenta" },
                { "data": "descripcion" },
                { "data": "naturaleza" },
                { "data": "aux_2" },
                { "data": "aux_3" },
                {
                    render: function (data, type, row, meta) {
                        return `<a href="#" class="btn btn-light btn-sm" onclick='modulo_cuentas.editar_cuenta(` + JSON.stringify(row) + `);'><i class="fa fa-edit"></i></a>
                        <a href="#" class="btn btn-light btn-sm" onclick='modulo_cuentas.borrar_cuenta(` + row.id + `);'><i class="fa fa-trash"></i></a>`;
                    }
                }
            ]
        });

    },
    loadDatatableModal: (cuentas) => {
        if ($.fn.DataTable.isDataTable("#tabla_cuentas_modal")) {
            $("#tabla_cuentas_modal").DataTable().destroy();
        }

        $('#tabla_cuentas_modal').DataTable({
            "dom": "frtip",
            data: cuentas,
            "paging": true,
            "columns": [
                { "data": "NUM_CUENTA" },
                { "data": "NOMBRE" },
                { "data": "AUX2" },
                { "data": "AUX3" },
                {
                    render: function (data, type, row, meta) {
                        return `<a href="#" class="btn btn-light btn-sm" onclick='modulo_cuentas.add_cuenta(` + JSON.stringify(row) + `);'><i class="fa fa-add"></i></a>`;
                    }
                }
            ],
            "ordering": true
        });
    }

}