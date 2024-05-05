import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { resetAllStores } from "@/store/helpers";
import { useTokensStore } from "@/store/tokens";

import * as userApi from "../services/api/user";

export const useUserQueries = () => {
  const queryClient = useQueryClient();

  const { saveTokens } = useTokensStore();

  const navigate = useNavigate();

  const location = useLocation();

  const useGetUser = (enabled?: boolean) =>
    useQuery({
      queryKey: ["user"],
      queryFn: () => userApi.getUser().then((response) => response.data),
      enabled,
    });

  const useAuthUser = () =>
    useMutation({
      mutationFn: userApi.authenticateUser,
      onSuccess: async (tokens, variables) => {
        const user = await queryClient.fetchQuery({
          queryKey: ["user"],
          queryFn: () =>
            userApi
              .getUserByEmail(variables.username, tokens.accessToken)
              .then((response) => response.data),
        });

        saveTokens(tokens);

        const from =
          location.state?.from?.pathname || user.Role === "aluno"
            ? "/perfil-aluno"
            : user.Role === "professor"
              ? "/perfil-professor"
              : "/perfil-coordenador";

        navigate(from, { replace: true });
      },
    });

  const useCreateUser = () =>
    useMutation({
      mutationFn: userApi.createUser,
    });

  const signOut = () => {
    resetAllStores();
    queryClient.clear();
  };

  return {
    useGetUser,
    useAuthUser,
    useCreateUser,
    signOut,
  };
};