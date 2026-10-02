'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import ProjectModal, { ProjectData } from '@/components/ProjectModal';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { windowPress } from '@/components/Window';

export interface ProjectItem {
  id: string;
  name: string;
  realm: string;
  org: string;
  description: string;
  stack: string[];
  images: string[];
  featured?: boolean;
}

interface ProjectSectionProps {
  title: string;
  clickPrompt: string;
  openViewer: string;
  imagesLabel: string;
  noImages: string;
  moreRealms: string;
  lessRealms: string;
  modalTitlePrefix: string;
  viewerEmpty: string;
  modalCloseAria: string;
  modalPrevAria: string;
  modalNextAria: string;
  modalDialogAria: string;
  screenshotAlt: string;
  projects: ProjectItem[];
}

function ProjectCard({
  project,
  imagesLabel,
  openViewer,
  noImages,
  onOpen,
}: {
  project: ProjectItem;
  imagesLabel: string;
  openViewer: string;
  noImages: string;
  onOpen: (project: ProjectItem) => void;
}) {
  const hasImages = project.images.length > 0;
  const previews = project.images.slice(0, 3);

  const handleActivate = () => {
    if (!hasImages) return;
    onOpen(project);
  };

  return (
    <div
      onClick={handleActivate}
      className={`group p-8 md:p-10 pointer-events-auto ${
        hasImages
          ? `${windowPress} cursor-pointer`
          : 'bg-white border-4 border-black shadow-[4px_4px_0px_#0C0C0C] cursor-not-allowed opacity-90'
      }`}
      role={hasImages ? 'button' : undefined}
      tabIndex={hasImages ? 0 : undefined}
      aria-disabled={!hasImages}
      onKeyDown={(e) => {
        if (!hasImages) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b-2 border-black pb-4">
        <div>
          <h3 className="text-3xl md:text-5xl font-serif font-bold">{project.name}</h3>
          <p className="font-mono uppercase tracking-widest text-xs mt-2 text-[#2945FF]">
            {project.realm}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-2 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] whitespace-nowrap group-hover:shadow-[1px_1px_0px_#0C0C0C] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all duration-75">
            {project.org}
          </div>
          <div
            className={`font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-2 shadow-[2px_2px_0px_#0C0C0C] whitespace-nowrap transition-all duration-75 ${
              hasImages
                ? 'bg-[#FFD700] text-[#0C0C0C] group-hover:bg-[#2945FF] group-hover:text-white group-hover:border-[#2945FF] group-hover:shadow-[1px_1px_0px_#0C0C0C] group-hover:translate-x-[1px] group-hover:translate-y-[1px]'
                : 'bg-[#F4F3ED] text-[#0C0C0C]'
            }`}
          >
            {hasImages ? `[ ${project.images.length} ${imagesLabel} ]` : noImages}
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="flex gap-2 mb-6 border-2 border-black p-2 bg-[#0C0C0C]">
          {previews.map((src, i) => (
            <div key={src} className="relative flex-1 aspect-video min-w-0 border-2 border-black overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 768px) 30vw, 200px"
                className="object-cover"
                aria-hidden={i > 0}
              />
            </div>
          ))}
        </div>
      )}

      <p className="font-serif text-lg md:text-xl leading-relaxed mb-8 max-w-4xl">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.stack.map((t, sidx) => (
          <span
            key={t}
            className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] active:translate-y-[3px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 cursor-default select-none"
            style={{ animationDelay: `${sidx * 0.05}s` }}
          >
            [{t}]
          </span>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t-2 border-dashed border-black flex items-center justify-between">
        <span
          className={`font-mono uppercase tracking-widest text-xs ${
            hasImages ? 'text-[#2945FF]' : 'text-[#0C0C0C]'
          }`}
        >
          {hasImages ? openViewer : noImages}
        </span>
        {hasImages && (
          <span className="font-mono uppercase tracking-widest text-xs">[ -&gt; ]</span>
        )}
      </div>
    </div>
  );
}

export default function ProjectSection({
  title,
  clickPrompt,
  openViewer,
  imagesLabel,
  noImages,
  moreRealms,
  lessRealms,
  modalTitlePrefix,
  viewerEmpty,
  modalCloseAria,
  modalPrevAria,
  modalNextAria,
  modalDialogAria,
  screenshotAlt,
  projects,
}: ProjectSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { featured, rest } = useMemo(() => {
    const featuredList = projects.filter((p) => p.featured === true);
    if (featuredList.length === 0) {
      return { featured: projects, rest: [] as ProjectItem[] };
    }
    const restList = projects.filter((p) => p.featured !== true);
    return { featured: featuredList, rest: restList };
  }, [projects]);

  const visibleProjects = showAll || rest.length === 0 ? projects : featured;

  const openModal = useCallback((project: ProjectItem) => {
    if (project.images.length === 0) return;
    setSelectedProject({
      name: project.name,
      images: project.images.map((src, i) => ({
        src,
        alt: screenshotAlt
          .replace('{name}', project.name)
          .replace('{index}', String(i + 1)),
      })),
    });
    setIsOpen(true);
  }, [screenshotAlt]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <section
        id="realms"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 border-t-4 border-black"
      >
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">{title}</h2>
          <div className="mt-4 inline-flex items-center gap-3 bg-white border-4 border-black shadow-[4px_4px_0px_#0C0C0C] px-4 py-3 max-w-full">
            <span className="inline-block w-3 h-3 bg-[#FFD700] border-2 border-black shadow-[1px_1px_0px_#0C0C0C]" />
            <span className="font-mono uppercase tracking-widest text-xs leading-tight">
              {clickPrompt}
            </span>
          </div>
        </div>

        <div className="space-y-10">
          {visibleProjects.map((project, idx) => (
            <AnimateOnScroll key={project.id} animation="animate-drawer" delay={`${idx * 0.15}s`}>
              <ProjectCard
                project={project}
                imagesLabel={imagesLabel}
                openViewer={openViewer}
                noImages={noImages}
                onOpen={openModal}
              />
            </AnimateOnScroll>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-10 flex justify-center pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="font-mono uppercase tracking-widest text-xs border-4 border-black px-6 py-3 bg-white shadow-[8px_8px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 retro-focus"
            >
              {showAll ? lessRealms : moreRealms}
            </button>
          </div>
        )}
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isOpen}
        onClose={closeModal}
        modalTitlePrefix={modalTitlePrefix}
        viewerEmpty={viewerEmpty}
        modalCloseAria={modalCloseAria}
        modalPrevAria={modalPrevAria}
        modalNextAria={modalNextAria}
        modalDialogAria={modalDialogAria}
      />
    </>
  );
}
