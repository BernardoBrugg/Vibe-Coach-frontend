import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "../services/api";
import { QUERY_KEYS } from "../constants/queryKeys";
import { User } from "../types";

export const useUser = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER, userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userId] });
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
