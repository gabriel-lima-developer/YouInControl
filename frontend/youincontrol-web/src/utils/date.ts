const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(value: string | null) {
  if (!value) {
    return 'Sem atualizacao';
  }

  return dateFormatter.format(new Date(value));
}

export function formatQuantity(quantity: number | null, unit: string | null) {
  if (quantity === null && !unit) {
    return 'Sem quantidade';
  }

  return [quantity, unit].filter((part) => part !== null && part !== '').join(' ');
}
