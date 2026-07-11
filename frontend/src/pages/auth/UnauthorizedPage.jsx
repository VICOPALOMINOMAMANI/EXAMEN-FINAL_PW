import { Link } from "react-router";

function UnauthorizedPage() {
  return (
    <main className="unauthorized-page">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <i className="bi bi-shield-lock-fill"></i>
        </div>

        <h1>Acceso denegado</h1>

        <p>
          Tu usuario no cuenta con permisos para ingresar a esta sección.
        </p>

        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door-fill me-2"></i>
          Volver al panel principal
        </Link>
      </div>
    </main>
  );
}

export default UnauthorizedPage;