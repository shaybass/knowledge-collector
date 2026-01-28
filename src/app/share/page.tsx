'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSaveItem } from '@/hooks/useKnowledge';
import {
  ProcessingState,
  SuccessState,
  ErrorState,
  PrimaryButton,
  LoadingSpinner,
} from '@/components/ui';

function SharePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saveItem = useSaveItem();

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedItemTitle, setSavedItemTitle] = useState('');

  // Extract URL from share intent
  const sharedUrl = searchParams.get('url') || searchParams.get('text') || '';

  // Auto-save when URL is provided
  useEffect(() => {
    if (sharedUrl && status === 'idle') {
      handleSave(sharedUrl);
    }
  }, [sharedUrl]);

  const handleSave = async (url: string) => {
    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await saveItem.mutateAsync(url);

      if (result.success && result.item) {
        setSavedItemTitle(result.item.title);
        setStatus('success');
      } else {
        setErrorMessage(result.error || 'שגיאה בשמירה');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('שגיאה בחיבור לשרת');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    if (sharedUrl) {
      handleSave(sharedUrl);
    }
  };

  const handleOpenLibrary = () => {
    router.push('/');
  };

  // Manual URL input (for testing / when not shared)
  const [manualUrl, setManualUrl] = useState('');

  if (status === 'idle' && !sharedUrl) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-surface-100 mb-2">
              הוספת ידע חדש
            </h1>
            <p className="text-surface-400">
              הדבק לינק או שתף מכל אפליקציה
            </p>
          </div>

          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl py-4 px-4 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-primary-500/50 transition-colors text-left"
            dir="ltr"
          />

          <PrimaryButton
            onClick={() => manualUrl && handleSave(manualUrl)}
            disabled={!manualUrl}
          >
            שמור ועבד
          </PrimaryButton>

          <button
            onClick={handleOpenLibrary}
            className="w-full py-3 text-surface-400 hover:text-surface-200 transition-colors"
          >
            חזרה לספריה
          </button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <ProcessingState />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
        <SuccessState
          title="נשמר בהצלחה!"
          description={savedItemTitle}
          action={
            <PrimaryButton onClick={handleOpenLibrary}>
              פתח ספריה
            </PrimaryButton>
          }
        />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <ErrorState message={errorMessage} onRetry={handleRetry} />
          <div className="mt-6">
            <button
              onClick={handleOpenLibrary}
              className="w-full py-3 text-surface-400 hover:text-surface-200 transition-colors"
            >
              חזרה לספריה
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}
