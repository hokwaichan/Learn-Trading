import { useState } from 'react';
import { CalendarSearch, ChevronRight, ChevronsRight, Pause, Play, Square } from 'lucide-react';
import { Button, IconButton, Input, Pnl, Select } from '@/components/ui';
import { formatMoney } from '@/lib/format';
import { REPLAY_SPEEDS } from '@/stores';

export interface PlaybackBarProps {
  playing: boolean;
  atEnd: boolean;
  speed: number;
  /** The replay clock, formatted for display. */
  clock: string;
  /** Start date of the session as YYYY-MM-DD, used as the earliest date offered. */
  date: string;
  equity: number;
  /** Replay equity minus the starting balance. */
  totalPnl: number;
  onPlay: (playing: boolean) => void;
  onStep: (count: number) => void;
  onSpeed: (speed: number) => void;
  onJump: (date: string) => void;
  onEnd: () => void;
}

/** Replay controls docked under the chart: play, pause, step, speed, jump to a date, and end. */
export function PlaybackBar(props: PlaybackBarProps) {
  const [jumpDate, setJumpDate] = useState('');
  const finished = props.atEnd;

  return (
    <div
      role="toolbar"
      aria-label="Replay controls"
      className="flex shrink-0 items-center gap-1 overflow-x-auto border-t border-border bg-surface px-2 py-1.5"
    >
      <Button
        variant="primary"
        className="w-[5.5rem] shrink-0"
        disabled={finished}
        icon={props.playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
        aria-keyshortcuts="Space"
        onClick={() => props.onPlay(!props.playing)}
      >
        {props.playing ? 'Pause' : 'Play'}
      </Button>
      <IconButton
        label="Next candle (N)"
        aria-keyshortcuts="N"
        disabled={finished}
        tooltipSide="top"
        icon={<ChevronRight className="size-4" />}
        onClick={() => props.onStep(1)}
      />
      <IconButton
        label="Forward 10 candles"
        disabled={finished}
        tooltipSide="top"
        icon={<ChevronsRight className="size-4" />}
        onClick={() => props.onStep(10)}
      />
      <Select
        aria-label="Playback speed"
        className="w-24"
        wrapperClassName="shrink-0"
        value={String(props.speed)}
        onChange={(value) => props.onSpeed(Number(value))}
        options={REPLAY_SPEEDS.map((s) => ({ value: String(s), label: `${s} / sec` }))}
      />

      <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />
      <span className="flex shrink-0 flex-col leading-tight" aria-live="off">
        <span className="text-[11px] text-muted">Replay time</span>
        <span className="num text-sm text-fg">{props.clock}</span>
      </span>
      {finished && <span className="shrink-0 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[11px] text-warning-text">End of history</span>}

      <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />
      <form
        className="flex shrink-0 items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (jumpDate) props.onJump(jumpDate);
        }}
      >
        <Input aria-label="Jump to date" type="date" className="num w-[8.5rem]" min={props.date} max={new Date().toISOString().slice(0, 10)} value={jumpDate} onChange={(e) => setJumpDate(e.target.value)} />
        <Button type="submit" disabled={!jumpDate} icon={<CalendarSearch aria-hidden className="size-4" />}>
          Jump
        </Button>
      </form>

      <div className="min-w-2 flex-1" />
      <span className="flex shrink-0 flex-col items-end leading-tight">
        <span className="text-[11px] text-muted">Replay account</span>
        <span className="num text-sm text-fg">
          {formatMoney(props.equity)} <Pnl value={props.totalPnl} className="text-xs" />
        </span>
      </span>
      <Button className="ml-2 shrink-0" icon={<Square aria-hidden className="size-3.5" />} onClick={props.onEnd}>
        End session
      </Button>
    </div>
  );
}
