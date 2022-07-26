using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PresupuestosDepartamentos.Data;
using System.Data;

namespace PresupuestosDepartamentos.Controllers
{
    
    public class UsuariosController : Controller
    {
        private string login;
        private int perfil = 0;
        private AccesoDatos accesoDatos;

        public UsuariosController()
        {
            accesoDatos = new AccesoDatos();
        }

        public IActionResult Index()
        {

            login = GetCookie();

            perfil = GetPerfil(login);
            ViewData["perfil"] = perfil;

            if(perfil == 0)
            {
                return View("NoAccess");
            }
            else
            {
                return View();
            }

            
        }

      
        public ActionResult loadModalUsuarios()
        {
            var response = new JObject();
            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETCENTROSCONFIGURADOS" });
            var dataSet = accesoDatos.GetDataSet("CRUD_CONF_CENTROS_COSTE", parameters);

            var dt_centros = dataSet?.Tables?[0];
            response["centros"] = JsonConvert.SerializeObject(dt_centros);

            parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETDIRECTORIOACTIVO" });
            dataSet = accesoDatos.GetDataSet("CRUD_USUARIOS", parameters);

            var dt_usuarios = dataSet?.Tables?[0];
            response["directorio"] = JsonConvert.SerializeObject(dt_usuarios);

            return Content(response.ToString(), "application/json");
        }

        public ActionResult GetUsuarios()
        {
            var response = new JObject();
            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETUSERS" });
            var dataSet = accesoDatos.GetDataSet("CRUD_USUARIOS", parameters);

            var dt_centros = dataSet?.Tables?[0];
            response["usuarios"] = JsonConvert.SerializeObject(dt_centros);

            return Content(response.ToString(), "application/json");
        }
        public ActionResult GetUsuariosCentros(int identificador)
        {
            var response = new JObject();
            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETUSERSCENTROS" });
            parameters.Add(new SqlParameter("@identificador", SqlDbType.Int) { Direction = ParameterDirection.Input, Value = identificador });
            var dataSet = accesoDatos.GetDataSet("CRUD_USUARIOS", parameters);

            var dt_centros = dataSet?.Tables?[0];

            List<String> arr_centros=new List<string>();

            foreach (DataRow dr in dt_centros.Rows)
            {
                //Muestras los valores obteniendolos con el Índice o el Nombre de la columna, 
                //   de la siguiente manera:
                arr_centros.Add(dr["fk_centro_coste"].ToString());
            }

            response["centros"] = JsonConvert.SerializeObject(arr_centros);



            return Content(response.ToString(), "application/json");
        }



        public ActionResult CRUD_USUARIOS(string operacion, string mail, string nombre, int identificador, string username, int perfil, List<int> centros)
        {
            var response = new JObject();


            var parameters = new[] {
                new SqlParameter("@operacion", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = operacion },
                new SqlParameter("@mail", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = mail },
                new SqlParameter("@usuario", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = username },
                new SqlParameter("@nombre", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = nombre },
                new SqlParameter("@identificador", SqlDbType.Int) {Direction = ParameterDirection.Input, Value = identificador},
                new SqlParameter("@perfil", SqlDbType.Int) {Direction = ParameterDirection.Input, Value = perfil},
                new SqlParameter("@mensaje", SqlDbType.VarChar, 200) {Direction = ParameterDirection.Output},
                new SqlParameter("@success", SqlDbType.Int) {Direction = ParameterDirection.Output},
                new SqlParameter("@out_identificador", SqlDbType.Int) {Direction = ParameterDirection.Output}
            };

            SqlCommand command = accesoDatos.EjecutarProcedimientoConParametros("CRUD_USUARIOS", CommandType.StoredProcedure, parameters);

            if (command.Parameters["@success"].Value != null)
            {
                var success = int.Parse(command.Parameters["@success"].Value.ToString());
                response["success"] = success;
                response["mensaje"] = command.Parameters["@mensaje"].Value.ToString();
                if (success == 1 && (operacion == "INSERT" || operacion == "UPDATE"))
                {
                    var identificador_usuario = int.Parse(command.Parameters["@out_identificador"].Value.ToString());

                    foreach (int centro in centros)
                    {
                        parameters = new[] {
                        new SqlParameter("@operacion", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = "INSERTCENTROSUSUARIO" },
                        new SqlParameter("@identificador", SqlDbType.Int) { Direction = ParameterDirection.Input, Value = identificador_usuario },
                        new SqlParameter("@centro", SqlDbType.Int) { Direction = ParameterDirection.Input, Value = centro }              
                    };

                        command = accesoDatos.EjecutarProcedimientoConParametros("CRUD_USUARIOS", CommandType.StoredProcedure, parameters);
                    }


                }
            }

            return Content(response.ToString(), "application/json");
        }
        private string GetCookie()
        {
            if (Request.Cookies["credencialesIntranetMVC"] != null && Request.Cookies["credencialesIntranetMVC"] != "")
            {
                login = Request.Cookies["credencialesIntranetMVC"].ToString();
            }
            else
            {
                Response.Redirect("http://dev.vegenat.net/Intranet2/Login?ReturnUrl=dev.vegenat.net%2presupuestotest%2&out=1");
            }

            return login;
        }

        private int GetPerfil(string login)
        {
            int perfil = 0;

            var parameters = new[] {
             new SqlParameter("@usuario", SqlDbType.NVarChar) { Direction = ParameterDirection.Input, Value = login },
             new SqlParameter("@operacion", SqlDbType.NVarChar) { Direction = ParameterDirection.Input, Value = "GETPERMISO" }
             };

            SqlDataReader reader = accesoDatos.EjecutarReader("CRUD_USUARIOS", CommandType.StoredProcedure, parameters);

            while (reader.Read())
            {
                perfil = Convert.ToInt32(reader["PERFIL"].ToString());
            }
            reader.Close();

            return perfil;
        }


    }
}
