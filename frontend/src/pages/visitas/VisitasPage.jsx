import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import VisitaForm from "../../components/visitas/VisitaForm";
import VisitaTable from "../../components/visitas/VisitaTable";

import { obtenerAdultosMayores } from "../../services/adultoMayorService";
import { obtenerVoluntarios } from "../../services/voluntarioService";

import {
  actualizarVisita,
  crearVisita,
  eliminarVisita,
  obtenerVisitas,
} from "../../services/visitaService";

function VisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [adultos, setAdultos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [visitaEditar, setVisitaEditar] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [datosVisitas, datosAdultos, datosVoluntarios] =
        await Promise.all([
          obtenerVisitas(),
          obtenerAdultosMayores(),
          obtenerVoluntarios(),
        ]);

      setVisitas(datosVisitas);
      setAdultos(datosAdultos);
      setVoluntarios(datosVoluntarios);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudieron cargar las visitas sociales.",
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

    return adulto
      ? `${adulto.nombres} ${adulto.apellidos}`.toLowerCase()
      : "";
  };

  const obtenerNombreVoluntario = (voluntarioId) => {
    const voluntario = voluntarios.find(
      (item) => String(item.id) === String(voluntarioId),
    );

    return voluntario
      ? `${voluntario.nombres} ${voluntario.apellidos}`.toLowerCase()
      : "";
  };

  const visitasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return visitas
      .filter((visita) => {
        const coincideBusqueda =
          !texto ||
          obtenerNombreAdulto(visita.adultoMayorId).includes(texto) ||
          obtenerNombreVoluntario(visita.voluntarioId).includes(texto) ||
          visita.motivo?.toLowerCase().includes(texto) ||
          visita.estado?.toLowerCase().includes(texto);

        const coincideEstado =
          !filtroEstado || visita.estado === filtroEstado;

        return coincideBusqueda && coincideEstado;
      })
      .sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora || "00:00"}`);
        const fechaB = new Date(`${b.fecha}T${b.hora || "00:00"}`);

        return fechaA - fechaB;
      });
  }, [visitas, adultos, voluntarios, busqueda, filtroEstado]);

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

    setVisitaEditar(null);
    setMostrarFormulario(true);
  };

  const abrirEdicion = (visita) => {
    setVisitaEditar(visita);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setVisitaEditar(null);
  };

  const guardarVisita = async (datos) => {
    try {
      setGuardando(true);

      const visitaDuplicada = visitas.some(
        (visita) =>
          String(visita.adultoMayorId) === String(datos.adultoMayorId) &&
          visita.fecha === datos.fecha &&
          visita.hora === datos.hora &&
          visita.id !== visitaEditar?.id,
      );

      if (visitaDuplicada) {
        await Swal.fire({
          icon: "warning",
          title: "Visita duplicada",
          text: "El adulto mayor ya tiene una visita programada en esa fecha y hora.",
        });

        return;
      }

      if (visitaEditar) {
        const actualizada = await actualizarVisita(
          visitaEditar.id,
          datos,
        );

        setVisitas((anteriores) =>
          anteriores.map((visita) =>
            visita.id === visitaEditar.id ? actualizada : visita,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Visita actualizada",
          text: "La información fue modificada correctamente.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        const nueva = await crearVisita(datos);

        setVisitas((anteriores) => [...anteriores, nueva]);

        await Swal.fire({
          icon: "success",
          title: "Visita registrada",
          text: "La visita social fue programada correctamente.",
          timer: 1600,
          showConfirmButton: false,
        });
      }

      cerrarFormulario();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: "Verifica que la API se encuentre funcionando.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarRegistro = async (visita) => {
    const nombreAdulto = obtenerNombreAdulto(
      visita.adultoMayorId,
    );

    const resultado = await Swal.fire({
      icon: "warning",
      title: "Eliminar visita",
      text: `¿Deseas eliminar la visita de ${nombreAdulto || "este adulto mayor"}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      await eliminarVisita(visita.id);

      setVisitas((anteriores) =>
        anteriores.filter((item) => item.id !== visita.id),
      );

      Swal.fire({
        icon: "success",
        title: "Visita eliminada",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "Ocurrió un error al eliminar la visita.",
      });
    }
  };

  return (
    <section className="page-container">
      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">Visitas sociales</h1>

          <p className="page-description">
            Programa y controla las visitas de seguimiento a adultos mayores.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={abrirRegistro}
        >
          <i className="bi bi-calendar-plus-fill me-2"></i>
          Programar visita
        </button>
      </div>

      <div className="content-card">
        <div className="visit-toolbar">
          <div className="adult-search visit-search">
            <i className="bi bi-search"></i>

            <input
              type="search"
              className="form-control"
              placeholder="Buscar por adulto, voluntario, motivo o estado"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <select
            className="form-select visit-status-filter"
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Programada">Programada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <span className="adult-count">
            {visitasFiltradas.length} visitas
          </span>
        </div>

        {cargando ? (
          <div className="loading-state">
            <div className="spinner-border text-primary"></div>
            <p>Cargando visitas sociales...</p>
          </div>
        ) : (
          <VisitaTable
            visitas={visitasFiltradas}
            adultos={adultos}
            voluntarios={voluntarios}
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
                  {visitaEditar
                    ? "Editar visita social"
                    : "Programar visita social"}
                </h2>

                <p>
                  Selecciona al adulto mayor, voluntario y fecha de atención.
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
              <VisitaForm
                visitaEditar={visitaEditar}
                adultos={adultos}
                voluntarios={voluntarios}
                onGuardar={guardarVisita}
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

export default VisitasPage;