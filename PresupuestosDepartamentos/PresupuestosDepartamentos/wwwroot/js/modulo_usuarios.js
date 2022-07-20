var modulo_usuarios = {
    init: () => {
        modulo_usuarios.loadSelector();
        modulo_usuarios.putEventsOnButtons();
        modulo_usuarios.getUsuarios();
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

        $("#btn_modal_usuarios").on("click", function (e) {
            e.preventDefault();
            modulo_usuarios.guardarUsuario();
        })

    },
    getUsuarios: () => {
        var url = helper.baseUrl + "/Usuarios/GetUsuarios";
        helper.ajax(url, "GET").then(result => {
            var usuarios = JSON.parse(result.usuarios);
            modulo_usuarios.loadDatatable(usuarios);

        });
    },
    loadDatatable: (usuarios) => {
        if ($.fn.DataTable.isDataTable("#tabla_usuarios")) {
            $("#tabla_usuarios").DataTable().destroy();
        }

        $('#tabla_usuarios').DataTable({
            "dom": "frtip",
            data: usuarios,
            "paging": false,
            "columns": [
                { "data": "nombre" },
                { "data": "username" },
                { "data": "perfil" },
                { "data": "centros" },
                {
                    render: function (data, type, row, meta) {
                        return `<a href="#" class="btn btn-light btn-sm" onclick='modulo_usuarios.editar_usuario(` + JSON.stringify(row) + `);'><i class="fa fa-edit"></i></a>
                            <a href="#" class="btn btn-light btn-sm" onclick='modulo_usuarios.borrar_usuario("` + row.id + `");'><i class="fa fa-trash"></i></a>`;
                    }
                }
            ],
            "ordering": false
        });
    },
    guardarUsuario: () => {
        var data = {
            operacion: $("#operacion").val(),
            centros: $("#sel_centros_coste").val(),
            nombre: $("#nombre").val(),
            username: $("#usuario").val(),
            mail: $("#mail").val(),
            perfil: $("#perfil").val(),
            identificador: $("#identificador").val()
        }

        var url = helper.baseUrl + "/Usuarios/CRUD_USUARIOS";
        helper.ajax(url, "POST", data).then(result => {
            if (result.success == 1) {
                helper.mostrarAlertaOk(result.mensaje);
                helper.cerrarModal();
                modulo_usuarios.getUsuarios();

            } else {
                helper.mostrarAlertaError(result.mensaje);
            }

        });

    },
    borrar_usuario: (identificador) => {
        if (confirm("Estás seguro de eliminar este usuario?")) {
            var data = {
                operacion: "DELETE",
                identificador: identificador
            }

            var url = helper.baseUrl + "/Usuarios/CRUD_USUARIOS";
            helper.ajax(url, "POST", data).then(result => {
                if (result.success == 1) {
                    helper.mostrarAlertaOk(result.mensaje);
                    modulo_usuarios.getUsuarios();

                } else {
                    helper.mostrarAlertaError(result.mensaje);
                }

            });
        }
    },
    editar_usuario: (row) => {

        var data = {
            identificador:row.id
        }
        var url = helper.baseUrl + "/Usuarios/GetUsuariosCentros";
        helper.ajax(url, "POST", data).then(result => {
            var centros = JSON.parse(result.centros);
            $('#sel_centros_coste').multiSelect('select', centros);
        });

        $("#identificador").val(row.id);
        $("#operacion").val("UPDATE");
        $("#nombre").val(row.nombre);
        $("#usuario").val(row.username);
        $("#mail").val(row.mail);
        $("#perfil").val(row.num_perfil);


        $("#modal_usuarios").modal("show");

    },
    loadSelector: () => {
        var url = helper.baseUrl + "/Usuarios/loadModalUsuarios";
        helper.ajax(url, "GET").then(result => {
            var centros = JSON.parse(result.centros);
            $("#sel_centros_coste option").remove();
            centros.forEach((centro) => {
                $('#sel_centros_coste').append(new Option(centro.cod_centro_coste + "-" + centro.nombre, centro.id));
            });
            $('#sel_centros_coste').multiSelect()

        });
    }
}