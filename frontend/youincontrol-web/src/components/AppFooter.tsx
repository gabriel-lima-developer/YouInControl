import { ExternalLink } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">Copyright &copy; 2026 Gabriel Lima. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/gabriel-lima-developer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-all hover:text-foreground active:scale-95"
            aria-label="GitHub de Gabriel Lima"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <span className="text-xs text-border" aria-hidden="true">
            |
          </span>
          <a
            href="https://www.linkedin.com/in/gabriel-lima-211901193/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-all hover:text-foreground active:scale-95"
            aria-label="LinkedIn de Gabriel Lima"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
