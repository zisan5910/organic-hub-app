import { BookOpen, FileText, Link as LinkIcon, Facebook, Youtube, MessageCircle, Send, Moon, Sun, Download, Share2, Calendar, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { APP_CONFIG } from '@/config/app';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { theme, toggleTheme } = useTheme();
  const { isInstalled, installApp } = usePwaInstall();

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: APP_CONFIG.name,
          text: APP_CONFIG.description,
          url: url,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "লিংক কপি হয়েছে!",
        description: "অ্যাপের লিংক ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
    onClose();
  };

  const handleInstall = async () => {
    await installApp();
    onClose();
  };

  const socialLinks = [
    { href: APP_CONFIG.social.facebook, icon: Facebook, label: 'Facebook Page', color: 'text-blue-600' },
    { href: APP_CONFIG.social.facebookGroup, icon: Facebook, label: 'Facebook Group', color: 'text-blue-500' },
    { href: APP_CONFIG.social.youtube, icon: Youtube, label: 'YouTube', color: 'text-red-500' },
    { href: APP_CONFIG.social.whatsapp, icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
    { href: APP_CONFIG.social.telegram, icon: Send, label: 'Telegram', color: 'text-blue-400' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border flex-shrink-0">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="text-sm font-medium">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="space-y-1">
              <Link to="/" onClick={onClose} className="sidebar-link">
                <BookOpen size={20} />
                <span>All Courses</span>
              </Link>
              <a href={APP_CONFIG.externalLinks.admissionCalendar} target="_blank" rel="noopener noreferrer" className="sidebar-link" onClick={onClose}>
                <Calendar size={20} className="text-orange-500" />
                <span>Admission Calendar</span>
              </a>
              <a href={APP_CONFIG.externalLinks.questionAnalysis} target="_blank" rel="noopener noreferrer" className="sidebar-link" onClick={onClose}>
                <HelpCircle size={20} className="text-purple-500" />
                <span>Question Analysis</span>
              </a>
            </div>

            <div className="border-t border-border" />

            {/* Social Links */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground px-4 mb-2 font-medium">Connect with us</p>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-link"
                  onClick={onClose}
                >
                  <link.icon size={20} className={link.color} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            <div className="border-t border-border" />

            {/* Share & Install App */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground px-4 mb-2 font-medium">App</p>
              
              <button
                onClick={handleShare}
                className="sidebar-link w-full text-left"
              >
                <Share2 size={20} className="text-primary" />
                <span>Share App</span>
              </button>

              {!isInstalled && (
                <button
                  onClick={handleInstall}
                  className="sidebar-link w-full text-left hover:bg-accent transition-colors"
                >
                  <Download size={20} className="text-primary" />
                  <span>Install App</span>
                </button>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
