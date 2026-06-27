import Footages from '@/features/components/Footages/Footages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/footages/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Footages/>
}
