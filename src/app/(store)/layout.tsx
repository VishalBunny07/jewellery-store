
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="min-h-screen pb-20 lg:pb-0">
        {children}
      </main>

      <MobileBottomNav />
    </>
  );
}
