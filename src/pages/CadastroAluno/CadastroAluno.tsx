import "./styles.css";

import LoadingButton from "@mui/lab/LoadingButton";
import { FormControlLabel, MenuItem, Radio, RadioGroup } from "@mui/material";
import { unformat, useMask } from "@react-input/mask";
import { Form, Formik, FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { FormikDateField } from "@/components/FormikDateField";
import { FormikInput } from "@/components/FormikInput";
import { FormikPasswordInput } from "@/components/FormikPasswordInput";
import { TipoUsuario } from "@/models/User";
import { useProfessoresQueries } from "@/queries/professores";
import { useUserQueries } from "@/queries/user";
import { Tokens } from "@/store/tokens";

const userTypeRoute = {
  ALUNO: "/perfil-aluno",
  PROFESSOR: "/perfil-professor",
  COORDENADOR: "/perfil-coordenador",
};

type Values = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  matricula: string;
  orientador_id: number | "";
  data_ingresso: Date | null;
  lattes: string;
  curso: "M" | "D" | "";
  senhaConfirmada: string;
  tipo_usuario: TipoUsuario;
};

const cpfMaskOptions = {
  mask: "___.___.___-__",
  replacement: { _: /\d/ },
};

const telefoneMaskOptions = {
  mask: "(__) _____-____",
  replacement: { _: /\d/ },
};

