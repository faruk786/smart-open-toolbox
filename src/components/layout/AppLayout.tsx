import { Link, Outlet } from "@tanstack/react-router";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchProvider } from "@/lib/search-context";

function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} SmartOpenTools. All rights reserved.</p>
        <nav aria-label="Legal" className="flex items-center gap-4">
          <Link to="/" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link to="/" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-foreground">
            100% Free Developer Utilities
          </span>
        </nav>
      </div>
    </footer>
  );
}

export function AppLayout() {
  return (
    <SearchProvider>
      <div className="min-h-dvh w-full max-w-full overflow-x-hidden bg-background text-foreground">
        <Header />
        <div className="flex w-full max-w-full overflow-x-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
            <main className="min-w-0 flex-1 overflow-x-hidden w-full max-w-full">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
