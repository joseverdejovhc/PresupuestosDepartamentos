using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PresupuestosDepartamentos.Data;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using System.Data;

namespace PresupuestosDepartamentos.Controllers
{
    public class ConfiguracionController : Controller
    {

        private AccesoDatos accesoDatos;
        private string login;
        private int perfil = 0;
        public ConfiguracionController()
        {
            accesoDatos = new AccesoDatos();
        }

        public ActionResult Index()
        {
            login = GetCookie();

            perfil = GetPerfil(login);
            ViewData["perfil"] = perfil;

            if (perfil == 0)
            {
                return View("NoAccess");
            }
            else
            {
                return View();
            }
        }

        /**
         * Tab Centros de Coste         
         */

        public ActionResult loadModalCentrosCoste()
        {
            var response = new JObject();
            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETMODAL" });
            var dataSet = accesoDatos.GetDataSet("CRUD_CONF_CENTROS_COSTE", parameters);

            var dt_tipos = dataSet?.Tables?[0];
            var dt_centros = dataSet?.Tables?[1];
            response["tipos"] = JsonConvert.SerializeObject(dt_tipos);
            response["centros"] = JsonConvert.SerializeObject(dt_centros);

            return Content(response.ToString(), "application/json");
        }

        public ActionResult CRUD_CENTROS_COSTE(string operacion, string cod_centro_coste, string nombre, int tipo, int anio_inicio, int anio_fin, int identificador, string info)
        {
            var response = new JObject();

            if (nombre != "" && nombre != null)
            {
                string[] arr_nombre = nombre.Split('-');
                nombre = arr_nombre[1];
            }
            else
            {
                nombre = "";
            }

            var parameters = new[] {
                new SqlParameter("@operacion", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = operacion },
                new SqlParameter("@identificador", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = identificador },
                new SqlParameter("@cod_centro_coste", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = cod_centro_coste },
                new SqlParameter("@nombre", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = nombre },
                new SqlParameter("@anio_fin", SqlDbType.Int) {Direction = ParameterDirection.Input, Value = anio_fin},
                new SqlParameter("@anio_inicio", SqlDbType.Int) {Direction = ParameterDirection.Input, Value = anio_inicio},
                new SqlParameter("@info_extracontable", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = info },
                new SqlParameter("@mensaje", SqlDbType.VarChar, 200) {Direction = ParameterDirection.Output},
                new SqlParameter("@success", SqlDbType.Int) {Direction = ParameterDirection.Output},
                new SqlParameter("@tipo", SqlDbType.Int) {Direction = ParameterDirection.Input, Value = tipo}
            };

            SqlCommand command = accesoDatos.EjecutarProcedimientoConParametros("CRUD_CONF_CENTROS_COSTE", CommandType.StoredProcedure, parameters);

            if (command.Parameters["@success"].Value != null)
            {
                response["success"] = int.Parse(command.Parameters["@success"].Value.ToString());
                response["mensaje"] = command.Parameters["@mensaje"].Value.ToString();
            }

            return Content(response.ToString(), "application/json");
        }

        public ActionResult getCentrosConfigurados()
        {
            var response = new JObject();

            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETCENTROSCONFIGURADOS" });
            var dataSet = accesoDatos.GetDataSet("CRUD_CONF_CENTROS_COSTE", parameters);

            var dt_centros = dataSet?.Tables?[0];
            response["centros"] = JsonConvert.SerializeObject(dt_centros);

            return Content(response.ToString(), "application/json");
        }

        /**
         * TAB NATURALEZAS
         */

        public ActionResult CRUD_NATURALEZA(string operacion, string cod_naturaleza, string nombre, int tipo, int identificador, string info)
        {
            var response = new JObject();

            var parameters = new[] {
                new SqlParameter("@operacion", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = operacion },
                new SqlParameter("@identificador", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = identificador },
                new SqlParameter("@codigo", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = cod_naturaleza },
                new SqlParameter("@nombre", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = nombre },
                new SqlParameter("@info", SqlDbType.VarChar, 200) { Direction = ParameterDirection.Input, Value = info },
                new SqlParameter("@mensaje", SqlDbType.VarChar, 200) {Direction = ParameterDirection.Output},
                new SqlParameter("@success", SqlDbType.Int) {Direction = ParameterDirection.Output},
                new SqlParameter("@tipo", SqlDbType.Int) {Direction = ParameterDirection.Input, Value = tipo}
            };

            SqlCommand command = accesoDatos.EjecutarProcedimientoConParametros("CRUD_CONF_NATURALEZAS", CommandType.StoredProcedure, parameters);

            if (command.Parameters["@success"].Value != null)
            {
                response["success"] = int.Parse(command.Parameters["@success"].Value.ToString());
                response["mensaje"] = command.Parameters["@mensaje"].Value.ToString();
            }

            return Content(response.ToString(), "application/json");
        }


        public ActionResult getNaturalezas()
        {
            var response = new JObject();

            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETNATURALEZAS" });
            var dataSet = accesoDatos.GetDataSet("CRUD_CONF_NATURALEZAS", parameters);

            var dt_naturalezas = dataSet?.Tables?[0];
            response["naturalezas"] = JsonConvert.SerializeObject(dt_naturalezas);

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
