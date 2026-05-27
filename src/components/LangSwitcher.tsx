'use client';

import { usePathname, useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function LangSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = (newLang: string) => {
    startTransition(() => {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    });
  };

  return (
    <div className="font-mono text-xs font-bold tracking-widest flex gap-2">
      <button 
        onClick={() => switchLang('en')} 
        className={currentLang === 'en' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}
      >
        [EN]
      </button>
      <span className="text-gray-800">/</span>
      <button 
        onClick={() => switchLang('id')} 
        className={currentLang === 'id' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}
      >
        [ID]
      </button>
    </div>
  );
}