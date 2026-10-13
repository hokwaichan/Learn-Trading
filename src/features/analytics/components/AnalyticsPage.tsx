import { Placeholder } from '@/components/ui/Placeholder';

export function AnalyticsPage() {
  return (
    <Placeholder
      title="Analytics"
      description="How your paper trading is really going."
      milestone={11}
      planned={[
        "Equity curve, win rate, expectancy and average risk/reward",
        "Performance by setup, instrument type, day of week and emotion",
      ]}
    />
  );
}
