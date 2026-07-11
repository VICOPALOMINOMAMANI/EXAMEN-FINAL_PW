function VisitaTable({
  visitas,
  adultos,
  voluntarios,
  onEditar,
  onEliminar,
}) {
  const obtenerAdulto = (adultoMayorId) => {
    return adultos.find(
      (adulto) => String(adulto.id) === String(adultoMayorId),
    );
  };

  const obtenerVoluntario = (voluntarioId) => {
    return voluntarios.find(
      (voluntario) => String(voluntario.id) === String(voluntarioId),
    );
  };

  const obtenerClaseEstado = (estado) => {
    const clases = {
      Pendiente: "bg-warning-subtle text-warning-emphasis",
      Programada: "bg-info-subtle text-info-emphasis",
      Realizada: "bg-success-subtle text-success",
      Cancelada: "bg-danger-subtle text-danger",
    };

    return clases[estado] || "bg-secondary-subtle text-secondary";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "Sin fecha";
    }

    const [anio, mes, dia] = fecha.split("-");

    return `${dia}/${mes}/${anio}`;
  };

  if (visitas.length === 0) {
    return (
      <div className="empty-table-state">
        <i className="bi bi-calendar-x"></i>

        <h3>No se encontraron visitas</h3>

        <p>
          Registra una nueva visita o utiliza otro término de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle adult-table">
        <thead>
          <tr>
            <th>Adulto mayor</th>
            <th>Voluntario</th>
            <th>Fecha y hora</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {visitas.map((visita) => {
            const adulto = obtenerAdulto(visita.adultoMayorId);
            const voluntario = obtenerVoluntario(visita.voluntarioId);

            return (
              <tr key={visita.id}>
                <td>
                  <div className="adult-person">
                    <div className="visit-adult-avatar">
                      {adulto?.nombres?.charAt(0) || "A"}
                      {adulto?.apellidos?.charAt(0) || "M"}
                    </div>

                    <div>
                      <strong>
                        {adulto
                          ? `${adulto.nombres} ${adulto.apellidos}`
                          : "Adulto no encontrado"}
                      </strong>

                      <span>
                        {adulto ? `DNI ${adulto.dni}` : "Sin información"}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="visit-volunteer">
                    <i className="bi bi-person-heart"></i>

                    <span>
                      {voluntario
                        ? `${voluntario.nombres} ${voluntario.apellidos}`
                        : "Voluntario no encontrado"}
                    </span>
                  </div>
                </td>

                <td>
                  <div className="visit-datetime">
                    <strong>{formatearFecha(visita.fecha)}</strong>
                    <span>{visita.hora}</span>
                  </div>
                </td>

                <td>
                  <span className="health-text">{visita.motivo}</span>
                </td>

                <td>
                  <span
                    className={`badge rounded-pill ${obtenerClaseEstado(
                      visita.estado,
                    )}`}
                  >
                    {visita.estado}
                  </span>
                </td>

                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEditar(visita)}
                      title="Editar visita"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onEliminar(visita)}
                      title="Eliminar visita"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VisitaTable;