import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

const ExternalBrowserRedirect = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isInAppBrowser = 
      /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua) ||
      /Messenger/i.test(ua) ||
      /Instagram/i.test(ua) ||
      /WhatsApp/i.test(ua) ||
      /Line/i.test(ua) ||
      /MicroMessenger/i.test(ua) ||
      /Snapchat/i.test(ua) ||
      /Twitter/i.test(ua) ||
      /LinkedInApp/i.test(ua);
    if (isInAppBrowser) setShowBanner(true);
  }, []);

  const openInChrome = () => {
    const currentUrl = window.location.href;
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      window.open(currentUrl, '_system');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
          <img src={APP_CONFIG.logo} alt={APP_CONFIG.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">সেরা অভিজ্ঞতার জন্য Chrome-এ খুলুন</h2>
        <p className="text-muted-foreground text-sm mb-6">এই অ্যাপটি আপনার ব্রাউজারে ভালোভাবে কাজ করে। ভিডিও দেখতে Chrome বা Safari ব্রাউজারে খুলুন।</p>
        <button onClick={openInChrome} className="w-full bg-foreground text-background font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <ExternalLink className="w-5 h-5" />
          Chrome-এ খুলুন
        </button>
        <button onClick={() => setShowBanner(false)} className="mt-3 text-muted-foreground text-sm hover:text-foreground transition-colors">এখানেই চালিয়ে যান</button>
      </div>
    </div>
  );
};

export default ExternalBrowserRedirect;
