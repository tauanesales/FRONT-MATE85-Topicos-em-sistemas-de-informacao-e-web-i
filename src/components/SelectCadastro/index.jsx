/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import './styles.css'


const SelectCadastro = () => {
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear()); //Função Atualizar ano
  useEffect(() => {
    setAnoAtual(new Date().getFullYear());
  }, []);
  return (
    <div className="containerData">
      <p id="date">
        Data de Ingresso
      </p>
      <div className="containSelects">
          <select
            className="selectCadastro"
            required
          >
            <option value="">Dia</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          

          <select
            className="selectCadastro"
            required
          >
            <option value="">Mês</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select
            className="selectCadastro"
            required
          >
            <option  value="">Ano</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option  key={anoAtual - i} value={anoAtual - i}>
                {anoAtual - i}
              </option>
            ))}
          </select>
      </div>
    </div>
  )
}

export default SelectCadastro;