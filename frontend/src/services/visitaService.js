import api from "./api";

const ENDPOINT = "/visitas";

export const obtenerVisitas = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const obtenerVisitaPorId = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const crearVisita = async (datos) => {
  const response = await api.post(ENDPOINT, datos);
  return response.data;
};

export const actualizarVisita = async (id, datos) => {
  const response = await api.put(`${ENDPOINT}/${id}`, datos);
  return response.data;
};

export const eliminarVisita = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};