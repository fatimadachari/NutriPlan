import Sidebar from "@/components/layouts/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-72 transition-all duration-300">
        <div className="h-full w-full p-8 md:p-12 overflow-y-auto min-h-screen">
            {children}
        </div>
      </main>
    </div>
  );
}