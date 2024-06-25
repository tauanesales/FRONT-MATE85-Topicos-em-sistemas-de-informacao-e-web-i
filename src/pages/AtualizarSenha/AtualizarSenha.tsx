import "./styles.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikPasswordInput } from "@/components/FormikPasswordInput";

const logoPgcop = "/assets/logoPgcop.png";


function AtualizarSenha() {

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, ({ min }) => `A senha deve ter no mínimo ${min} caracteres`)
      .required("Insira uma senha"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Senhas não coincidem")
      .required("Insira a senha novamente"),
  });

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form className="containerPrincipal">
          <img src={logoPgcop} width={110} />

          <div style={{ display: "flex"}}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormikPasswordInput
                name="password"
                label="Nova senha"
                fullWidth
                required
              />
              <FormikPasswordInput
                name="confirmPassword"
                label="Confirmar senha"
                fullWidth
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              
            </div>
          </div>

          <div className="buttonCadastro">
            <LoadingButton 
              sx={{
                marginTop: 2,
                color: '#000000',
                fontSize:13,
                fontWeight:550,
                backgroundColor: '#D6DDE2', // cinza claro
                '&:hover': {
                  backgroundColor: '#E9EAEC', // cor cinza um pouco mais escura ao passar o mouse
                }
              }}
              variant="contained"
              fullWidth
              loading={isSubmitting}
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
            >
              Atualizar senha
            </LoadingButton>
         </div>
        </Form>
      )}
    </Formik>
  );
}

export default AtualizarSenha;