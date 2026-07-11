export const agruparPorCampo = (registros, campo) => {
  const contador = registros.reduce((resultado, registro) => {
    const valor = registro[campo] || "Sin información";

    resultado[valor] = (resultado[valor] || 0) + 1;

    return resultado;
  }, {});

  return Object.entries(contador).map(([nombre, cantidad]) => ({
    nombre,
    cantidad,
  }));
};

export const filtrarPorFecha = (
  registros,
  campoFecha,
  fechaInicio,
  fechaFin,
) => {
  return registros.filter((registro) => {
    const fecha = registro[campoFecha];

    if (!fecha) {
      return false;
    }

    const cumpleInicio = !fechaInicio || fecha >= fechaInicio;
    const cumpleFin = !fechaFin || fecha <= fechaFin;

    return cumpleInicio && cumpleFin;
  });
};