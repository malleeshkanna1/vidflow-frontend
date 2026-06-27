import AddEditCustomer from '@/features/components/customers/AddEditCustomer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customers/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddEditCustomer/>
}
