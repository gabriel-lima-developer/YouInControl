import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createShoppingList,
  deleteShoppingList,
  getShoppingListById,
  getShoppingLists,
  updateShoppingList,
} from '../services/shoppingListsService';
import type { CreateShoppingListRequest, UpdateShoppingListRequest } from '../types/shoppingListTypes';
import { shoppingListKeys } from './queryKeys';

export function useShoppingListsQuery() {
  return useQuery({
    queryKey: shoppingListKeys.all,
    queryFn: getShoppingLists,
  });
}

export function useShoppingListQuery(id: string) {
  return useQuery({
    queryKey: shoppingListKeys.detail(id),
    queryFn: () => getShoppingListById(id),
    enabled: Boolean(id),
  });
}

export function useCreateShoppingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShoppingListRequest) => createShoppingList(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
    },
  });
}

export function useUpdateShoppingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShoppingListRequest }) =>
      updateShoppingList(id, payload),
    onSuccess: (list) => {
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(list.id) });
    },
  });
}

export function useDeleteShoppingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShoppingList(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
    },
  });
}
