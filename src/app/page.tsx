import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { ViewportPlaceholder } from "@/components/ViewportPlaceholder";

export default function HomePage() {
  return (
    <AppShell
      topBar={<TopBar />}
      sidebar={<Sidebar />}
      viewport={<ViewportPlaceholder />}
    />
  );
}
