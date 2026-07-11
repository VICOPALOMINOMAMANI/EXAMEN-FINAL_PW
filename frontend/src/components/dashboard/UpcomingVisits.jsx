function UpcomingVisits({ visitas }) {
  if (visitas.length === 0) {
    return (
      <div className="dashboard-panel">
        <h3>Próximas visitas</h3>

        <div className="dashboard-empty">
          <i className="bi bi-calendar2-week"></i>

          <p>No existen visitas programadas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">

      <div className="panel-header">

        <h3>Próximas visitas</h3>

        <span>{visitas.length}</span>

      </div>

      {visitas.map((visita) => (

        <div
          className="visit-item"
          key={visita.id}
        >

          <div className="visit-date">

            <i className="bi bi-calendar-event"></i>

            <span>{visita.fecha}</span>

          </div>

          <strong>{visita.motivo}</strong>

          <small>{visita.observaciones}</small>

          <div>

            <span
              className={`badge ${
                visita.estado === "Pendiente"
                  ? "text-bg-warning"
                  : "text-bg-success"
              }`}
            >
              {visita.estado}
            </span>

          </div>

        </div>

      ))}

    </div>
  );
}

export default UpcomingVisits;