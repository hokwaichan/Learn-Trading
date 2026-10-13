import { Placeholder } from '@/components/ui/Placeholder';

export function ReplayPage() {
  return (
    <Placeholder
      title="Replay"
      description="Practise on years of history in minutes."
      milestone={7}
      planned={[
        "Pick a symbol and a past date, with the future hidden",
        "Play, pause, step and change speed",
        "Paper trade during the replay on a separate replay account",
      ]}
    />
  );
}
