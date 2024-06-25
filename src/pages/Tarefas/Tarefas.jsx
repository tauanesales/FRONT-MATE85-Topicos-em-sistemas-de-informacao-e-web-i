import React, { useState } from 'react';
import { MdOutlineLibraryAdd, MdArrowBack, MdCreate, MdDelete } from 'react-icons/md'; // Importando os ícones
import "./styles.css";
import Button from "../../components/ButtonPrimary";

function Tarefas(){

    const logoPgcomp = "/assets/logopgcomp.png"; //Logo

    const tarefasData = [
        { id: 1, nome: 'Qualificação', prazo: 13, descricao: 'Apresentação e defesa do projeto de pesquisa.', titulacao: 'Mestrado' },
        { id: 2, nome: 'Carga Horária Básica', prazo: 18, descricao: 'Cumprir a carga horária mínima de disciplinas obrigatórias.', titulacao: 'Mestrado' },
        { id: 3, nome: 'Artigo', prazo: 24, descricao: 'Elaborar e submeter um artigo científico.', titulacao: 'Mestrado' },
        { id: 4, nome: 'Exame de Proficiência em Língua Estrangeira', prazo: 24, descricao: 'Aprovação em exame de proficiência em língua estrangeira.', titulacao: 'Doutorado' },
        { id: 5, nome: 'Estágio', prazo: 18, descricao: 'Concluir o estágio obrigatório.', titulacao: 'Doutorado' }
    ];

    /*Const Att Tarefas */
    const [tarefas, setTarefas] = useState(tarefasData);
    const [showModal, setShowModal] = useState(false);
    const [selectedTarefa, setSelectedTarefa] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTarefaNome, setEditTarefaNome] = useState('');
    const [editTarefaPrazo, setEditTarefaPrazo] = useState(0);
    const [editTarefaDescricao, setEditTarefaDescricao] = useState('');
    const [editTarefaTitulacao, setEditTarefaTitulacao] = useState('Mestrado');
    /* Const Add Tarefas*/
    const [showAddModal, setShowAddModal] = useState(false);
    const [novaTarefaNome, setNovaTarefaNome] = useState('');
    const [novaTarefaPrazo, setNovaTarefaPrazo] = useState(0);
    const [novaTarefaDescricao, setNovaTarefaDescricao] = useState('');
    const [novaTarefaTitulacao, setNovaTarefaTitulacao] = useState('Mestrado');

    const tarefasMestrado = tarefas.filter(tarefa => tarefa.titulacao === 'Mestrado');
    const tarefasDoutorado = tarefas.filter(tarefa => tarefa.titulacao === 'Doutorado');

    const handleDelete = () => {
        const updatedTarefas = tarefas.filter(tarefa => tarefa.id !== selectedTarefa.id);
        setTarefas(updatedTarefas);
        setShowModal(false);
    }

    const handleEdit = () => {
        const updatedTarefas = tarefas.map(tarefa => {
            if (tarefa.id === selectedTarefa.id) {
                return {
                    ...tarefa,
                    nome: editTarefaNome,
                    prazo: editTarefaPrazo,
                    descricao: editTarefaDescricao,
                    titulacao: editTarefaTitulacao
                };
            }
            return tarefa;
        });
        setTarefas(updatedTarefas);
        setIsEditing(false);
        setSelectedTarefa(null);
    }

    const handleAddTarefa = () => {
        const newTarefa = {
            id: tarefas.length + 1,
            nome: novaTarefaNome,
            prazo: novaTarefaPrazo,
            descricao: novaTarefaDescricao,
            titulacao: novaTarefaTitulacao
        };
        setTarefas([...tarefas, newTarefa]);
        setShowAddModal(false);
        setNovaTarefaNome('');
        setNovaTarefaPrazo(0);
        setNovaTarefaDescricao('');
        setNovaTarefaTitulacao('Mestrado');
    }

    return (
        <div className='contain'>
          <div className='botoesTarefas' style={{marginLeft:'1000px'}}>
            {/* Botão Adicionar Tarefa */}
            <MdOutlineLibraryAdd 
              onClick={() => setShowAddModal(true)} 
              style={{ cursor: 'pointer', marginRight: "30px" }}
              size={35} 
              title="Adicionar Tarefa" 
            />
            {/* Botão retornar */}
            <MdArrowBack 
              onClick={() => window.location.href = "/perfil-coordenador"} 
              style={{ cursor: 'pointer', marginRight: "10px" }}
              size={35} 
              title="Voltar" 
            />
          </div>


           
            {/* Container de Tarefas de Mestrado*/}
            <div className="listaTarefas" >
                <div className='containerLista'>
                    <ul className='ultarefas'>
                    <h2 style={{marginTop:"20px", marginBottom:"20px", marginLeft:"20px"}}>Tarefas Mestrado</h2>
                        {tarefasMestrado.map(tarefa => (
                            <li className='litarefas' key={tarefa.id} >
                                {/* Edição das tarefas*/}
                            <div> {isEditing && selectedTarefa.id === tarefa.id ? (<>
                                <label className='labeltarefas'>Nome da Tarefa</label>
                                    <input className="inputContainer"
                                            type="text" 
                                            value={editTarefaNome} 
                                            onChange={(e) => setEditTarefaNome(e.target.value)}
                                            placeholder="Nome da tarefa"
                                            style={{ marginBottom: '10px', width: '29em', padding: '8px' }}/>
                                    <label>Descrição</label>
                                    <textarea 
                                            value={editTarefaDescricao} 
                                            onChange={(e) => setEditTarefaDescricao(e.target.value)}
                                            placeholder="Descrição"
                                            style={{ marginBottom: '10px', width: '100%', padding: '8px', height: '80px' }}/>
                                    <label>Curso</label>
                                    <label>Prazo em meses</label>
                                    <input className="inputContainer"
                                            type="number" 
                                            value={editTarefaPrazo} 
                                            onChange={(e) => setEditTarefaPrazo(Number(e.target.value))}
                                            placeholder="Prazo em meses"
                                            style={{ marginBottom: '10px', width: '60%', padding: '8px' }}/>

                                    <select 
                                            value={editTarefaTitulacao} 
                                            onChange={(e) => setEditTarefaTitulacao(e.target.value)}
                                            style={{ marginBottom: '10px', width: '60%', padding: '8px' }}>
                                        <option value="Mestrado">Mestrado</option>
                                        <option value="Doutorado">Doutorado</option>
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <strong>{tarefa.nome}</strong> Prazo: {tarefa.prazo} meses<br />
                                        Descrição: {tarefa.descricao}
                                    </>
                                )}
                            </div>
                            {/* Ação dos botões e ícones - salvar, editar e deletar*/}
                            <div >
                                {isEditing && selectedTarefa.id === tarefa.id ? (
                                    <button className="bttn" onClick={handleEdit} style={{ width:'100px',height:'35px' }}>
                                        Salvar
                                    </button>
                                ) : (
                                    <>
                                        <MdCreate style={{padding: '10px', cursor: 'pointer'}}
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditTarefaNome(tarefa.nome);
                                                setEditTarefaPrazo(tarefa.prazo);
                                                setEditTarefaDescricao(tarefa.descricao);
                                                setEditTarefaTitulacao(tarefa.titulacao);
                                                setSelectedTarefa(tarefa);
                                            }}  
                                            size={45}
                                        />
                                        <MdDelete style={{cursor: 'pointer',padding:  '10px',}}
                                            onClick={() => {
                                                setSelectedTarefa(tarefa);
                                                setShowModal(true);
                                            }}
                                            size={45}  
                                        />
                                    </>
                                )}
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
  
            

                
                {/*Container de Tarefas de Doutorado */}
                <div className='containerLista'>
                    <ul className='ultarefas'>
                    <h2 style={{marginTop:"20px", marginBottom:"20px", marginLeft:"20px"}}>Tarefas Doutorado</h2>
                        {tarefasDoutorado.map(tarefa => (
                            <li className='litarefas' key={tarefa.id} >
                                {/* Edição das tarefas */}
                                <div> {isEditing && selectedTarefa.id === tarefa.id ? (<>
                                    <label>Nome da Tarefa</label>
                                        <input className="inputContainer"
                                                type="text" 
                                                value={editTarefaNome} 
                                                onChange={(e) => setEditTarefaNome(e.target.value)}
                                                placeholder="Nome da tarefa"
                                                style={{ marginBottom: '10px', width: '29em', padding: '8px' }}/>
                                        <label>Descrição</label>
                                        <textarea 
                                                value={editTarefaDescricao} 
                                                onChange={(e) => setEditTarefaDescricao(e.target.value)}
                                                placeholder="Descrição"
                                                style={{ marginBottom: '10px', width: '100%', padding: '8px', height: '80px' }}/>
                                        <label>Prazo em meses</label>
                                        <input className="inputContainer"
                                                type="number" 
                                                value={editTarefaPrazo} 
                                                onChange={(e) => setEditTarefaPrazo(Number(e.target.value))}
                                                placeholder="Prazo em meses"
                                                style={{ marginBottom: '10px', width: '60%', padding: '8px' }}/>
                                        <label>Curso</label>
                                        <select   
                                                value={editTarefaTitulacao} 
                                                onChange={(e) => setEditTarefaTitulacao(e.target.value)}
                                                style={{ marginBottom: '10px', width: '60%', padding: '8px' }}>
                                            <option value="Mestrado">Mestrado</option>
                                            <option value="Doutorado">Doutorado</option>
                                            </select>
                                        </>
                                    ) : (
                                        <> {/* Exibir em tela*/}
                                            <strong>{tarefa.nome}</strong> Prazo: {tarefa.prazo} meses<br />
                                            Descrição: {tarefa.descricao}
                                        </>
                                    )}
                                </div>
                                {/*Ação dos botões e ícones - salvar, editar e deletar*/}
                                <div >
                                    {isEditing && selectedTarefa.id === tarefa.id ? (
                                        <button className="bttn" onClick={handleEdit}  style={{ width:'100px',height:'35px' }}>Salvar</button>
                                    ) : (
                                        <>
                                            <MdCreate style={{padding: '10px', cursor: 'pointer'}}
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setEditTarefaNome(tarefa.nome);
                                                    setEditTarefaPrazo(tarefa.prazo);
                                                    setEditTarefaDescricao(tarefa.descricao);
                                                    setEditTarefaTitulacao(tarefa.titulacao);
                                                    setSelectedTarefa(tarefa);
                                                }}  
                                                size={45}
                                            />
                                            <MdDelete style={{cursor: 'pointer', padding: '10px',}}
                                                onClick={() => {
                                                    setSelectedTarefa(tarefa);
                                                    setShowModal(true);
                                                }}
                                                size={45}  
                                            />
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

                {/* Modal de Adicionar Tarefa*/}
                {showAddModal && (
                <div className='confirmationBox'>
                    <div className='modalTarefas'style={{backgroundColor: '#fff'}}>
                        <p style={{fontWeight: 'bold', marginBottom:'15px'}}>Adicionar Nova Tarefa</p>
                        <label>Nome da Tarefa</label>
                        <input className="inputContainer"
                            type="text" 
                            value={novaTarefaNome} 
                            onChange={(e) => setNovaTarefaNome(e.target.value)}
                            placeholder="Nome da tarefa"
                            style={{ marginBottom: '10px', width: '100%', padding: '8px' }}/>
                         <label>Descrição</label>
                        <textarea  className="inputContainer"
                            value={novaTarefaDescricao} 
                            onChange={(e) => setNovaTarefaDescricao(e.target.value)}
                            placeholder="Descrição"
                            style={{ marginBottom: '10px', width: '100%', padding: '8px', height: '80px' }}/>
                        <label>Prazo em meses</label>
                        <input className="inputContainer"
                            type="number" 
                            value={novaTarefaPrazo} 
                            onChange={(e) => setNovaTarefaPrazo(Number(e.target.value))}
                            placeholder="Prazo em meses"
                            style={{ marginBottom: '10px', width: '60%', padding: '8px' }}/>
                        <label>Curso</label>
                        <select className="inputContainer"
                            value={novaTarefaTitulacao} 
                            onChange={(e) => setNovaTarefaTitulacao(e.target.value)}
                            style={{ marginBottom: '10px', width: '60%', padding: '8px' }}
                        >
                            <option value="Mestrado">Mestrado</option>
                            <option value="Doutorado">Doutorado</option>
                        </select>
                        <ul style={{display: 'flex'}}>
                            <button className="bttn" onClick={handleAddTarefa} style={{marginRight: '30px',padding: "10px" }}>Adicionar</button>
                            <button className="bttn" onClick={() => setShowAddModal(false)} style={{padding: "10px" }}>Cancelar</button>
                        </ul>
                    </div>
                </div>
            )}

            {/* Modal de confirmação exclusão*/}
            {showModal && (
                <div className='confirmationBox'>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '300px',
                        textAlign: 'center',}}>
                        <p>Tem certeza que deseja remover essa tarefa da lista?</p>
                        <ul style={{display: 'flex'}}>
                            <button className="bttn" onClick={handleDelete} style={{marginRight: '30px',padding: "10px" }}>Sim</button>
                            <button className="bttn" onClick={() => setShowModal(false)} style={{padding: "10px" }}>Não</button>
                        </ul>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Tarefas;