function AlertaTable({
  alertas,
  adultos,
  onEditar,
  onEliminar,
}) {
  const obtenerAdulto = (adultoMayorId) => {
    return adultos.find(
      (adulto) => String(adulto.id) === String(adultoMayorId),
    );
  };

  const badgeNivel = (nivel) => {
    const clases = {
      Bajo: "bg-success-subtle text-success",
      Medio: "bg-warning-subtle text-warning-emphasis",
      Alto: "bg-orange text-white",
      Crítico: "bg-danger text-white",
    };

    return clases[nivel] || "bg-secondary-subtle text-secondary";
  };

  const badgeEstado = (estado) => {
    const clases = {
      Pendiente: "bg-warning-subtle text-warning-emphasis",
      "En atención": "bg-info-subtle text-info-emphasis",
      Resuelta: "bg-success-subtle text-success",
      Archivada: "bg-secondary-subtle text-secondary",
    };

    return clases[estado] || "bg-secondary";
  };

  if (alertas.length === 0) {
    return (
      <div className="empty-table-state">
        <i className="bi bi-exclamation-circle"></i>

        <h3>No existen alertas registradas</h3>

        <p>
          Registra una nueva alerta social.
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

            <th>Título</th>

            <th>Nivel</th>

            <th>Responsable</th>

            <th>Estado</th>

            <th>Fecha</th>

            <th className="text-end">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {alertas.map((alerta) => {

            const adulto = obtenerAdulto(
              alerta.adultoMayorId,
            );

            return (

              <tr key={alerta.id}>

                <td>

                  <div className="adult-person">

                    <div className="alert-avatar">

                      {adulto?.nombres?.charAt(0)}
                      {adulto?.apellidos?.charAt(0)}

                    </div>

                    <div>

                      <strong>

                        {adulto
                          ? `${adulto.nombres} ${adulto.apellidos}`
                          : "Sin registro"}

                      </strong>

                      <span>

                        {adulto?.dni}

                      </span>

                    </div>

                  </div>

                </td>

                <td>

                  <strong>

                    {alerta.titulo}

                  </strong>

                  <div
                    className="health-text"
                  >

                    {alerta.descripcion}

                  </div>

                </td>

                <td>

                  <span
                    className={`badge rounded-pill ${badgeNivel(
                      alerta.nivel,
                    )}`}
                  >
                    {alerta.nivel}
                  </span>

                </td>

                <td>

                  {alerta.responsable}

                </td>

                <td>

                  <span
                    className={`badge rounded-pill ${badgeEstado(
                      alerta.estado,
                    )}`}
                  >
                    {alerta.estado}
                  </span>

                </td>

                <td>

                  {alerta.fechaRegistro}

                </td>

                <td>

                  <div className="d-flex justify-content-end gap-2">

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        onEditar(alerta)
                      }
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        onEliminar(alerta)
                      }
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

export default AlertaTable;