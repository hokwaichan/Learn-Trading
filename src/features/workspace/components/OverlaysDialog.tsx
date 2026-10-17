import { Link } from 'react-router-dom';
import { OVERLAY_OPTIONS, type StructureOverlays } from '@/components/chart';
import { Button, Modal, Switch, Trans } from '@/components/ui';
import { t } from '@/i18n';

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
      title={t('Chart overlays')}
      footer={
        <>
          <Button disabled={!anyOn} onClick={() => onChange(Object.fromEntries(OVERLAY_OPTIONS.map((o) => [o.key, false])) as unknown as StructureOverlays)}>
            {t('Turn all off')}
          </Button>
          <Button variant="primary" onClick={onClose}>
            {t('Done')}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">
        <Trans
          text="Markings from smart money concepts (SMC) and ICT, found automatically on the last 500 candles. They are one way of reading a chart, drawn by fixed rules, not signals to trade. The {lessons} lessons explain each one."
          values={{
            lessons: (
              <Link to="/learn/smart-money/structure-bos-choch" className="text-accent-text underline underline-offset-4" onClick={onClose}>
                {t('Smart money concepts')}
              </Link>
            ),
          }}
        />
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {OVERLAY_OPTIONS.map((option) => {
          const unavailable = option.intraday === true && !intraday;
          return (
            <Switch
              key={option.key}
              label={option.label}
              description={unavailable ? `${option.description} ${t('Needs a chart of 1 hour candles or shorter.')}` : option.description}
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
