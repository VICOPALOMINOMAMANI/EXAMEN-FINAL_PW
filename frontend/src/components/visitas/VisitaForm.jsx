import { useEffect, useState } from "react";

const formularioInicial = {
  adultoMayorId: "",
  voluntarioId: "",
  fecha: "",
  hora: "",
  motivo: "",
  observaciones: "",
  estado: "Pendiente",
};

function VisitaForm({
  visitaEditar,
  adultos,
  voluntarios,
  onGuardar,
  onCancelar,
  guardando,
}) {
  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    if (visitaEditar) {
      setFormulario({
        adultoMayorId: String(visitaEditar.adultoMayorId ?? ""),
        voluntarioId: String(visitaEditar.voluntarioId ?? ""),
        fecha: visitaEditar.fecha ?? "",
        hora: visitaEditar.hora ?? "",
        motivo: visitaEditar.motivo ?? "",
        observaciones: visitaEditar.observaciones ?? "",
        estado: visitaEditar.estado ?? "Pendiente",
      });
    } else {
      setFormulario(formularioInicial);
    }
  }, [visitaEditar]);

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

  const fechaActual = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Adulto mayor</label>

          <select
            name="adultoMayorId"
            className="form-select"
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

        <div className="col-md-6">
          <label className="form-label">Voluntario responsable</label>

          <select
            name="voluntarioId"
            className="form-select"
            value={formulario.voluntarioId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un voluntario</option>

            {voluntarios
              .filter((voluntario) => voluntario.estado === "Activo")
              .map((voluntario) => (
                <option key={voluntario.id} value={voluntario.id}>
                  {voluntario.nombres} {voluntario.apellidos}
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha</label>

          <input
            type="date"
            name="fecha"
            className="form-control"
            value={formulario.fecha}
            onChange={handleChange}
            min={visitaEditar ? undefined : fechaActual}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Hora</label>

          <input
            type="time"
            name="hora"
            className="form-control"
            value={formulario.hora}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Estado</label>

          <select
            name="estado"
            className="form-select"
            value={formulario.estado}
            onChange={handleChange}
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Programada">Programada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Motivo de la visita</label>

          <input
            type="text"
            name="motivo"
            className="form-control"
            value={formulario.motivo}
            onChange={handleChange}
            placeholder="Ejemplo: Seguimiento médico"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Observaciones</label>

          <textarea
            name="observaciones"
            className="form-control"
            value={formulario.observaciones}
            onChange={handleChange}
            rows="4"
            placeholder="Describe las actividades o consideraciones de la visita"
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
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>
              Guardar visita
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default VisitaForm;