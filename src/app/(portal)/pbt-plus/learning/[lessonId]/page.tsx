import { LessonDetailView } from "@/features/learning/components/lesson-detail-view";

export default async function PbtPlusLessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return <LessonDetailView lessonId={lessonId} contentTier="Plus" basePath="/pbt-plus/learning" homeLabel="PBT Plus Learning" />;
}