const CadastroAluno = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { useCreateAluno, useCreateProfessor, useAuthUser, fetchUser } =
    useUserQueries();

  const { mutate: authenticateUser } = useAuthUser();

  const { mutate: createAluno } = useCreateAluno();

  const { mutate: createProfessor } = useCreateProfessor();

  const { useGetProfessores } = useProfessoresQueries();

  const { data: professores = [] } = useGetProfessores();

  const handleSignUp = (
    values: Values,
    formikHelpers: FormikHelpers<Values>,
  ) => {
    const {
      cpf,
      telefone,
      matricula,
      orientador_id,
      data_ingresso,
      lattes,
      curso,
      nome,
      email,
      senha,
      tipo_usuario,
    } = values;

    const onSettled = () => formikHelpers.setSubmitting(false);

    const onSuccess = async (tokens: Required<Tokens>) => {
      const user = await fetchUser(tokens.accessToken);

      const from =
        location.state?.from?.pathname || userTypeRoute[user.tipo_usuario];

      navigate(from, { replace: true });
    };

    if (tipo_usuario === TipoUsuario.ALUNO) {
      createAluno(
        {
          nome,
          email,
          senha,
          tipo_usuario,
          orientador_id: orientador_id as number,
          curso: curso as "M" | "D",
          data_ingresso: (data_ingresso as Date).toISOString().split("T")[0],
          data_defesa: null,
          data_qualificacao: null,
          lattes,
          matricula,
          telefone: unformat(telefone, telefoneMaskOptions),
          cpf: unformat(cpf, cpfMaskOptions),
        },
        {
          onSettled,
          onSuccess: (_, variables) =>
            authenticateUser(
              {
                password: variables.senha,
                username: variables.email,
              },
              { onSuccess },
            ),
        },
      );
    } else {
      createProfessor(
        {
          nome,
          email,
          senha,
          tipo_usuario,
        },
        {
          onSettled,
          onSuccess: (_, variables) =>
            authenticateUser(
              {
                password: variables.senha,
                username: variables.email,
              },
              {
                onSuccess,
              },
            ),
        },
      );
    }
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string()
      .matches(/(\w.+\s).+/, "Insira no mínimo 2 nomes")
      .required("Insira seu nome"),
    email: Yup.string()
      .email("Insira um e-mail válido")
      .required("Insira um e-mail"),
    telefone: Yup.string().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) => schema.required("Insira seu telefone"),
    }),
    cpf: Yup.string().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) => schema.required("Insira seu CPF"),
    }),
    lattes: Yup.string().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) =>
        schema.required("Insira o link para seu perfil no Lattes"),
    }),
    matricula: Yup.string().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) => schema.required("Insira o seu número de matrícula"),
    }),
    orientador_id: Yup.string().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) => schema.required("Selecione um orientador"),
    }),
    data_ingresso: Yup.date().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) =>
        schema
          .required("Insira uma data")
          .max(new Date(), "Escolha uma data no passado"),
      otherwise: (schema) => schema.notRequired(),
    }),
    curso: Yup.string().when("tipo_usuario", {
      is: TipoUsuario.ALUNO,
      then: (schema) =>
        schema.required().oneOf(["M", "D"]).required("Selecione uma titulação"),
    }),
    senha: Yup.string()
      .min(8, ({ min }) => `A senha deve ter no mínimo ${min} caracteres`)
      .required("Insira uma senha"),
    senhaConfirmada: Yup.string()
      .oneOf([Yup.ref("senha")], "Senhas não coincidem")
      .required("Insira a senha novamente"),
  });

  const cpfInputRef = useMask(cpfMaskOptions);

  const telefoneInputRef = useMask(telefoneMaskOptions);

  return (
    <Formik
      initialValues={{
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        matricula: "",
        orientador_id: "",
        data_ingresso: null,
        tipo_usuario: TipoUsuario.ALUNO,
        lattes: "",
        curso: "",
        senha: "",
        senhaConfirmada: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSignUp}
    >
      {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
        <Form className="containerPrincipal">
          <img src="assets/logoPgcop.png" width={110} />

          <RadioGroup
            row
            aria-label="tipo-usuario"
            name="tipo-usuario"
            value={values.tipo_usuario}
            onChange={(e) =>
              setFieldValue("tipo_usuario", e.target.value as TipoUsuario)
            }
          >
            <FormControlLabel
              value={TipoUsuario.ALUNO}
              control={<Radio color="primary" />}
              label="Aluno"
            />
            <FormControlLabel
              style={{ marginRight: "400px" }}
              value={TipoUsuario.PROFESSOR}
              control={<Radio color="primary" />}
              label="Professor"
            />
          </RadioGroup>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormikInput
                name="nome"
                label="Nome completo"
                fullWidth
                required
              />

              <FormikInput
                name="email"
                label="E-mail"
                type="email"
                fullWidth
                required
              />

              <FormikInput
                inputRef={cpfInputRef}
                name="cpf"
                label="CPF"
                fullWidth
                required
              />

              <FormikInput
                inputRef={telefoneInputRef}
                name="telefone"
                label="Telefone"
                fullWidth
                required
              />

              <FormikPasswordInput
                name="senha"
                label="Senha"
                fullWidth
                required
              />

              <FormikPasswordInput
                name="senhaConfirmada"
                label="Confirmar senha"
                fullWidth
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {values.tipo_usuario === TipoUsuario.ALUNO ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <FormikInput
                    name="matricula"
                    label="Matrícula"
                    fullWidth
                    required
                  />

                  <FormikInput
                    name="orientador_id"
                    label="Orientador"
                    fullWidth
                    select
                    required
                  >
                    {professores.map((professor) => (
                      <MenuItem key={professor.id} value={professor.id}>
                        {professor.nome}
                      </MenuItem>
                    ))}
                  </FormikInput>

                  <FormikInput
                    fullWidth
                    variant="standard"
                    id="select-curso"
                    name="curso"
                    label="Titulação do curso"
                    select
                    required
                  >
                    <MenuItem value="M">Mestrado</MenuItem>
                    <MenuItem value="D">Doutorado</MenuItem>
                  </FormikInput>

                  <FormikDateField
                    required
                    variant="standard"
                    name="data_ingresso"
                    label="Data de ingresso"
                  />

                  <FormikInput
                    name="lattes"
                    label="Link para o Lattes"
                    fullWidth
                    required
                  />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <FormikInput
                    className="inputRow"
                    style={{ width: "240px" }}
                    fullWidth
                    variant="standard"
                    id="select-tipo-usuario"
                    name="tipo_usuario"
                    label="Função"
                    select
                    required
                  >
                    <MenuItem value={TipoUsuario.PROFESSOR}>
                      Orientador
                    </MenuItem>
                    <MenuItem value={TipoUsuario.COORDENADOR}>
                      Coordenador
                    </MenuItem>
                  </FormikInput>
                </div>
              )}
            </div>
          </div>

          <div className="buttonCadastro">
            <LoadingButton
              className="bttn"
              sx={{ marginTop: 2 }}
              variant="contained"
              fullWidth
              loading={isSubmitting}
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
            >
              Cadastrar
            </LoadingButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CadastroAluno;
