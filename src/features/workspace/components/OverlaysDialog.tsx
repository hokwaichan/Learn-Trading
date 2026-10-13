import { Link } from 'react-router-dom';
import { OVERLAY_OPTIONS, type StructureOverlays } from '@/components/chart';
import { Button, Modal, Switch } from '@/components/ui';

export interface OverlaysDialogProps {
  open: boolean;
  onClose: () => void;
  overlays: StructureOverlays;
  onChange: (overlays: StructureOverlays) => void;
  /** False on daily charts, where sessions and kill zones cannot be drawn. */
  intraday: boolean;
}

/** Switches for the structure and session markings drawn over the chart. */
export function OverlaysDialog({ open, onClose, overlays, onChange, intraday }: OverlaysDialogProps) {
  const anyOn = Object.values(overlays).some(Boolean);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chart overlays"
      footer={
        <>
          <Button disabled={!anyOn} onClick={() => onChange(Object.fromEntries(OVERLAY_OPTIONS.map((o) => [o.key, false])) as unknown as StructureOverlays)}>
            Turn all off
          </Button>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">
        Markings from smart money concepts (SMC) and ICT, found automatically on the last 500 candles. They are one way of reading a chart, drawn by fixed rules, not signals to trade. The{' '}
        <Link to="/learn/smart-money/structure-bos-choch" className="text-accent-text underline underline-offset-4" onClick={onClose}>
          Smart money concepts
        </Link>{' '}
        lessons explain each one.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {OVERLAY_OPTIONS.map((option) => {
          const unavailable = option.intraday === true && !intraday;
          return (
            <Switch
              key={option.key}
              label={option.label}
              description={unavailable ? `${option.description} Needs a chart of 1 hour candles or shorter.` : option.description}
              checked={overlays[option.key] && !unavailable}
              disabled={unavailable}
              onChange={(on) => onChange({ ...overlays, [option.key]: on })}
            />
          );
        })}
      </div>
    </Modal>
  );
}
