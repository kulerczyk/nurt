import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-heather-50/40">
      <header className="bg-white border-b border-heather-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-lg font-semibold text-stone-900 tracking-widest">
            NURT <span className="text-heather-500 font-sans text-xs font-medium tracking-wide align-middle ml-1">panel</span>
          </Link>

          <div className="flex items-center gap-4">
            {user?.email && <span className="text-sm text-stone-500 hidden sm:inline">{user.email}</span>}
            <form action={logout}>
              <button
                type="submit"
                className="text-sm font-medium text-heather-700 border border-heather-300 px-4 py-1.5 rounded-full
                           hover:bg-heather-500 hover:text-white hover:border-heather-500
                           transition-all duration-300"
              >
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
