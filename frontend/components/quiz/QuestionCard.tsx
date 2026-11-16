import React from 'react';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { HelpCircle } from 'lucide-react';

export interface QuestionCardProps {
  text: string;
  explanation?: string | null;
  imageUrl?: string | null;
  isRevealed?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  text,
  explanation,
  imageUrl,
  isRevealed = false,
}) => {
  return (
    <Card className="w-full text-center relative overflow-hidden bg-white/95 backdrop-blur-sm border-stone-200">
      {imageUrl && (
        <div className="relative w-full h-48 sm:h-64 mb-4 rounded-xl overflow-hidden bg-stone-100">
          <Image
            src={imageUrl}
            alt="Иллюстрация к вопросу"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 leading-snug tracking-tight px-2">
        {text}
      </h2>

      {isRevealed && explanation && (
        <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-left animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-1.5 text-blue-900 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Химическое объяснение:</span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>
      )}
    </Card>
  );
};
