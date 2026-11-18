import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  isError?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  isError = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array
  const valueArray = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    // Focus first input on mount if empty
    if (!value && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (!rawVal) return;

    // If user typed/pasted multiple digits
    if (rawVal.length > 1) {
      const combined = (value.slice(0, index) + rawVal + value.slice(index + rawVal.length)).slice(
        0,
        length
      );
      onChange(combined);
      const nextIndex = Math.min(index + rawVal.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const singleDigit = rawVal.charAt(rawVal.length - 1);
    const newArr = [...valueArray];
    newArr[index] = singleDigit;
    const combined = newArr.join('');
    onChange(combined);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!valueArray[index] && index > 0) {
        // Clear previous box and shift focus
        const newArr = [...valueArray];
        newArr[index - 1] = '';
        onChange(newArr.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newArr = [...valueArray];
        newArr[index] = '';
        onChange(newArr.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextIdx = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIdx]?.focus();
    }
  };

  const isComplete = value.length === length;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => {
        const val = valueArray[idx];
        const isFilled = Boolean(val);

        return (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={val}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`
              w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-extrabold rounded-xl
              border-2 transition-all duration-200 select-all outline-none
              ${
                isError
                  ? 'border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-200'
                  : isFilled && isComplete
                  ? 'border-[#84CC16] bg-[#84CC16]/5 text-[#072644] ring-1 ring-[#84CC16]/30'
                  : isFilled
                  ? 'border-[#0F4C81] bg-white text-[#0F4C81]'
                  : 'border-slate-200 bg-white text-[#072644] hover:border-slate-300 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15'
              }
              disabled:opacity-50 disabled:bg-slate-100
            `}
            aria-label={`Digit ${idx + 1}`}
          />
        );
      })}
    </div>
  );
};
