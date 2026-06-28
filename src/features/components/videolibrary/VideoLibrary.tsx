import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

import AxiosService from "@/services/AxiosService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import LibLoader from "./LibLoader"
import Embedded from "./Embedded"
import SelectedFootages from "./SelectedFootages"
import SelectFootageSlideout from "./SelectFootageSlideout"

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

          Save Library
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

      <SelectFootageSlideout
        footageSheet={footageSheet}
        setFootageSheet={setFootageSheet}
        loading={loading}
        allFootages={allFootages}
        search={search}
        setSearch={setSearch}
        selectedFootages={selectedFootages}
        setSelectedFootages={setSelectedFootages}
      />

      {/* Selected Cards */}

      <SelectedFootages
        selectedFootages={selectedFootages}
        setSelectedFootages={setSelectedFootages}
        setFootageSheet={setFootageSheet}
      />
      {/* Embed Code */}

      <Embedded customerId={customerId} />

      {/* Loading Overlay */}

      {loading && <LibLoader />}
    </div>
  )
}
