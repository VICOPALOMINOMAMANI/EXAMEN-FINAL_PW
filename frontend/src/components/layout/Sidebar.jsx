import { NavLink } from "react-router";

import useAuth from "../../hooks/useAuth";

function Sidebar({ isOpen, closeSidebar }) {
  const { usuario } = useAuth();

  const menuItems = [
    {
      path: "/",
      label: "Panel principal",
      icon: "bi-grid-1x2-fill",
      roles: ["Administrador", "Voluntario"],
    },
    {
      path: "/adultos",
      label: "Adultos mayores",
      icon: "bi-people-fill",
      roles: ["Administrador"],
    },
    {
      path: "/voluntarios",
      label: "Voluntarios",
      icon: "bi-person-heart",
      roles: ["Administrador"],
    },
    {
      path: "/visitas",
      label: "Visitas sociales",
      icon: "bi-calendar-check-fill",
      roles: ["Administrador", "Voluntario"],
    },
    {
      path: "/alertas",
      label: "Alertas",
      icon: "bi-exclamation-triangle-fill",
      roles: ["Administrador", "Voluntario"],
    },
    {
      path: "/reportes",
      label: "Reportes",
      icon: "bi-bar-chart-fill",
      roles: ["Administrador"],
    },
  ];

  const menuPermitido = menuItems.filter((item) =>
    item.roles.includes(usuario?.rol),
  );

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>

          <div>
            <h1>AylluCare</h1>
            <span>Cusco</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MENÚ PRINCIPAL
        </div>

        <nav className="sidebar-menu">
          {menuPermitido.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-help">
            <i className="bi bi-shield-check"></i>

            <div>
              <strong>{usuario?.rol}</strong>

              <span>
                {usuario?.rol === "Administrador"
                  ? "Acceso completo al sistema"
                  : "Seguimiento y atención social"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          role="button"
          tabIndex={0}
          aria-label="Cerrar menú"
        ></div>
      )}
    </>
  );
}

export default Sidebar;