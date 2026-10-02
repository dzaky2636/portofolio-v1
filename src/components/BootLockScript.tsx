import Script from 'next/script';
import { BOOT_RUN_EVERY_LOAD, BOOT_SESSION_KEY } from '@/lib/bootSession';

const bootLockScript = `(function(){try{var k='${BOOT_SESSION_KEY}';var always=${BOOT_RUN_EVERY_LOAD};if(!always&&sessionStorage.getItem(k)==='1')return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){if(!always)sessionStorage.setItem(k,'1');return;}document.documentElement.classList.add('boot-lock');}catch(e){}})();`;

/** Runs before React hydrates to hide page until boot finishes. */
export default function BootLockScript() {
  return (
    <Script id="boot-lock" strategy="beforeInteractive">
      {bootLockScript}
    </Script>
  );
}
