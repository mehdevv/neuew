"use client";

import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPaperPlane, FaMicrophone, FaStop } from "react-icons/fa6";
import { useTranslations, useLocale } from "next-intl";

interface ChatbotInputBarProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const ChatbotInputBar = memo(function ChatbotInputBar({
  inputValue,
  onInputChange,
  onSend,
  inputRef,
}: ChatbotInputBarProps) {
  const t = useTranslations("Chatbot");
  const locale = useLocale();
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      // Set language based on locale
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'ar': 'ar-SA'
      };
      recognitionRef.current.lang = langMap[locale] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onInputChange(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [locale, onInputChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }, [onSend]);

  // Handle focus when clicking anywhere in the chatbar
  const handleContainerFocus = useCallback(() => {
    setIsFocused(true);
    // Also focus the input for typing
    inputRef?.current?.focus();
  }, [inputRef]);

  // Handle blur only when clicking outside the entire chatbar
  const handleContainerBlur = useCallback((e: React.FocusEvent) => {
    // Check if the new focus target is still within the container
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  }, [onInputChange]);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  return (
    <div className="absolute bottom-4 md:bottom-6 left-1/2 z-[60] -translate-x-1/2 px-3 md:px-4 w-full max-w-[calc(100%-1.5rem)] md:max-w-none">
      <div
        ref={containerRef}
        tabIndex={-1}
        onClick={handleContainerFocus}
        onFocus={handleContainerFocus}
        onBlur={handleContainerBlur}
        className={`mx-auto rounded-2xl border bg-white/70 backdrop-blur-xl p-1.5 md:p-2 shadow-2xl shadow-black/10 transition-all duration-300 ease-out dark:bg-white/10 hover:shadow-2xl hover:shadow-[#05C205]/50 will-change-[width,max-width] cursor-text ${isFocused
          ? "w-full max-w-[calc(100%-1rem)] md:max-w-[512px] border-[#05C205] shadow-[#05C205]/30"
          : "w-full max-w-[280px] md:max-w-[320px] border-white/20 dark:border-white/10 hover:border-[#05C205]/80"
          }`}
      >
        <div className="flex items-center gap-1 md:gap-2">
          <div className="relative flex flex-grow items-center min-w-0">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("placeholder")}
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="border-none bg-transparent py-2 md:py-3 text-[13px] md:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Microphone Button */}
          <Button
            onClick={toggleRecording}
            type="button"
            className={`flex items-center justify-center rounded-xl p-2 md:p-3 transition-all duration-200 hover:scale-110 active:scale-95 h-9 w-9 md:h-11 md:w-11 flex-shrink-0 will-change-transform bg-transparent hover:bg-transparent border-0 shadow-none ${isRecording
                ? 'text-red-500 animate-pulse'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#05C205]'
              }`}
          >
            {isRecording ? (
              <FaStop className="text-base md:text-xl" />
            ) : (
              <FaMicrophone className="text-base md:text-xl" />
            )}
          </Button>

          {/* Send Button */}
          <Button
            onClick={onSend}
            className="flex items-center justify-center rounded-xl p-2 md:p-3 text-white shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:shadow-[#05C205]/50 hover:scale-105 active:scale-95 h-9 w-9 md:h-11 md:w-11 flex-shrink-0 will-change-transform"
            style={{ backgroundColor: "#05C205" }}
          >
            <FaPaperPlane className="text-base md:text-xl" />
          </Button>
        </div>
      </div>
      {/* Disclaimer */}
      <p className="mt-1.5 md:mt-2 text-center text-[7px] md:text-[10px] uppercase tracking-tight text-slate-500/80 dark:text-slate-400/80">
        {t("disclaimer")}
      </p>
    </div>
  );
});

