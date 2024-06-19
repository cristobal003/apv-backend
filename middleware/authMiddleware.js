import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraer el token
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('Token no proporcionado');
            }

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario asociado al token
            const veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");

            // Verificar que el usuario exista
            if (!veterinario) {
                throw new Error('Usuario no encontrado');
            }

            // Asignar el usuario a la request para el próximo middleware
            req.veterinario = veterinario;

            return next();
        } catch (error) {
            console.error('Error en la verificación del token:', error);
            return res.status(403).json({ msg: error.message });
        }
    } else {
        return res.status(403).json({ msg: 'No autorizado, no se encontró el token' });
    }
};

export default checkAuth;