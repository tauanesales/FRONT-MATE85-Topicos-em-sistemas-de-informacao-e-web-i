import { useState, useEffect, useRef } from "react";
import "./styles.css";
import { MdEditNote, MdLogout } from 'react-icons/md';
import { AiOutlineEdit , AiOutlineFileExcel } from 'react-icons/ai'; 
import * as d3 from "d3"; // Importando D3.js
import D3Visualization from "../../components/D3Visualization"; // Import Vis



function PerfilAluno() {
  
  const logoPgcop = "/assets/logoPgcop.png";
  const flagBlack = "/assets/flagBlack.png";
  const flagGreen = "/assets/flagGreen.png";
  const flagRed = "/assets/flagRed.png";

  // Definição das tarefas
  const [tarefas, setTarefas] = useState([
    { id: 1, nome: "Qualificacao", prazoMeses: 24, descricao: "Apresentação e defesa do projeto de pesquisa.", feita: false },
    { id: 2, nome: "Artigo", prazoMeses: 24, descricao: "Elaborar e submeter um artigo científico.", feita: false },
    { id: 3, nome: "Estágio", prazoMeses: 18, descricao: "Concluir o estágio obrigatório.", feita: false },
    { id: 4, nome: "Defesa", prazoMeses: 24, descricao: "", feita: false },
    { id: 5, nome: "Exame de Proficiência em Língua Estrangeira", prazoMeses: 16, descricao: "Aprovação em exame de proficiência em língua estrangeira.", feita: false },
    { id: 6, nome: "Carga Horária Básica", prazoMeses: 15, descricao: "Cumprir a carga horária mínima de disciplinas obrigatórias.", feita: false },
  ]);

  const idAluno = [
    { id: 1, nome: 'João Silva', matricula: '2022001', titulacao: 'Mestrado', datainicio: '2023-01-01', orientador:'Frederico Durão' },
  ];

    // Definindo as datas de início e atual
    const getData = new Date(idAluno[0].datainicio);
    const dataDeInicio =  new Date(getData.getFullYear(), getData.getMonth(), getData.getDate() +1 );
    //const dataFinal = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + ultimaTarefa.prazoMeses, dataDeInicio.getDate());
    const [dataAtual, setDataAtual] = useState(new Date());
    const [aluno, setAluno] = useState(null); // Estado para armazenar os dados do aluno
    const svgRef = useRef();

        // Definindo a data final com base na titulação do aluno
    const anosDePrazo = idAluno[0].titulacao === 'Mestrado' ? 2 : 4;
    const dataFinal = new Date(dataDeInicio);
    dataFinal.setFullYear(dataFinal.getFullYear() + anosDePrazo);
  

  // Atualiza o estado do aluno assim que o componente é montado
  useEffect(() => {
    setAluno(idAluno[0]); // Define o primeiro aluno da lista
  }, []);

  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);

  const handleCheckboxChange = (id) => {
    const updatedTarefas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        if (tarefa.feita) {
          return { ...tarefa, feita: false, dataRealizacao: null };
        } else {
          setTarefaEmEdicao(id);
          return tarefa;
        }
      }
      return tarefa;
    });
    setTarefas(updatedTarefas);
  };

  const salvarDataRealizacao = (id) => {
    const updatedTarefas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        const dataRealizacao = dataSelecionada || new Date(); // Se dataSelecionada for nula, usa a data atual
        return { ...tarefa, feita: true, dataRealizacao };
      }
      return tarefa;
    });
    setTarefas(updatedTarefas);
    setTarefaEmEdicao(null); // Limpa o estado de tarefa em edição
    setDataSelecionada(null); // Limpa a data selecionada
  };

  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    const prazoA = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + a.prazoMeses, dataDeInicio.getDate());
    const prazoB = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + b.prazoMeses, dataDeInicio.getDate());
    return prazoA - prazoB;
  });

  const tarefasAFazer = tarefasOrdenadas.filter((tarefa) => !tarefa.feita);
  const tarefasFeitas = tarefasOrdenadas.filter((tarefa) => tarefa.feita);

  useEffect(() => {
    const timer = setInterval(() => {
      setDataAtual(new Date());
    }, 86400000); // Atualiza data atual diariamente
    return () => {
      clearInterval(timer);
    };
  }, []);



  return (
    <div className="contain">
        <div className="containerAluno">
        <div className="infoAluno">
          <img src={logoPgcop} alt="Logo" />
          {aluno && ( // Verifica se o aluno foi carregado
            <div className="boxInfoAluno">
              <h3>{aluno.nome}</h3>
              <p><span>Titulação:</span> {aluno.titulacao}</p>
              <p><span>Data de Inicio:</span> {new Date(dataDeInicio).toLocaleDateString()}</p>
              <p><span>Status:</span> Ativo</p>
            </div>
          )}
          <div className="boxInfoAluno">
            <h3><span>Matrícula:</span> {aluno && aluno.matricula}</h3>
            <p><span>Orientador(a): </span>{aluno && aluno.orientador}</p>
            <p><span>Término Previsto:</span> {new Date(dataFinal).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="botoesToolbarAluno">
          <MdEditNote onClick={() => window.location.href = "/perfil-aluno/atualizar-dados"} 
            style={{ cursor: 'pointer', marginRight:"40px" }} 
            size={35} 
            title="Atualizar dados" 
          />
          <MdLogout onClick={() => window.location.href = "/"} 
            style={{ cursor: 'pointer', marginRight:"40px" }} 
            size={35} 
            title="Sair" 
          />
        </div>
      </div>
      {/* Visualização */}
      < D3Visualization 
            dataDeInicio={dataDeInicio} 
            dataFinal={dataFinal} 
            dataAtual={dataAtual} 
            tarefas={tarefas}
          /> 
        {/* Div Mouseover */}
        <div id="tooltip" 
              style={{ display: "none", 
                        position: "fixed", 
                        backgroundColor: "white", 
                        padding: "5px", 
                        border: "1px solid black", 
                        borderEndEndRadius:"15px"
                    }}>
        </div>


        <div className="tarefasAluno">
        <div className="boxTarefas">
          <h3 style={{ textAlign: "center" }}>TAREFAS A FAZER</h3>
          {tarefasAFazer.map((tarefa) => {
            const prazo = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + tarefa.prazoMeses, dataDeInicio.getDate());
            const diasRestantes = Math.ceil((prazo - dataAtual) / (1000 * 60 * 60 * 24));
            let backgroundColor;
            if (diasRestantes <= 90) {
              backgroundColor = "#ff9999"; 
            } else if (diasRestantes <= 180) {
              backgroundColor = "#ffb394";
            } else {
              backgroundColor = "#fff2a7";
            }

            return (
              <div id="task" key={tarefa.id} style={{ backgroundColor: backgroundColor }}>
                <AiOutlineEdit // Marcador icone
                  onClick={() => handleCheckboxChange(tarefa.id)}
                  style={{ cursor: 'pointer', marginLeft: '5px', marginRight: "10px" }}
                  size={20}  
                  title="Editar"
                />
                <label style={{ marginLeft: "5px", fontSize: "18px", fontWeight: "500" }}>
                  {tarefa.nome}
                </label>
                {tarefaEmEdicao === tarefa.id && (
                  <>
                    <br />
                    <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                      Data de realização:
                      <input  className="dateInput"
                        type="date"
                        value={dataSelecionada}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                        style={{ marginLeft: "15px" }}
                      />
                      <button className="bttnSalvar" onClick={() => salvarDataRealizacao(tarefa.id)} 
                        style={{ marginLeft:"12vh", width:'70px', height:'25px' }}>Salvar</button>
                    </label>
                  </>
                )}
                <br />
                <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                  {tarefa.descricao}<br />
                </label>
                <label style={{ marginLeft: "40px", fontSize: "15px" }}> 
                  Data Limite: {prazo.toLocaleDateString()} — {diasRestantes >= 0 ? `${diasRestantes} dias restantes` : "Tarefa em atraso"}.
                </label>
              </div>
            );
          })}
        </div>
        

        <div className="boxTarefas">
          <h3 style={{ textAlign: "center" }}>TAREFAS REALIZADAS</h3>
          {tarefasFeitas.length === 0 ? (
            <p style={{ textAlign: "center", marginTop:"70px",  fontSize: "25px", fontWeight: "600", color: "lightgrey" }}>
              AINDA NÃO HÁ TAREFAS REALIZADAS</p>
          ) : (
            tarefasFeitas.map((tarefa) => {
              const prazo = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + tarefa.prazoMeses, dataDeInicio.getDate());
              return (
                <div id="task" key={tarefa.id} style={{ backgroundColor: "#ADD8E6" }}>
                  <AiOutlineFileExcel // Marcador icone
                    onClick={() => handleCheckboxChange(tarefa.id)}
                    style={{ cursor: 'pointer', marginLeft: "5px" }}
                    size={20} 
                    title="Desfazer"
                  />
                  <label style={{ marginLeft: "15px", fontSize: "18px", fontWeight: "500" }}>
                    {tarefa.nome}
                  </label>
                  <br />
                  <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                    {tarefa.descricao}<br />
                  </label>
                  <label style={{ marginLeft: "40px", fontSize: "15px" }}>
                    Realizada em: {new Date(tarefa.dataRealizacao).toLocaleDateString()}
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