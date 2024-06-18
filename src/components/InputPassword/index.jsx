
import { useState } from 'react';
import './styles.css'
import { Password } from 'primereact/password';
const InputPassword = ({type, onFocus, onBlur, label, id}) => {
  const [value, setValue] = useState('');
  return (

      <div className="containInput">
        <label htmlFor={id} className="label">{label}</label>
        <Password value={value} onChange={(e) => setValue(e.target.value)} 
          toggleMask 
          inputClassName='inputGeral' 
          weakLabel="Fraco" 
          mediumLabel="Médio" 
          strongLabel="Forte"
          feedback={false} 
        />
      </div>
    
  )
}

export default InputPassword;