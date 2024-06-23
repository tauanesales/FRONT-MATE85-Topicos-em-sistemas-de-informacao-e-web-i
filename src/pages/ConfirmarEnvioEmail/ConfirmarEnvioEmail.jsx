import "./styles.css";

import { useState } from "react";
import PinInput from "react-pin-input";

import ButtonSecondary from "@/components/ButtonSecondary/index.jsx";

const ConfirmarEnvioEmail = () => {
  const logoPgcop = "assets/logoPgcop.png";
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinChange = (value) => {
    setPin(value);
    if (value.length === 6) {
      // Validação simples, você pode adicionar regras de validação adicionais aqui
      setError("");
    } else {
      setError("O PIN deve ter 6 dígitos.");
    }
  };

  const handleSubmit = () => {
    if (pin.length === 6) {
      // Faça algo com o PIN, como enviar para o servidor
      console.log("PIN:", pin);
    } else {
      setError("O PIN deve ter 6 dígitos.");
    }
  };

  return (
    <div className="container">
      <div className="containerCard gap">
        <img src={logoPgcop} width={120} alt="Logo Pgcop" />
        <h1>Redefinir senha</h1>
        <div>
          <p>Enviamos um Código de confirmação para o e-mail informado.</p>
          <p>
            Por favor, verifique sua caixa de entrada e cole o Código no campo
            abaixo.
          </p>
        </div>
        <div className="pin-input-container">
          <PinInput
            length={6}
            initialValue=""
            onChange={handlePinChange}
            type="numeric"
            inputMode="number"
            style={{ padding: "10px" }}
            inputStyle={{
              borderColor: "gray",
              borderRadius: "8px",
              borderWidth: "2px",
              transition: "border-color 0.3s, border-width 0.3s",
            }}
            inputFocusStyle={{
              borderColor: "black",
              borderWidth: "3px",
            }}
            onComplete={handleSubmit}
            autoSelect={true}
          />
          {error && <p className="error">{error}</p>}
        </div>
        <ButtonSecondary
          link={"/atualizar-senha"}
          label={"Continuar"}
          width={"12em"}
        />
      </div>
    </div>
  );
};

export default ConfirmarEnvioEmail;
