import { useEffect, useState } from "react";

const initialForm = {
  nombres: "",
  apellidos: "",
  dni: "",
  fechaNacimiento: "",
  sexo: "",
  telefono: "",
  direccion: "",
  distrito: "",
  contactoFamiliar: "",
  telefonoFamiliar: "",
  estadoSalud: "",
  nivelVulnerabilidad: "Bajo",
  necesidades: "",
  observaciones: "",
  estado: "Activo",
};

function AdultoForm({ adultoEditar, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (adultoEditar) {
      setForm(adultoEditar);
    } else {
      setForm(initialForm);
    }
  }, [adultoEditar]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onGuardar(form);
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
            value={form.nombres}
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
            value={form.apellidos}
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
            value={form.dni}
            onChange={handleChange}
            maxLength="8"
            pattern="[0-9]{8}"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            className="form-control"
            value={form.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Sexo</label>
          <select
            name="sexo"
            className="form-select"
            value={form.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            value={form.telefono}
            onChange={handleChange}
            maxLength="9"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Distrito</label>
          <select
            name="distrito"
            className="form-select"
            value={form.distrito}
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

        <div className="col-md-4">
          <label className="form-label">Vulnerabilidad</label>
          <select
            name="nivelVulnerabilidad"
            className="form-select"
            value={form.nivelVulnerabilidad}
            onChange={handleChange}
            required
          >
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Contacto familiar</label>
          <input
            type="text"
            name="contactoFamiliar"
            className="form-control"
            value={form.contactoFamiliar}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Teléfono del familiar</label>
          <input
            type="text"
            name="telefonoFamiliar"
            className="form-control"
            value={form.telefonoFamiliar}
            onChange={handleChange}
            maxLength="9"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Estado de salud</label>
          <textarea
            name="estadoSalud"
            className="form-control"
            value={form.estadoSalud}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Necesidades</label>
          <textarea
            name="necesidades"
            className="form-control"
            value={form.necesidades}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            value={form.observaciones}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            className="form-select"
            value={form.estado}
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

export default AdultoForm;