import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import VoluntarioForm from "../../components/voluntarios/VoluntarioForm";
import VoluntarioTable from "../../components/voluntarios/VoluntarioTable";

import {
  actualizarVoluntario,
  crearVoluntario,
  eliminarVoluntario,
  obtenerVoluntarios,
} from "../../services/voluntarioService";

function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [voluntarioEditar, setVoluntarioEditar] = useState(null);

  const cargarVoluntarios = async () => {
    try {
      setCargando(true);

      const datos = await obtenerVoluntarios();
      setVoluntarios(datos);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los voluntarios.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVoluntarios();
  }, []);

  const voluntariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) {
      return voluntarios;
    }

    return voluntarios.filter((voluntario) => {
      const nombreCompleto =
        `${voluntario.nombres} ${voluntario.apellidos}`.toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        voluntario.dni?.includes(texto) ||
        voluntario.correo?.toLowerCase().includes(texto) ||
        voluntario.distrito?.toLowerCase().includes(texto) ||
        voluntario.especialidad?.toLowerCase().includes(texto)
      );
    });
  }, [voluntarios, busqueda]);

  const abrirRegistro = () => {
    setVoluntarioEditar(null);
    setMostrarFormulario(true);
  };

  const abrirEdicion = (voluntario) => {
    setVoluntarioEditar(voluntario);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setVoluntarioEditar(null);
  };

  const guardarVoluntario = async (datos) => {
    try {
      setGuardando(true);

      const dniDuplicado = voluntarios.some(
        (voluntario) =>
          voluntario.dni === datos.dni &&
          voluntario.id !== voluntarioEditar?.id,
      );

      if (dniDuplicado) {
        await Swal.fire({
          icon: "warning",
          title: "DNI duplicado",
          text: "Ya existe un voluntario registrado con ese DNI.",
        });

        return;
      }

      const correoDuplicado = voluntarios.some(
        (voluntario) =>
          voluntario.correo.toLowerCase() === datos.correo.toLowerCase() &&
          voluntario.id !== voluntarioEditar?.id,
      );

      if (correoDuplicado) {
        await Swal.fire({
          icon: "warning",
          title: "Correo duplicado",
          text: "Ya existe un voluntario registrado con ese correo.",
        });

        return;
      }

      if (voluntarioEditar) {
        const actualizado = await actualizarVoluntario(
          voluntarioEditar.id,
          datos,
        );

        setVoluntarios((anteriores) =>
          anteriores.map((voluntario) =>
            voluntario.id === voluntarioEditar.id
              ? actualizado
              : voluntario,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Voluntario actualizado",
          text: "Los datos fueron modificados correctamente.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        const nuevo = await crearVoluntario(datos);

        setVoluntarios((anteriores) => [...anteriores, nuevo]);

        await Swal.fire({
          icon: "success",
          title: "Voluntario registrado",
          text: "El registro fue creado correctamente.",
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

  const eliminarRegistro = async (voluntario) => {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "Eliminar voluntario",
      text: `¿Deseas eliminar a ${voluntario.nombres} ${voluntario.apellidos}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      await eliminarVoluntario(voluntario.id);

      setVoluntarios((anteriores) =>
        anteriores.filter((item) => item.id !== voluntario.id),
      );

      Swal.fire({
        icon: "success",
        title: "Voluntario eliminado",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "Ocurrió un error al eliminar el voluntario.",
      });
    }
  };

  return (
    <section className="page-container">
      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">Voluntarios</h1>

          <p className="page-description">
            Gestión de personas que brindan acompañamiento y apoyo social.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={abrirRegistro}
        >
          <i className="bi bi-person-plus-fill me-2"></i>
          Registrar voluntario
        </button>
      </div>

      <div className="content-card">
        <div className="adult-toolbar">
          <div className="adult-search">
            <i className="bi bi-search"></i>

            <input
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, DNI, correo, distrito o especialidad"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <span className="adult-count">
            {voluntariosFiltrados.length} registros
          </span>
        </div>

        {cargando ? (
          <div className="loading-state">
            <div className="spinner-border text-primary"></div>

            <p>Cargando voluntarios...</p>
          </div>
        ) : (
          <VoluntarioTable
            voluntarios={voluntariosFiltrados}
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
                  {voluntarioEditar
                    ? "Editar voluntario"
                    : "Registrar voluntario"}
                </h2>

                <p>
                  Completa la información de la persona voluntaria.
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
              <VoluntarioForm
                voluntarioEditar={voluntarioEditar}
                onGuardar={guardarVoluntario}
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

export default VoluntariosPage;