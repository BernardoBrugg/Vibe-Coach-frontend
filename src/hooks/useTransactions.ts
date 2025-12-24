import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/api";
import { QUERY_KEYS } from "../constants/queryKeys";
import { Transaction } from "../types";

export const useTransactions = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, userId],
    queryFn: () => getTransactions(userId),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTIONS, userId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTIONS, userId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTIONS, userId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userId] });
    },
  });

  return {
    transactions,
    isLoading,
    error,
    refetch,
    createTransaction: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTransaction: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
