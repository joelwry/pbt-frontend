"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileText, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LessonBody, QuizQuestion } from "@/features/learning/types";

export function LessonBodyRenderer({ body }: { body: LessonBody }) {
  switch (body.kind) {
    case "video":
      return <VideoBlock body={body} />;
    case "article":
      return <ArticleBlock body={body} />;
    case "pdf":
      return <PdfBlock body={body} />;
    case "quiz":
      return <QuizBlock body={body} />;
  }
}

function VideoBlock({ body }: { body: Extract<LessonBody, { kind: "video" }> }) {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center relative">
        <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center">
          <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
        </div>
        <span className="absolute bottom-4 right-4 text-xs font-semibold text-white/80 bg-black/30 rounded-full px-2.5 py-1">
          {body.durationLabel}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-base font-semibold text-text-primary mb-2">Transcript summary</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{body.transcript}</p>
      </div>
    </Card>
  );
}

function ArticleBlock({ body }: { body: Extract<LessonBody, { kind: "article" }> }) {
  return (
    <Card>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">{body.readTimeLabel}</p>
      <div
        className="text-sm text-text-secondary leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: body.html }}
      />
    </Card>
  );
}

function PdfBlock({ body }: { body: Extract<LessonBody, { kind: "pdf" }> }) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-sky-tint text-sky-600 flex items-center justify-center shrink-0">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{body.pageCountLabel}</p>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">{body.summary}</p>
          <Button variant="secondary" size="sm" className="mt-4" asChild>
            <a href={body.fileUrl} download>
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function QuizBlock({ body }: { body: Extract<LessonBody, { kind: "quiz" }> }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? body.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-base font-semibold text-text-primary">
          Knowledge Check · {body.questionCount} questions
        </h3>
        {submitted && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D]">
            <CheckCircle2 className="h-4 w-4" />
            {score}/{body.questions.length} correct
          </span>
        )}
      </div>

      <div className="space-y-6">
        {body.questions.map((question, i) => (
          <QuizQuestionRow
            key={question.id}
            index={i}
            question={question}
            selected={answers[question.id]}
            submitted={submitted}
            onSelect={(optionIndex) => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
          />
        ))}
      </div>

      {!submitted && (
        <Button
          className="mt-6"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < body.questions.length}
        >
          Submit Answers
        </Button>
      )}
    </Card>
  );
}

function QuizQuestionRow({
  index,
  question,
  selected,
  submitted,
  onSelect,
}: {
  index: number;
  question: QuizQuestion;
  selected?: number;
  submitted: boolean;
  onSelect: (optionIndex: number) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-text-primary mb-3">
        {index + 1}. {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrect = submitted && optionIndex === question.correctIndex;
          const isWrongSelected = submitted && isSelected && optionIndex !== question.correctIndex;

          return (
            <button
              key={option}
              type="button"
              disabled={submitted}
              onClick={() => onSelect(optionIndex)}
              className={[
                "w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors",
                isCorrect
                  ? "border-[#86EFAC] bg-[#F0FDF4] text-[#15803D] font-medium"
                  : isWrongSelected
                    ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C] font-medium"
                    : isSelected
                      ? "border-sky-500 bg-sky-tint text-text-primary"
                      : "border-border bg-white text-text-secondary hover:bg-[#F5F8FA]",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
