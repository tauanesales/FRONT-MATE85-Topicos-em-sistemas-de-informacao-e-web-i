import "./styles.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonSecondary from "@/components/ButtonSecondary";
import InputPassword from "@/components/InputPassword";
import { useUserQueries } from "@/queries/user";

import Input from "../../components/Input";

const Login = () => {
  const navigate = useNavigate();

  const logoPgcop = "assets/logoPgcop.png";
  const imagemBarra = "assets/salvador.png";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { useAuthUser, fetchUser } = useUserQueries();

  const { mutate: authenticate, isPending: isAuthenticating } = useAuthUser();

  const handleSignIn = () =>
    authenticate(
      { username: email, password },
      {
        onSuccess: async (tokens) => {
          const user = await fetchUser(tokens.accessToken);

          const pathOptions: { [key: string]: string } = {
            aluno: "/perfil-aluno",
            professor: "/perfil-professor",
          };

          const path =
            (user.tipo_usuario != "COORDENADOR" && pathOptions) ||
            "/perfil-coordenador";

          navigate(path, { replace: true });
        },
      },
    );

  const disabled = !email || !password;

  return (
    <div className="containerLogin">
      <div className="containerCardImagem">
        <div className="cardLogin">
          {/* Logo*/}
          <img src={logoPgcop} width={130} />

          <h1>Bem vindo de volta ao PGCop</h1>
          <div className="inputs">
            {/* Campo Email */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Campo Senha */}
            <InputPassword
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="conectado" style={{ marginTop: "1em" }}>
              <input type="checkbox" name="conectado" id="conectado" />
              <label htmlFor="conectado">Matenha-me conectado</label>
            </div>

            {/* Botão Login */}
            <ButtonSecondary
              disabled={disabled || isAuthenticating}
              onClick={handleSignIn}
              label={isAuthenticating ? "Carregando..." : "Entrar"}
              style={{ width: "90%" }}
            />
          </div>

          {/* Links Cadastro e Recuperação de senha */}
          <div className="links">
            <a href="/cadastro-aluno" className="text">
              Cadastre-se
            </a>

            <p className="text">
              Esqueceu a senha? Clique
              <a href="/esqueci-senha"> aqui.</a>
            </p>
          </div>
        </div>
        <img
          src={imagemBarra}
          className="imagemLogin"
          alt="Imagem do Forte de Santa Maria - Salvador/BA"
        />
      </div>
    </div>
  );
};

export default Login;
