import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const ExternalBrowserRedirect = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Detect in-app browsers
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    const inAppBrowserPatterns = [
      'FBAN', // Facebook App
      'FBAV', // Facebook App
      'FB_IAB', // Facebook In-App Browser
      'Instagram', // Instagram
      'Messenger', // Facebook Messenger
      'WhatsApp', // WhatsApp
      'Line', // Line App
      'Twitter', // Twitter App
      'Snapchat', // Snapchat
      'Pinterest', // Pinterest
      'LinkedIn', // LinkedIn
      'TikTok', // TikTok
      'Telegram', // Telegram
      'WeChat', // WeChat
      'MicroMessenger', // WeChat
    ];

    const isInApp = inAppBrowserPatterns.some(pattern => 
      userAgent.includes(pattern)
    );

    setIsInAppBrowser(isInApp);
  }, []);

  const openInChrome = () => {
    const currentUrl = window.location.href;
    
    // Try to open in external browser
    // For Android, intent:// scheme works better
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // Android Intent to open in Chrome
      const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
    } else {
      // For iOS and others, just try to open the URL
      // This will trigger the "Open in Safari/Chrome" prompt in most cases
      window.open(currentUrl, '_system');
    }
  };

  if (!isInAppBrowser) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background p-6">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/logo.jpg" 
            alt="HSCianTV Logo" 
            className="w-20 h-20 rounded-2xl shadow-lg"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            সেরা অভিজ্ঞতার জন্য
          </h2>
          <p className="text-muted-foreground">
            Chrome বা Safari ব্রাউজারে অ্যাপটি খুলুন।
          </p>
        </div>

        {/* Open in Chrome Button */}
        <button
          onClick={openInChrome}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-foreground text-background rounded-xl font-medium text-lg transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Chrome-এ খুলুন</span>
        </button>

        {/* Alternative: Copy link */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('লিংক কপি হয়েছে! Chrome-এ পেস্ট করুন।');
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
        >
          অথবা লিংক কপি করুন
        </button>
      </div>
    </div>
  );
};

export default ExternalBrowserRedirect;
