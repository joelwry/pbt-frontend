"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AdminQuizQuestion } from "@/features/admin-content/types";

function newQuestion(): AdminQuizQuestion {
  return {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  };
}

export { newQuestion };

export function QuizQuestionBuilder({
  questions,
  onChange,
}: {
  questions: AdminQuizQuestion[];
  onChange: (questions: AdminQuizQuestion[]) => void;
}) {
  function updateQuestion(index: number, patch: Partial<AdminQuizQuestion>) {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const options = [...questions[qIndex].options];
    options[oIndex] = value;
    updateQuestion(qIndex, { options });
  }

  function removeQuestion(index: number) {
    onChange(questions.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5">
      {questions.length === 0 && (
        <p className="text-sm text-text-muted">No questions yet — add at least one below.</p>
      )}

      {questions.map((question, qIndex) => (
        <div key={question.id} className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`question-${question.id}`}>Question {qIndex + 1}</Label>
              <Input
                id={`question-${question.id}`}
                value={question.question}
                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                placeholder="e.g. What is a BRRRR strategy?"
              />
            </div>
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="mt-7 inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-[#FEF2F2] hover:text-error shrink-0"
              aria-label={`Remove question ${qIndex + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <Label>Answer options — select the correct one</Label>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctIndex === oIndex}
                  onChange={() => updateQuestion(qIndex, { correctIndex: oIndex })}
                  className="h-4 w-4 accent-sky-600 shrink-0"
                  aria-label={`Mark option ${oIndex + 1} as correct`}
                />
                <Input
                  value={option}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={() => onChange([...questions, newQuestion()])}>
        <Plus className="h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}
