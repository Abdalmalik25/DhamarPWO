// ============================================================
// useKeyboardShortcuts.ts - اختصارات لوحة المفاتيح
// ============================================================

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  callback: () => void;
  description?: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  enabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  target?: Window | Document | HTMLElement;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {},
) {
  const { enabled = true, target = typeof window !== 'undefined' ? window : document } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if user is typing in an input field
      const targetElement = event.target as HTMLElement;
      const isInputField =
        targetElement.tagName === 'INPUT' ||
        targetElement.tagName === 'TEXTAREA' ||
        targetElement.isContentEditable;

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.callback();
          return;
        }
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    target.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [target, handleKeyDown]);

  return {
    shortcuts,
    enabled,
  };
}

export default useKeyboardShortcuts;
