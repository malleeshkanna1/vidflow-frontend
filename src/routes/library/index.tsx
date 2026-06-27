import VideoLibrary from '@/features/components/videolibrary/VideoLibrary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/library/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <VideoLibrary/>
}
