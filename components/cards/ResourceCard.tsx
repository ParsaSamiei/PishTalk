import { Download, ExternalLink, FileText, Code2, PlayCircle, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ResourceSummary, ResourceType } from "@/features/resources/types/resource";
import { pick } from "@/lib/i18n/content";
import { getLocaleContext } from "@/lib/i18n/server";

const TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  PDF: FileText,
  PRESENTATION: FileText,
  GITHUB: Code2,
  VIDEO: PlayCircle,
  RESEARCH_PAPER: BookOpen,
  EXTERNAL_LINK: ExternalLink,
};

interface ResourceCardProps {
  readonly resource: ResourceSummary;
}

async function ResourceCard({ resource }: ResourceCardProps) {
  const { locale, dictionary: d } = await getLocaleContext();
  const Icon = TYPE_ICONS[resource.resourceType];
  const label = d.resources.types[resource.resourceType];
  const description = pick(locale, resource.description, resource.descriptionEn);
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
        <CardTitle>{pick(locale, resource.title, resource.titleEn)}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={href} target="_blank" rel="noreferrer noopener">
            {isExternal ? (
              <>
                <ExternalLink className="size-4" aria-hidden="true" />
                {d.common.view}
              </>
            ) : (
              <>
                <Download className="size-4" aria-hidden="true" />
                {d.common.download}
              </>
            )}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ResourceCard };
