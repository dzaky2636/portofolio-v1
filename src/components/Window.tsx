import type { ReactNode } from 'react';

const windowPress =
  'bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] rounded-none pointer-events-auto hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] hover:scale-y-[0.98] active:scale-y-[0.96] transition-all duration-75';

interface WindowProps {
  title: string;
  status: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  interactive?: boolean;
  /** Transparent shell/body so fixed Canvas View content shows through (hero 3D). */
  viewportHole?: boolean;
  /** Highlights status text (e.g. inventory “active” pill). */
  statusAccent?: boolean;
}

export default function Window({
  title,
  status,
  children,
  className = '',
  bodyClassName = 'p-6',
  interactive = true,
  viewportHole = false,
  statusAccent = false,
}: WindowProps) {
  const shellClass = viewportHole
    ? 'bg-transparent border-4 border-black shadow-[8px_8px_0px_#0C0C0C] rounded-none pointer-events-auto'
    : interactive
      ? windowPress
      : 'bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] rounded-none pointer-events-auto';

  const bodyClass = viewportHole
    ? `${bodyClassName} bg-transparent`
    : bodyClassName;

  return (
    <div className={`${shellClass} ${className}`}>
      <div className="font-mono uppercase tracking-widest text-xs border-b-4 border-black bg-[#F4F3ED] px-4 py-2 flex justify-between gap-2">
        <span className="truncate">{title}</span>
        <span className={`shrink-0 ${statusAccent ? 'text-[#2945FF]' : ''}`}>{status}</span>
      </div>
      <div className={bodyClass}>{children}</div>
    </div>
  );
}

export { windowPress };
