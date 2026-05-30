import type { ShoppingListItemUnitOfMeasure } from '../types/shoppingListTypes';

export const unitOfMeasureOptions = [
  { value: 'Kg', label: 'KG', singularLabel: 'KG', pluralLabel: 'KG' },
  { value: 'Unit', label: 'Unidade', singularLabel: 'Unidade', pluralLabel: 'Unidades' },
  { value: 'Liter', label: 'Litro', singularLabel: 'Litro', pluralLabel: 'Litros' },
  { value: 'Package', label: 'Pacote', singularLabel: 'Pacote', pluralLabel: 'Pacotes' },
] satisfies {
  value: ShoppingListItemUnitOfMeasure;
  label: string;
  singularLabel: string;
  pluralLabel: string;
}[];

export function getUnitOfMeasureLabel(unitOfMeasure: ShoppingListItemUnitOfMeasure | null | undefined) {
  return unitOfMeasureOptions.find((option) => option.value === unitOfMeasure)?.label ?? '';
}

export function getUnitOfMeasureQuantityLabel(
  unitOfMeasure: ShoppingListItemUnitOfMeasure | null | undefined,
  quantity: number,
) {
  const option = unitOfMeasureOptions.find((currentOption) => currentOption.value === unitOfMeasure);

  if (!option) {
    return '';
  }

  return quantity === 1 ? option.singularLabel : option.pluralLabel;
}

export function parseOptionalQuantity(value: string) {
  const normalizedValue = value.trim().replace(',', '.');

  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}
