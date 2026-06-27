import { useEffect, useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import AxiosService from "@/services/AxiosService"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Loader2, Sparkles, Trash2, Upload } from "lucide-react"

const customerSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  username: z.string().min(3, "Username is required"),
  tagline: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  brandColor1: z.string(),
  brandColor2: z.string(),
})

type CustomerForm = z.infer<typeof customerSchema>

interface CustomerResponse {
  success: boolean
  data: CustomerForm & {
    _id: string
    logo?: string
    isActive: boolean
    createdAt: string
  }
}

export default function AddEditCustomer() {
  const navigate = useNavigate()

  const params = useParams({
    strict: false,
  })

  const customerId = (params as any)?.id

  const isEdit = Boolean(customerId)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [logo, setLogo] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      companyName: "",
      username: "",
      tagline: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      brandColor1: "#3B82F6",
      brandColor2: "#8B5CF6",
    },
  })

  const brand1 = form.watch("brandColor1")
  const brand2 = form.watch("brandColor2")

  useEffect(() => {
    if (isEdit) {
      loadCustomer()
    }
  }, [])

  async function loadCustomer() {
    try {
      const response = await AxiosService.get<CustomerResponse>(
        `/customers//${customerId}`
      )

      if (response.success) {
        form.reset(response.data)

        setLogo(response.data.logo || "")
      }
    } catch {
      toast.error("Failed to load customer.")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: CustomerForm) {
    try {
      setSaving(true)

      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value ?? "")
      })

      if (logoFile) {
        formData.append("logo", logoFile)
      }

      if (isEdit) {
        await AxiosService.post(`/customers/update/${customerId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        toast.success("Customer updated.")
      } else {
        await AxiosService.post("/customers/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        toast.success("Customer created.")
      }

      navigate({
        to: "/customers",
      })
    } catch {
      toast.error("Failed to save customer.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true)

      await AxiosService.get(`/customers/delete/${customerId}`)

      toast.success("Customer deleted successfully.")

      navigate({
        to: "/customers",
      })
    } catch {
      toast.error("Failed to delete customer.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-7xl space-y-6"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Customer" : "Add Customer"}
          </h1>

          <p className="text-muted-foreground">
            Create and manage customer branding.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isEdit && (
            <div className="max-w-3xl">

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Customer?</AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. The customer and all related
                    information will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>

          )}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({
                to: "/customers",
              })
            }
          >
            Cancel
          </Button>

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {isEdit ? "Save Changes" : "Create Customer"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Side */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>

            <CardContent>
              <FieldSet>
                {/* Logo */}

                <Field>
                  <FieldLabel>Company Logo</FieldLabel>

                  <FieldContent>
                    <div className="flex items-center gap-6">
                      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          id="logo-upload"
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]

                            if (!file) return

                            setLogoFile(file)

                            setLogo(URL.createObjectURL(file))
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("logo-upload")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>

                        <FieldDescription>PNG, JPG or SVG</FieldDescription>
                      </div>
                    </div>
                  </FieldContent>
                </Field>

                {/* Company */}

                <Field>
                  <FieldLabel>Company Name</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="GenovaSuite"
                      {...form.register("companyName")}
                    />

                    <FieldError errors={[form.formState.errors.companyName]} />
                  </FieldContent>
                </Field>

                {/* Username */}

                <Field>
                  <FieldLabel>Username</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="genovasuite"
                      {...form.register("username")}
                    />

                    <FieldError errors={[form.formState.errors.username]} />
                  </FieldContent>
                </Field>

                {/* Brand Colors */}

                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Brand Color 1</FieldLabel>

                    <FieldContent>
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          className="w-16"
                          value={brand1}
                          onChange={(e) =>
                            form.setValue("brandColor1", e.target.value, {
                              shouldDirty: true,
                            })
                          }
                        />

                        <Input
                          value={brand1}
                          onChange={(e) =>
                            form.setValue("brandColor1", e.target.value, {
                              shouldDirty: true,
                            })
                          }
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Brand Color 2</FieldLabel>

                    <FieldContent>
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          className="w-16"
                          value={brand2}
                          onChange={(e) =>
                            form.setValue("brandColor2", e.target.value, {
                              shouldDirty: true,
                            })
                          }
                        />

                        <Input
                          value={brand2}
                          onChange={(e) =>
                            form.setValue("brandColor2", e.target.value, {
                              shouldDirty: true,
                            })
                          }
                        />
                      </div>
                    </FieldContent>
                  </Field>
                </div>

                {/* Tagline */}

                <Field>
                  <FieldLabel>Tagline</FieldLabel>

                  <FieldContent>
                    <Textarea
                      rows={4}
                      placeholder="Your product our service"
                      {...form.register("tagline")}
                    />

                    <div className="mt-3">
                      <Button type="button" variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  </FieldContent>
                </Field>

                {/* Website */}

                <Field>
                  <FieldLabel>Website</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="https://example.com"
                      {...form.register("website")}
                    />
                  </FieldContent>
                </Field>

                {/* Email */}

                <Field>
                  <FieldLabel>Email</FieldLabel>

                  <FieldContent>
                    <Input
                      type="email"
                      placeholder="hello@example.com"
                      {...form.register("email")}
                    />

                    <FieldError errors={[form.formState.errors.email]} />
                  </FieldContent>
                </Field>

                {/* Phone */}

                <Field>
                  <FieldLabel>Phone</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="+91 9876543210"
                      {...form.register("phone")}
                    />
                  </FieldContent>
                </Field>

                {/* Address */}

                <Field>
                  <FieldLabel>Address</FieldLabel>

                  <FieldContent>
                    <Textarea
                      rows={3}
                      placeholder="Customer address..."
                      {...form.register("address")}
                    />
                  </FieldContent>
                </Field>
              </FieldSet>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Right Side */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6 overflow-hidden">
            <CardHeader>
              <CardTitle>Brand Preview</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {/* Banner */}

              <div
                className="h-36"
                style={{
                  background: `linear-gradient(135deg, ${brand1}, ${brand2})`,
                }}
              />

              {/* Logo */}

              <div className="-mt-14 flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-white shadow-lg">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Company Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* Company */}

                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {form.watch("companyName") || "Company Name"}
                  </h2>

                  <p className="mt-2 text-muted-foreground">
                    {form.watch("tagline") || "Your company tagline"}
                  </p>
                </div>

                {/* Brand Colors */}

                <div>
                  <h4 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Brand Colors
                  </h4>

                  <div className="flex gap-3">
                    <div
                      className="flex-1 rounded-xl border p-3"
                      style={{
                        background: brand1,
                      }}
                    />

                    <div
                      className="flex-1 rounded-xl border p-3"
                      style={{
                        background: brand2,
                      }}
                    />
                  </div>
                </div>

                {/* Information */}

                <div className="space-y-4 rounded-xl border p-5">
                  <PreviewItem
                    label="Username"
                    value={
                      form.watch("username")
                        ? `@${form.watch("username")}`
                        : "-"
                    }
                  />

                  <PreviewItem
                    label="Website"
                    value={form.watch("website") || "-"}
                  />

                  <PreviewItem
                    label="Email"
                    value={form.watch("email") || "-"}
                  />

                  <PreviewItem
                    label="Phone"
                    value={form.watch("phone") || "-"}
                  />
                </div>

                {/* Buttons */}

                <div className="space-y-3">
                  <Button
                    type="button"
                    className="w-full"
                    style={{
                      background: brand1,
                    }}
                  >
                    Primary Button
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    style={{
                      borderColor: brand1,
                      color: brand1,
                    }}
                  >
                    Secondary Button
                  </Button>
                </div>

                {/* Address */}

                {form.watch("address") && (
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <h4 className="mb-2 font-medium">Address</h4>

                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                      {form.watch("address")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

interface PreviewItemProps {
  label: string
  value: string
}

function PreviewItem({ label, value }: PreviewItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="max-w-[180px] truncate font-medium">{value}</span>
    </div>
  )
}
