import { BookX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/ui';
import { getLesson, getModule } from '@/content/lessons';
import { CurriculumOverview } from './CurriculumOverview';
import { LessonView } from './LessonView';

export function LessonsPage() {
  const { moduleId, lessonId } = useParams();
  if (!moduleId || !lessonId) return <CurriculumOverview />;

  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!module || !lesson) {
    return (
      <EmptyState
        className="h-full"
        icon={<BookX />}
        title="Lesson not found"
        description="That address does not match any lesson. It may have been renamed."
        action={
          <Link to="/learn" className="text-sm text-accent-text underline underline-offset-4">
            See all lessons
          </Link>
        }
      />
    );
  }
  // The key gives each lesson fresh quiz and widget state.
  return <LessonView key={`${module.id}/${lesson.id}`} module={module} lesson={lesson} />;
}
