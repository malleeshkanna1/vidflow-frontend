import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface Footage {
  id: string
  thumbnail: string
  name: string
  duration: string
  status: string
  tags: string[]
}

interface SelectFootageProps {
  selectedFootages: Footage[];
  setSelectedFootages: Dispatch<SetStateAction<Footage[]>>;
  setFootageSheet: Dispatch<SetStateAction<boolean>>;
}

const SelectedFootages = ({
  selectedFootages,
  setSelectedFootages,
  setFootageSheet,
}: SelectFootageProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {selectedFootages.map((footage: any) => (
        <Card
          key={footage.id}
          className="overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="relative aspect-video">
            <img
              src={
                footage.thumbnail ||
                "https://placehold.co/640x360?text=No+Preview"
              }
              className="h-full w-full object-cover"
            />

            <Badge
              className={`absolute top-3 left-3 ${
                footage.status === "completed"
                  ? "bg-green-600"
                  : footage.status === "processing"
                    ? "bg-amber-500"
                    : "bg-red-600"
              }`}
            >
              {footage.status}
            </Badge>

            <Badge variant="secondary" className="absolute top-3 right-3">
              {footage.duration}
            </Badge>
          </div>

          <CardContent className="space-y-4 p-4">
            <h3 className="line-clamp-1 font-semibold">{footage.name}</h3>

            <div className="flex flex-wrap gap-2">
              {footage.tags?.slice(0, 4).map((tag: any) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() =>
                  setSelectedFootages((prev) =>
                    prev.filter(
                      (x: any) =>
                        (x._id ?? x.id) !== (footage._id ?? footage.id)
                    )
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add More */}

      <Card
        className="flex aspect-[4/3] cursor-pointer items-center justify-center border-2 border-dashed transition-all hover:border-primary hover:bg-primary/5"
        onClick={() => setFootageSheet(true)}
      >
        <div className="text-center">
          <Plus className="mx-auto mb-3 h-8 w-8" />

          <p className="font-medium">Add More Footages</p>
        </div>
      </Card>
    </div>
  )
}

export default SelectedFootages
