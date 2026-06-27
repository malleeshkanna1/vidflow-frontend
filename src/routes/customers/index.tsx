import ListCustomers from '@/features/components/customers/ListCustomers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ListCustomers/>
}
