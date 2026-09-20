import React from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  state: 'idle' | 'saving' | 'saved' | 'error';
  label?: string;
  disabled?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  state,
  label = 'Save Changes',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={state === 'saving' || disabled}
      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer min-h-[42px] shadow-sm ${
        state === 'saving'
          ? 'bg-[#D0FF00]/50 text-black cursor-wait'
          : state === 'saved'
          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          : state === 'error'
          ? 'bg-rose-600 text-white'
          : 'bg-[#D0FF00] hover:bg-[#b8e600] text-[#050505] shadow-[0_0_15px_rgba(208,255,0,0.25)] hover:shadow-[0_0_20px_rgba(208,255,0,0.4)]'
      }`}
    >
      {state === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>Saving...</span>
        </>
      )}

      {state === 'saved' && (
        <>
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>Saved to Firestore!</span>
        </>
      )}

      {state === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-white" />
          <span>Save Failed — Retry</span>
        </>
      )}

      {state === 'idle' && (
        <>
          <Save className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
