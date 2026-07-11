import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 p-4">
      <div className="text-center">
        <i className="bi bi-exclamation-circle display-1 text-primary"></i>

        <h1 className="display-4 fw-bold mt-3">404</h1>

        <h2 className="h4">Página no encontrada</h2>

        <p className="text-secondary">
          La dirección solicitada no existe dentro del sistema.
        </p>

        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door me-2"></i>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;