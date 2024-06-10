import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { resetAllStores } from "@/store/helpers";
import { saveTokens } from "@/store/tokens";

import * as userApi from "../services/api/user";

export const useUserQueries = () => {
  const queryClient = useQueryClient();

  const useGetUser = (enabled: boolean) =>
    useQuery({
      queryKey: ["user"],
      queryFn: () => userApi.getUser().then((response) => response.data),
      enabled,
    });

  const fetchUser = (accessToken: string) =>
    queryClient.fetchQuery({
      queryKey: ["user"],
      queryFn: () =>
        userApi.getUser(accessToken).then((response) => response.data),
    });

  const useAuthUser = () =>
    useMutation({
      mutationFn: userApi.authenticateUser,
      onSuccess: (tokens) => {
        saveTokens(tokens);
      },
    });

  const useCreateAluno = () =>
    useMutation({
      mutationFn: userApi.createAluno,
    });

  const useCreateProfessor = () =>
    useMutation({
      mutationFn: userApi.createProfessor,
    });

  const signOut = () => {
    resetAllStores();
    queryClient.clear();
    navigate("/");
  };

  return {
    useGetUser,
    fetchUser,
    useAuthUser,
    useCreateAluno,
    useCreateProfessor,
    signOut,
  };
};
