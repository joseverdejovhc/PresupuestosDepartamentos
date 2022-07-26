var modulo_centro_coste = {
    init: () => {
        modulo_centro_coste.putEventsOnButtons();       
        
    },
    loadData: () => {
        modulo_centro_coste.loadSelectores();
        modulo_centro_coste.getCentrosConfigurados();
    },
    putEventsOnButtons: () => {
        $("#btn_new_centro").on("click", function (e) {
            e.preventDefault();
            $("#identificador").val("");
            $("#operacion").val("INSERT");
            $("#sel_centro_coste").val("");
            $("#tipo_centro_coste").val("");
            $("#dt_inicio").val("");
            $("#dt_fin").val("");
            $("#info_extracontable").val("");
            var currentYear = new Date().getFullYear();
            $("#dt_inicio").val(currentYear);
            $("#dt_inicio").prop("min", currentYear);
            $("#dt_fin").prop("min", currentYear);
            $("#modal_centros_coste").modal("show");
        })

        $("#btn_modal_centro_coste").on("click", function (e) {
            e.preventDefault();
            modulo_centro_coste.guardarConfCentroCoste();
        })
    },
    guardarConfCentroCoste: () => {

        if ($("#sel_centro_coste").val() != "null" && $("#dt_inicio").val() >= 2022 && $("#dt_fin").val() >= 2022 && $("#tipo_centro_coste").val() != "") {
            var data = {
                operacion: $("#operacion").val(),
                cod_centro_coste: $("#sel_centro_coste").val(),
                nombre: $("#sel_centro_coste option:selected").text(),
                tipo: $("#tipo_centro_coste").val(),
                anio_inicio: $("#dt_inicio").val(),
                anio_fin: $("#dt_fin").val(),
                info: $("#info_extracontable").val(),
                identificador: $("#identificador").val()
            }

            var url = helper.baseUrl + "/Configuracion/CRUD_CENTROS_COSTE";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    helper.cerrarModal();
                    modulo_centro_coste.getCentrosConfigurados();
                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }
            });
        } else {
            helper.mostrarAlertaError("Hay datos incorrectos en el formulario");
        }

        

    },
    getCentrosConfigurados: () => {
        var url = helper.baseUrl + "/Configuracion/getCentrosConfigurados";
        helper.ajax(url, "GET").then(result => {
            var centros = JSON.parse(result.centros);
            modulo_centro_coste.loadDatatable(centros);
        });
    },
    loadSelectores: () => {
        var url = helper.baseUrl + "/Configuracion/loadModalCentrosCoste";
        helper.ajax(url, "GET").then(result => {
            var tipos = JSON.parse(result.tipos);
            var centros = JSON.parse(result.centros);

            $("#sel_centro_coste option").remove();
            $('#sel_centro_coste').append(new Option("Selecciona centro de coste", null));
            centros.forEach((centro) => {
                $('#sel_centro_coste').append(new Option(centro.cod_centro_coste + "-" + centro.nombre, centro.cod_centro_coste));
            });


            $("#tipo_centro_coste option").remove();
            $('#tipo_centro_coste').append(new Option("Selecciona tipo", null));
            tipos.forEach((tipo) => {
                $('#tipo_centro_coste').append(new Option(tipo.nombre, tipo.ID));
            });

        });
    },
    delete_centro: (id) => {
        var data = {
            operacion: "DELETE",
            identificador: id
        }

        var url = helper.baseUrl + "/Configuracion/CRUD_CENTROS_COSTE";
        helper.ajax(url, "POST", data).then(result => {
            if (result.success == 1) {
                helper.mostrarAlertaOk(result.mensaje);
                modulo_centro_coste.getCentrosConfigurados();
            } else {
                helper.mostrarAlertaError(result.mensaje);
            }
        });
    },
    editar_centro: (centro) => {
        $("#operacion").val("UPDATE");
        $("#sel_centro_coste").val(centro.cod_centro_coste);
        $("#tipo_centro_coste").val(centro.fk_tipo);
        $("#dt_inicio").val(centro.anio_inicio);
        $("#dt_fin").val(centro.anio_fin);
        $("#info_extracontable").val(centro.info_extracontable);
        $("#identificador").val(centro.id);
        $("#modal_centros_coste").modal("show");

    },
    loadDatatable: (centros) => {
        if ($.fn.DataTable.isDataTable("#tabla_centros")) {
            $("#tabla_centros").DataTable().destroy();
        }

        $('#tabla_centros').DataTable({
            "dom": "frtip",
            data: centros,
            "paging": false,
            "ordering": true,
            order: [[0, 'desc']],
            "columns": [
                { "data": "cod_centro_coste" },
                { "data": "nombre" },
                { "data": "tipo" },
                { "data": "anio_inicio" },
                { "data": "anio_fin" },
                { "data": "info_extracontable" },
                {
                    render: function (data, type, row, meta) {
                        return `<a href="#" class="btn btn-light btn-sm" onclick='modulo_centro_coste.editar_centro(` + JSON.stringify(row) + `);'><i class="fa fa-edit"></i></a>
                            <a href="#" class="btn btn-light btn-sm" onclick='modulo_centro_coste.delete_centro("` + row.id + `");'><i class="fa fa-trash"></i></a>`;
                    }
                }
            ],
            "ordering": false
        });
    }

}