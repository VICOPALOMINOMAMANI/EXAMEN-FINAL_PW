import { useEffect, useState } from "react";

const formularioInicial = {
  nombres: "",
  apellidos: "",
  dni: "",
  correo: "",
  telefono: "",
  distrito: "",
  disponibilidad: "",
  especialidad: "",
  estado: "Activo",
};

function VoluntarioForm({
  voluntarioEditar,
  onGuardar,
  onCancelar,
  guardando,
}) {
  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    if (voluntarioEditar) {
      setFormulario(voluntarioEditar);
    } else {
      setFormulario(formularioInicial);
    }
  }, [voluntarioEditar]);

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombres</label>

          <input
            type="text"
            name="nombres"
            className="form-control"
            value={formulario.nombres}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Apellidos</label>

          <input
            type="text"
            name="apellidos"
            className="form-control"
            value={formulario.apellidos}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">DNI</label>

          <input
            type="text"
            name="dni"
            className="form-control"
            value={formulario.dni}
            onChange={handleChange}
            maxLength="8"
            pattern="[0-9]{8}"
            title="El DNI debe contener 8 números"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Teléfono</label>

          <input
            type="text"
            name="telefono"
            className="form-control"
            value={formulario.telefono}
            onChange={handleChange}
            maxLength="9"
            pattern="[0-9]{9}"
            title="El teléfono debe contener 9 números"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Distrito</label>

          <select
            name="distrito"
            className="form-select"
            value={formulario.distrito}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Cusco">Cusco</option>
            <option value="Wanchaq">Wanchaq</option>
            <option value="Santiago">Santiago</option>
            <option value="San Sebastián">San Sebastián</option>
            <option value="San Jerónimo">San Jerónimo</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Correo electrónico</label>

          <input
            type="email"
            name="correo"
            className="form-control"
            value={formulario.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Disponibilidad</label>

          <select
            name="disponibilidad"
            className="form-select"
            value={formulario.disponibilidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Mañanas">Mañanas</option>
            <option value="Tardes">Tardes</option>
            <option value="Noches">Noches</option>
            <option value="Fines de semana">Fines de semana</option>
            <option value="Tiempo completo">Tiempo completo</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Especialidad o apoyo</label>

          <input
            type="text"
            name="especialidad"
            className="form-control"
            value={formulario.especialidad}
            onChange={handleChange}
            placeholder="Ejemplo: Primeros auxilios"
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
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
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
              Guardar
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default VoluntarioForm;