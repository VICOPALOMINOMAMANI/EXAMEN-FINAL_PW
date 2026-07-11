import api from "./api";

export const obtenerDatosReporte = async () => {
  const [
    respuestaAdultos,
    respuestaVoluntarios,
    respuestaVisitas,
    respuestaAlertas,
  ] = await Promise.all([
    api.get("/adultosMayores"),
    api.get("/voluntarios"),
    api.get("/visitas"),
    api.get("/alertas"),
  ]);

  return {
    adultos: respuestaAdultos.data,
    voluntarios: respuestaVoluntarios.data,
    visitas: respuestaVisitas.data,
    alertas: respuestaAlertas.data,
  };
};