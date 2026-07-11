function VoluntarioTable({ voluntarios, onEditar, onEliminar }) {
  if (voluntarios.length === 0) {
    return (
      <div className="empty-table-state">
        <i className="bi bi-person-heart"></i>

        <h3>No se encontraron voluntarios</h3>

        <p>
          Registra un nuevo voluntario o utiliza otro término de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle adult-table">
        <thead>
          <tr>
            <th>Voluntario</th>
            <th>DNI</th>
            <th>Distrito</th>
            <th>Disponibilidad</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {voluntarios.map((voluntario) => (
            <tr key={voluntario.id}>
              <td>
                <div className="adult-person">
                  <div className="volunteer-avatar">
                    {voluntario.nombres?.charAt(0)}
                    {voluntario.apellidos?.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {voluntario.nombres} {voluntario.apellidos}
                    </strong>

                    <span>{voluntario.correo}</span>
                  </div>
                </div>
              </td>

              <td>{voluntario.dni}</td>

              <td>{voluntario.distrito}</td>

              <td>
                <span className="badge rounded-pill bg-info-subtle text-info-emphasis">
                  {voluntario.disponibilidad}
                </span>
              </td>

              <td>
                <span className="health-text">
                  {voluntario.especialidad}
                </span>
              </td>

              <td>
                <span
                  className={`badge rounded-pill ${
                    voluntario.estado === "Activo"
                      ? "bg-success-subtle text-success"
                      : "bg-secondary-subtle text-secondary"
                  }`}
                >
                  {voluntario.estado}
                </span>
              </td>

              <td>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEditar(voluntario)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onEliminar(voluntario)}
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

export default VoluntarioTable;