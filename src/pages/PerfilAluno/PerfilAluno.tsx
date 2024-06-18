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

  const { useGetProfessores } = useProfessoresQueries();

  const { data: professores = [] } = useGetProfessores();

  const nomeOrientador =
    professores.find((professor) => professor.id === user.orientador_id)
      ?.nome ?? "-";

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
                        type="date"
                        value={dataSelecionada.toLocaleDateString()}
                        onChange={(e) =>
                          setDataSelecionada(new Date(e.target.value))
                        }
                        style={{ marginLeft: "25px" }}
                      />
                      <button
                        onClick={() => salvarDataRealizacao(tarefa)}
                        style={{
                          marginLeft: "25px",
                          width: "70px",
                          height: "25px",
                          borderRadius: "5px",
                          fontSize: "13px",
                        }}
                      >
                        Salvar
                      </button>
                    </label>
                  </>
                )}
                <br></br>
                <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                  {tarefa.descricao}
                  <br></br>
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
          {tarefasFeitas.map((tarefa) => {
            return (
              <div
                id="task"
                key={tarefa.id}
                style={{ backgroundColor: "#ADD8E6" }}
              >
                <AiOutlineFileExcel // Marcador icone
                  onClick={() => handleCheckboxChange(tarefa)}
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
                <br></br>
                <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                  {tarefa.descricao}
                  <br></br>
                </label>
                <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                  Realizada em:{" "}
                  {tarefa.data_conclusao
                    ? new Date(tarefa.data_conclusao).toLocaleDateString()
                    : "-"}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PerfilAluno;
