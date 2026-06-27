import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Copy, Loader2, Plus, Search, Trash2 } from "lucide-react"

import AxiosService from "@/services/AxiosService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Checkbox } from "@/components/ui/checkbox"

interface Customer {
  _id: string
  companyName: string
}

interface Footage {
  id: string
  thumbnail: string
  name: string
  duration: string
  status: string
  tags: string[]
}

interface LibraryResponse {
  success: boolean
  data: {
    id: string
    customer_id: string
    lib_heading: string
    description: string
    footages_id: Footage[]
  }
}

export default function VideoLibrary() {
  const [loading, setLoading] = useState(false)

  const [saving, setSaving] = useState(false)

  const [libraryId, setLibraryId] = useState<string | null>(null)

  const [customers, setCustomers] = useState<Customer[]>([])

  const [customerId, setCustomerId] = useState("")

  const [title, setTitle] = useState("")

  const [description, setDescription] = useState("")

  const [search, setSearch] = useState("")

  const [footageSheet, setFootageSheet] = useState(false)

  const [allFootages, setAllFootages] = useState<Footage[]>([])

  const [selectedFootages, setSelectedFootages] = useState<Footage[]>([])

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const response: any = await AxiosService.get("/customers/list")

      if (response.success) {
        setCustomers(response.data)
      }
    } catch {
      toast.error("Failed to load customers.")
    }
  }

  async function handleCustomerChange(id: string) {
    setCustomerId(id)

    await loadLibrary(id)
  }

  async function loadLibrary(customerId: string) {
    try {
      setLoading(true)

      const response = await AxiosService.get<LibraryResponse>(
        `/library/${customerId}`
      )

      if (response.success) {
        const lib = response.data

        setLibraryId(lib.id)

        setTitle(lib.lib_heading)

        setDescription(lib.description)

        setSelectedFootages(lib.footages_id || [])

        toast.success("Library loaded.")
      }
    } catch {
      // No library exists

      setLibraryId(null)

      setTitle("")

      setDescription("")

      setSelectedFootages([])

      console.log("Customer has no library.")
    } finally {
      setLoading(false)
    }
  }

  async function loadFootages() {
    try {
      const response: any = await AxiosService.get("/footages/list", {
        params: {
          search,
        },
      })

      if (response.success) {
        setAllFootages(response.data)
      }
    } catch {
      toast.error("Unable to load footages.")
    }
  }

  useEffect(() => {
    if (!footageSheet) return

    const timer = setTimeout(() => {
      loadFootages()
    }, 500)

    return () => clearTimeout(timer)
  }, [search, footageSheet])

  const embedCode = useMemo(() => {
    if (!customerId) return ""

    return `<script src="https://cdn.yourdomain.com/embed/${customerId}.js"></script>`
  }, [customerId])

  async function copyEmbed() {
    await navigator.clipboard.writeText(embedCode)

    toast.success("Embed code copied.")
  }

  async function saveLibrary() {
    if (!customerId) {
      toast.error("Select customer.")
      return
    }

    if (!title.trim()) {
      toast.error("Heading required.")
      return
    }

    if (selectedFootages.length === 0) {
      toast.error("Select at least one footage.")
      return
    }

    try {
      setSaving(true)

      const payload = {
        customer_id: customerId,
        lib_heading: title,
        description,
        footages_id: selectedFootages.map((x: any) => (x._id ? x._id : x.id)),
      }

      const response: any = libraryId
        ? await AxiosService.put(`/library/update/${libraryId}`, payload)
        : await AxiosService.post("/library/update", payload)

      if (response.success) {
        toast.success(libraryId ? "Library updated." : "Library created.")

        await loadLibrary(customerId)
      }
    } catch {
      toast.error("Unable to save library.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Library</h1>

          <p className="mt-1 text-muted-foreground">
            Curate assets, assign customers, and activate your embedding tools.
          </p>
        </div>

        <Button onClick={saveLibrary} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {libraryId ? "Update Library" : "Create Library"}
        </Button>
      </div>

      {/* Library Details */}

      <Card>
        <CardHeader>
          <CardTitle>Library Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Customer</label>

            <Select value={customerId} onValueChange={handleCustomerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>

              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Library Heading
            </label>

            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      {/* Selected Footages */}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Selected Footages</h2>

        <Button type="button" onClick={() => setFootageSheet(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Select Footage
        </Button>
      </div>

      {/* Footage Selection Sheet */}

      <Sheet open={footageSheet} onOpenChange={setFootageSheet}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Select Footages</SheetTitle>

            <SheetDescription>
              Choose one or more footages for this library.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
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
                    (x) => x.id === footage.id
                  )

                  return (
                    <Card
                      key={footage.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        checked ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => {
                        if (checked) {
                          setSelectedFootages((prev) =>
                            prev.filter((x) => x.id !== footage.id)
                          )
                        } else {
                          setSelectedFootages((prev) => [...prev, footage])
                        }
                      }}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <Checkbox checked={checked} />

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

      {/* Selected Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {selectedFootages.map((footage:any) => (
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
                {footage.tags?.slice(0, 4).map((tag:any) => (
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
      {/* Embed Code */}

      <Card>
        <CardHeader>
          <CardTitle>Embedded Code</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Script Tag */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Embed Script
            </label>

            <div className="rounded-lg border bg-muted/40 p-4">
              <code className="text-sm break-all">
                {customerId
                  ? `<script src="https://cdn.yourdomain.com/embed/${customerId}.js"></script>`
                  : "Select a customer to generate the embed script."}
              </code>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={!customerId}
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `<script src="https://cdn.yourdomain.com/embed/${customerId}.js"></script>`
                  )

                  toast.success("Embed script copied.")
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Script
              </Button>
            </div>
          </div>

          {/* JS URL */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              JavaScript URL
            </label>

            <div className="rounded-lg border bg-muted/40 p-4">
              <code className="text-sm break-all">
                {customerId
                  ? `https://cdn.yourdomain.com/embed/${customerId}.js`
                  : "Select a customer to generate the JavaScript URL."}
              </code>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={!customerId}
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `https://cdn.yourdomain.com/embed/${customerId}.js`
                  )

                  toast.success("JavaScript URL copied.")
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy JS URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl border bg-background px-6 py-4 shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin" />

            <span className="font-medium">Loading Library...</span>
          </div>
        </div>
      )}
    </div>
  )
}
