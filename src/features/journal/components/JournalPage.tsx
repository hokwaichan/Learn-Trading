import { useMemo, useState } from 'react';
import { Download, NotebookPen, StickyNote } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, DataTable, EmptyState, Input, Page, PageHeader, Pnl, Select, toast, type Column } from '@/components/ui';
import { intlLocale, t } from '@/i18n';
import { displaySymbol, findInstrument } from '@/lib/data';
import { EMOTIONS, EXIT_LABELS, filterRows, journalRows, KIND_LABELS, setupOptions, toCsv, type JournalFilter, type JournalRow } from '@/lib/journal/journal';
import { useAccount, useJournal } from '@/stores';
import type { InstrumentKind } from '@/types';
import { JournalDetail } from './JournalDetail';

type Scope = 'main' | 'replay' | 'all';

const when = (time: number) => new Date(time).toLocaleString(intlLocale(), { month: 'short', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' });
const nameOf = (row: JournalRow) => {
  const instrument = findInstrument(row.symbol, row.kind === 'perpetual' ? 'perpetual' : 'spot') ?? findInstrument(row.symbol, 'spot');
  return instrument ? displaySymbol(instrument) : row.symbol;
};

function download(filename: string, text: string) {
  // The byte-order mark makes Excel read the file as UTF-8.
  const url = URL.createObjectURL(new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const COLUMNS: Column<JournalRow>[] = [
  {
    id: 'closed',
    header: t('Closed'),
    cell: (r) => (r.closedAt != null ? <span className="num text-muted">{when(r.closedAt)}</span> : <Badge tone="accent">{t('status::Open')}</Badge>),
    sortValue: (r) => r.closedAt ?? Number.MAX_SAFE_INTEGER,
  },
  {
    id: 'symbol',
    header: t('Trade'),
    cell: (r) => (
      <span className="flex flex-col leading-tight">
        <span className="num font-medium text-fg">{nameOf(r)}</span>
        {r.label && <span className="text-[11px] text-muted">{r.label}</span>}
      </span>
    ),
    sortValue: (r) => r.symbol,
  },
  { id: 'kind', header: t('Type'), cell: (r) => KIND_LABELS[r.kind], sortValue: (r) => r.kind, hideOnPhone: true },
  {
    id: 'side',
    header: t('Side'),
    hideOnPhone: true,
    cell: (r) => (r.kind === 'option' ? <span className="text-muted">–</span> : <Badge tone={r.direction === 'long' ? 'up' : 'down'}>{r.direction === 'long' ? t('Long') : t('Short')}</Badge>),
  },
  { id: 'pnl', header: t('Result'), numeric: true, align: 'right', cell: (r) => (r.netPnl != null ? <Pnl value={r.netPnl} /> : <span className="text-muted">–</span>), sortValue: (r) => r.netPnl ?? 0 },
  {
    id: 'r',
    header: 'R',
    numeric: true,
    align: 'right',
    hideOnPhone: true,
    cell: (r) => (r.rMultiple != null ? <span className={r.rMultiple >= 0 ? 'text-up-text' : 'text-down-text'}>{`${r.rMultiple >= 0 ? '+' : ''}${r.rMultiple.toFixed(2)}R`}</span> : <span className="text-muted">–</span>),
    sortValue: (r) => r.rMultiple ?? 0,
  },
  { id: 'exit', header: t('Closed by'), hideOnPhone: true, cell: (r) => <span className="text-muted">{r.trade ? EXIT_LABELS[r.trade.exitReason] : '–'}</span> },
  { id: 'setup', header: t('Setup'), hideOnPhone: true, cell: (r) => r.note?.setup ?? <span className="text-muted">–</span>, sortValue: (r) => r.note?.setup ?? '' },
  {
    id: 'emotion',
    header: t('Feeling'),
    hideOnPhone: true,
    cell: (r) => (r.note?.emotion ? EMOTIONS.find((e) => e.id === r.note!.emotion)?.label : <span className="text-muted">–</span>),
    sortValue: (r) => r.note?.emotion ?? '',
  },
  {
    id: 'notes',
    header: t('Notes'),
    cell: (r) =>
      r.note && (r.note.reasoning || r.note.review) ? (
        <span className="inline-flex items-center gap-1 text-muted">
          <StickyNote aria-hidden className="size-3.5" />
          <span className="sr-only">{t('Has notes')}</span>
        </span>
      ) : (
        <span className="text-xs text-accent-text">{t('Add')}</span>
      ),
  },
];

function JournalList() {
  const navigate = useNavigate();
  const accounts = useAccount((s) => s.accounts);
  const notes = useJournal((s) => s.notes);
  const [scope, setScope] = useState<Scope>('main');
  const [filter, setFilter] = useState<JournalFilter>({ kind: 'all', result: 'all', emotion: 'all', setup: '', search: '' });

  const all = useMemo(() => journalRows(scope === 'all' ? [accounts.main, accounts.replay] : [accounts[scope]], notes), [accounts, notes, scope]);
  const rows = useMemo(() => filterRows(all, filter), [all, filter]);
  const usedSetups = useMemo(() => setupOptions(notes).filter((s) => Object.values(notes).some((n) => n.setup === s)), [notes]);
  const closed = rows.filter((r) => r.status === 'closed');
  const net = closed.reduce((sum, r) => sum + (r.netPnl ?? 0), 0);
  const set = (patch: Partial<JournalFilter>) => setFilter((f) => ({ ...f, ...patch }));
  const filtered = rows.length !== all.length;

  return (
    <Page>
      <PageHeader
        title={t('Journal')}
        description={t('Every paper trade is logged here automatically, with a chart of the market at the time. Open one to add why you took it, how you felt, and what you learned.')}
        actions={
          <Button
            icon={<Download aria-hidden className="size-4" />}
            disabled={rows.length === 0}
            onClick={() => {
              download(`tradeschool-journal-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
              toast.success(
                t('Journal exported'),
                rows.length === 1 ? t('1 trade saved as a CSV file.') : t('{n} trades saved as a CSV file.', { n: rows.length }),
              );
            }}
          >
            {t('Export CSV')}
          </Button>
        }
      />

      <Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Select<Scope>
            label={t('Account')}
            value={scope}
            onChange={setScope}
            options={[
              { value: 'main', label: t('Paper account') },
              { value: 'replay', label: t('Replay account') },
              { value: 'all', label: t('Both') },
            ]}
          />
          <Select<InstrumentKind | 'all'>
            label={t('Type')}
            value={filter.kind ?? 'all'}
            onChange={(kind) => set({ kind })}
            options={[{ value: 'all', label: t('All types') }, ...(['spot', 'perpetual', 'option'] as const).map((k) => ({ value: k, label: KIND_LABELS[k] }))]}
          />
          <Select<NonNullable<JournalFilter['result']>>
            label={t('Result')}
            value={filter.result ?? 'all'}
            onChange={(result) => set({ result })}
            options={[
              { value: 'all', label: t('All results') },
              { value: 'wins', label: t('Wins') },
              { value: 'losses', label: t('Losses') },
              { value: 'open', label: t('Still open') },
            ]}
          />
          <Select label={t('Setup')} value={filter.setup ?? ''} onChange={(setup) => set({ setup })} options={[{ value: '', label: t('All setups') }, ...usedSetups.map((s) => ({ value: s, label: s }))]} />
          <Select<NonNullable<JournalFilter['emotion']>>
            label={t('Feeling')}
            value={filter.emotion ?? 'all'}
            onChange={(emotion) => set({ emotion })}
            options={[{ value: 'all', label: t('All feelings') }, ...EMOTIONS.map((e) => ({ value: e.id, label: e.label })), { value: 'none', label: t('Not tagged') }]}
          />
          <Input label={t('Search')} placeholder={t('Symbol or strategy')} value={filter.search ?? ''} onChange={(e) => set({ search: e.target.value })} />
        </div>
      </Card>

      <Card
        flush
        title={
          <span>
            {rows.length === 1 ? t('1 trade') : t('{n} trades', { n: rows.length })}
            {filtered && <span className="font-normal text-muted"> {t('of {total}', { total: all.length })}</span>}
          </span>
        }
        actions={
          closed.length > 0 && (
            <span className="text-xs text-muted">
              {t('Closed trades total')} <Pnl value={net} className="text-sm" />
            </span>
          )
        }
      >
        <DataTable
          label={t('Trades')}
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.accountId}:${r.id}`}
          onRowClick={(r) => navigate(`/journal/${r.id}`)}
          initialSort={{ id: 'closed', dir: 'desc' }}
          empty={
            all.length === 0 ? (
              <EmptyState
                className="py-12"
                icon={<NotebookPen />}
                title={t('No trades yet')}
                description={scope === 'replay' ? t('Trades you make in Replay are logged here.') : t('Place a paper trade and it will be logged here automatically.')}
                action={
                  <Link to={scope === 'replay' ? '/replay' : '/charts/BTCUSDT'} className="text-sm text-accent-text underline underline-offset-4">
                    {scope === 'replay' ? t('Open Replay') : t('Open the charts')}
                  </Link>
                }
              />
            ) : (
              <EmptyState className="py-12" title={t('No trades match these filters')} description={t('Clear a filter to see more.')} />
            )
          }
        />
      </Card>
      <p className="text-xs text-muted">{t('Click a trade to open it. The CSV export contains the trades shown above, with your notes.')}</p>
    </Page>
  );
}

/** The trade journal: a filterable list, or one trade in detail when the address names it. */
export function JournalPage() {
  const { tradeId } = useParams();
  const accounts = useAccount((s) => s.accounts);
  const notes = useJournal((s) => s.notes);
  const row = useMemo(() => (tradeId ? journalRows([accounts.main, accounts.replay], notes).find((r) => r.id === tradeId) : undefined), [tradeId, accounts, notes]);

  if (!tradeId) return <JournalList />;
  if (!row) {
    return (
      <EmptyState
        className="h-full"
        icon={<NotebookPen />}
        title={t('That trade is not in the journal')}
        description={t('It may have been cleared when the account was reset.')}
        action={
          <Link to="/journal" className="text-sm text-accent-text underline underline-offset-4">
            {t('Back to the journal')}
          </Link>
        }
      />
    );
  }
  return <JournalDetail key={row.id} row={row} />;
}
