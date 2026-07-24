import { Download, ExternalLink, FileText, Code2, PlayCircle, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ResourceSummary, ResourceType } from "@/features/resources/types/resource";

const TYPE_META: Record<ResourceType, { label: string; icon: LucideIcon }> = {
  PDF: { label: "PDF", icon: FileText },
  PRESENTATION: { label: "اسلاید", icon: FileText },
  GITHUB: { label: "گیت‌هاب", icon: Code2 },
  VIDEO: { label: "ویدیو", icon: PlayCircle },
  RESEARCH_PAPER: { label: "مقاله پژوهشی", icon: BookOpen },
  EXTERNAL_LINK: { label: "لینک خارجی", icon: ExternalLink },
};

interface ResourceCardProps {
  readonly resource: ResourceSummary;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const { label, icon: Icon } = TYPE_META[resource.resourceType];
  const href = resource.fileUrl ?? resource.externalUrl ?? "#";
  const isExternal = Boolean(resource.externalUrl && !resource.fileUrl);

  return (
    <Card className="flex flex-col hover:-translate-y-0.5">
      <CardHeader>
        <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <Badge variant="neutral" className="w-fit">
          {label}
        </Badge>
        <CardTitle>{resource.title}</CardTitle>
        {resource.description ? (
          <CardDescription>{resource.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={href} target="_blank" rel="noreferrer noopener">
            {isExternal ? (
              <>
                <ExternalLink className="size-4" aria-hidden="true" />
                مشاهده
              </>
            ) : (
              <>
                <Download className="size-4" aria-hidden="true" />
                دانلود
              </>
            )}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ResourceCard };
