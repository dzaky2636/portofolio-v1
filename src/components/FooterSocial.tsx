import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

interface FooterSocialProps {
  connectLabel: string;
}

const links = [
  { href: 'https://github.com/dzaky2636', label: 'GitHub', icon: FaGithub },
  { href: 'https://www.linkedin.com/in/dzakyfaturr/', label: 'LinkedIn', icon: FaLinkedin },
  { href: 'mailto:dzaky2636@gmail.com', label: 'Email', icon: FaEnvelope },
  { href: 'https://wa.me/6281377752644', label: 'WhatsApp', icon: FaWhatsapp },
  { href: 'https://instagram.com/dzakyfaturr', label: 'Instagram', icon: FaInstagram },
] as const;

export default function FooterSocial({ connectLabel }: FooterSocialProps) {
  return (
    <div className="space-y-4 md:text-right">
      <div className="font-mono uppercase tracking-widest text-xs">{connectLabel}</div>
      <div className="flex flex-wrap gap-3 md:justify-end">
        {links.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            aria-label={label}
            className="bg-white border-2 border-black shadow-[4px_4px_0px_#0C0C0C] p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] hover:border-[#2945FF] hover:text-[#2945FF] transition-all duration-75 pointer-events-auto retro-focus flex items-center gap-2"
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="font-mono uppercase tracking-widest text-[10px] hidden sm:inline">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
