import { Aluno } from "@/models/User";

import api from "./config";

export const removerOrientador = (id: number) =>
  api
    .put<Aluno>(`/alunos/${id}/remover-orientador`)
    .then((response) => response.data);
