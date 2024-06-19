import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
} from "../controllers/veterinarioController.js";

const router = express.Router();

//El área publica

router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//El área privada

//Custom middleware para las rutas propias del usuario primero coge la ruta, luego hace el checkAuth y luego se va a perfil
router.get("/perfil", checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router;
