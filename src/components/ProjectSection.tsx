'use client';

import { useState, useCallback } from 'react';
import ProjectModal, { ProjectData } from '@/components/ProjectModal';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface Project {
  id: string;
  name: string;
  realm: string;
  org: string;
  description: string;
  stack: string[];
  images: string[];
}

const projects: Project[] = [
  {
    id: 'chatrigo',
    name: 'CHATRIGO',
    realm: 'SaaS & AI Orchestration // REALM_01',
    org: 'PT RIGO INOVASI DIGITAL',
    description:
      'Architected a multi-tenant B2B SaaS omnichannel AI chatbot platform utilizing Next.js 15, Prisma, Supabase, and PostgreSQL (pgvector) to centralize customer interactions across WhatsApp and Telegram. Engineered an anti-hallucination AI orchestrator featuring Retrieval-Augmented Generation (RAG), full sales cycle management, and an AI Business Advisor for strategic analytics.',
    stack: ['Next.js 15/16', 'Prisma', 'Supabase', 'PostgreSQL (pgvector)'],
    images: ['/chatrigo-1.jpg', '/chatrigo-2.jpg'],
  },
  {
    id: 'egov',
    name: 'BALIKPAPAN E-GOVERNMENT SYSTEMS',
    realm: 'Civic Tech // REALM_02',
    org: 'DISKOMINFO BALIKPAPAN',
    description:
      'Developed a Laravel-based E-Signature system (E-Sign) for digital documents featuring QR code integration, background queue processing, and automated PDF management, currently deployed across all schools in Balikpapan. Built a web-based Periodic Salary and Promotion management application (E-KGB) using Laravel and Tailwind CSS, with process automation, interactive data dashboards, and a secure authentication system.',
    stack: ['Laravel', 'Tailwind CSS', 'Queue Processing', 'Flutter'],
    images: ['/egov-1.jpg', '/egov-2.jpg'],
  },
  {
    id: 'thesis',
    name: 'INTELLIGENT TUTORING SYSTEM',
    realm: 'Academic/AI // REALM_03',
    org: 'UMN THESIS',
    description:
      'Thesis Project: Octalysis-Based Gamification in Intelligent Tutoring Systems with AI Agents for Feedback and Adaptive Support. Engineered an adaptive tutoring system utilizing Octalysis-based gamification and autonomous AI agents for real-time feedback and adaptive support.',
    stack: ['Python', 'AI Agents', 'LLM Engineering'],
    images: ['/thesis-1.jpg', '/thesis-2.jpg'],
  },
];

export default function ProjectSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const openModal = useCallback((project: Project) => {
    setSelectedProject({
      name: project.name,
      images: project.images.map((src, i) => ({
        src,
        alt: `${project.name} - Screenshot ${i + 1}`,
      })),
    });
    setIsOpen(true);
  }, []);

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
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            PROJECT_REALMS
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {'/// SELECT A DIALOGUE BOX TO INSPECT'}
          </div>
        </div>

        <div className="space-y-10">
          {projects.map((project, idx) => (
            <AnimateOnScroll
              key={project.id}
              animation="animate-drawer"
              delay={`${idx * 0.15}s`}
            >
              <div
                onClick={() => openModal(project)}
                className="group bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-8 md:p-10 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0C0C0C] active:translate-y-[2px] active:shadow-[4px_4px_0px_#0C0C0C] transition-all duration-75 cursor-pointer rounded-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(project);
                  }
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b-2 border-black pb-4">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold">
                      {project.name}
                    </h3>
                    <p className="font-mono uppercase tracking-widest text-xs mt-2 text-[#2945FF]">
                      {project.realm}
                    </p>
                  </div>
                  <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-2 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] whitespace-nowrap group-hover:shadow-[1px_1px_0px_#0C0C0C] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all duration-75">
                    {project.org}
                  </div>
                </div>
                <p className="font-serif text-lg md:text-2xl leading-relaxed mb-8 max-w-4xl">
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
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <ProjectModal project={selectedProject} isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
