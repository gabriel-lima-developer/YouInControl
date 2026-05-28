import { apiRequest } from '../../../api/httpClient';
import type {
  CreateShoppingListRequest,
  ShoppingList,
  ShoppingListDetails,
  UpdateShoppingListRequest,
} from '../types/shoppingListTypes';

const shoppingListsPath = '/api/shopping-lists';

export function getShoppingLists() {
  return apiRequest<ShoppingList[]>(shoppingListsPath);
}

export function getShoppingListById(id: string) {
  return apiRequest<ShoppingListDetails>(`${shoppingListsPath}/${id}`);
}

export function createShoppingList(payload: CreateShoppingListRequest) {
  return apiRequest<ShoppingList>(shoppingListsPath, {
    method: 'POST',
    body: payload,
  });
}

export function updateShoppingList(id: string, payload: UpdateShoppingListRequest) {
  return apiRequest<ShoppingList>(`${shoppingListsPath}/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteShoppingList(id: string) {
  return apiRequest<void>(`${shoppingListsPath}/${id}`, {
    method: 'DELETE',
  });
}
