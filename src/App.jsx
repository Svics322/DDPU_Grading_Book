import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { restoreSession } from "./features/auth/authSlice";
import { loadCoreData } from "./features/data/dataSlice";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PublicCatalogPage } from "./pages/PublicCatalogPage";
import { ResourceFormPage } from "./pages/ResourceFormPage";
import { ResourceListPage } from "./pages/ResourceListPage";
import { TeacherAccessPage } from "./pages/TeacherAccessPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function Guard({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
    dispatch(loadCoreData());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/catalog" element={<PublicCatalogPage />} />
        <Route path="/dashboard" element={<Guard><DashboardPage /></Guard>} />
        <Route path="/my-grades" element={<Guard><ResourceListPage fixedResource="success_rate" /></Guard>} />
        <Route path="/grades" element={<Guard><ResourceListPage fixedResource="success_rate" /></Guard>} />
        <Route path="/grades/new" element={<Guard><ResourceFormPage fixedResource="success_rate" returnPath="/grades" /></Guard>} />
        <Route path="/grades/:id/edit" element={<Guard><ResourceFormPage fixedResource="success_rate" returnPath="/grades" /></Guard>} />
        <Route path="/admin/users" element={<Guard><ResourceListPage fixedResource="profiles" /></Guard>} />
        <Route path="/access" element={<Guard><TeacherAccessPage /></Guard>} />
        <Route path="/:resource" element={<Guard><ResourceListPage /></Guard>} />
        <Route path="/:resource/new" element={<Guard><ResourceFormPage /></Guard>} />
        <Route path="/:resource/:id/edit" element={<Guard><ResourceFormPage /></Guard>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
