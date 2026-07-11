import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { obtenerDatosReporte } from "../../services/reporteService";

import {
  agruparPorCampo,
  filtrarPorFecha,
} from "../../utils/reporteUtils";

const coloresVulnerabilidad = {
  Bajo: "#16a34a",
  Medio: "#eab308",
  Alto: "#f97316",
  Crítico: "#dc2626",
};

const coloresAlertas = {
  Bajo: "#16a34a",
  Medio: "#eab308",
  Alto: "#f97316",
  Crítico: "#dc2626",
};

function ReportesPage() {
  const [datos, setDatos] = useState({
    adultos: [],
    voluntarios: [],
    visitas: [],
    alertas: [],
  });

  const [cargando, setCargando] = useState(true);

  const [distrito, setDistrito] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const informacion = await obtenerDatosReporte();

      setDatos(informacion);
    } catch (error) {
      console.error("Error al cargar reportes:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos del reporte.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const distritos = useMemo(() => {
    return [...new Set(datos.adultos.map((adulto) => adulto.distrito))]
      .filter(Boolean)
      .sort();
  }, [datos.adultos]);

  const adultosFiltrados = useMemo(() => {
    if (!distrito) {
      return datos.adultos;
    }

    return datos.adultos.filter(
      (adulto) => adulto.distrito === distrito,
    );
  }, [datos.adultos, distrito]);

  const idsAdultosFiltrados = useMemo(() => {
    return adultosFiltrados.map((adulto) => String(adulto.id));
  }, [adultosFiltrados]);

  const visitasFiltradas = useMemo(() => {
    const visitasPorFecha = filtrarPorFecha(
      datos.visitas,
      "fecha",
      fechaInicio,
      fechaFin,
    );

    if (!distrito) {
      return visitasPorFecha;
    }

    return visitasPorFecha.filter((visita) =>
      idsAdultosFiltrados.includes(String(visita.adultoMayorId)),
    );
  }, [
    datos.visitas,
    fechaInicio,
    fechaFin,
    distrito,
    idsAdultosFiltrados,
  ]);

  const alertasFiltradas = useMemo(() => {
    const alertasPorFecha = filtrarPorFecha(
      datos.alertas,
      "fechaRegistro",
      fechaInicio,
      fechaFin,
    );

    if (!distrito) {
      return alertasPorFecha;
    }

    return alertasPorFecha.filter((alerta) =>
      idsAdultosFiltrados.includes(String(alerta.adultoMayorId)),
    );
  }, [
    datos.alertas,
    fechaInicio,
    fechaFin,
    distrito,
    idsAdultosFiltrados,
  ]);

  const vulnerabilidadData = useMemo(() => {
    return agruparPorCampo(
      adultosFiltrados,
      "nivelVulnerabilidad",
    );
  }, [adultosFiltrados]);

  const visitasData = useMemo(() => {
    return agruparPorCampo(visitasFiltradas, "estado");
  }, [visitasFiltradas]);

  const alertasData = useMemo(() => {
    return agruparPorCampo(alertasFiltradas, "nivel");
  }, [alertasFiltradas]);

  const visitasRealizadas = visitasFiltradas.filter(
    (visita) => visita.estado === "Realizada",
  ).length;

  const alertasResueltas = alertasFiltradas.filter(
    (alerta) => alerta.estado === "Resuelta",
  ).length;

  const casosCriticos = adultosFiltrados.filter(
    (adulto) => adulto.nivelVulnerabilidad === "Crítico",
  ).length;

  const limpiarFiltros = () => {
    setDistrito("");
    setFechaInicio("");
    setFechaFin("");
  };

  const imprimirReporte = () => {
    window.print();
  };

  if (cargando) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-primary"></div>
        <p>Cargando reportes...</p>
      </div>
    );
  }

  return (
    <section className="page-container report-page">
      <div className="dashboard-heading report-page-header">
        <div>
          <h1 className="page-title">Reportes</h1>

          <p className="page-description">
            Análisis del seguimiento y atención social de adultos mayores.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary print-button"
          onClick={imprimirReporte}
        >
          <i className="bi bi-printer-fill me-2"></i>
          Imprimir reporte
        </button>
      </div>

      <div className="content-card report-filters">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Distrito</label>

            <select
              className="form-select"
              value={distrito}
              onChange={(event) => setDistrito(event.target.value)}
            >
              <option value="">Todos los distritos</option>

              {distritos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha inicial</label>

            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(event) => setFechaInicio(event.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha final</label>

            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(event) => setFechaFin(event.target.value)}
              min={fechaInicio || undefined}
            />
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={limpiarFiltros}
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1 report-summary">
        <div className="col-12 col-sm-6 col-xl-3">
          <article className="report-summary-card">
            <div className="report-summary-icon report-icon-primary">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <span>Adultos atendidos</span>
              <strong>{adultosFiltrados.length}</strong>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="report-summary-card">
            <div className="report-summary-icon report-icon-success">
              <i className="bi bi-calendar-check-fill"></i>
            </div>

            <div>
              <span>Visitas realizadas</span>
              <strong>{visitasRealizadas}</strong>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="report-summary-card">
            <div className="report-summary-icon report-icon-warning">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div>
              <span>Alertas resueltas</span>
              <strong>{alertasResueltas}</strong>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="report-summary-card">
            <div className="report-summary-icon report-icon-danger">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <div>
              <span>Casos críticos</span>
              <strong>{casosCriticos}</strong>
            </div>
          </article>
        </div>
      </div>

      <div className="row g-4 mt-1 report-charts">
        <div className="col-12 col-xl-6">
          <article className="content-card report-chart-card">
            <div className="report-chart-header">
              <div>
                <h2>Vulnerabilidad</h2>
                <p>Adultos mayores según el nivel registrado.</p>
              </div>
            </div>

            {vulnerabilidadData.length === 0 ? (
              <div className="report-empty">
                No existen datos para mostrar.
              </div>
            ) : (
              <div className="report-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vulnerabilidadData}
                      dataKey="cantidad"
                      nameKey="nombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label
                    >
                      {vulnerabilidadData.map((item) => (
                        <Cell
                          key={item.nombre}
                          fill={
                            coloresVulnerabilidad[item.nombre] ||
                            "#64748b"
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>
        </div>

        <div className="col-12 col-xl-6">
          <article className="content-card report-chart-card">
            <div className="report-chart-header">
              <div>
                <h2>Visitas por estado</h2>
                <p>Situación de las visitas sociales registradas.</p>
              </div>
            </div>

            {visitasData.length === 0 ? (
              <div className="report-empty">
                No existen datos para mostrar.
              </div>
            ) : (
              <div className="report-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="cantidad"
                      name="Visitas"
                      fill="#0891b2"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>
        </div>

        <div className="col-12">
          <article className="content-card report-chart-card">
            <div className="report-chart-header">
              <div>
                <h2>Alertas por nivel</h2>
                <p>
                  Distribución de situaciones que requieren seguimiento.
                </p>
              </div>
            </div>

            {alertasData.length === 0 ? (
              <div className="report-empty">
                No existen datos para mostrar.
              </div>
            ) : (
              <div className="report-chart report-chart-wide">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />

                    <Bar
                      dataKey="cantidad"
                      name="Alertas"
                      radius={[8, 8, 0, 0]}
                    >
                      {alertasData.map((item) => (
                        <Cell
                          key={item.nombre}
                          fill={
                            coloresAlertas[item.nombre] || "#64748b"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>
        </div>
      </div>

      <div className="content-card mt-4 report-conclusion">
        <div className="report-conclusion-icon">
          <i className="bi bi-heart-pulse-fill"></i>
        </div>

        <div>
          <h2>Resumen del impacto social</h2>

          <p>
            El sistema registra actualmente {adultosFiltrados.length} adultos
            mayores dentro del filtro seleccionado. Se realizaron{" "}
            {visitasRealizadas} visitas y se resolvieron {alertasResueltas}{" "}
            alertas sociales. Además, existen {casosCriticos} casos críticos
            que requieren atención prioritaria.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReportesPage;