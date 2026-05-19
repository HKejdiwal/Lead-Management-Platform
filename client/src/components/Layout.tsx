import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            Smart Leads
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm text-slate-600">
                  {user.name} <span className="font-medium text-slate-900">({user.role})</span>
                </div>
                <button onClick={logout} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
