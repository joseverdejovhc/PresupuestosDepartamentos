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

        private AccesoDatos accesoDatos;

        public UsuariosController()
        {
            accesoDatos = new AccesoDatos();
        }

        public IActionResult Index()
        {
            return View();
        }

        public ActionResult loadModalUsuarios()
        {
            var response = new JObject();
            var parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("@operacion", SqlDbType.VarChar) { Direction = ParameterDirection.Input, Value = "GETCENTROSCONFIGURADOS" });
            var dataSet = accesoDatos.GetDataSet("CRUD_CONF_CENTROS_COSTE", parameters);

            var dt_centros = dataSet?.Tables?[0];
            response["centros"] = JsonConvert.SerializeObject(dt_centros);

            return Content(response.ToString(), "application/json");
        }

    }
}
