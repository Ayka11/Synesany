import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import Header from '@/components/synth/Header';
import {
  ChevronDown, Mail, MessageCircle, Github,
  ArrowLeft, HelpCircle, ExternalLink
} from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
      >
        <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{question}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const Help: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    { q: t('help.faq.q1'), a: t('help.faq.a1') },
    { q: t('help.faq.q2'), a: t('help.faq.a2') },
    { q: t('help.faq.q3'), a: t('help.faq.a3') },
    { q: t('help.faq.q4'), a: t('help.faq.a4') },
    { q: t('help.faq.q5'), a: t('help.faq.a5') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-teal-500/10" />
          <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Canvas
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('help.title')}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              {t('help.subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-20">
          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">{t('help.faq')}</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-2">{t('help.contact')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('help.contact.desc')}</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <a
                href="mailto:support@synesthetica.app"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t('help.email')}</div>
                  <div className="text-[10px] text-muted-foreground">support@synesthetica.app</div>
                </div>
              </a>
              <a
                href="https://discord.gg/synesthetica"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Discord</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    Join community <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>
              </a>
              <a
                href="https://github.com/synesthetica"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">GitHub</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    View source <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Quick tips */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Draw to hear', desc: 'Start drawing on the canvas — each color produces a unique frequency.' },
                { title: 'Try different modes', desc: 'Switch sonification modes to hear your art differently.' },
                { title: 'Use the spectrum', desc: 'The 88-key rainbow palette maps directly to piano notes.' },
                { title: 'Generate soundscapes', desc: 'Click Generate to play back your entire drawing as music.' },
              ].map((tip, i) => (
                <div key={i} className="p-4 rounded-xl bg-accent/30 border border-border/30">
                  <h3 className="text-sm font-semibold mb-1">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
