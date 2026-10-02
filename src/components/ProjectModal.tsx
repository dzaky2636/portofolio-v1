'use client';

import { useState, useCallback, useEffect } from 'react';
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
  modalPrevAria: string;
  modalNextAria: string;
  modalDialogAria: string;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  modalTitlePrefix,
  viewerEmpty,
  modalCloseAria,
  modalPrevAria,
  modalNextAria,
  modalDialogAria,
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPressedPrev, setIsPressedPrev] = useState(false);
  const [isPressedNext, setIsPressedNext] = useState(false);
  const [imageTransition, setImageTransition] = useState(false);
  const [modalFlicker, setModalFlicker] = useState(false);

  const totalImages = project?.images.length ?? 0;

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
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    },
    [isOpen, onClose, handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
      setModalFlicker(true);
      setTimeout(() => setModalFlicker(false), 300);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !project || totalImages === 0) return null;

  const currentImage = project.images[currentImageIndex];
  const dialogLabel = modalDialogAria.replace('{name}', project.name);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center modal-halftone-backdrop pointer-events-auto ${
        modalFlicker ? 'animate-flicker' : ''
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
    >
      {/* Modal Window */}
      <div
        className="relative w-[90vw] max-w-4xl bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] animate-iris"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#F4F3ED] px-4 py-3">
          <div className="font-mono uppercase tracking-widest text-xs font-bold">
            {modalTitlePrefix} - [{project.name}]
          </div>
          <button
            onClick={onClose}
            className="font-mono uppercase tracking-widest text-xs border-2 border-black px-2 py-1 bg-white shadow-[2px_2px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 retro-focus"
            aria-label={modalCloseAria}
          >
            [ X ]
          </button>
        </div>

        {/* Image Display Area */}
        <div className="relative bg-[#0C0C0C] flex items-center justify-center min-h-[300px] md:min-h-[450px] p-4 overflow-hidden">
          {currentImage ? (
            <div
              className={`relative w-full h-[50vh] md:h-[60vh] max-h-[60vh] ${
                imageTransition ? 'animate-memoryCorrupt' : ''
              }`}
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

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 font-mono uppercase tracking-widest text-xs text-white bg-[#0C0C0C] border-2 border-white px-3 py-1">
            [{String(currentImageIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}]
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-t-4 border-black bg-white px-4 py-3">
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
    </div>
  );
}
