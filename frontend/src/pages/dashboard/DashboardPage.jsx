import { useEffect, useState } from "react";

import DashboardCards from "../../components/dashboard/DashboardCards";
import UpcomingVisits from "../../components/dashboard/UpcomingVisits";
import RecentActivity from "../../components/dashboard/RecentActivity";

import useAuth from "../../hooks/useAuth";

import { obtenerDashboard } from "../../services/dashboardService";

import {
  contarCasosCriticos,
  contarVisitasPendientes,
} from "../../utils/dashboardUtils";

function DashboardPage() {
  const { usuario } = useAuth();

  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  const cargarDashboard = async () => {
    try {
      setError("");

      const informacion = await obtenerDashboard();

      setDatos(informacion);
    } catch (errorCargar) {
      console.error("Error al cargar el Dashboard:", errorCargar);

      setError(
        "No se pudo cargar la información del panel principal.",
      );
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  if (error) {
    return (
      <section className="page-container">
        <div className="content-card text-center py-5">
          <i className="bi bi-exclamation-circle display-5 text-danger"></i>

          <h2 className="h5 mt-3">
            Error al cargar el Dashboard
          </h2>

          <p className="text-secondary">
            {error}
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={cargarDashboard}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Intentar nuevamente
          </button>
        </div>
      </section>
    );
  }

  if (!datos) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-primary"></div>

        <p>Cargando Dashboard...</p>
      </div>
    );
  }

  const visitasPendientes = contarVisitasPendientes(
    datos.visitas,
  );

  const casosCriticos = contarCasosCriticos(
    datos.adultos,
  );

  return (
    <section className="page-container">
      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">
            Panel principal
          </h1>

          <p className="page-description">
            {usuario?.rol === "Administrador"
              ? "Resumen general del sistema AylluCare Cusco."
              : "Consulta tus actividades de seguimiento y alertas sociales."}
          </p>
        </div>

        <div className="dashboard-user-welcome">
          <span>Bienvenido</span>

          <strong>{usuario?.nombre}</strong>
        </div>
      </div>

      <DashboardCards
        totalAdultos={datos.adultos.length}
        totalVoluntarios={datos.voluntarios.length}
        visitasPendientes={visitasPendientes}
        casosCriticos={casosCriticos}
      />

      <div className="row mt-4 g-4">
        <div className="col-12 col-lg-7">
          <UpcomingVisits
            visitas={datos.visitas}
          />
        </div>

        <div className="col-12 col-lg-5">
          <RecentActivity
            alertas={datos.alertas}
          />
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;