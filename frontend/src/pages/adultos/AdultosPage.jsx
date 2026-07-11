import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import AdultoForm from "../../components/adultos/AdultoForm";
import AdultoTable from "../../components/adultos/AdultoTable";

import {
  actualizarAdultoMayor,
  crearAdultoMayor,
  eliminarAdultoMayor,
  obtenerAdultosMayores,
} from "../../services/adultoMayorService";

function AdultosPage() {
  const [adultos, setAdultos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [adultoEditar, setAdultoEditar] = useState(null);

  const cargarAdultos = async () => {
    try {
      setCargando(true);

      const datos = await obtenerAdultosMayores();
      setAdultos(datos);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los adultos mayores.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAdultos();
  }, []);

  const adultosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) {
      return adultos;
    }

    return adultos.filter((adulto) => {
      const nombreCompleto =
        `${adulto.nombres} ${adulto.apellidos}`.toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        adulto.dni?.includes(texto) ||
        adulto.distrito?.toLowerCase().includes(texto) ||
        adulto.nivelVulnerabilidad?.toLowerCase().includes(texto)
      );
    });
  }, [adultos, busqueda]);

  const abrirRegistro = () => {
    setAdultoEditar(null);
    setMostrarFormulario(true);
  };

  const abrirEdicion = (adulto) => {
    setAdultoEditar(adulto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setAdultoEditar(null);
  };

  const guardarAdulto = async (datos) => {
    try {
      setGuardando(true);

      const dniDuplicado = adultos.some(
        (adulto) =>
          adulto.dni === datos.dni && adulto.id !== adultoEditar?.id,
      );

      if (dniDuplicado) {
        await Swal.fire({
          icon: "warning",
          title: "DNI duplicado",
          text: "Ya existe un adulto mayor registrado con ese DNI.",
        });

        return;
      }

      if (adultoEditar) {
        const actualizado = await actualizarAdultoMayor(
          adultoEditar.id,
          datos,
        );

        setAdultos((anteriores) =>
          anteriores.map((adulto) =>
            adulto.id === adultoEditar.id ? actualizado : adulto,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Registro actualizado",
          text: "Los datos fueron modificados correctamente.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        const nuevo = await crearAdultoMayor(datos);

        setAdultos((anteriores) => [...anteriores, nuevo]);

        await Swal.fire({
          icon: "success",
          title: "Registro creado",
          text: "El adulto mayor fue registrado correctamente.",
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

  const eliminarAdulto = async (adulto) => {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "Eliminar registro",
      text: `¿Deseas eliminar a ${adulto.nombres} ${adulto.apellidos}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      await eliminarAdultoMayor(adulto.id);

      setAdultos((anteriores) =>
        anteriores.filter((item) => item.id !== adulto.id),
      );

      Swal.fire({
        icon: "success",
        title: "Registro eliminado",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "Ocurrió un error al eliminar el registro.",
      });
    }
  };

  return (
    <section className="page-container">
      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">Adultos mayores</h1>

          <p className="page-description">
            Registro y seguimiento de personas en situación vulnerable.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={abrirRegistro}
        >
          <i className="bi bi-person-plus-fill me-2"></i>
          Registrar adulto mayor
        </button>
      </div>

      <div className="content-card">
        <div className="adult-toolbar">
          <div className="adult-search">
            <i className="bi bi-search"></i>

            <input
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, DNI, distrito o vulnerabilidad"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <span className="adult-count">
            {adultosFiltrados.length} registros
          </span>
        </div>

        {cargando ? (
          <div className="loading-state">
            <div className="spinner-border text-primary"></div>
            <p>Cargando adultos mayores...</p>
          </div>
        ) : (
          <AdultoTable
            adultos={adultosFiltrados}
            onEditar={abrirEdicion}
            onEliminar={eliminarAdulto}
          />
        )}
      </div>

      {mostrarFormulario && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal custom-modal-large">
            <div className="custom-modal-header">
              <div>
                <h2>
                  {adultoEditar
                    ? "Editar adulto mayor"
                    : "Registrar adulto mayor"}
                </h2>

                <p>
                  Completa la información necesaria para el seguimiento social.
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
              <AdultoForm
                adultoEditar={adultoEditar}
                onGuardar={guardarAdulto}
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

export default AdultosPage;