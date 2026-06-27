import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SideNav } from '@/features/layout/SideNav'

const RootLayout = () => (
  <>
    <div className="flex h-screen">
      <SideNav />

      <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
        <Outlet />
      </main>
    </div>
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })