import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

function RoleRoute({ rolesPermitidos, children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}

export default RoleRoute;