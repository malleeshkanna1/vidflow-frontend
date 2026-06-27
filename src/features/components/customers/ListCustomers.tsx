import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  Loader2,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import AxiosService from "@/services/AxiosService";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Customer {
  _id: string;
  companyName: string;
  username: string;
  tagline: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  brandColor1: string;
  brandColor2: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
}

interface CustomerResponse {
  success: boolean;
  count: number;
  data: Customer[];
}

export default function ListCustomers() {
  const [loading, setLoading] =
    useState(true);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  async function loadCustomers(
    keyword = ""
  ) {
    try {
      setLoading(true);

      const response =
        await AxiosService.get<CustomerResponse>(
          "/customers/list",
          {
            params: {
              search: keyword,
            },
          }
        );

      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  const activeCount = useMemo(
    () =>
      customers.filter(
        (x) => x.isActive
      ).length,
    [customers]
  );

  const inactiveCount = useMemo(
    () =>
      customers.filter(
        (x) => !x.isActive
      ).length,
    [customers]
  );

  const statusBadge = (
    active: boolean
  ) => {
    return active ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Customers
          </h1>

          <p className="text-muted-foreground">
            Manage enterprise customer
            organizations.
          </p>

        </div>

        <div className="flex gap-3">

          <div className="relative w-80">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search customers..."
              value={search}
              className="pl-9"
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <Button asChild>

            <Link to="/customers/new">

              <Plus className="mr-2 h-4 w-4" />

              Add Customer

            </Link>

          </Button>

        </div>

      </div>

      {/* Stats */}

      <div className="flex gap-3">

        <Badge
          variant="secondary"
          className="px-4 py-2"
        >
          Total :
          {" "}
          {customers.length}
        </Badge>

        <Badge className="bg-green-100 px-4 py-2 text-green-700">

          Active :
          {" "}
          {activeCount}

        </Badge>

        <Badge className="bg-red-100 px-4 py-2 text-red-700">

          Inactive :
          {" "}
          {inactiveCount}

        </Badge>

      </div>

      <Card>

        <CardContent className="p-0">

          {/* Table Header */}

          <div className="grid grid-cols-[2fr_1.3fr_160px_180px_120px_60px] border-b bg-muted/40 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">

            <div>
              Company
            </div>

            <div>
              Username
            </div>

            <div>
              Brand
            </div>

            <div>
              Created
            </div>

            <div>
              Status
            </div>

            <div />

          </div>

          {/* Loading */}

          {loading && (
            <div className="flex justify-center py-20">

              <Loader2 className="h-8 w-8 animate-spin" />

            </div>
          )}
                    {/* Empty State */}

          {!loading &&
            customers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24">

                <Building2 className="mb-4 h-14 w-14 text-muted-foreground" />

                <h3 className="text-xl font-semibold">
                  No Customers Found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first customer to get started.
                </p>

                <Button
                  className="mt-6"
                  asChild
                >
                  <Link to="/customers/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Link>
                </Button>

              </div>
            )}

          {/* Customer Rows */}

          {!loading &&
            customers.map((customer) => (
              <div
                key={customer._id}
                className="grid grid-cols-[2fr_1.3fr_160px_180px_120px_60px] items-center border-b px-6 py-5 transition-colors hover:bg-muted/30"
              >

                {/* Company */}

                <div className="flex items-center gap-4">

                  {customer.logo ? (
                    <img
                      src={customer.logo}
                      alt={customer.companyName}
                      className="h-14 w-14 rounded-xl border object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-muted">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div>

                    <Link
                      to="/customers/$id"
                      params={{
                        id: customer._id,
                      }}
                      className="font-semibold transition-colors hover:text-primary hover:underline"
                    >
                      {customer.companyName}
                    </Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {customer.email}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground italic">
                      {customer.tagline}
                    </p>

                  </div>

                </div>

                {/* Username */}

                <div>

                  <p className="font-medium">
                    @{customer.username}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {customer.website || "-"}
                  </p>

                </div>

                {/* Brand Colors */}

                <div className="flex items-center gap-3">

                  <div
                    className="h-8 w-8 rounded-full border shadow-sm"
                    style={{
                      background:
                        customer.brandColor1,
                    }}
                  />

                  <div
                    className="h-8 w-8 rounded-full border shadow-sm"
                    style={{
                      background:
                        customer.brandColor2,
                    }}
                  />

                </div>

                {/* Created */}

                <div className="flex items-center gap-2 text-sm">

                  <Calendar className="h-4 w-4 text-muted-foreground" />

                  {new Date(
                    customer.createdAt
                  ).toLocaleDateString()}

                </div>

                {/* Status */}

                <div>
                  {statusBadge(
                    customer.isActive
                  )}
                </div>

                {/* Actions */}

                <div>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link
                      to="/customers/$id"
                      params={{
                        id: customer._id,
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Link>
                  </Button>

                </div>

              </div>
            ))}

        </CardContent>

      </Card>

    </div>
  );
}