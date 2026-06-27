import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import AxiosService from "@/services/AxiosService";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  MediaPlayer,
  MediaProvider,
  Track
} from "@vidstack/react";

import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

interface FootageResponse {
  success: boolean;
  data: any;
}

export default function EditFootage() {
  const navigate = useNavigate();

  const { EditFootage } = useParams({
    from: "/footages/$EditFootage",
  });

  const [loading, setLoading] = useState(true);

  const [footage, setFootage] = useState<any>(null);

  useEffect(() => {
    loadFootage();
  }, [EditFootage]);

  const loadFootage = async () => {
    try {
      setLoading(true);

      const response =
        await AxiosService.get<FootageResponse>(
          `/footages/getById/${EditFootage}`
        );

      if (response.success) {
        setFootage(response.data);
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to load footage.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!footage) {
    return (
      <div className="py-24 text-center">
        No footage found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Edit Footage
          </h1>

          <p className="text-muted-foreground">
            Review AI generated metadata and
            manage this footage.
          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/footages",
              })
            }
          >
            Back
          </Button>

          <Button>
            Save Changes
          </Button>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* LEFT */}

        <div className="space-y-6 lg:col-span-3">

          <Card>

            <CardContent className="p-5">

              <MediaPlayer
                title={footage.name}
                src={footage.video}
                className="aspect-video overflow-hidden rounded-xl"
              >
                <MediaProvider >
                  {footage.subtitle && (
      <Track
        src={footage.subtitle}
        kind="subtitles"
        label="English"
        lang="en-US"
        default
      />
    )}
                  </MediaProvider>

                <DefaultVideoLayout
                  icons={defaultLayoutIcons}
                />

              </MediaPlayer>

            </CardContent>

          </Card>

          <div>

            <h2 className="text-3xl font-bold">
              {footage.name}
            </h2>

            <p className="mt-3 leading-7 text-muted-foreground">
              {footage.description}
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-6 lg:col-span-2">

          <Card>

            <CardHeader>

              <CardTitle>
                AI Summary
              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex items-center justify-between">

                <span>Status</span>

                <Badge
                  className={
                    footage.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : footage.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {footage.status}
                </Badge>

              </div>

              <div className="flex justify-between">
                <span>Processing</span>
                <span>
                  {footage.processingStage}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Duration</span>
                <span>{footage.duration}</span>
              </div>

              <div className="flex justify-between">
                <span>Resolution</span>
                <span>{footage.resolution}</span>
              </div>

              <div className="flex justify-between">
                <span>FPS</span>
                <span>{footage.fps}</span>
              </div>

              <div className="flex justify-between">
                <span>Codec</span>
                <span>{footage.codec}</span>
              </div>

              <div className="flex justify-between">
                <span>Aspect Ratio</span>
                <span>
                  {footage.aspectRatio}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Size</span>
                <span>
                  {(footage.size / 1024 / 1024).toFixed(2)}
                  {" MB"}
                </span>
              </div>

            </CardContent>

          </Card>

          <Card>

            <CardHeader>

              <CardTitle>
                Transcription
              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="max-h-[420px] overflow-y-auto whitespace-pre-wrap text-sm leading-7">
                {footage.transcription}
              </div>

            </CardContent>

          </Card>

        </div>

      </div>      {/* Tabs */}

      <Card>

        <CardContent className="p-6">

          <Tabs defaultValue="video">

            <TabsList className="grid w-full grid-cols-7">

              <TabsTrigger value="video">
                Video Info
              </TabsTrigger>

              <TabsTrigger value="metadata">
                Metadata
              </TabsTrigger>

              <TabsTrigger value="tags">
                Tags
              </TabsTrigger>

              <TabsTrigger value="keywords">
                Keywords
              </TabsTrigger>

              <TabsTrigger value="objects">
                Objects
              </TabsTrigger>

              <TabsTrigger value="activities">
                Activities
              </TabsTrigger>

              <TabsTrigger value="colors">
                Colors
              </TabsTrigger>

            </TabsList>

            {/* VIDEO INFO */}

            <TabsContent
              value="video"
              className="mt-6"
            >

              <div className="grid gap-6 md:grid-cols-2">

                <InfoItem
                  title="Duration"
                  value={footage.duration}
                />

                <InfoItem
                  title="Resolution"
                  value={footage.resolution}
                />

                <InfoItem
                  title="FPS"
                  value={footage.fps}
                />

                <InfoItem
                  title="Codec"
                  value={footage.codec}
                />

                <InfoItem
                  title="Format"
                  value={footage.format}
                />

                <InfoItem
                  title="Bitrate"
                  value={`${footage.bitrate} kbps`}
                />

                <InfoItem
                  title="Aspect Ratio"
                  value={footage.aspectRatio}
                />

                <InfoItem
                  title="Video Size"
                  value={`${(
                    footage.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB`}
                />

              </div>

            </TabsContent>

            {/* METADATA */}

            <TabsContent
              value="metadata"
              className="mt-6"
            >

              <div className="grid gap-6 md:grid-cols-2">

                <InfoItem
                  title="Category"
                  value={footage.category}
                />

                <InfoItem
                  title="Sub Category"
                  value={footage.subcategory}
                />

                <InfoItem
                  title="Location"
                  value={footage.location}
                />

                <InfoItem
                  title="Country"
                  value={footage.country}
                />

                <InfoItem
                  title="City"
                  value={footage.city}
                />

                <InfoItem
                  title="Season"
                  value={footage.season}
                />

                <InfoItem
                  title="Weather"
                  value={footage.weather}
                />

                <InfoItem
                  title="Mood"
                  value={footage.mood}
                />

                <InfoItem
                  title="Camera Angle"
                  value={footage.cameraAngle}
                />

                <InfoItem
                  title="Shot Type"
                  value={footage.shotType}
                />

                <InfoItem
                  title="Indoor"
                  value={
                    footage.indoor
                      ? "Yes"
                      : "No"
                  }
                />

                <InfoItem
                  title="People"
                  value={
                    footage.people
                      ? `${footage.peopleCount} detected`
                      : "None"
                  }
                />

              </div>

            </TabsContent>

            {/* TAGS */}

            <TabsContent
              value="tags"
              className="mt-6"
            >

              <ChipGrid
                items={footage.tags}
              />

            </TabsContent>

            {/* KEYWORDS */}

            <TabsContent
              value="keywords"
              className="mt-6"
            >

              <ChipGrid
                items={footage.keywords}
              />

            </TabsContent>

            {/* OBJECTS */}

            <TabsContent
              value="objects"
              className="mt-6"
            >

              <ChipGrid
                items={footage.objects}
              />

            </TabsContent>

            {/* ACTIVITIES */}

            <TabsContent
              value="activities"
              className="mt-6"
            >

              <ChipGrid
                items={footage.activities}
              />

            </TabsContent>

            {/* COLORS */}

            <TabsContent
              value="colors"
              className="mt-6"
            >

              <ChipGrid
                items={footage.colors}
              />

            </TabsContent>

          </Tabs>

        </CardContent>

      </Card>

    </div>
  );
}

/* Helpers */

function InfoItem({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-xl border bg-muted/30 p-4">

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h4 className="mt-2 font-semibold">
        {value || "-"}
      </h4>

    </div>
  );
}

function ChipGrid({
  items,
}: {
  items: string[];
}) {
  if (!items?.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">

      {items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className="rounded-full px-4 py-2 text-sm"
        >
          {item}
        </Badge>
      ))}

    </div>
  );
}