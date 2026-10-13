import { Placeholder } from '@/components/ui/Placeholder';

export function ToolsPage() {
  return (
    <Placeholder
      title="Calculators"
      description="Quick calculators for sizing and risk."
      milestone={12}
      planned={[
        "Position size, risk/reward and break-even win rate",
        "Compounding, and futures leverage and liquidation price",
        "Option profit and probability of profit",
      ]}
    />
  );
}
