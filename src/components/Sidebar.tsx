import { BookOpen, Facebook, Youtube, MessageCircle, Send, Calendar, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '@/config/app';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/', icon: BookOpen, label: 'All Courses' },
    { href: APP_CONFIG.externalLinks.admissionCalendar, icon: Calendar, label: 'Admission Calendar', color: 'text-orange-500' },
    { href: APP_CONFIG.externalLinks.questionAnalysis, icon: HelpCircle, label: 'Question Analysis', color: 'text-purple-500' },
  ];

  const socialLinks = [
    { href: APP_CONFIG.social.facebook, icon: Facebook, label: 'Facebook Page', color: 'text-blue-600' },
    { href: APP_CONFIG.social.facebookGroup, icon: Facebook, label: 'Facebook Group', color: 'text-blue-500' },
    { href: APP_CONFIG.social.youtube, icon: Youtube, label: 'YouTube', color: 'text-red-500' },
    { href: APP_CONFIG.social.whatsapp, icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
    { href: APP_CONFIG.social.telegram, icon: Send, label: 'Telegram', color: 'text-blue-400' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-52 fixed left-0 top-14 bottom-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          {links.map((link) => (
            'to' in link ? (
              <Link key={link.label} to={link.to} className={`sidebar-link ${location.pathname === link.to ? 'sidebar-link-active' : ''}`}>
                <link.icon size={20} />
                <span className="text-sm">{link.label}</span>
              </Link>
            ) : (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                <link.icon size={20} className={link.color} />
                <span className="text-sm">{link.label}</span>
              </a>
            )
          ))}
        </div>

        <div className="border-t border-sidebar-border mx-3 my-2" />

        <div className="p-3 space-y-1">
          <p className="text-xs text-muted-foreground px-4 mb-2 font-medium">যোগাযোগ</p>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link"
            >
              <link.icon size={20} className={link.color} />
              <span className="text-sm">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
