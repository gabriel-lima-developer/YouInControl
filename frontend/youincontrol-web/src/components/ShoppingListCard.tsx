import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ShoppingListSummary } from '../types/shoppingList';
import { formatDate } from '../utils/date';

type ShoppingListCardProps = {
  list: ShoppingListSummary;
};

export function ShoppingListCard({ list }: ShoppingListCardProps) {
  return (
    <Link
      className="group grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
      to={`/lists/${list.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-stone-950">{list.title}</h2>
          <p className="mt-1 text-sm text-stone-500">Status {list.status}</p>
        </div>
        <ArrowRight className="h-5 w-5 flex-none text-stone-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Criada em {formatDate(list.createdAt)}
      </div>
    </Link>
  );
}
