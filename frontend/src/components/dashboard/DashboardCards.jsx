function DashboardCards({
  totalAdultos,
  totalVoluntarios,
  visitasPendientes,
  casosCriticos,
}) {
  const tarjetas = [
    {
      titulo: "Adultos mayores",
      cantidad: totalAdultos,
      icono: "bi-people-fill",
      clase: "dashboard-card-primary",
    },
    {
      titulo: "Voluntarios",
      cantidad: totalVoluntarios,
      icono: "bi-person-heart",
      clase: "dashboard-card-success",
    },
    {
      titulo: "Visitas pendientes",
      cantidad: visitasPendientes,
      icono: "bi-calendar-check-fill",
      clase: "dashboard-card-warning",
    },
    {
      titulo: "Casos críticos",
      cantidad: casosCriticos,
      icono: "bi-exclamation-triangle-fill",
      clase: "dashboard-card-danger",
    },
  ];

  return (
    <div className="row g-4">
      {tarjetas.map((tarjeta) => (
        <div className="col-lg-3 col-md-6" key={tarjeta.titulo}>
          <article className={`dashboard-card ${tarjeta.clase}`}>
            <div>
              <span>{tarjeta.titulo}</span>

              <h2>{tarjeta.cantidad}</h2>
            </div>

            <div className="dashboard-card-icon">
              <i className={`bi ${tarjeta.icono}`}></i>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;