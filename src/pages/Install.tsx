import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/config/app';
import { usePwaInstall } from '@/hooks/use-pwa-install';

const Install = () => {
  const { isInstallable, isInstalled, installApp } = usePwaInstall();
  const [copied, setCopied] = useState(false);

  const device = useMemo(() => {
    const ua = (navigator.userAgent || '').toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isInAppBrowser = /fban|fbav|fb_iab|fbios|fb4a|messenger|instagram|whatsapp|line|micromessenger|snapchat|twitter|linkedinapp/i.test(
      ua,
    );
    return { isIOS, isAndroid, isInAppBrowser };
  }, []);

  useEffect(() => {
    document.title = `Install ${APP_CONFIG.name}`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute('content', `${APP_CONFIG.name} ইনস্টল করুন — দ্রুত অ্যাক্সেসের জন্য হোম স্ক্রিনে যোগ করুন।`);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  const openInChromeAndroid = () => {
    const currentUrl = window.location.href;
    window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14 px-4 pb-10">
        <header className="max-w-2xl mx-auto pt-6">
          <h1 className="text-2xl font-bold text-foreground">{APP_CONFIG.name} Install</h1>
          <p className="mt-2 text-muted-foreground">
            এক ক্লিকে ইনস্টল সম্ভব হলে নিচের <span className="font-medium text-foreground">Install App</span> বাটন থেকেই সরাসরি
            ইনস্টল হবে। না হলে ডিভাইস অনুযায়ী নির্দেশনা দেখুন।
          </p>
        </header>

        <section className="max-w-2xl mx-auto mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Install</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isInstalled ? (
                <p className="text-foreground">অ্যাপটি ইতিমধ্যে ইনস্টল করা আছে।</p>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => installApp()}
                    disabled={!isInstallable}
                    className="w-full"
                  >
                    Install App
                  </Button>

                  {!isInstallable && (
                    <div className="text-sm text-muted-foreground space-y-2">
                      {device.isInAppBrowser && device.isAndroid && (
                        <Button type="button" variant="secondary" onClick={openInChromeAndroid} className="w-full">
                          Chrome-এ খুলুন (Install করার জন্য)
                        </Button>
                      )}

                      {device.isIOS ? (
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Safari-তে এই সাইটটি খুলুন</li>
                          <li>Share বাটনে ট্যাপ করুন</li>
                          <li>“Add to Home Screen” সিলেক্ট করুন</li>
                        </ol>
                      ) : (
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Chrome-এ সাইটটি খুলুন</li>
                          <li>Browser menu (⋮) → “Install app” বা “Add to Home screen”</li>
                        </ol>
                      )}

                      <div className="flex gap-2 flex-col sm:flex-row">
                        <Button type="button" variant="outline" onClick={handleCopy} className="w-full">
                          {copied ? 'Link copied' : 'Copy app link'}
                        </Button>
                        <Button asChild type="button" variant="outline" className="w-full">
                          <Link to="/">Back to home</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Install;
