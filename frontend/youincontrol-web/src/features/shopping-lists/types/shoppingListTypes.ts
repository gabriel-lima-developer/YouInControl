export type ShoppingListStatus = 'Active' | 'Completed' | 'Archived';

export type ShoppingList = {
  id: string;
  name: string;
  status: ShoppingListStatus;
  createdAt: string;
  updatedAt: string | null;
};

export type ShoppingListItem = {
  id: string;
  shoppingListId: string;
  description: string;
  quantity: number;
  order: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
};

export type ShoppingListDetails = ShoppingList & {
  items: ShoppingListItem[];
};

export type CreateShoppingListRequest = {
  name: string;
};

export type UpdateShoppingListRequest = {
  name: string;
};

export type CreateShoppingListItemRequest = {
  description: string;
  quantity: number;
};

export type UpdateShoppingListItemRequest = {
  description: string;
  quantity: number;
};

export type ReorderShoppingListItemsRequest = {
  items: {
    itemId: string;
    order: number;
  }[];
};
