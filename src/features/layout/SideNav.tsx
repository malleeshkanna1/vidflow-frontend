import { Link, useLocation } from "@tanstack/react-router";
import {
  FolderOpen,
  FileVideo,
  Clapperboard,
  Files,
  Users,
  Settings,
  LifeBuoy,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Video Library",
    to: "/library",
    icon: FileVideo,
  },
  {
    title: "Projects",
    to: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Footages",
    to: "/footages",
    icon: Clapperboard,
  },
  {
    title: "Files",
    to: "/files",
    icon: Files,
  },
  {
    title: "Customers",
    to: "/customers",
    icon: Users,
  },
];

export function SideNav() {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="px-6 py-5">
        <Link
          to="/"
          className="text-2xl font-bold text-primary"
        >
          Cyrano Studio
        </Link>
      </div>


      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = location.pathname.startsWith(item.to);

          return (
            <Link key={item.to} to={item.to}>
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  active && "font-semibold"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <LifeBuoy className="h-5 w-5" />
          Support
        </Button>
      </div>

      {/* User */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            MK
          </div>

          <div>
            <p className="text-sm font-medium">Malleeshkanna</p>
            <p className="text-xs text-muted-foreground">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}