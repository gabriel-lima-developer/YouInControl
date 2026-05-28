import { apiRequest } from '../../../api/httpClient';
import type {
  CreateShoppingListItemRequest,
  ReorderShoppingListItemsRequest,
  ShoppingListItem,
  UpdateShoppingListItemRequest,
} from '../types/shoppingListTypes';

const shoppingListsPath = '/api/shopping-lists';

function shoppingListItemsPath(shoppingListId: string) {
  return `${shoppingListsPath}/${shoppingListId}/items`;
}

export function getShoppingListItems(shoppingListId: string) {
  return apiRequest<ShoppingListItem[]>(shoppingListItemsPath(shoppingListId));
}

export function getShoppingListItemById(shoppingListId: string, itemId: string) {
  return apiRequest<ShoppingListItem>(`${shoppingListItemsPath(shoppingListId)}/${itemId}`);
}

export function createShoppingListItem(shoppingListId: string, payload: CreateShoppingListItemRequest) {
  return apiRequest<ShoppingListItem>(shoppingListItemsPath(shoppingListId), {
    method: 'POST',
    body: payload,
  });
}

export function updateShoppingListItem(
  shoppingListId: string,
  itemId: string,
  payload: UpdateShoppingListItemRequest,
) {
  return apiRequest<ShoppingListItem>(`${shoppingListItemsPath(shoppingListId)}/${itemId}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteShoppingListItem(shoppingListId: string, itemId: string) {
  return apiRequest<void>(`${shoppingListItemsPath(shoppingListId)}/${itemId}`, {
    method: 'DELETE',
  });
}

export function completeShoppingListItem(shoppingListId: string, itemId: string) {
  return apiRequest<ShoppingListItem>(`${shoppingListItemsPath(shoppingListId)}/${itemId}/complete`, {
    method: 'PATCH',
  });
}

export function uncompleteShoppingListItem(shoppingListId: string, itemId: string) {
  return apiRequest<ShoppingListItem>(`${shoppingListItemsPath(shoppingListId)}/${itemId}/uncomplete`, {
    method: 'PATCH',
  });
}

export function reorderShoppingListItems(shoppingListId: string, payload: ReorderShoppingListItemsRequest) {
  return apiRequest<ShoppingListItem[]>(`${shoppingListItemsPath(shoppingListId)}/reorder`, {
    method: 'PATCH',
    body: payload,
  });
}
