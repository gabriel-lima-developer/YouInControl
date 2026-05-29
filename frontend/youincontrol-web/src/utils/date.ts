const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function formatDate(value: string | null) {
  if (!value) {
    return 'Sem atualizacao';
  }

  return dateFormatter.format(new Date(value));
}

export function formatLongDate(value: string | null) {
  if (!value) {
    return 'Sem atualizacao';
  }

  return longDateFormatter.format(new Date(value));
}

export function formatQuantity(quantity: number | null) {
  if (quantity === null) {
    return 'Sem quantidade';
  }

  return quantity.toLocaleString('pt-BR');
}
