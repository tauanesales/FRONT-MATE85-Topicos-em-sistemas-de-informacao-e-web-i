import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Aluno } from "@/models/User";

import * as alunosApi from "../services/api/alunos";

export const useAlunosQueries = () => {
  const queryClient = useQueryClient();

  const useRemoverOrientador = () =>
    useMutation({
      mutationFn: alunosApi.removerOrientador,
      onMutate: async (id) => {
        await queryClient.cancelQueries({
          queryKey: ["orientandos"],
        });

        const previousAlunos = queryClient.getQueryData<Aluno[]>([
          "orientandos",
        ]);

        queryClient.setQueryData<Aluno[]>(
          ["orientandos"],
          (data) => data && data.filter((a) => a.id !== id),
        );

        return { previousAlunos };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(["orientandos"], context?.previousAlunos);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["orientandos"],
        });
      },
    });

  return {
    useRemoverOrientador,
  };
};
