import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  //Prevenir usuarios duplicados
  const existeUsuario = await Veterinario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Guardar un nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar el email
    emailRegistro({ email, nombre, token: veterinarioGuardado.token });

    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json(veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //Revisar el password
  if (await usuario.comprobarPassword(password)) {
    //Autenticar al usuario
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const existeVeterinario = await Veterinario.findOne({ email });
  if (!existeVeterinario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();
    //Enviar email con instrucciones
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });
    res.json({ msg: "hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params; // Extraemos el token de req.params
  try {
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
      // El token es válido, el veterinario existe
      res.json({ msg: "Token válido y el veterinario existe" });
    } else {
      const error = new Error("Token no válido");
      return res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(token);

  try {
    // Asegúrate de que el token sea una cadena
    if (typeof token !== "string") {
      throw new Error("El token proporcionado no es válido.");
    }

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
      return res.status(400).json({ msg: "Hubo un error" });
    }

    veterinario.token = null;
    veterinario.password = password;

    await veterinario.save();

    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al modificar el password" });
  }
};

const actualizarPerfil = async (req, res) => {
  console.log(req.params);
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const { nombre, email, web, telefono } = req.body;

    if (veterinario.email !== email) {
      const existeEmail = await Veterinario.findOne({ email });
      if (existeEmail) {
        const error = new Error("Ese email ya está en uso");
        return res.status(400).json({ msg: error.message });
      }
    }

    veterinario.nombre = nombre;
    veterinario.email = email;
    veterinario.web = web;
    veterinario.telefono = telefono;

    const veterinarioActualizado = await veterinario.save();
    return res.json(veterinarioActualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const actualizarPassword = async (req, res) => {
  //Leer los datos
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body;
  //Comprobar que el veterinario exista
  const veterinario = await Veterinario.findById(id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  //Comprobar su password
  if (await veterinario.comprobarPassword(pwd_actual)) {
    //Almacenar nuevo password
    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({ msg: "Contraseña almacenada correctamente" });
  } else {
    const error = new Error("La contraseña actual es incorrecta");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
