import { useRef, useState } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { Button, Card, ConfirmDialog, toast } from '@/components/ui';
import { BACKUP_KEYS, clearAll, createBackup, parseBackup, restoreBackup, STORE_NAMES, type BackupFile } from '@/lib/backup';

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Export everything to a file, import it back, or erase it all. */
export function DataCard() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ backup: BackupFile; stores: string[]; name: string } | null>(null);
  const [erasing, setErasing] = useState(false);

  const exportAll = () => {
    const backup = createBackup(localStorage);
    const count = Object.keys(backup.data).length;
    download(`tradeschool-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(backup, null, 2));
    toast.success('Backup saved', count ? 'Keep the file somewhere safe. It can be imported on any device.' : 'There was nothing saved yet, so the file is empty.');
  };

  const choose = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = parseBackup(await file.text());
      if (result.ok) setPending({ backup: result.backup, stores: result.stores, name: file.name });
      else toast.error('Could not import', result.error);
    } catch {
      toast.error('Could not import', 'The file could not be read.');
    }
    // Allow choosing the same file again.
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <Card title="Your data">
      <p className="text-sm text-muted">
        Everything is stored in this browser only: nothing is sent to a server, and there is no account. Clearing your browser data erases it, so export a backup if it matters to you.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button icon={<Download aria-hidden className="size-4" />} onClick={exportAll}>
          Export all data
        </Button>
        <Button icon={<Upload aria-hidden className="size-4" />} onClick={() => fileInput.current?.click()}>
          Import a backup
        </Button>
        <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Backup file to import" onChange={(e) => void choose(e.target.files?.[0])} />
        <Button variant="danger" icon={<Trash2 aria-hidden className="size-4" />} onClick={() => setErasing(true)}>
          Erase everything
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted">
        A backup holds your settings, paper and replay accounts, lesson and trainer progress, journal notes, chart layouts and drawings, and saved strategies. Chart pictures in the Journal are
        rebuilt from price history when needed.
      </p>

      <ConfirmDialog
        open={pending != null}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          restoreBackup(localStorage, pending.backup);
          window.location.reload();
        }}
        title="Replace everything with this backup?"
        confirmLabel="Import and replace"
      >
        <p>
          <span className="num">{pending?.name}</span>
          {pending?.backup.exportedAt ? ` was exported on ${new Date(pending.backup.exportedAt).toLocaleString()}.` : '.'} It contains:
        </p>
        <ul className="mt-2 list-disc space-y-0.5 pl-5">
          {pending?.stores.map((key) => (
            <li key={key}>{STORE_NAMES[key as (typeof BACKUP_KEYS)[number]] ?? key}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted">Everything currently in this browser is replaced, including anything the backup does not contain. This cannot be undone. The page reloads afterwards.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={erasing}
        onClose={() => setErasing(false)}
        onConfirm={() => {
          clearAll(localStorage);
          window.location.reload();
        }}
        title="Erase everything?"
        confirmLabel="Erase everything"
      >
        <p>This removes your lesson progress, trainer history, paper and replay accounts, journal notes, drawings, saved strategies and settings from this browser.</p>
        <p className="mt-2 text-muted">It cannot be undone. Export a backup first if you might want any of it back. The page reloads afterwards.</p>
      </ConfirmDialog>
    </Card>
  );
}
