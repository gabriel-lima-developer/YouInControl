import { Outlet } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <header className="border-b border-stone-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-700">YouInControl</p>
            <h1 className="text-xl font-semibold text-stone-950">Lista de compras</h1>
          </div>
          <span className="hidden max-w-sm truncate rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-500 sm:block">
            {API_BASE_URL}
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
