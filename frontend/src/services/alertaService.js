import api from "./api";

const ENDPOINT = "/alertas";

export const obtenerAlertas = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const crearAlerta = async (datos) => {
  const response = await api.post(ENDPOINT, datos);
  return response.data;
};

export const actualizarAlerta = async (id, datos) => {
  const response = await api.put(`${ENDPOINT}/${id}`, datos);
  return response.data;
};

export const eliminarAlerta = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};