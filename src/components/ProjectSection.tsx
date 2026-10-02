'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import ProjectModal, { ProjectData } from '@/components/ProjectModal';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { windowPress } from '@/components/Window';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import {
  getProjectRealmCategory,
  REALM_CATEGORY_ORDER,
  type RealmCategory,
} from '@/lib/projectRealmCategory';

export type RealmFilterId = 'all' | RealmCategory;

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
  modalMinimizeAria: string;
  modalRestoreAria: string;
  modalFullscreenAria: string;
  modalExitFullscreenAria: string;
  modalPrevAria: string;
  modalNextAria: string;
  modalDialogAria: string;
  screenshotAlt: string;
  featuredLabel: string;
  stackShowMore: string;
  realmFilterLabel: string;
  realmFilterAll: string;
  realmFilterSaas: string;
  realmFilterCivic: string;
  realmFilterAcademic: string;
  realmFilterPersonal: string;
  realmFilterEmpty: string;
  projects: ProjectItem[];
}

const REALM_FILTER_LABEL: Record<
  RealmCategory,
  keyof Pick<
    ProjectSectionProps,
    | 'realmFilterSaas'
    | 'realmFilterCivic'
    | 'realmFilterAcademic'
    | 'realmFilterPersonal'
  >
> = {
  saas: 'realmFilterSaas',
  civic: 'realmFilterCivic',
  academic: 'realmFilterAcademic',
  personal: 'realmFilterPersonal',
};

const STACK_VISIBLE_COUNT = 5;

