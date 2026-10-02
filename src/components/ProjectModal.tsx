'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export interface ProjectImageData {
  src: string;
  alt: string;
}

export interface ProjectData {
  name: string;
  images: ProjectImageData[];
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
  modalTitlePrefix: string;
  viewerEmpty: string;
  modalCloseAria: string;
  modalMinimizeAria: string;
  modalRestoreAria: string;
  modalFullscreenAria: string;
  modalExitFullscreenAria: string;
  modalPrevAria: string;
  modalNextAria: string;
  modalDialogAria: string;
}

const windowControlClass =
  'font-mono uppercase tracking-widest text-xs border-2 border-black px-2 py-1 bg-white shadow-[2px_2px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 retro-focus';

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  modalTitlePrefix,
  viewerEmpty,
  modalCloseAria,
  modalMinimizeAria,
  modalRestoreAria,
  modalFullscreenAria,
  modalExitFullscreenAria,
  modalPrevAria,
  modalNextAria,
  modalDialogAria,
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPressedPrev, setIsPressedPrev] = useState(false);
  const [isPressedNext, setIsPressedNext] = useState(false);
  const [imageTransition, setImageTransition] = useState(false);
  const [modalFlicker, setModalFlicker] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const totalImages = project?.images.length ?? 0;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const triggerImageTransition = useCallback(() => {
    setImageTransition(true);
    setTimeout(() => setImageTransition(false), 150);
  }, []);

  const handlePrev = useCallback(() => {
    if (totalImages === 0) return;
    triggerImageTransition();
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages, triggerImageTransition]);

  const handleNext = useCallback(() => {
    if (totalImages === 0) return;
    triggerImageTransition();
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages, triggerImageTransition]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (minimized) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    },
    [isOpen, minimized, onClose, handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setMinimized(false);
      setIsMaximized(false);
      setModalFlicker(true);
      setTimeout(() => setModalFlicker(false), 300);
    } else {
      setMinimized(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = minimized ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, minimized]);

  const handleRestore = useCallback(() => {
    setMinimized(false);
  }, []);

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimized(true);
  }, []);

  const handleToggleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized((v) => !v);
  }, []);

  if (!portalReady || !isOpen || !project || totalImages === 0) return null;

  const currentImage = project.images[currentImageIndex];
  const dialogLabel = modalDialogAria.replace('{name}', project.name);

  if (minimized) {
    return createPortal(
      <div
        className="fixed bottom-4 right-4 z-[200] flex items-stretch max-w-[min(90vw,20rem)] border-4 border-black bg-white shadow-[8px_8px_0px_#0C0C0C] pointer-events-auto animate-iris"
        role="dialog"
        aria-modal="false"
        aria-label={dialogLabel}
      >
        <button
          type="button"
          onClick={handleRestore}
          className="flex-1 min-w-0 flex items-center justify-between gap-2 border-r-4 border-black bg-[#F4F3ED] px-3 py-2 font-mono uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#2945FF] hover:text-white transition-colors duration-75 retro-focus"
          aria-label={modalRestoreAria}
        >
          <span className="truncate font-bold">
            {modalTitlePrefix} — {project.name}
          </span>
          <span className="shrink-0 text-[#2945FF]">[ + ]</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`${windowControlClass} border-0 border-l-0 shadow-none rounded-none px-3`}
          aria-label={modalCloseAria}
        >
          [ X ]
        </button>
      </div>,
      document.body
    );
  }

  const modalWindow = (
    <div
      className={`bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] flex flex-col ${
        isMaximized
          ? 'fixed inset-2 md:inset-4 z-[201] max-w-none min-h-0'
          : 'relative w-[90vw] max-w-4xl animate-iris'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-4 border-black bg-[#F4F3ED] px-4 py-3 z-10">
          <div className="font-mono uppercase tracking-widest text-xs font-bold truncate min-w-0">
            {modalTitlePrefix} - [{project.name}]
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleMinimize}
              className={windowControlClass}
              aria-label={modalMinimizeAria}
            >
              [ _ ]
            </button>
            <button
              type="button"
              onClick={handleToggleMaximize}
              className={`${windowControlClass} ${
                isMaximized
                  ? 'bg-[#FFD700] text-[#0C0C0C] border-[#2945FF] shadow-[2px_2px_0px_#2945FF]'
                  : ''
              }`}
              aria-label={
                isMaximized ? modalExitFullscreenAria : modalFullscreenAria
              }
              aria-pressed={isMaximized}
            >
              [ □ ]
            </button>
            <button
              type="button"
              onClick={onClose}
              className={windowControlClass}
              aria-label={modalCloseAria}
            >
              [ X ]
            </button>
          </div>
        </div>

        <div
          className={`relative bg-[#0C0C0C] flex items-center justify-center p-4 overflow-hidden ${
            isMaximized ? 'flex-1 min-h-0' : 'min-h-[300px] md:min-h-[450px]'
          }`}
        >
          {currentImage ? (
            <div
              className={`relative w-full ${
                isMaximized
                  ? 'h-full min-h-[40vh]'
                  : 'h-[50vh] md:h-[60vh] max-h-[60vh]'
              } ${imageTransition ? 'animate-memoryCorrupt' : ''}`}
            >
              <Image
                key={currentImage.src}
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                sizes="(max-width: 896px) 90vw, 896px"
                className="object-contain border-2 border-black"
              />
            </div>
          ) : (
            <div className="font-mono uppercase tracking-widest text-xs text-white">
              {viewerEmpty}
            </div>
          )}

          <div className="absolute bottom-4 right-4 font-mono uppercase tracking-widest text-xs text-white bg-[#0C0C0C] border-2 border-white px-3 py-1">
            [{String(currentImageIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}]
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t-4 border-black bg-white px-4 py-3">
          <button
            onClick={handlePrev}
            onMouseDown={() => setIsPressedPrev(true)}
            onMouseUp={() => setIsPressedPrev(false)}
            onMouseLeave={() => setIsPressedPrev(false)}
            onTouchStart={() => setIsPressedPrev(true)}
            onTouchEnd={() => setIsPressedPrev(false)}
            className={`font-mono uppercase tracking-widest text-sm border-2 border-black px-4 py-2 bg-[#F4F3ED] shadow-[4px_4px_0px_#0C0C0C] select-none transition-all duration-75 retro-focus ${
              isPressedPrev
                ? 'translate-x-[4px] translate-y-[4px] shadow-[0px_0px_0px_#0C0C0C] scale-95'
                : 'hover:border-[#2945FF]'
            }`}
            aria-label={modalPrevAria}
          >
            [ &lt; ]
          </button>

          <div className="font-mono uppercase tracking-widest text-xs text-[#2945FF]">
            {project.name}
          </div>

          <button
            onClick={handleNext}
            onMouseDown={() => setIsPressedNext(true)}
            onMouseUp={() => setIsPressedNext(false)}
            onMouseLeave={() => setIsPressedNext(false)}
            onTouchStart={() => setIsPressedNext(true)}
            onTouchEnd={() => setIsPressedNext(false)}
            className={`font-mono uppercase tracking-widest text-sm border-2 border-black px-4 py-2 bg-[#F4F3ED] shadow-[4px_4px_0px_#0C0C0C] select-none transition-all duration-75 retro-focus ${
              isPressedNext
                ? 'translate-x-[4px] translate-y-[4px] shadow-[0px_0px_0px_#0C0C0C] scale-95'
                : 'hover:border-[#2945FF]'
            }`}
            aria-label={modalNextAria}
          >
            [ &gt; ]
          </button>
        </div>
      </div>
  );

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex justify-center modal-halftone-backdrop pointer-events-auto overflow-hidden p-2 md:p-4 ${
        isMaximized ? '' : 'items-center overflow-y-auto'
      } ${modalFlicker ? 'animate-flicker' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
    >
      {modalWindow}
    </div>,
    document.body
  );
}
