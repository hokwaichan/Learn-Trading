import { useMemo } from 'react';
import { Card, DataTable, EmptyState, ProgressBar, type Column } from '@/components/ui';
import { CANDLESTICK_PATTERNS, CHART_PATTERNS } from '@/content/patterns';
import { OUTLOOK_SCENARIOS } from '@/content/strategies';
import { useProgress } from '@/stores';
import type { ReviewCard } from '@/types';
import { accuracyText, PAYOFF_STRATEGIES } from '../questions';

interface Row {
  id: string;
  name: string;
  group: string;
  card?: ReviewCard;
}

const DAY_MS = 86_400_000;

function dueText(card: ReviewCard | undefined, now: number): string {
  if (!card || card.attempts === 0) return 'Not seen yet';
  const days = Math.ceil((card.dueAt - now) / DAY_MS);
  return days <= 0 ? 'Due now' : days === 1 ? 'Tomorrow' : `In ${days} days`;
}

/** Every trainer item with how often you get it right, weakest first. */
export function AccuracyTable() {
  const cards = useProgress((s) => s.cards);
  // A stable "now" for this render pass; the table does not need to tick.
  const now = useMemo(() => Date.now(), [cards]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo<Row[]>(
    () => [
      ...CANDLESTICK_PATTERNS.map((p) => ({ id: `pattern:${p.id}`, name: p.name, group: 'Candlestick' })),
      ...CHART_PATTERNS.map((p) => ({ id: `pattern:${p.id}`, name: p.name, group: 'Chart pattern' })),
      { id: 'what-next:all', name: 'What happened next?', group: 'Prediction' },
      ...PAYOFF_STRATEGIES.map((s) => ({ id: `option-payoff:${s.id}`, name: s.name, group: 'Payoff diagram' })),
      ...OUTLOOK_SCENARIOS.map((s, i) => ({ id: `option-outlook:${s.id}`, name: `Outlook scenario ${i + 1}`, group: 'Strategy choice' })),
    ].map((row) => ({ ...row, card: cards[row.id] })),
    [cards],
  );
  const seen = rows.filter((r) => r.card && r.card.attempts > 0);

  const columns: Column<Row>[] = [
    { id: 'name', header: 'Item', cell: (r) => r.name, sortValue: (r) => r.name },
    { id: 'group', header: 'Drill', cell: (r) => <span className="text-muted">{r.group}</span>, sortValue: (r) => r.group, hideOnPhone: true },
    { id: 'attempts', header: 'Answered', numeric: true, cell: (r) => r.card?.attempts ?? 0, sortValue: (r) => r.card?.attempts ?? 0 },
    {
      id: 'accuracy',
      header: 'Right',
      numeric: true,
      cell: (r) => (
        <span className="inline-flex items-center justify-end gap-2">
          <ProgressBar
            className="hidden w-16 sm:flex"
            label={`${r.name} accuracy`}
            value={r.card && r.card.attempts ? r.card.correct / r.card.attempts : 0}
            tone={r.card && r.card.correct / r.card.attempts < 0.5 ? 'warning' : 'up'}
          />
          {accuracyText(r.card)}
        </span>
      ),
      // Unseen items sort after everything that has been answered.
      sortValue: (r) => (r.card && r.card.attempts ? r.card.correct / r.card.attempts : 2),
    },
    { id: 'due', header: 'Next review', cell: (r) => <span className="text-muted">{dueText(r.card, now)}</span>, sortValue: (r) => r.card?.dueAt ?? Infinity, hideOnPhone: true },
  ];

  return (
    <Card title="Your accuracy" flush>
      {seen.length === 0 ? (
        <EmptyState
          className="py-8"
          title="Nothing answered yet"
          description="Answer a few questions and this table will show which patterns you know and which need work. Weak ones are asked more often."
        />
      ) : (
        <>
          <p className="border-b border-border px-4 py-2.5 text-sm text-muted">
            Weakest first. Items you get wrong come back sooner and more often; ones you know are spaced further apart.
          </p>
          <DataTable
            label="Accuracy by item"
            dense
            className="max-h-80"
            columns={columns}
            rows={seen}
            rowKey={(r) => r.id}
            // 'desc' on this column would put the best first; start with the weakest.
            initialSort={{ id: 'accuracy', dir: 'asc' }}
          />
        </>
      )}
    </Card>
  );
}
