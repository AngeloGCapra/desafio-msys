import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Usuarios from './pages/Usuarios';
import EditarUsuario from './pages/EditarUsuario';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/:id/editar" element={<EditarUsuario />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
