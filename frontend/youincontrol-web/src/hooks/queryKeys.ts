export const shoppingListKeys = {
  all: ['shopping-lists'] as const,
  detail: (id: string) => ['shopping-lists', id] as const,
};
