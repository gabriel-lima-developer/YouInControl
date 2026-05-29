import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-foreground shadow-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link className="group flex items-center gap-2.5" to="/shopping-lists" aria-label="YouInControl - Pagina inicial">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-primary-foreground">
            You<span className="text-primary">In</span>Control
          </span>
        </Link>
      </div>
    </header>
  );
}
