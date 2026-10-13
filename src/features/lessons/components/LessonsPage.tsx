import { useParams } from 'react-router-dom';
import { Placeholder } from '@/components/ui/Placeholder';

export function LessonsPage() {
  const { lessonId } = useParams();
  return (
    <Placeholder
      title="Lessons"
      description="Eleven modules that take you from the basics to futures and options."
      milestone={4}
      context={lessonId}
      planned={[
        "The full curriculum in recommended order, with nothing locked",
        "Plain-language explanations with interactive chart examples",
        "A 3 to 5 question quiz at the end of every lesson",
        "Glossary terms linked wherever they appear",
      ]}
    />
  );
}
