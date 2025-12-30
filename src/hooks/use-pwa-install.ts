import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export const usePwaInstall = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(globalDeferredPrompt);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    if (isStandalone) { setIsInstalled(true); return; }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      promptRef.current = promptEvent;
      setIsReady(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsReady(false);
      globalDeferredPrompt = null;
      promptRef.current = null;
    };

    if (globalDeferredPrompt) { promptRef.current = globalDeferredPrompt; setIsReady(true); }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (isInstalled) return;
    const prompt = promptRef.current || globalDeferredPrompt;
    if (prompt) {
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') setIsInstalled(true);
        globalDeferredPrompt = null;
        promptRef.current = null;
        setIsReady(false);
      } catch (error) {}
    } else {
      const ua = navigator.userAgent || '';
      const isInAppBrowser = /FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger|Instagram|WhatsApp|Line|MicroMessenger|Snapchat|Twitter|LinkedInApp/i.test(ua);
      const isAndroid = /Android/i.test(ua);
      if (isInAppBrowser && isAndroid) {
        const currentUrl = window.location.href;
        window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        return;
      }
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, url: window.location.href });
          return;
        } catch (error) {}
      }
      window.location.href = '/install';
    }
  }, [isInstalled]);

  return { isInstallable: isReady && !isInstalled, isInstalled, installApp };
};
