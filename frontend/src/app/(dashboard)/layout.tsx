import Sidebar from "@/components/layouts/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      {/* ml-72 corresponde à largura da sidebar (w-72) */}
      <main className="flex-1 ml-72 p-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}