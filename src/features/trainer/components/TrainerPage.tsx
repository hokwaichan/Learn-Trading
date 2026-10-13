import { Placeholder } from '@/components/ui/Placeholder';

export function TrainerPage() {
  return (
    <Placeholder
      title="Trainer"
      description="Short drills that train your eye on real charts."
      milestone={5}
      planned={[
        "Name the candlestick or chart pattern on a real chart segment",
        "\"What happened next?\" drills with the future hidden",
        "Options drills: read a payoff diagram, pick a strategy for an outlook",
        "Accuracy per pattern, with weak ones shown more often",
      ]}
    />
  );
}
