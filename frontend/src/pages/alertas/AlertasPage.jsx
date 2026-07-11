import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import AlertaForm from "../../components/alertas/AlertaForm";
import AlertaTable from "../../components/alertas/AlertaTable";

import { obtenerAdultosMayores } from "../../services/adultoMayorService";
import { obtenerVoluntarios } from "../../services/voluntarioService";
import {
  actualizarAlerta,
  crearAlerta,
  eliminarAlerta,
  obtenerAlertas,
} from "../../services/alertaService";

function AlertasPage() {
  
  const [alertas, setAlertas] = useState([]);
  const [adultos, setAdultos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [alertaEditar, setAlertaEditar] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [datosAlertas, datosAdultos, datosVoluntarios] =
      await Promise.all([
      obtenerAlertas(),
      obtenerAdultosMayores(),
      obtenerVoluntarios(),
      ]);

      setAlertas(datosAlertas);
      setAdultos(datosAdultos);
      setVoluntarios(datosVoluntarios);
    } catch (error) {
      console.error("Error al cargar alertas:", error);

      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudieron cargar las alertas sociales.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerNombreAdulto = (adultoMayorId) => {
    const adulto = adultos.find(
      (item) => String(item.id) === String(adultoMayorId),
    );

    if (!adulto) {
      return "";
    }

    return `${adulto.nombres} ${adulto.apellidos}`.toLowerCase();
  };
    const alertasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return alertas.filter((alerta) => {
      const nombreAdulto = obtenerNombreAdulto(alerta.adultoMayorId);

      const coincideBusqueda =
        !texto ||
        nombreAdulto.includes(texto) ||
        alerta.titulo?.toLowerCase().includes(texto) ||
        alerta.descripcion?.toLowerCase().includes(texto) ||
        alerta.responsable?.toLowerCase().includes(texto);

      const coincideNivel =
        !filtroNivel || alerta.nivel === filtroNivel;

      const coincideEstado =
        !filtroEstado || alerta.estado === filtroEstado;

      return coincideBusqueda && coincideNivel && coincideEstado;
    });
  }, [
    alertas,
    adultos,
    busqueda,
    filtroNivel,
    filtroEstado,
  ]);

 const abrirRegistro = () => {
  if (adultos.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No existen adultos mayores",
      text: "Primero debes registrar un adulto mayor.",
    });

    return;
  }

  const voluntariosActivos = voluntarios.filter(
    (voluntario) => voluntario.estado === "Activo",
  );

  if (voluntariosActivos.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No existen voluntarios activos",
      text: "Primero debes registrar o activar un voluntario.",
    });

    return;
  }

  setAlertaEditar(null);
  setMostrarFormulario(true);
};

  const abrirEdicion = (alerta) => {
    setAlertaEditar(alerta);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setAlertaEditar(null);
  };

  const guardarAlerta = async (datos) => {
    try {
      setGuardando(true);

      if (alertaEditar) {
        const actualizada = await actualizarAlerta(
          alertaEditar.id,
          datos,
        );

        setAlertas((anteriores) =>
          anteriores.map((alerta) =>
            alerta.id === alertaEditar.id
              ? actualizada
              : alerta,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Alerta actualizada",
          text: "La información fue modificada correctamente.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        const nueva = await crearAlerta(datos);

        setAlertas((anteriores) => [...anteriores, nueva]);

        await Swal.fire({
          icon: "success",
          title: "Alerta registrada",
          text: "La alerta social fue registrada correctamente.",
          timer: 1600,
          showConfirmButton: false,
        });
      }

      cerrarFormulario();
    } catch (error) {
      console.error("Error al guardar alerta:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: "Verifica que la API se encuentre funcionando.",
      });
    } finally {
      setGuardando(false);
    }
  };
    const eliminarRegistro = async (alerta) => {
    const nombreAdulto = obtenerNombreAdulto(
      alerta.adultoMayorId,
    );

    const resultado = await Swal.fire({
      icon: "warning",
      title: "Eliminar alerta",
      text: `¿Deseas eliminar la alerta de ${
        nombreAdulto || "este adulto mayor"
      }?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      await eliminarAlerta(alerta.id);

      setAlertas((anteriores) =>
        anteriores.filter((item) => item.id !== alerta.id),
      );

      Swal.fire({
        icon: "success",
        title: "Alerta eliminada",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar alerta:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "Ocurrió un error al eliminar la alerta.",
      });
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroNivel("");
    setFiltroEstado("");
  };

  const existenFiltros =
    busqueda.trim() !== "" ||
    filtroNivel !== "" ||
    filtroEstado !== "";
      return (
    <section className="page-container">
      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">Alertas sociales</h1>

          <p className="page-description">
            Registra y da seguimiento a situaciones que requieren atención.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={abrirRegistro}
        >
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          Registrar alerta
        </button>
      </div>

      <div className="content-card">
        <div className="alert-toolbar">
          <div className="adult-search alert-search">
            <i className="bi bi-search"></i>

            <input
              type="search"
              className="form-control"
              placeholder="Buscar por adulto, título, descripción o responsable"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <select
            className="form-select alert-filter"
            value={filtroNivel}
            onChange={(event) => setFiltroNivel(event.target.value)}
          >
            <option value="">Todos los niveles</option>
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
            <option value="Crítico">Crítico</option>
          </select>

          <select
            className="form-select alert-filter"
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En atención">En atención</option>
            <option value="Resuelta">Resuelta</option>
            <option value="Archivada">Archivada</option>
          </select>

          {existenFiltros && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={limpiarFiltros}
            >
              <i className="bi bi-x-circle me-2"></i>
              Limpiar
            </button>
          )}

          <span className="adult-count">
            {alertasFiltradas.length} alertas
          </span>
        </div>

        {cargando ? (
          <div className="loading-state">
            <div className="spinner-border text-primary"></div>
            <p>Cargando alertas sociales...</p>
          </div>
        ) : (
          <AlertaTable
            alertas={alertasFiltradas}
            adultos={adultos}
            onEditar={abrirEdicion}
            onEliminar={eliminarRegistro}
          />
        )}
      </div>

      {mostrarFormulario && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal custom-modal-large">
            <div className="custom-modal-header">
              <div>
                <h2>
                  {alertaEditar
                    ? "Editar alerta social"
                    : "Registrar alerta social"}
                </h2>

                <p>
                  Completa la información necesaria para realizar el
                  seguimiento del caso.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={cerrarFormulario}
                aria-label="Cerrar"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="custom-modal-body">
            <AlertaForm
              alertaEditar={alertaEditar}
              adultos={adultos}
              voluntarios={voluntarios}
              onGuardar={guardarAlerta}
              onCancelar={cerrarFormulario}
              guardando={guardando}
            />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AlertasPage;