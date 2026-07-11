import { Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LoginPage from "../pages/auth/LoginPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AdultosPage from "../pages/adultos/AdultosPage";
import VoluntariosPage from "../pages/voluntarios/VoluntariosPage";
import VisitasPage from "../pages/visitas/VisitasPage";
import AlertasPage from "../pages/alertas/AlertasPage";
import ReportesPage from "../pages/reportes/ReportesPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Voluntario"]}>
              <DashboardPage />
            </RoleRoute>
          }
        />

        <Route
          path="/adultos"
          element={
            <RoleRoute rolesPermitidos={["Administrador"]}>
              <AdultosPage />
            </RoleRoute>
          }
        />

        <Route
          path="/voluntarios"
          element={
            <RoleRoute rolesPermitidos={["Administrador"]}>
              <VoluntariosPage />
            </RoleRoute>
          }
        />

        <Route
          path="/visitas"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Voluntario"]}>
              <VisitasPage />
            </RoleRoute>
          }
        />

        <Route
          path="/alertas"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Voluntario"]}>
              <AlertasPage />
            </RoleRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <RoleRoute rolesPermitidos={["Administrador"]}>
              <ReportesPage />
            </RoleRoute>
          }
        />
      </Route>

      <Route
        path="/no-autorizado"
        element={<UnauthorizedPage />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;