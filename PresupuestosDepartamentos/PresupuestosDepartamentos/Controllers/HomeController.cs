using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PresupuestosDepartamentos.Data;
using PresupuestosDepartamentos.Models;
using System.Data;
using System.Diagnostics;

namespace PresupuestosDepartamentos.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private string login;
        private int perfil = 0;
        private AccesoDatos accesoDatos;
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            accesoDatos = new AccesoDatos();
        }

        public IActionResult Index()
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

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Usuarios()
        {
            login = GetCookie();

            perfil = GetPerfil(login);
            ViewData["perfil"] = perfil;

            if (perfil != 1) //Solo accederá a los usuarios si es administrador
            {
                return View("NoAccess");
            }
            else
            {
                return View();
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
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
                perfil = Convert.ToInt32(reader["perfil"].ToString());
            }
            reader.Close();

            return perfil;
        }

    }
}