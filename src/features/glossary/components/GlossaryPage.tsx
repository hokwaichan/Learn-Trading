import { Placeholder } from '@/components/ui/Placeholder';

export function GlossaryPage() {
  return (
    <Placeholder
      title="Glossary"
      description="Every trading term used in the app, in plain words."
      milestone={4}
      planned={[
        "Searchable list of every term with a one-sentence definition",
        "Links to related terms and to the lesson that teaches each one",
      ]}
    />
  );
}
