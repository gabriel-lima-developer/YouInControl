import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeShoppingListItem,
  createShoppingListItem,
  deleteShoppingListItem,
  getShoppingListItems,
  reorderShoppingListItems,
  uncompleteShoppingListItem,
  updateShoppingListItem,
} from '../services/shoppingListItemsService';
import type {
  CreateShoppingListItemRequest,
  ReorderShoppingListItemsRequest,
  UpdateShoppingListItemRequest,
} from '../types/shoppingListTypes';
import { shoppingListKeys } from './queryKeys';

function invalidateList(queryClient: ReturnType<typeof useQueryClient>, shoppingListId: string) {
  void queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(shoppingListId) });
  void queryClient.invalidateQueries({ queryKey: shoppingListKeys.items(shoppingListId) });
  void queryClient.invalidateQueries({ queryKey: shoppingListKeys.all });
}

export function useShoppingListItemsQuery(shoppingListId: string) {
  return useQuery({
    queryKey: shoppingListKeys.items(shoppingListId),
    queryFn: () => getShoppingListItems(shoppingListId),
    enabled: Boolean(shoppingListId),
  });
}

export function useCreateShoppingListItemMutation(shoppingListId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShoppingListItemRequest) => createShoppingListItem(shoppingListId, payload),
    onSuccess: () => invalidateList(queryClient, shoppingListId),
  });
}

export function useUpdateShoppingListItemMutation(shoppingListId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateShoppingListItemRequest }) =>
      updateShoppingListItem(shoppingListId, itemId, payload),
    onSuccess: () => invalidateList(queryClient, shoppingListId),
  });
}

export function useToggleShoppingListItemMutation(shoppingListId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) =>
      isCompleted ? uncompleteShoppingListItem(shoppingListId, itemId) : completeShoppingListItem(shoppingListId, itemId),
    onSuccess: () => invalidateList(queryClient, shoppingListId),
  });
}

export function useDeleteShoppingListItemMutation(shoppingListId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteShoppingListItem(shoppingListId, itemId),
    onSuccess: () => invalidateList(queryClient, shoppingListId),
  });
}

export function useReorderShoppingListItemsMutation(shoppingListId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderShoppingListItemsRequest) => reorderShoppingListItems(shoppingListId, payload),
    onSuccess: () => invalidateList(queryClient, shoppingListId),
  });
}
