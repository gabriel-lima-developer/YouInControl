export type ShoppingListStatus = 'Active' | 'Completed' | 'Archived';

export type ShoppingListSummary = {
  id: string;
  title: string;
  status: ShoppingListStatus;
  createdAt: string;
  updatedAt: string | null;
};

export type ShoppingListItem = {
  id: string;
  shoppingListId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
};

export type ShoppingListDetail = ShoppingListSummary & {
  items: ShoppingListItem[];
};

export type CreateShoppingListRequest = {
  title: string;
};

export type CreateShoppingListItemRequest = {
  name: string;
  quantity?: number | null;
  unit?: string | null;
};
