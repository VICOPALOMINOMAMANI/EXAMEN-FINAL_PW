import { useEffect, useState } from "react";

const formularioInicial = {
  adultoMayorId: "",
  titulo: "",
  descripcion: "",
  nivel: "Medio",
  fechaRegistro: new Date().toISOString().split("T")[0],
  responsable: "",
  estado: "Pendiente",
};

function AlertaForm({
  alertaEditar,
  adultos,
  voluntarios,
  onGuardar,
  onCancelar,
  guardando,
}) {
  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    if (alertaEditar) {
      setFormulario({
        adultoMayorId: String(alertaEditar.adultoMayorId ?? ""),
        titulo: alertaEditar.titulo ?? "",
        descripcion: alertaEditar.descripcion ?? "",
        nivel: alertaEditar.nivel ?? "Medio",
        fechaRegistro:
          alertaEditar.fechaRegistro ??
          new Date().toISOString().split("T")[0],
        responsable: alertaEditar.responsable ?? "",
        estado: alertaEditar.estado ?? "Pendiente",
      });
    } else {
      setFormulario({
        ...formularioInicial,
        fechaRegistro: new Date().toISOString().split("T")[0],
      });
    }
  }, [alertaEditar]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onGuardar(formulario);
  };

  const voluntariosActivos = voluntarios.filter(
    (voluntario) => voluntario.estado === "Activo",
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Adulto mayor</label>

          <select
            className="form-select"
            name="adultoMayorId"
            value={formulario.adultoMayorId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un adulto mayor</option>

            {adultos.map((adulto) => (
              <option key={adulto.id} value={adulto.id}>
                {adulto.nombres} {adulto.apellidos} - DNI {adulto.dni}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Título</label>

          <input
            type="text"
            className="form-control"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            placeholder="Ejemplo: Falta de medicamentos"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Descripción</label>

          <textarea
            className="form-control"
            rows="4"
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Describe la situación detectada"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Nivel</label>

          <select
            className="form-select"
            name="nivel"
            value={formulario.nivel}
            onChange={handleChange}
            required
          >
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Responsable</label>

          <select
            className="form-select"
            name="responsable"
            value={formulario.responsable}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un voluntario</option>

            {voluntariosActivos.map((voluntario) => {
              const nombreCompleto =
                `${voluntario.nombres} ${voluntario.apellidos}`;

              return (
                <option key={voluntario.id} value={nombreCompleto}>
                  {nombreCompleto}
                </option>
              );
            })}
          </select>

          {voluntariosActivos.length === 0 && (
            <small className="text-danger">
              No existen voluntarios activos.
            </small>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">Estado</label>

          <select
            className="form-select"
            name="estado"
            value={formulario.estado}
            onChange={handleChange}
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En atención">En atención</option>
            <option value="Resuelta">Resuelta</option>
            <option value="Archivada">Archivada</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha de registro</label>

          <input
            type="date"
            className="form-control"
            name="fechaRegistro"
            value={formulario.fechaRegistro}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando || voluntariosActivos.length === 0}
        >
          {guardando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>
              Guardar alerta
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default AlertaForm;