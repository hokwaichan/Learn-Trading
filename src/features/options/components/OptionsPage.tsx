import { useParams } from 'react-router-dom';
import { Placeholder } from '@/components/ui/Placeholder';

export function OptionsPage() {
  const { symbol } = useParams();
  return (
    <Placeholder
      title="Options"
      description="Option chain and strategy builder on simulated prices."
      milestone={10}
      context={symbol}
      planned={[
        "A simulated option chain priced with the Black-Scholes model",
        "Strategy builder with up to four legs and a payoff diagram",
        "\"What if\" sliders for price, days to expiry and implied volatility",
        "Options paper trading with expiry and assignment",
      ]}
    />
  );
}
