import ButtonSecondary from '@/components/ButtonSecondary';
import Button from '../../components/ButtonPrimary';
import Input from '../../components/Input';
import InputPassword from '@/components/InputPassword';
import './styles.css'

const Login = () => {

  const logoPgcop = "assets/logoPgcop.png";
  const imagemBarra = "assets/salvador.png";
  const gamboa = "assets/gamboa.jpg";
  const farol = "assets/farol.jpg"
  const pelourinho = "assets/pelourinho.jpg"
  const barra = "assets/barra.jpg"

  return (
    <div className="containerLogin">
      <div className="containerCardImagem">
        <div className='cardLogin'>
          <img src={logoPgcop} width={130} />

          <h1>Bem vindo de volta ao PGCop</h1>
          <div className="inputs">
            <Input  label={"Matrícula"} type={"email"} />
            <InputPassword label={"Senha"} type={"password"}/>

            <div className='conectado' style={{ marginTop: "1em"}}>
              <input type="checkbox" name="conectado" id="conectado" />
              <label htmlFor="conectado">Matenha-me conectado</label>
            </div>


            <ButtonSecondary link={'/perfil-aluno'} label={"Entrar"} width={"90%"}/>
          </div>

          <div className="links">
            <a
              href="/cadastro-aluno"
            >
              Cadastre-se
            </a>

            <p className='text'>
              Esqueceu a senha? Clique 
              <a
                href="/esqueci-senha"
                > aqui.</a>
            </p>
          </div>
        </div>
        <img  src={imagemBarra} className='imagemLogin'
        alt="Imagem do Forte de Santa Maria - Salvador/BA"
        />
      </div>
    </div>

  );
}

export default Login;
