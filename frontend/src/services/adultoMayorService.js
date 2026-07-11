import api from "./api";

const ENDPOINT = "/adultosMayores";

export const obtenerAdultosMayores = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const obtenerAdultoMayorPorId = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const crearAdultoMayor = async (datos) => {
  const response = await api.post(ENDPOINT, datos);
  return response.data;
};

export const actualizarAdultoMayor = async (id, datos) => {
  const response = await api.put(`${ENDPOINT}/${id}`, datos);
  return response.data;
};

export const eliminarAdultoMayor = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};