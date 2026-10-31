import { Fragment } from 'react';
import type { CaseStudy, CaseStudyLabels } from '@/lib/caseStudy';

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="font-mono uppercase tracking-widest text-xs text-[#2945FF] mb-3">{children}</h3>
  );
}

export default function CaseStudyView({
  caseStudy,
  labels,
}: {
  caseStudy: CaseStudy;
  labels: CaseStudyLabels;
}) {
  return (
    <div className="space-y-8 p-5 md:p-8 text-[#0C0C0C]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <SectionLabel>{labels.problem}</SectionLabel>
          <p className="font-serif text-lg leading-relaxed">{caseStudy.problem}</p>
        </section>
        <section>
          <SectionLabel>{labels.role}</SectionLabel>
          <p className="font-serif text-lg leading-relaxed">{caseStudy.role}</p>
        </section>
      </div>

      <section>
        <SectionLabel>{labels.flow}</SectionLabel>
        <ol className="flex flex-col lg:flex-row lg:items-stretch gap-2">
          {caseStudy.flow.map((step, index) => (
            <Fragment key={step.label}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="self-center shrink-0 font-mono text-xs before:content-['v'] lg:before:content-['->']"
                />
              )}
              <li className="flex-1 min-w-0 border-2 border-black bg-[#F4F3ED] p-3 shadow-[3px_3px_0px_#0C0C0C]">
                <p className="font-mono uppercase tracking-widest text-[10px] font-bold break-words">
                  {step.label}
                </p>
                <p className="mt-1 font-serif text-sm leading-snug">{step.detail}</p>
              </li>
            </Fragment>
          ))}
        </ol>
      </section>

      <section>
        <SectionLabel>{labels.decisions}</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudy.decisions.map((decision) => (
            <div key={decision.title} className="border-l-4 border-[#2945FF] pl-4">
              <h4 className="font-serif font-bold text-xl leading-tight">{decision.title}</h4>
              <p className="mt-1 font-serif text-base leading-snug">{decision.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>{labels.outcome}</SectionLabel>
        <ul className="flex flex-wrap gap-2">
          {caseStudy.outcome.map((item) => (
            <li
              key={item}
              className="font-mono uppercase tracking-widest text-[10px] border-2 border-black bg-[#FFD700] px-2 py-1 shadow-[2px_2px_0px_#0C0C0C]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
