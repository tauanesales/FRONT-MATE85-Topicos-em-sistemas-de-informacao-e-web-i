import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
} from "react-router-dom";

import { TipoUsuario } from "@/models/User";
import { AtualizarDados } from "@/pages/AtualizarDados/AtualizarDados";
import AtualizarSenha from "@/pages/AtualizarSenha/AtualizarSenha";
import CadastroAluno from "@/pages/CadastroAluno/CadastroAluno";
import ConfirmarCadastro from "@/pages/ConfirmarCadastro/ConfirmarCadastro";
import ConfirmarEnvioEmail from "@/pages/ConfirmarEnvioEmail/ConfirmarEnvioEmail";
import ConfirmarNovaSenha from "@/pages/ConfirmarNovaSenha/ConfirmarNovaSenha";
import Error404 from "@/pages/Erro/Error404";
import EsqueciSenha from "@/pages/EsqueciSenha/EsqueciSenha";
import Login from "@/pages/Login/Login";
import PerfilAluno from "@/pages/PerfilAluno/PerfilAluno";
import PerfilCoordenador from "@/pages/PerfilCoordenador/PerfilCoordenador";
import PerfilOrientador from "@/pages/PerfilOrientador/PerfilOrientador";
import Tarefas from "@/pages/Tarefas/Tarefas";
import { AuthenticationGuard } from "@/routes/AuthenticationGuard";

import { PublicRoute } from "./PublicRoute";

const routes = createRoutesFromElements(
  <Route element={<Outlet />}>
    <Route element={<AuthenticationGuard allowedRoles={[TipoUsuario.ALUNO]} />}>
      <Route path="/perfil-aluno" element={<PerfilAluno />} />

      <Route
        path="/perfil-aluno/atualizar-dados"
        element={<AtualizarDados />}
      />
    </Route>

    <Route
      element={<AuthenticationGuard allowedRoles={[TipoUsuario.PROFESSOR]} />}
    >
      <Route path="/perfil-professor" element={<PerfilOrientador />} />
    </Route>

    <Route
      element={<AuthenticationGuard allowedRoles={[TipoUsuario.COORDENADOR]} />}
    >
      <Route path="/perfil-coordenador" element={<PerfilCoordenador />} />
      <Route path="/tarefas" element={<Tarefas />} />
    </Route>

    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
    </Route>

    <Route path="/atualizar-senha" element={<AtualizarSenha />} />
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/cadastro-aluno" element={<CadastroAluno />} />
    <Route path="/confirmar-cadastro" element={<ConfirmarCadastro />} />
    <Route path="/esqueci-senha" element={<EsqueciSenha />} />
    <Route path="/confirmar-envio-email" element={<ConfirmarEnvioEmail />} />
    <Route path="/confirmar-nova-senha" element={<ConfirmarNovaSenha />} />

    <Route path="*" element={<Error404 />} />
  </Route>,
);

export const router = createBrowserRouter(routes);
