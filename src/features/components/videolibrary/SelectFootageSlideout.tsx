import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Dispatch, SetStateAction } from "react"

interface Footage {
  id: string
  thumbnail: string
  name: string
  duration: string
  status: string
  tags: string[]
}

interface SelectFootageSlideoutProps {
  footageSheet: boolean
  setFootageSheet: Dispatch<SetStateAction<boolean>>

  loading: boolean

  allFootages: Footage[]

  search: string
  setSearch: Dispatch<SetStateAction<string>>

  selectedFootages: Footage[]
  setSelectedFootages:Dispatch<SetStateAction<Footage[]>>;
}

const SelectFootageSlideout = ({
  footageSheet,
  setFootageSheet,
  loading,
  allFootages,
  search,
  setSearch,
  selectedFootages,
  setSelectedFootages,
}: SelectFootageSlideoutProps) => {
  const getId = (item: any) => item._id ?? item.id

  return (
    <Sheet open={footageSheet} onOpenChange={setFootageSheet}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Select Footages</SheetTitle>

          <SheetDescription>
            Choose one or more footages for this library.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-3 space-y-5 p-3">
          {/* Search */}

          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search footage..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Footages */}

          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {!loading &&
              allFootages.map((footage) => {
                const checked = selectedFootages.some(
                  (item: any) => getId(item) === getId(footage)
                )

                return (
                  <Card
                    key={footage.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      checked ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      const exists = selectedFootages.some(
                        (item: any) => getId(item) === getId(footage)
                      )

                      if (exists) {
                        setSelectedFootages((prev) =>
                          prev.filter(
                            (item: any) => getId(item) !== getId(footage)
                          )
                        )
                      } else {
                        setSelectedFootages((prev) => [...prev, footage])
                      }
                    }}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <Checkbox checked={checked} onCheckedChange={() => {}} />

                      <img
                        src={
                          footage.thumbnail ||
                          "https://placehold.co/320x180?text=No+Image"
                        }
                        className="h-20 w-32 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{footage.name}</h3>

                        <div className="mt-1 text-sm text-muted-foreground">
                          Duration : {footage.duration}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {footage.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

            {!loading && allFootages.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                No footages found.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFootageSheet(false)}
            >
              Cancel
            </Button>

            <Button type="button" onClick={() => setFootageSheet(false)}>
              Done ({selectedFootages.length})
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SelectFootageSlideout
