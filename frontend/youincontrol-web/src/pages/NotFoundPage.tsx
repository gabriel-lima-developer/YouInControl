import { Link } from 'react-router-dom';
import { StateView } from '../components/StateView';

export function NotFoundPage() {
  return (
    <StateView
      action={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          to="/"
        >
          Voltar para listas
        </Link>
      }
      message="A rota acessada nao existe nesta aplicacao."
      title="Pagina nao encontrada"
      type="empty"
    />
  );
}
