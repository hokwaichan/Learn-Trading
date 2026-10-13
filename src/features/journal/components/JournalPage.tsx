import { useParams } from 'react-router-dom';
import { Placeholder } from '@/components/ui/Placeholder';

export function JournalPage() {
  const { tradeId } = useParams();
  return (
    <Placeholder
      title="Journal"
      description="Every paper trade, logged automatically."
      milestone={11}
      context={tradeId}
      planned={[
        "A filterable table of every spot, futures and options trade",
        "A detail view with the chart snapshot, the numbers and your notes",
        "Emotion and setup tags, and a post-trade review",
        "Export to CSV",
      ]}
    />
  );
}
