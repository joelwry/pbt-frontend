import { LessonDetailView } from "@/features/learning/components/lesson-detail-view";

export default async function PbtMasterplanLessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return (
    <LessonDetailView lessonId={lessonId} contentTier="Mentorship" basePath="/pbt-masterplan/learning" homeLabel="PBT Masterplan Learning" />
  );
}
