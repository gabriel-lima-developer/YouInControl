import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeShoppingListItem,
  createShoppingList,
  createShoppingListItem,
  deleteShoppingListItem,
  getShoppingListById,
  getShoppingLists,
  uncompleteShoppingListItem,
} from '../services/shoppingListsService';
import type { CreateShoppingListItemRequest, CreateShoppingListRequest } from '../types/shoppingList';
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

export function useCreateShoppingListItemMutation(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShoppingListItemRequest) => createShoppingListItem(listId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(listId) });
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
    },
  });
}

export function useToggleShoppingListItemMutation(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) =>
      isCompleted ? uncompleteShoppingListItem(listId, itemId) : completeShoppingListItem(listId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(listId) });
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
    },
  });
}

export function useDeleteShoppingListItemMutation(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteShoppingListItem(listId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(listId) });
      void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
    },
  });
}
