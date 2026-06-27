import EditFootage from '@/features/components/Footages/EditFootage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/footages/$EditFootage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditFootage/>
}
