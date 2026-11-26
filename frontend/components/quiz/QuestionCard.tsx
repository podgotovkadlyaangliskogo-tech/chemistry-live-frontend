import React from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

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
    <div className="w-full text-center bg-[#111117] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
      {imageUrl && (
        <div className="relative w-full h-44 sm:h-56 bg-black/30">
          <Image
            src={imageUrl}
            alt="Иллюстрация к вопросу"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        <h2 className="font-sans font-bold text-lg sm:text-2xl text-[#F5F4F0] leading-snug tracking-tight">
          {text}
        </h2>

        {isRevealed && explanation && (
          <div className="mt-5 p-4 rounded-xl text-left bg-[#5B8FF9]/8 border border-[#5B8FF9]/20">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-[#5B8FF9]">
              <BookOpen className="w-3.5 h-3.5" />
              Химическое объяснение
            </div>
            <p className="text-sm text-[#71717A] leading-relaxed">
              {explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
