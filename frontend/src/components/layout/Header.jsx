import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

function Header({ openSidebar }) {
  const navigate = useNavigate();

  const { usuario, cerrarSesion } = useAuth();

  const salir = () => {
    Swal.fire({
      title: "Cerrar sesión",
      text: "¿Desea salir del sistema?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarSesion();
        navigate("/login");
      }
    });
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-button"
          onClick={openSidebar}
          aria-label="Abrir menú"
        >
          <i className="bi bi-list"></i>
        </button>

        <div>
          <h2>Bienvenido</h2>
          <p>Sistema de seguimiento social</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notificaciones"
        >
          <i className="bi bi-bell"></i>
          <span className="notification-indicator"></span>
        </button>

        <div className="header-user">
          <div className="user-avatar">
            <i className="bi bi-person-fill"></i>
          </div>

          <div className="user-information">
            <strong>{usuario?.nombre}</strong>
            <span>{usuario?.rol}</span>
          </div>

          <i className="bi bi-chevron-down user-chevron"></i>
        </div>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={salir}
          title="Cerrar sesión"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </header>
  );
}

export default Header;