import "./styles.css";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { MdGroupAdd, MdLogout, MdOutlineLibraryBooks } from "react-icons/md"; // Importando ícones
import { useNavigate } from "react-router-dom";

import Solicitacoes from "@/components/Solicitacoes/Solicitacoes";
import { Status } from "@/models/Solicitacao";
import { Aluno, Professor } from "@/models/User";
import { useAlunosQueries } from "@/queries/alunos";
import { useProfessoresQueries } from "@/queries/professores";
import { useSolicitacoesQueries } from "@/queries/solicitacoes";
import { useUserQueries } from "@/queries/user";

function PerfilCoordenador() {
  const logoPgcop = "/assets/logoPgcop.png";

  const navigate = useNavigate();

  const { signOut, useGetUser } = useUserQueries();

  const { data: userData } = useGetUser();

  const user = userData as Professor;

  const { useGetSolicitacoes, useUpdateSolicitacao } = useSolicitacoesQueries();

  const { data: solicitacoes = [] } = useGetSolicitacoes({
    orientadorId: user.id,
    status: Status.PENDENTE,
  });

  const { mutate: updatedSolicitacao } = useUpdateSolicitacao();

  const handleAcceptRequest = (solicitacaoId: number) =>
    updatedSolicitacao({ solicitacaoId, status: Status.ACEITA });

  const handleRemoveRequest = (solicitacaoId: number) =>
    updatedSolicitacao({ solicitacaoId, status: Status.RECUSADA });

  const { useGetAlunosOrientador } = useProfessoresQueries();

  const { data: alunos = [] } = useGetAlunosOrientador();

  const { useRemoverOrientador } = useAlunosQueries();

  const { mutate: removerOrientador } = useRemoverOrientador();

  const [showModal, setShowModal] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno>();

  const [showSolicitacoes, setShowSolicitacoes] = useState(false);

  useEffect(() => {
    if (solicitacoes.length === 0) {
      setShowSolicitacoes(false);
    }
  }, [solicitacoes.length]);

  const handleDoubleClick = (matricula) => {
    const aluno = alunos.find((aluno) => aluno.matricula === matricula);
    if (aluno) {
      window.open(`/perfil-aluno`);
    }
  };

  const handleDelete = () => {
    removerOrientador(selectedAluno!.id);
    setShowModal(false);
  };

  // Separa os alunos baseados na titulação
  const alunosMestrado = alunos.filter((aluno) => aluno.curso === "M");
  const alunosDoutorado = alunos.filter((aluno) => aluno.curso === "D");

  const handleSolicitacoesClick = () => setShowSolicitacoes(!showSolicitacoes);

  return (
    <div className="contain">
      <div className="containerCoordenador">
        {/* Logo*/}
        <img src={logoPgcop} alt="Logo" />
        {/* Informações do perfil */}
        <div
          className="infoCoordenador"
          style={{ justifyContent: "space-between", marginRight: "30px" }}
        >
          <div>
            <h2>{user?.nome}</h2>
            <h3>Orientandos: {alunos.length}</h3>
          </div>
          {/* Botões Toolbar */}
          <div>
            <div className="botoesToolbar">
              <div style={{ position: "relative" }}>
                <MdGroupAdd
                  onClick={handleSolicitacoesClick}
                  style={{
                    marginRight: "40px",
                    cursor: "pointer",
                    color: solicitacoes.length > 0 ? "red" : "inherit",
                  }}
                  size={35}
                  title="Solicitações"
                />
                {showSolicitacoes && (
                  <div
                    className="solicitacoesContainer"
                    style={{ position: "absolute", top: "-50px" }}
                  >
                    <Solicitacoes
                      solicitacoes={solicitacoes}
                      handleAcceptRequest={handleAcceptRequest}
                      handleRemoveRequest={handleRemoveRequest}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <MdOutlineLibraryBooks
                onClick={() => navigate("/tarefas")}
                style={{ cursor: "pointer", marginRight: "45px" }}
                size={35}
                title="Tarefas"
              />
            </div>
            <div>
              <MdLogout
                onClick={signOut}
                style={{ cursor: "pointer", marginRight: "30px" }}
                size={35}
                title="Sair"
              />
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Lista de Orientandos
      </h2>
      {/* Container de Alunos Orientados - Mestrado */}
      <div className="containerOrientandosCoordenador">
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Alunos de Mestrado
        </h3>
        <ul>
          {alunosMestrado?.map((aluno) => (
            <li
              style={{ cursor: "pointer", padding: "7px 20px" }}
              key={aluno.id}
              onDoubleClick={() => handleDoubleClick(aluno.matricula)}
            >
              <div>
                <strong>{aluno.nome}</strong> - Matrícula: {aluno.matricula}
                <br />
                {aluno.data_defesa
                  ? format(new Date(aluno.data_defesa), "dd/MM/yyyy")
                  : "-"}
              </div>
              <div>
                <button
                  className="bttn"
                  onClick={() => handleDoubleClick(aluno.matricula)}
                  style={{
                    marginRight: "10px",
                    height: "30px",
                    borderRadius: "5px",
                    width: "95px",
                    fontSize: "13px",
                  }}
                >
                  Abrir
                </button>
                <button
                  className="bttn"
                  onClick={() => {
                    setSelectedAluno(aluno);
                    setShowModal(true);
                  }}
                  style={{
                    marginRight: "10px",
                    height: "30px",
                    borderRadius: "5px",
                    width: "95px",
                    fontSize: "13px",
                  }}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Container de Alunos Orientados - Doutorado */}
      <div
        className="containerOrientandosCoordenador"
        style={{ marginTop: "30px" }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Alunos de Doutorado
        </h3>
        <ul>
          {alunosDoutorado?.map((aluno) => (
            <li
              style={{ cursor: "pointer", padding: "7px 20px" }}
              key={aluno.id}
              onDoubleClick={() => handleDoubleClick(aluno.matricula)}
            >
              <div>
                <strong>{aluno.nome}</strong> - Matrícula: {aluno.matricula}
                <br />
                Conclusão prevista em{" "}
                {aluno.data_defesa
                  ? format(new Date(aluno.data_defesa), "dd/MM/yyyy")
                  : "-"}
              </div>
              <div>
                <button
                  className="bttn"
                  onClick={() => handleDoubleClick(aluno.matricula)}
                  style={{
                    marginRight: "10px",
                    height: "30px",
                    borderRadius: "5px",
                    width: "95px",
                    fontSize: "13px",
                  }}
                >
                  Abrir
                </button>
                <button
                  className="bttn"
                  onClick={() => {
                    setSelectedAluno(aluno);
                    setShowModal(true);
                  }}
                  style={{
                    marginRight: "10px",
                    height: "30px",
                    borderRadius: "5px",
                    width: "95px",
                    fontSize: "13px",
                  }}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="confirmationBox">
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <p>Tem certeza que deseja remover esse aluno da sua lista?</p>
            <ul style={{ display: "flex" }}>
              <button
                className="bttn"
                onClick={handleDelete}
                style={{ marginRight: "30px", padding: "10px" }}
              >
                Sim
              </button>
              <button
                className="bttn"
                onClick={() => setShowModal(false)}
                style={{ padding: "10px" }}
              >
                Não
              </button>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilCoordenador;
