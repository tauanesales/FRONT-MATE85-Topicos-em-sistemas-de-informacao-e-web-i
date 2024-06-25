import React, { useState, useEffect, useRef } from 'react';
import "./styles.css";
import { MdGroupAdd, MdLogout } from 'react-icons/md';
import { BsFillCircleFill } from 'react-icons/bs'; // icone de notificação
import Solicitacoes from '../../components/Solicitacoes/Solicitacoes';
import ButtonSecondary from '@/components/ButtonSecondary';

function PerfilOrientador() {

    const logoPgcop = "/assets/logoPgcop.png";
    const containerRef = useRef(null);

    const alunosData = [
        { id: 1, nome: 'Vini Silva', matricula: '2022001', titulacao: 'Mestrado', datafinal: '03/05/2024' },
        { id: 8, nome: 'Claudio Silva', matricula: '2022001', titulacao: 'Mestrado', datafinal: '03/05/2024' },
        { id: 9, nome: 'Savio Silva', matricula: '2022001', titulacao: 'Mestrado', datafinal: '03/05/2024' },
        { id: 10, nome: 'João Silva', matricula: '2022001', titulacao: 'Mestrado', datafinal: '03/05/2024' },
        { id: 2, nome: 'Tauane Souza', matricula: '2022002', titulacao: 'Doutorado', datafinal: '18/05/2027' },
        { id: 3, nome: 'Mario Souza', matricula: '2022003', titulacao: 'Mestrado', datafinal: '15/05/2024' },
        { id: 4, nome: 'Ana Clara', matricula: '2022004', titulacao: 'Doutorado', datafinal: '03/07/2027' },
        { id: 5, nome: 'Pedro Henrique', matricula: '2022005', titulacao: 'Mestrado', datafinal: '03/012/2025' },
        { id: 6, nome: 'Carlos Eduardo', matricula: '2022006', titulacao: 'Doutorado', datafinal: '03/05/2026' },
        { id: 7, nome: 'Roberta Santos', matricula: '2022007', titulacao: 'Mestrado', datafinal: '03/08/2025' }
    ];

    const [solicitacoes, setSolicitacoes] = useState([
        { id: 1, nome: 'Natalia  Santos Santos Santos', matricula: '2022001', titulacao: 'Mestrado', datafinal: '03/05/2024' },
        { id: 2, nome: 'Claudio Souza', matricula: '2022002', titulacao: 'Doutorado', datafinal: '8/05/2027' },
        { id: 3, nome: 'Vinicius Alves', matricula: '2022003', titulacao: 'Mestrado', datafinal: '15/05/2024' },
    ]);

    const [alunos, setAlunos] = useState(alunosData);
    const [showModal, setShowModal] = useState(false);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [showSolicitacoes, setShowSolicitacoes] = useState(false);

    const handleDoubleClick = (matricula) => {
        const aluno = alunos.find(aluno => aluno.matricula === matricula);
        if (aluno) {
            window.open(`/perfil-aluno`);
        }
    };

    const handleDelete = () => {
        const updatedAlunos = alunos.filter(aluno => aluno.id !== selectedAluno.id);
        setAlunos(updatedAlunos);
        setShowModal(false);
        setSelectedAluno(null);
    };

    const handleSolicitacoesClick = () => {
        setShowSolicitacoes(!showSolicitacoes);
    };

    const handleAcceptRequest = (id) => {
        const solicitationToAccept = solicitacoes.find(solicitacao => solicitacao.id === id);
        setAlunos([...alunos, solicitationToAccept]);
        const updatedSolicitacoes = solicitacoes.filter(solicitacao => solicitacao.id !== id);
        setSolicitacoes(updatedSolicitacoes);
    };

    const handleRemoveRequest = (id) => {
        const updatedSolicitacoes = solicitacoes.filter(solicitacao => solicitacao.id !== id);
        setSolicitacoes(updatedSolicitacoes);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSolicitacoes(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [containerRef]);

    const alunosMestrado = alunos.filter(aluno => aluno.titulacao === 'Mestrado');
    const alunosDoutorado = alunos.filter(aluno => aluno.titulacao === 'Doutorado');

    return (
        <div className='contain'>
            <div className='containerOrientador'>
                <img src={logoPgcop} />
                <div className='infoOrientador' style={{ justifyContent: "space-between" }}>
                    <div>
                        <h2>Augusto Carlos Santos</h2>
                        <h3>Orientandos: {alunos.length}</h3>
                    </div>
                    <div className="botoesToolbar">
                        <div style={{ position: 'relative' }}>
                            <MdGroupAdd 
                                onClick={handleSolicitacoesClick} 
                                style={{ marginRight: "40px", cursor: "pointer", color: solicitacoes.length > 0 ? "red" : "inherit" }}
                                size={35} 
                                title="Solicitações" 
                            />
                            {showSolicitacoes && 
                                <div ref={containerRef} className="solicitacoesContainer">
                                    <Solicitacoes 
                                        solicitacoes={solicitacoes} 
                                        handleAcceptRequest={handleAcceptRequest}
                                        handleRemoveRequest={handleRemoveRequest}
                                    />
                                </div>
                            }
                        </div>
                        <div>
                            <MdLogout 
                                onClick={() => window.location.href = "/"} 
                                style={{ marginRight: "40px", cursor: "pointer" }}
                                size={35} 
                                title="Sair" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '10px' }}>Lista de Orientandos</h2>
            <div className="listaAlunos">
                <div className='containerOrientadorOrientandos'>
                    <ul>
                        <h3 style={{ marginLeft: '20px', marginBottom: '10px', padding: '5px' }}>Alunos de Mestrado</h3>
                        {alunosMestrado.map(aluno => (
                            <li style={{ cursor: 'pointer', padding: '7px 20px' }}
                                key={aluno.id}
                                onDoubleClick={() => handleDoubleClick(aluno.matricula)}>
                                <div>
                                    <strong>{aluno.nome}</strong> Matrícula: {aluno.matricula} <br />
                                    Conclusão prevista em {aluno.datafinal}
                                </div>
                                <div>
                                    <button className='bttn' onClick={() => handleDoubleClick(aluno.matricula)}
                                        style={{ marginRight: '10px', height: '30px', borderRadius: '5px', width: '95px', fontSize: '13px' }}>
                                        Abrir
                                    </button>
                                    <button className='bttn' onClick={() => {
                                        setSelectedAluno(aluno);
                                        setShowModal(true);
                                    }} style={{ marginRight: '10px', height: '30px', borderRadius: '5px', width: '95px', fontSize: '13px' }}>
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='containerOrientadorOrientandos'>
                    <ul>
                        <h3 style={{ marginLeft: '20px', marginBottom: '10px', padding: '5px' }}>Alunos de Doutorado</h3>
                        {alunosDoutorado.map(aluno => (
                            <li style={{ cursor: 'pointer', padding: '7px 20px' }}
                                key={aluno.id}
                                onDoubleClick={() => handleDoubleClick(aluno.matricula)}>
                                <div>
                                    <strong>{aluno.nome}</strong> Matrícula: {aluno.matricula} <br />
                                    Conclusão prevista em {aluno.datafinal}
                                </div>
                                <div>
                                    <button className='bttn' onClick={() => handleDoubleClick(aluno.matricula)}
                                        style={{ marginRight: '10px', height: '30px', borderRadius: '5px', width: '95px', fontSize: '13px' }}>
                                        Abrir
                                    </button>
                                    <button className='bttn' onClick={() => {
                                        setSelectedAluno(aluno);
                                        setShowModal(true);
                                    }} style={{ marginRight: '10px', height: '30px', borderRadius: '5px', width: '95px', fontSize: '13px' }}>
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {showModal && (
                <div className='confirmationBox'>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        width: '300px',
                        textAlign: 'center',
                    }}>
                        <p>Tem certeza que deseja remover esse aluno da sua lista?</p>
                        <ul style={{ display: 'flex' }}>
                            <button className='bttn' onClick={handleDelete} style={{ marginRight: '30px', padding: "10px" }}>Sim</button>
                            <button className='bttn' onClick={() => setShowModal(false)} style={{ padding: "10px" }}>Não</button>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerfilOrientador;
