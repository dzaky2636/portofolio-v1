'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

export const PORTFOLIO_EMAIL = 'dzaky2636@gmail.com';

type CopyEmailContextValue = (event?: MouseEvent<HTMLElement>) => Promise<void>;

const CopyEmailContext = createContext<CopyEmailContextValue | null>(null);

async function writeEmailToClipboard(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    return;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export function CopyEmailProvider({
  copiedMessage,
  children,
}: {
  copiedMessage: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  const copyEmail = useCallback(async (event?: MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    await writeEmailToClipboard(PORTFOLIO_EMAIL);
    setVisible(true);
    window.setTimeout(() => setVisible(false), 2200);
  }, []);

  return (
    <CopyEmailContext.Provider value={copyEmail}>
      {children}
      {visible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none max-w-[calc(100vw-2rem)]"
        >
          <div
            className="bg-white text-[#0C0C0C] border-4 border-black shadow-[10px_10px_0px_#0C0C0C] px-8 py-5 font-mono uppercase tracking-widest text-sm md:text-base animate-iris"
          >
            {copiedMessage}
          </div>
        </div>
      )}
    </CopyEmailContext.Provider>
  );
}

export function useCopyEmail() {
  const copy = useContext(CopyEmailContext);
  if (!copy) {
    throw new Error('useCopyEmail must be used within CopyEmailProvider');
  }
  return copy;
}
