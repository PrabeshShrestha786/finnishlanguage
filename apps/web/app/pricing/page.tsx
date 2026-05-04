'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Zap, Star, Users, ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect to get started',
    color: 'border-white/15',
    badge: null,
    features: [
      { text: '5 lessons per day', included: true },
      { text: 'Basic vocabulary flashcards', included: true },
      { text: 'Grammar reference guide', included: true },
      { text: 'AI tutor (10 messages/day)', included: true },
      { text: 'Reading practice (A1–A2)', included: true },
      { text: 'Unlimited lessons', included: false },
      { text: 'Speaking + pronunciation AI', included: false },
      { text: 'YKI mock exams', included: false },
      { text: 'Offline mode', included: false },
      { text: 'Certificates', included: false },
    ],
    cta: 'Get Started Free',
    ctaClass: 'btn-secondary',
    href: '/register',
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    description: 'For serious learners',
    color: 'border-finn-500/50',
    badge: '🔥 Most Popular',
    badgeColor: 'bg-finn-600',
    features: [
      { text: 'Unlimited lessons', included: true },
      { text: 'All vocabulary categories (5000+ words)', included: true },
      { text: 'Full grammar system', included: true },
      { text: 'Unlimited AI tutor (FinnMate)', included: true },
      { text: 'All reading levels (A1–C1)', included: true },
      { text: 'Listening with native audio', included: true },
      { text: 'Writing with AI feedback', included: true },
      { text: 'YKI exam preparation', included: true },
      { text: 'Offline mode', included: true },
      { text: 'Speaking pronunciation scoring', included: false },
      { text: 'Downloadable certificates', included: false },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaClass: 'btn-primary',
    href: '/register?plan=PRO',
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: { monthly: 19, yearly: 15 },
    description: 'Complete mastery path',
    color: 'border-aurora-purple/50',
    badge: '⭐ Best Value',
    badgeColor: 'bg-aurora-purple',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'AI speaking coach + pronunciation scoring', included: true },
      { text: 'Downloadable certificates (A1–C1)', included: true },
      { text: 'Personal study plan with AI', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'Advanced YKI mock exams (all levels)', included: true },
      { text: 'Spoken Finnish vs written Finnish module', included: true },
      { text: 'Team collaboration features', included: true },
      { text: 'API access for custom integrations', included: false },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaClass: 'btn-secondary',
    href: '/register?plan=PREMIUM',
  },
  {
    id: 'TEAM',
    name: 'Team',
    price: { monthly: 49, yearly: 39 },
    description: 'For schools & companies',
    color: 'border-aurora-green/40',
    badge: '🏫 Institutions',
    badgeColor: 'bg-aurora-green/30 text-aurora-green border border-aurora-green/40',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Up to 5 seats (expandable)', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Team progress tracking', included: true },
      { text: 'Custom lesson content upload', included: true },
      { text: 'Branded certificates', included: true },
      { text: 'LMS integration (SCORM)', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA + priority support', included: true },
    ],
    cta: 'Contact Sales',
    ctaClass: 'btn-aurora',
    href: '/contact',
  },
];

const FAQS = [
  { q: 'Is the free plan really free?', a: 'Yes — forever. You can learn up to A1 level completely free, no credit card required.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your account settings at any time. You keep access until the end of the billing period.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards via Stripe, and PayPal. All transactions are secure.' },
  { q: 'Is there a student discount?', a: 'Yes! Students with a valid .edu email get 30% off Pro and Premium plans. Use code STUDENT30.' },
  { q: 'How does the 7-day trial work?', a: 'You get full access to all paid features for 7 days. No charge until the trial ends.' },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-nordic-dark relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-finn-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-aurora-purple/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-slate-400 text-xl mb-8">Start free forever. Upgrade when you&apos;re ready.</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 glass-card rounded-2xl p-1.5">
            <button onClick={() => setYearly(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${!yearly ? 'bg-finn-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${yearly ? 'bg-finn-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Yearly
              <span className="text-xs bg-aurora-green/20 text-aurora-green px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-3xl p-6 border ${plan.color} relative ${plan.id === 'PRO' ? 'glow-blue' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full ${plan.badgeColor} whitespace-nowrap`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-4">
                <div className="text-slate-400 text-sm font-medium mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">€{yearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className="text-slate-500 text-sm">{plan.price.monthly === 0 ? '' : '/mo'}</span>
                </div>
                {yearly && plan.price.monthly > 0 && (
                  <div className="text-aurora-green text-xs mt-0.5">
                    Save €{(plan.price.monthly - plan.price.yearly) * 12}/year
                  </div>
                )}
                <p className="text-slate-500 text-xs mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2 text-xs ${f.included ? 'text-slate-300' : 'text-slate-600 line-through'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${f.included ? 'text-aurora-green' : 'text-slate-700'}`} />
                    {f.text}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className={`${plan.ctaClass} w-full py-3 flex items-center justify-center gap-2 text-sm font-bold ${plan.id === 'TEAM' ? 'text-nordic-dark' : ''}`}>
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-8">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-all text-left">
                  <span className="text-white font-semibold text-sm">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-white/5 px-5 py-4">
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
