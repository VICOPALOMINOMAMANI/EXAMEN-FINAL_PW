import api from "./api";

const ENDPOINT = "/voluntarios";

export const obtenerVoluntarios = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const obtenerVoluntarioPorId = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const crearVoluntario = async (datos) => {
  const response = await api.post(ENDPOINT, datos);
  return response.data;
};

export const actualizarVoluntario = async (id, datos) => {
  const response = await api.put(`${ENDPOINT}/${id}`, datos);
  return response.data;
};

export const eliminarVoluntario = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};