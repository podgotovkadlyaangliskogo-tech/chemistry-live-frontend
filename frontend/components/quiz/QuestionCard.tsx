import React from 'react';
import Image from 'next/image';
import { HelpCircle, Sparkles } from 'lucide-react';

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
    <div className="w-full text-center relative overflow-hidden bg-[#10172A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.45)]">
      {/* Subtle top cyan/blue glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4F8EF7]/50 to-transparent" />

      {imageUrl && (
        <div className="relative w-full h-48 sm:h-64 mb-6 rounded-2xl overflow-hidden bg-black/30 border border-white/5">
          <Image
            src={imageUrl}
            alt="Иллюстрация к вопросу"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      <h2 className="text-xl sm:text-3xl font-black text-white leading-snug tracking-tight px-2">
        {text}
      </h2>

      {isRevealed && explanation && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl text-left bg-[#4F8EF7]/10 border border-[#4F8EF7]/25 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-[#4F8EF7]">
            <HelpCircle className="w-4 h-4 text-[#4F8EF7]" />
            <span>Химическое объяснение:</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300 font-normal">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
