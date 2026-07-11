import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { login } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();

  const { setUsuario } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const usuario = await login(correo, password);

      if (!usuario) {
        Swal.fire({
          icon: "error",
          title: "Credenciales incorrectas",
          text: "Verifique su correo y contraseña.",
        });

        return;
      }

      setUsuario(usuario);

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Hola ${usuario.nombre}`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible conectar con la API.",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <i className="bi bi-heart-pulse-fill"></i>

          <h1>AylluCare</h1>

          <p>Cusco</p>
        </div>

        <form onSubmit={iniciarSesion}>

          <div className="mb-3">

            <label className="form-label">
              Correo electrónico
            </label>

            <input
              className="form-control"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

          </div>

          <div className="mb-4">

            <label className="form-label">
              Contraseña
            </label>

            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
          >
            Iniciar sesión
          </button>

        </form>

      </div>
    </div>
  );
}

export default LoginPage;