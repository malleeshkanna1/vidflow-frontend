import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import AxiosService from "@/services/AxiosService"
const Embedded = ({customerId}:{customerId : string}) => {
  const embedScript = `
   <script src="${AxiosService.apiUrl()}/embed/js/${customerId}"></script>

    <script>

        document.addEventListener("DOMContentLoaded", () => {

            new CyranoVideo({

                elem: "#videos-section"

            });

        });

    </script>
  `

  const jsUrl =  `${AxiosService.apiUrl()}/embed/js/${customerId}`;

  return (
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
                  ? embedScript
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
                    embedScript
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
                  ? jsUrl
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
                    jsUrl
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
  )
}

export default Embedded