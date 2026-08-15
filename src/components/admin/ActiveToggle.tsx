'use client';

import { useState, useTransition } from 'react';
import { toggleSectionVisibility } from '@/actions/admin/visibility';
import { Loader2 } from 'lucide-react';

export function ActiveToggle({ id, initialStatus }: { id: string, initialStatus: boolean }) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // 1. Optimistically update the UI instantly
    const newStatus = !isActive;
    setIsActive(newStatus); 

    // 2. Perform the server action in the background
    startTransition(async () => {
      const res = await toggleSectionVisibility(id, newStatus);
      if (!res.success) {
        // 3. Revert if the server request fails
        setIsActive(!newStatus); 
        alert(res.error || 'Failed to update status');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
        isActive ? 'bg-green-500' : 'bg-slate-300'
      }`}
    >
      <span className="sr-only">Toggle status</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {isPending && (
        <span className="absolute -right-6">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        </span>
      )}
    </button>
  );
}