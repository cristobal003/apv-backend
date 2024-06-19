import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
  // Eliminamos la propiedad del objeto que viene del req.body
  delete req.body.id;

  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id;
  try {
    const pacienteAlmacenado = await paciente.save();
    res.json(pacienteAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerPacientes = async (req, res) => {
  const { id } = req.veterinario; // ID del veterinario autenticado
  try {
    const pacientes = await Paciente.find({ veterinario: id }); // Filtrar por ID del veterinario
    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener pacientes" });
  }
};


const obtenerPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);
  if (!paciente) {
    return res.status(404).json({ msg: "No encontrado" });
  }
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no valida" });
  }
  res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);
  if (!paciente) {
    return res.status(404).json({ msg: "No encontrado" });
  }
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no valida" });
  }
  //Actualizar Paciente
  paciente.nombre = req.body.nombre || paciente.nombre;
  paciente.propietario = req.body.propietario || paciente.propietario;
  paciente.email = req.body.email || paciente.email;
  paciente.fecha = req.body.fecha || paciente.fecha;
  paciente.sintomas = req.body.sintomas || paciente.sintomas;
  try {
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);
  if (!paciente) {
    return res.status(404).json({ msg: "No encontrado" });
  }
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no valida" });
  }

  try {
    await paciente.deleteOne();
    res.json({ msg: "Paciente eliminado" });
  } catch (error) {
    console.log(error);
  }
};

export {
  obtenerPacientes,
  agregarPaciente,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
