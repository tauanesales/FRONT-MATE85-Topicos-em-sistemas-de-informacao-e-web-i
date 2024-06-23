import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import "./formikStyle.css"

import { FormikInput, Props } from "../FormikInput";

export const FormikPasswordInput = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <FormikInput
      {...props}
      type={showPassword ? "text" : "password"}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className="icon-button-no-outline"  // Adicione esta linha
              aria-label="alterar visibilidade da senha"
              onClick={handleShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};