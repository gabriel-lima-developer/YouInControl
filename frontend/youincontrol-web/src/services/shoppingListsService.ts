import { apiRequest } from '../api/httpClient';
import type {
  CreateShoppingListItemRequest,
  CreateShoppingListRequest,
  ShoppingListDetail,
  ShoppingListItem,
  ShoppingListSummary,
} from '../types/shoppingList';

const shoppingListsPath = '/api/shopping-lists';

export function getShoppingLists() {
  return apiRequest<ShoppingListSummary[]>(shoppingListsPath);
}

export function getShoppingListById(id: string) {
  return apiRequest<ShoppingListDetail>(`${shoppingListsPath}/${id}`);
}

export function createShoppingList(payload: CreateShoppingListRequest) {
  return apiRequest<ShoppingListSummary>(shoppingListsPath, {
    method: 'POST',
    body: payload,
  });
}

export function createShoppingListItem(listId: string, payload: CreateShoppingListItemRequest) {
  return apiRequest<ShoppingListItem>(`${shoppingListsPath}/${listId}/items`, {
    method: 'POST',
    body: payload,
  });
}

export function completeShoppingListItem(listId: string, itemId: string) {
  return apiRequest<ShoppingListItem>(`${shoppingListsPath}/${listId}/items/${itemId}/complete`, {
    method: 'PATCH',
  });
}

export function uncompleteShoppingListItem(listId: string, itemId: string) {
  return apiRequest<ShoppingListItem>(`${shoppingListsPath}/${listId}/items/${itemId}/uncomplete`, {
    method: 'PATCH',
  });
}

export function deleteShoppingListItem(listId: string, itemId: string) {
  return apiRequest<void>(`${shoppingListsPath}/${listId}/items/${itemId}`, {
    method: 'DELETE',
  });
}