function ProjectCard({
  project,
  imagesLabel,
  openViewer,
  noImages,
  featuredLabel,
  stackShowMore,
  screenshotAlt,
  onOpen,
}: {
  project: ProjectItem;
  imagesLabel: string;
  openViewer: string;
  noImages: string;
  featuredLabel: string;
  stackShowMore: string;
  screenshotAlt: string;
  onOpen: (project: ProjectItem) => void;
}) {
  const hasImages = project.images.length > 0;
  const thumbSrc = project.images[0];
  const previews = project.images.slice(0, 3);
  const extraImageCount = Math.max(0, project.images.length - previews.length);
  const reducedMotion = usePrefersReducedMotion();
  const [stackExpanded, setStackExpanded] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripHover, setStripHover] = useState(false);

  const visibleStack = stackExpanded
    ? project.stack
    : project.stack.slice(0, STACK_VISIBLE_COUNT);
  const hiddenStackCount = Math.max(0, project.stack.length - STACK_VISIBLE_COUNT);

  const handleActivate = () => {
    if (!hasImages) return;
    onOpen(project);
  };

  useEffect(() => {
    if (reducedMotion || !stripHover) return;
    const el = stripRef.current;
    if (!el) return;
    el.classList.remove('animate-guillotine');
    void el.offsetWidth;
    el.classList.add('animate-guillotine');
  }, [stripHover, reducedMotion]);

  const featuredShadow =
    hasImages && project.featured
      ? 'shadow-[12px_12px_0px_#0C0C0C] hover:shadow-[10px_10px_0px_#0C0C0C]'
      : '';

  const stripRevealClass = reducedMotion
    ? 'hidden'
    : 'max-md:hidden overflow-hidden max-h-0 opacity-0 transition-[max-height,opacity] duration-300 md:group-hover:max-h-48 md:group-hover:opacity-100 md:group-focus-within:max-h-48 md:group-focus-within:opacity-100';

  return (
    <div
      onClick={handleActivate}
      onPointerEnter={() => {
        if (!reducedMotion) setStripHover(true);
      }}
      onPointerLeave={() => setStripHover(false)}
      onFocus={() => {
        if (!reducedMotion) setStripHover(true);
      }}
      onBlur={() => setStripHover(false)}
      className={`group p-4 md:p-5 pointer-events-auto overflow-hidden ${
        hasImages
          ? `${windowPress} cursor-pointer ${featuredShadow}`
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
      <div className="flex gap-3 md:gap-4">
        {thumbSrc && (
          <div className="relative w-28 md:w-36 aspect-video shrink-0 border-2 border-black overflow-hidden bg-[#0C0C0C]">
            <Image
              src={thumbSrc}
              alt={screenshotAlt.replace('{name}', project.name).replace('{index}', '1')}
              fill
              sizes="(max-width: 768px) 112px, 144px"
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl md:text-2xl font-serif font-bold leading-tight">
              {project.name}
            </h3>
            {project.featured && (
              <span className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-0.5 bg-[#F4F3ED] text-[#0C0C0C] shadow-[2px_2px_0px_#0C0C0C]">
                {featuredLabel}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="font-mono uppercase tracking-widest text-[10px] md:text-xs text-[#2945FF]">
              {project.realm}
            </p>
            <span className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-0.5 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C]">
              {project.org}
            </span>
            <span
              className={`font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_#0C0C0C] ${
                hasImages ? 'bg-[#FFD700] text-[#0C0C0C]' : 'bg-[#F4F3ED] text-[#0C0C0C]'
              }`}
            >
              {hasImages ? `[ ${project.images.length} ${imagesLabel} ]` : noImages}
            </span>
          </div>

          <p className="mt-2 font-serif text-base md:text-lg leading-snug line-clamp-2">
            {project.description}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {visibleStack.map((t) => (
              <span
                key={t}
                className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-0.5 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] cursor-default select-none"
              >
                [{t}]
              </span>
            ))}
            {!stackExpanded && hiddenStackCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStackExpanded(true);
                }}
                className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-0.5 bg-[#FFD700] text-[#0C0C0C] shadow-[2px_2px_0px_#0C0C0C] retro-focus"
              >
                {stackShowMore.replace('{count}', String(hiddenStackCount))}
              </button>
            )}
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div ref={stripRef} className={`mt-3 ${stripRevealClass}`}>
          <div className="flex gap-2 border-2 border-black p-2 bg-[#0C0C0C]">
            {previews.map((src, i) => (
              <div
                key={`${project.id}-strip-${src}`}
                className="relative flex-1 aspect-video min-w-0 border-2 border-black overflow-hidden"
              >
                <Image
                  src={src}
                  alt={
                    i === 0
                      ? screenshotAlt.replace('{name}', project.name).replace('{index}', '1')
                      : ''
                  }
                  fill
                  sizes="(max-width: 768px) 30vw, 200px"
                  className="object-cover"
                  aria-hidden={i > 0}
                />
                {i === previews.length - 1 && extraImageCount > 0 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-[#0C0C0C]/80 border-2 border-[#FFD700] font-mono uppercase tracking-widest text-xs text-white pointer-events-none"
                    aria-hidden
                  >
                    [ +{extraImageCount} ]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t-2 border-dashed border-black flex items-center justify-between">
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
  modalMinimizeAria,
  modalRestoreAria,
  modalFullscreenAria,
  modalExitFullscreenAria,
  modalPrevAria,
  modalNextAria,
  modalDialogAria,
  screenshotAlt,
  featuredLabel,
  stackShowMore,
  realmFilterLabel,
  realmFilterAll,
  realmFilterSaas,
  realmFilterCivic,
  realmFilterAcademic,
  realmFilterPersonal,
  realmFilterEmpty,
  projects,
}: ProjectSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [realmFilter, setRealmFilter] = useState<RealmFilterId>('all');

  const realmFilterLabels = {
    realmFilterSaas,
    realmFilterCivic,
    realmFilterAcademic,
    realmFilterPersonal,
  };

  const availableRealmFilters = useMemo(() => {
    const counts = new Map<RealmCategory, number>();
    for (const project of projects) {
      const category = getProjectRealmCategory(project.realm);
      if (!category) continue;
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return REALM_CATEGORY_ORDER.filter((id) => (counts.get(id) ?? 0) > 0);
  }, [projects]);

  const filteredPool = useMemo(() => {
    if (realmFilter === 'all') return projects;
    return projects.filter(
      (p) => getProjectRealmCategory(p.realm) === realmFilter
    );
  }, [projects, realmFilter]);

  const { featured, rest } = useMemo(() => {
    const featuredList = filteredPool.filter((p) => p.featured === true);
    if (featuredList.length === 0) {
      return { featured: filteredPool, rest: [] as ProjectItem[] };
    }
    const restList = filteredPool.filter((p) => p.featured !== true);
    return { featured: featuredList, rest: restList };
  }, [filteredPool]);

  const visibleProjects = useMemo(() => {
    if (realmFilter !== 'all') {
      const featuredIds = new Set(featured.map((p) => p.id));
      const orderedRest = filteredPool.filter((p) => !featuredIds.has(p.id));
      return [...featured, ...orderedRest];
    }
    if (!showAll && rest.length > 0) return featured;
    if (rest.length === 0) return filteredPool;
    const featuredIds = new Set(featured.map((p) => p.id));
    const orderedRest = filteredPool.filter((p) => !featuredIds.has(p.id));
    return [...featured, ...orderedRest];
  }, [realmFilter, showAll, rest.length, featured, filteredPool]);

  const showExpandRealms = realmFilter === 'all' && rest.length > 0;

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

        <div className="mb-10 pointer-events-auto">
          <p className="font-mono uppercase tracking-widest text-[10px] text-[#2945FF] mb-3">
            {realmFilterLabel}
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label={realmFilterLabel}
          >
            <button
              type="button"
              role="tab"
              aria-selected={realmFilter === 'all'}
              onClick={() => setRealmFilter('all')}
              className={`font-mono uppercase tracking-widest text-xs border-4 border-black px-4 py-2 shadow-[4px_4px_0px_#0C0C0C] transition-all duration-75 retro-focus ${
                realmFilter === 'all'
                  ? 'bg-[#2945FF] text-white shadow-[2px_2px_0px_#0C0C0C] translate-x-[2px] translate-y-[2px]'
                  : 'bg-white hover:border-[#2945FF]'
              }`}
            >
              {realmFilterAll}
            </button>
            {availableRealmFilters.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={realmFilter === id}
                onClick={() => setRealmFilter(id)}
                className={`font-mono uppercase tracking-widest text-xs border-4 border-black px-4 py-2 shadow-[4px_4px_0px_#0C0C0C] transition-all duration-75 retro-focus ${
                  realmFilter === id
                    ? 'bg-[#2945FF] text-white shadow-[2px_2px_0px_#0C0C0C] translate-x-[2px] translate-y-[2px]'
                    : 'bg-white hover:border-[#2945FF]'
                }`}
              >
                {realmFilterLabels[REALM_FILTER_LABEL[id]]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {visibleProjects.length === 0 && (
            <p className="font-mono uppercase tracking-widest text-sm border-4 border-black bg-white px-6 py-8 shadow-[6px_6px_0px_#0C0C0C] pointer-events-auto">
              {realmFilterEmpty}
            </p>
          )}
          {visibleProjects.map((project, idx) => (
            <AnimateOnScroll key={project.id} animation="animate-drawer" delay={`${idx * 0.15}s`}>
              <ProjectCard
                project={project}
                imagesLabel={imagesLabel}
                openViewer={openViewer}
                noImages={noImages}
                featuredLabel={featuredLabel}
                stackShowMore={stackShowMore}
                screenshotAlt={screenshotAlt}
                onOpen={openModal}
              />
            </AnimateOnScroll>
          ))}
        </div>

        {showExpandRealms && (
          <div className="mt-10 flex justify-center pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="font-mono uppercase tracking-widest text-xs border-4 border-black px-6 py-3 bg-white shadow-[8px_8px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 retro-focus"
            >
              {showAll ? lessRealms : moreRealms.replace('{count}', String(rest.length))}
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
        modalMinimizeAria={modalMinimizeAria}
        modalRestoreAria={modalRestoreAria}
        modalFullscreenAria={modalFullscreenAria}
        modalExitFullscreenAria={modalExitFullscreenAria}
        modalPrevAria={modalPrevAria}
        modalNextAria={modalNextAria}
        modalDialogAria={modalDialogAria}
      />
    </>
  );
}
