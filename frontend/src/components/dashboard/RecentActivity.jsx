function RecentActivity({ alertas }) {
  return (
    <div className="dashboard-panel">

      <div className="panel-header">

        <h3>Alertas recientes</h3>

        <span>{alertas.length}</span>

      </div>

      {alertas.map((alerta) => (

        <div
          className="activity-item"
          key={alerta.id}
        >

          <div className="activity-icon">

            <i className="bi bi-exclamation-circle"></i>

          </div>

          <div>

            <strong>{alerta.titulo}</strong>

            <small>{alerta.descripcion}</small>

          </div>

        </div>

      ))}
    </div>
  );
}

export default RecentActivity;