'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import ProjectModal, { ProjectData } from '@/components/ProjectModal';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { windowPress } from '@/components/Window';
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

function ProjectCard({
  project,
  imagesLabel,
  openViewer,
  noImages,
  featuredLabel,
  screenshotAlt,
  onOpen,
}: {
  project: ProjectItem;
  imagesLabel: string;
  openViewer: string;
  noImages: string;
  featuredLabel: string;
  screenshotAlt: string;
  onOpen: (project: ProjectItem) => void;
}) {
  const hasImages = project.images.length > 0;
  const previews = project.images.slice(0, 3);
  const extraImageCount = Math.max(0, project.images.length - previews.length);

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
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-3xl md:text-5xl font-serif font-bold">{project.name}</h3>
            {project.featured && (
              <span className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-1 bg-[#FFD700] text-[#0C0C0C] shadow-[2px_2px_0px_#0C0C0C]">
                {featuredLabel}
              </span>
            )}
          </div>
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
            <div
              key={`${project.id}-${src}`}
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
  modalMinimizeAria,
  modalRestoreAria,
  modalFullscreenAria,
  modalExitFullscreenAria,
  modalPrevAria,
  modalNextAria,
  modalDialogAria,
  screenshotAlt,
  featuredLabel,
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

        <div className="space-y-10">
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
