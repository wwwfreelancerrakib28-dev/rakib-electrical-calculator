import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Chrome, 
  ArrowRight,
  Package,
  Layers,
  Code2,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkAndInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkAndInstallModal: React.FC<ApkAndInstallModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'instant' | 'apk' | 'faq'>('instant');

  if (!isOpen) return null;

  // Actual shared live app URL
  const appUrl = 'https://ais-pre-4buc3vhc6ugzpym36vz3ze-222174005556.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-black">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                ফোনে অ্যাপ চালানো ও APK তৈরির সহজ গাইড
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                গিটহাব ছাড়া কীভাবে সরাসরি আপনার মোবাইলে চালাবেন ও APK ফাইল ডাউনলোড করবেন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Question Direct Answer Callout */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/50 p-3 sm:p-4 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <div className="space-y-1">
              <strong className="text-amber-950 dark:text-amber-200 block text-xs">
                "GitHub তো আমাকে অ্যাপ বানিয়ে দেয় না, তাহলে ফোন দিয়ে কীভাবে অ্যাপ চালাব বা APK বানাব?"
              </strong>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                আপনার কোনো GitHub বা কোডিং জানার কোনো প্রয়োজন নেই! আপনার হাতের সাধারণ স্মার্টফোন দিয়েই আপনি <strong>২টি সহজ উপায়ে</strong> এটি আসল অ্যাপের মতো চালাতে এবং আসল <strong>.APK ফাইল</strong> ডাউনলোড করতে পারেন। নিচে দেখুন:
              </p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveGuideTab('instant')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeGuideTab === 'instant'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>১. ফোনে ১ ক্লিকে ইনস্টল (সেরা)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('apk')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeGuideTab === 'apk'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>২. অনলাইন APK মেকার (ফ্রি)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('faq')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeGuideTab === 'faq'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>৩. সাধারণ প্রশ্নোত্তর</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Quick URL Sharing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              আপনার অ্যাপের লাইভ লিংক (মোবাইলে খোলার জন্য):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full px-3 py-2 text-xs rounded-xl font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shrink-0 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              এই লিংকটি WhatsApp, মেসেঞ্জার বা ফোনের Chrome ব্রাউজারে পেস্ট করে খুললেই সাথে সাথে পুরো অ্যাপ পেয়ে যাবেন।
            </p>
          </div>

          {/* TAB 1: INSTANT PHONE INSTALL (PWA) */}
          {activeGuideTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  <h3 className="font-black text-sm text-amber-950 dark:text-amber-200">
                    APK ফাইল ছাড়াই মোবাইলে আসল অ্যাপ হিসেবে চালানোর সেরা উপায়
                  </h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  আপনার অ্যান্ড্রয়েড ফোনে গুগল ক্রোম (Google Chrome) ব্রাউজার দিয়ে এই অ্যাপটি ১ ক্লিকেই মোবাইলের হোম স্ক্রিনে ফেসবুক বা বিকাশের মতো আলাদা অ্যাপ হিসেবে ইনস্টল করা যায়! এতে কোনো APK ফাইলের ঝামেলা বা ভাইরাস ওয়ার্নিং থাকে না এবং <strong>১০০% অফলাইনে সব হিসাব সেভ থাকে</strong>।
                </p>

                {isInstallable && (
                  <div className="pt-2">
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>এখনই এই ডিভাইসে অ্যাপ ইনস্টল করুন (Install App)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step-by-Step for Android Phone */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  মোবাইল ফোনে মাত্র ৩ ধাপে ইনস্টল করার নিয়ম:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                      ১
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">ফোনে লিংকটি খুলুন</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      মোবাইলের গুগল ক্রোম (Chrome) ব্রাউজারে উপরের কপি করা লিংকটি পেস্ট করে ওপেন করুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                      ২
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">থ্রি-ডট (⋮) অপশন চাপুন</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      ক্রোমের উপরের ডানদিকের ৩টি ফোঁটা (⋮) মেনুতে চাপ দিন অথবা নিচে "ইনস্টল করুন" পপ-আপে চাপুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                      ৩
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">"Install app" দিন</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> এ চাপ দিলেই ফোনে অ্যাপ আইকন চলে আসবে!
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>সুবিধা:</strong> একবার ইনস্টল করার পর ব্রাউজারের কোনো অ্যাড্রেসবার থাকবে না, ফুলস্ক্রিনে চলবে এবং ইন্টারনেট বন্ধ থাকলেও আপনার কাস্টমার, রুম ও বিলের হিসাব সংরক্ষিত থাকবে!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ONLINE APK MAKER (PWABuilder) */}
          {activeGuideTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-black text-sm text-blue-950 dark:text-blue-200">
                    PWABuilder দিয়ে সরাসরি .apk ফাইল ডাউনলোড করার নিয়ম (১০০% ফ্রি)
                  </h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  মাইক্রোসফটের তৈরি অফিসিয়াল ফ্রি টুল <strong>PWABuilder (pwabuilder.com)</strong> যে কোনো ওয়েব অ্যাপকে সরাসরি অ্যান্ড্রয়েড <strong>.apk</strong> ফাইলে রূপান্তর করে দেয়। এতে কোনো GitHub বা প্রোগ্রামিং লাগে না।
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block">ধাপ ১: PWABuilder ওয়েবসাইটে যান</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    ব্রাউজারে <strong>pwabuilder.com</strong> ওপেন করুন।
                  </p>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs mt-1"
                  >
                    <span>PWABuilder খুলুন ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block">ধাপ ২: অ্যাপের লিংক পেস্ট করুন</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    বক্সে এই অ্যাপের লিংকটি ({appUrl}) পেস্ট করে <strong>"Start"</strong> বাটনে চাপ দিন।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block">ধাপ ৩: "Package for Android" দিয়ে APK ডাউনলোড করুন</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    টুলটি যাচাই করে <strong>"Package for Stores"</strong> অপশন দিবে। সেখান থেকে <strong>"Android APK"</strong> সিলেক্ট করে ডাউনলোড দিন এবং ফোনে ইনস্টল করে নিন!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeGuideTab === 'faq' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  প্রশ্ন: এই অ্যাপটি কি ফোনে ইন্টারনেট ছাড়া (অফলাইনে) কাজ করবে?
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  হ্যাঁ! একবার ফোনে ওপেন বা ইনস্টল করার পর আপনার সমস্ত ডেটা ফোনের নিজস্ব মেমোরিতে (LocalStorage) জমা থাকে। আপনি অফলাইনে ওয়্যারিং সাইটে বসেও যে কোনো রুমের লোড, তারের সাইজ বা মালামাল যোগ-বিয়োগ করতে পারবেন।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  প্রশ্ন: ফোন রিস্টার্ট দিলে বা ক্যাশ ক্লিয়ার করলে কি ডেটা মুছে যাবে?
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  না, সাধারণ রিস্টার্টে মুছে যায় না। তবে সুরক্ষার জন্য আপনি অ্যাপের "সেটিংস ও ব্যাকআপ" অপশন থেকে যেকোনো সময় ১ ক্লিকে <strong>"ব্যাকআপ ফাইল ডাউনলোড"</strong> করে রাখতে পারেন।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  প্রশ্ন: কাস্টমারকে কি সরাসরি রিপোর্ট বা বিল প্রিন্ট করে দেওয়া যাবে?
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  হ্যাঁ! প্রতিটি রুমের "অল রিপোর্ট" বাটনে এবং মূল মেনুর "রিপোর্ট ও PDF" অপশনে গিয়ে আপনি কাস্টমারের নামে পূর্ণাঙ্গ প্রফেশনাল ভাউচার ও ওয়্যারিং শিট প্রিন্ট বা PDF হিসেবে সেভ করতে পারবেন।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            রাকিব ইলেকট্রিক্যাল ক্যালকুলেটর • মোবাইল ও APK গাইড
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
          >
            বুঝেছি (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
