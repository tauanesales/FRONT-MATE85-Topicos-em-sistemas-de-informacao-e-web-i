import "./styles.css";

import { differenceInDays, format } from "date-fns";
import { useState } from "react";
import { AiOutlineEdit, AiOutlineFileExcel } from "react-icons/ai";
import { MdEditNote, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Tarefa } from "@/models/Tarefa";
import { Aluno, Curso } from "@/models/User";
import { useProfessoresQueries } from "@/queries/professores";
import { useTarefasQueries } from "@/queries/tarefas";
import { useUserQueries } from "@/queries/user";

import D3Visualization from "../../components/D3Visualization"; // Import Vis

function PerfilAluno() {
  const navigate = useNavigate();

  const { signOut } = useUserQueries();

  const { useGetUser } = useUserQueries();

  const { data: userData } = useGetUser();

  const user = userData as Aluno;

  const logoPgcop = "/assets/logoPgcop.png";

  const { useGetTarefaAluno, useUpdateTarefa } = useTarefasQueries();

  const { data: tarefas = [] } = useGetTarefaAluno();

  const { mutate: updateTarefa } = useUpdateTarefa();

  //const dataFinal = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + ultimaTarefa.prazoMeses, dataDeInicio.getDate());
  const [dataAtual, setDataAtual] = useState(new Date());
  const [aluno, setAluno] = useState({
    id: 1,
    nome: "João Silva",
    matricula: "2022001",
    titulacao: "Mestrado",
    datainicio: "2023-01-01",
    orientador: "Frederico Durão",
  }); // Estado para armazenar os dados do aluno

  // Definindo as datas de início e atual
  const getData = new Date(aluno.datainicio);

  const dataDeInicio = new Date(
    getData.getFullYear(),
    getData.getMonth(),
    getData.getDate() + 1,
  );

  // Definindo a data final com base na titulação do aluno
  const anosDePrazo = aluno.titulacao === "Mestrado" ? 2 : 4;
  const dataFinal = new Date(dataDeInicio);
  dataFinal.setFullYear(dataFinal.getFullYear() + anosDePrazo);

  const { useGetProfessores } = useProfessoresQueries();

  const { data: professores = [] } = useGetProfessores();

  const nomeOrientador =
    professores.find((professor) => professor.id === user.orientador_id)
      ?.nome ?? "-";

  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<number | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleCheckboxChange = (tarefa: Tarefa) => {
    const { id, completada } = tarefa;

    if (completada) {
      updateTarefa({ ...tarefa, id, completada: 0, data_conclusao: null });
    } else {
      setTarefaEmEdicao(id);
    }
  };

  const salvarDataRealizacao = (tarefa: Tarefa) => {
    updateTarefa({
      ...tarefa,
      completada: 1,
      data_conclusao: dataSelecionada.toISOString().split("T")[0],
    });

    setTarefaEmEdicao(null); // Limpa o estado de tarefa em edição
    setDataSelecionada(new Date()); // Limpa a data selecionada
  };

  const tarefasAFazer = tarefas.filter((tarefa) => !tarefa.completada);

  const tarefasFeitas = tarefas.filter((tarefa) => tarefa.completada);

  return (
    <div className="contain">
      <div className="containerAluno">
        {user && (
          <div className="infoAluno">
            <img src={logoPgcop} alt="Logo" />
            <div className="boxInfoAluno">
              <h3>{user.nome}</h3>
              <p>
                <span>Titulação:</span> {Curso[user.curso]}
              </p>
              <p>
                <span>Data de Inicio:</span>{" "}
                {user.data_ingresso
                  ? format(user.data_ingresso, "dd/MM/yyyy")
                  : "-"}
              </p>
              <p>
                <span>Status:</span>{" "}
                {tarefasAFazer.length > 0 ? "Ativo" : "Concluído"}
              </p>
            </div>
            <div className="boxInfoAluno">
              <h3>
                <span>Matrícula:</span> {user.matricula}
              </h3>
              <p>
                <span>Orientador(a): </span>
                {nomeOrientador}
              </p>
              <p>
                <span>Término Previsto:</span>{" "}
                {user.data_qualificacao
                  ? format(user.data_qualificacao, "dd/MM/yyyy")
                  : "-"}
              </p>
            </div>
          </div>
        )}

        <div className="botoesToolbar">
          <MdEditNote
            onClick={() => navigate("/perfil-aluno/atualizar-dados")}
            style={{ cursor: "pointer", marginRight: "40px" }}
            size={35}
            title="Atualizar dados"
          />
          <MdLogout
            onClick={signOut}
            style={{ cursor: "pointer", marginRight: "40px" }}
            size={35}
            title="Sair"
          />
        </div>
      </div>

      {/* Visualização */}
      <D3Visualization
        dataDeInicio={dataDeInicio}
        dataFinal={dataFinal}
        dataAtual={dataAtual}
        tarefas={tarefas}
      />
      {/* Div Mouseover */}
      <div
        id="tooltip"
        style={{
          display: "none",
          position: "fixed",
          backgroundColor: "white",
          padding: "5px",
          border: "1px solid black",
          borderEndEndRadius: "15px",
        }}
      ></div>

      <div className="tarefasAluno">
        <div className="boxTarefas">
          <h3 style={{ textAlign: "center" }}>TAREFAS A FAZER</h3>
          {tarefasAFazer.map((tarefa) => {
            const prazo = new Date(tarefa.data_prazo);

            const diferencaDias = differenceInDays(prazo, new Date());

            let backgroundColor;

            if (diferencaDias <= 90) {
              backgroundColor = "#ff9999";
            } else if (diferencaDias <= 180) {
              backgroundColor = "#ffb394";
            } else {
              backgroundColor = "#fff2a7";
            }

            const plural = diferencaDias !== 1 ? "s" : "";

            const statusData =
              diferencaDias === 0
                ? "Hoje"
                : diferencaDias > 0
                  ? `${diferencaDias} dia${plural} restantes`
                  : `A tarefa está atrasada há ${Math.abs(diferencaDias)} dia${plural}`;

            return (
              <div
                id="task"
                key={tarefa.id}
                style={{ backgroundColor: backgroundColor }}
              >
                <AiOutlineEdit // Marcador icone
                  onClick={() => handleCheckboxChange(tarefa)}
                  style={{
                    cursor: "pointer",
                    marginLeft: "5px",
                    marginRight: "10px",
                  }}
                  size={20}
                  title="Editar"
                />
                <label
                  style={{
                    marginLeft: "5px",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  {tarefa.nome}
                </label>
                {tarefaEmEdicao === tarefa.id && (
                  <>
                    <br />
                    <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                      Data de realização:
                      <input
                        className="dateInput"
                        type="date"
                        value={dataSelecionada.toLocaleDateString()}
                        onChange={(e) =>
                          setDataSelecionada(new Date(e.target.value))
                        }
                        style={{ marginLeft: "15px" }}
                      />
                      <button
                        className="bttnSalvar"
                        onClick={() => salvarDataRealizacao(tarefa)}
                        style={{
                          marginLeft: "12vh",
                          width: "70px",
                          height: "25px",
                        }}
                      >
                        Salvar
                      </button>
                    </label>
                  </>
                )}
                <br />
                <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                  {tarefa.descricao}
                  <br />
                </label>
                <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                  Data Limite: {format(prazo, "dd/MM/yyyy")} - {statusData}
                </label>
              </div>
            );
          })}
        </div>

        <div className="boxTarefas">
          <h3 style={{ textAlign: "center" }}>TAREFAS REALIZADAS</h3>
          {tarefasFeitas.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "70px",
                fontSize: "25px",
                fontWeight: "600",
                color: "lightgrey",
              }}
            >
              AINDA NÃO HÁ TAREFAS REALIZADAS
            </p>
          ) : (
            tarefasFeitas.map((tarefa) => {
              return (
                <div
                  id="task"
                  key={tarefa.id}
                  style={{ backgroundColor: "#ADD8E6" }}
                >
                  <AiOutlineFileExcel // Marcador icone
                    onClick={() => handleCheckboxChange(tarefa.id)}
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                    size={20}
                    title="Desfazer"
                  />
                  <label
                    style={{
                      marginLeft: "15px",
                      fontSize: "18px",
                      fontWeight: "500",
                    }}
                  >
                    {tarefa.nome}
                  </label>
                  <br />
                  <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                    {tarefa.descricao}
                    <br />
                  </label>
                  <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                    Realizada em:{" "}
                    {tarefa.data_conclusao
                      ? new Date(tarefa.data_conclusao).toLocaleDateString()
                      : "-"}
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilAluno;
