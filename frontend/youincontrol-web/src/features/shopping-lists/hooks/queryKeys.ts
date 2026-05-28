export const shoppingListKeys = {
  all: ['shopping-lists'] as const,
  detail: (id: string) => ['shopping-lists', id] as const,
  items: (id: string) => ['shopping-lists', id, 'items'] as const,
};
