import { Placeholder } from '@/components/ui/Placeholder';

export function BacktesterPage() {
  return (
    <Placeholder
      title="Backtester"
      description="Test a rule-based strategy on historical data without writing code."
      milestone={8}
      planned={[
        "A rule builder: enter when a condition is true, exit when another is",
        "Preset strategies you can load and adjust",
        "Equity curve, trades marked on the chart, and a comparison with buy-and-hold",
        "Leverage, funding costs and liquidation for futures strategies",
      ]}
    />
  );
}
