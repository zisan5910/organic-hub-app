import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      // Check for iOS standalone
      if ((navigator as any).standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (checkInstalled()) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    // If already installed, do nothing
    if (isInstalled) return;

    // If we have a deferred prompt, use it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Install error:', error);
      }
      return;
    }

    // For iOS Safari - no prompt available, open in new tab to trigger Safari's add to home screen
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      // For iOS Safari, we can't programmatically trigger install
      // Just reload the page which may help trigger the banner
      window.location.reload();
      return;
    }

    // For Android/Desktop without deferred prompt - try opening in standalone mode
    // This forces a fresh PWA check
    const currentUrl = window.location.href;
    
    // Create a hidden link and trigger manifest check
    const link = document.createElement('a');
    link.href = currentUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // For Chrome on Android, opening in new tab can trigger install banner
    if (/Android/i.test(navigator.userAgent)) {
      window.open(currentUrl, '_blank');
      return;
    }

    // For desktop browsers without deferred prompt
    // Reload to potentially trigger the install prompt
    window.location.reload();
  }, [deferredPrompt, isInstalled]);

  return { 
    isInstallable: !!deferredPrompt && !isInstalled, 
    isInstalled, 
    installApp 
  };
};
