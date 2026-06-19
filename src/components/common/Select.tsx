import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: React.ReactNode;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  selectClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = '',
  selectClassName = '',
  placeholder = 'Select option',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync highlightedIndex when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, value, options]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          containerRef.current?.querySelector('button')?.focus();
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const isInline = selectClassName.includes('border-none') || selectClassName.includes('bg-transparent');

  const buttonClass = `
    w-full flex items-center justify-between transition-all duration-300 outline-none focus:outline-none focus:ring-0
    ${selectClassName}
    ${!isInline && isOpen ? '!border-[#9B2A4C] !ring-4 !ring-[#9B2A4C]/10 shadow-[0_4px_16px_rgba(155,42,76,0.06)] bg-white' : ''}
    ${!isInline ? 'hover:border-gray-300' : 'hover:text-[#9B2A4C]'}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-block w-full text-left ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <i className={`ri-arrow-down-s-line transition-transform duration-300 shrink-0 ml-1.5 text-gray-400 group-hover:text-gray-600 ${isOpen ? 'rotate-180 text-[#9B2A4C]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[999] mt-2 w-full bg-white/95 backdrop-blur-md border border-gray-100/90 rounded-2xl shadow-[0_16px_36px_rgba(44,62,80,0.12)] py-1.5 overflow-y-auto max-h-60 transition-all origin-top animate-dropdown-in scrollbar-thin">
          {options.map((opt, idx) => (
            <button
              key={opt.value}
              ref={(el) => {
                optionsRef.current[idx] = el;
              }}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center justify-between
                ${opt.value === value
                  ? 'text-[#9B2A4C] font-bold bg-[#9B2A4C]/5'
                  : idx === highlightedIndex
                    ? 'bg-gray-50/80 text-[#9B2A4C] font-medium'
                    : 'text-[#1C2526] font-medium hover:bg-gray-50/50 hover:text-[#9B2A4C]'
                }`}
            >
              <span className="truncate">{opt.label}</span>
              {opt.value === value && (
                <i className="ri-check-line text-[#9B2A4C] font-bold shrink-0 ml-2" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

