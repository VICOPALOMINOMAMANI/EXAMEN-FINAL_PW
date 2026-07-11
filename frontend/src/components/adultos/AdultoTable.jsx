function AdultoTable({ adultos, onEditar, onEliminar }) {
  const obtenerClaseVulnerabilidad = (nivel) => {
    const clases = {
      Bajo: "bg-success-subtle text-success",
      Medio: "bg-warning-subtle text-warning-emphasis",
      Alto: "bg-danger-subtle text-danger",
      Crítico: "bg-danger text-white",
    };

    return clases[nivel] || "bg-secondary-subtle text-secondary";
  };

  if (adultos.length === 0) {
    return (
      <div className="empty-table-state">
        <i className="bi bi-person-x"></i>
        <h3>No se encontraron registros</h3>
        <p>Prueba con otro término de búsqueda o registra un adulto mayor.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle adult-table">
        <thead>
          <tr>
            <th>Adulto mayor</th>
            <th>DNI</th>
            <th>Distrito</th>
            <th>Salud</th>
            <th>Vulnerabilidad</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {adultos.map((adulto) => (
            <tr key={adulto.id}>
              <td>
                <div className="adult-person">
                  <div className="adult-avatar">
                    {adulto.nombres?.charAt(0)}
                    {adulto.apellidos?.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {adulto.nombres} {adulto.apellidos}
                    </strong>
                    <span>{adulto.telefono || "Sin teléfono"}</span>
                  </div>
                </div>
              </td>

              <td>{adulto.dni}</td>
              <td>{adulto.distrito}</td>

              <td>
                <span className="health-text">
                  {adulto.estadoSalud}
                </span>
              </td>

              <td>
                <span
                  className={`badge rounded-pill ${obtenerClaseVulnerabilidad(
                    adulto.nivelVulnerabilidad,
                  )}`}
                >
                  {adulto.nivelVulnerabilidad}
                </span>
              </td>

              <td>
                <span
                  className={`badge rounded-pill ${
                    adulto.estado === "Activo"
                      ? "bg-success-subtle text-success"
                      : "bg-secondary-subtle text-secondary"
                  }`}
                >
                  {adulto.estado}
                </span>
              </td>

              <td>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEditar(adulto)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onEliminar(adulto)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdultoTable;