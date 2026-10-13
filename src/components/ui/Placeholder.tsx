import { Construction } from 'lucide-react';
import { Badge, Card } from './Card';
import { Page, PageHeader } from './States';

export interface PlaceholderProps {
  title: string;
  description: string;
  milestone: number;
  /** What this screen will do once its milestone is built. */
  planned: string[];
  /** Route parameter to show, e.g. the symbol. */
  context?: string;
}

/** Stand-in for a screen whose milestone has not been built yet. */
export function Placeholder({ title, description, milestone, planned, context }: PlaceholderProps) {
  return (
    <Page className="max-w-3xl">
      <PageHeader
        title={title}
        description={description}
        actions={context ? <Badge tone="accent">{context}</Badge> : undefined}
      />
      <Card
        title={
          <span className="flex items-center gap-2">
            <Construction aria-hidden className="size-4 text-warning-text" />
            Not built yet
          </span>
        }
        actions={<Badge tone="warning">Milestone {milestone}</Badge>}
      >
        <p className="text-sm text-muted">This screen is a placeholder. When its milestone is done it will have:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg">
          {planned.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Card>
    </Page>
  );
}
