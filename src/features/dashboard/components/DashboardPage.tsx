import { Placeholder } from '@/components/ui/Placeholder';

export function DashboardPage() {
  return (
    <Placeholder
      title="Home"
      description="Your learning and paper-trading summary in one place."
      milestone={12}
      planned={[
        "A \"continue learning\" card and the suggested next lesson",
        "The daily challenge: one pattern quiz and one concept question",
        "Paper account summary with a small equity sparkline",
        "Progress per module, recent trades, and your weakest patterns",
      ]}
    />
  );
}
