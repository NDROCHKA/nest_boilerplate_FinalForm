import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const InstagramIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface FaqItem {
  id: number;
  category: 'delivery' | 'orders' | 'returns' | 'sizing';
  question: string;
  answer: string;
}

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<number[]>([1, 2]);

  const faqs: FaqItem[] = [
    {
      id: 1,
      category: 'delivery',
      question: 'How does Cash on Delivery (COD) work in Lebanon?',
      answer:
        'We offer seamless Cash on Delivery across all regions in Lebanon. When your order is delivered to your door by our courier, you can inspect the package and pay the exact amount in USD or LBP at the daily market rate.',
    },
    {
      id: 2,
      category: 'delivery',
      question: 'What are the shipping fees and delivery times?',
      answer:
        'Standard delivery across all regions in Lebanon is flat $4. Delivery takes approximately 4 to 7 days directly to your doorstep.',
    },
    {
      id: 3,
      category: 'orders',
      question: 'Do I need an account to place an order?',
      answer:
        'You are welcome to browse all items, explore collections, and view size charts freely as a visitor. However, creating a free account is required to place an order. Having an account allows you to securely track order fulfillment, view past purchases, and manage delivery details.',
    },
    {
      id: 4,
      category: 'returns',
      question: 'What is your return and refund policy?',
      answer:
        'All sales are final. Due to the exclusive drop nature and premium custom production of Crusader Collective garments, we enforce a strict no-refund and no-return policy once orders are fulfilled. Please consult our detailed size guide before completing your order.',
    },
    {
      id: 5,
      category: 'sizing',
      question: 'How do your sizes fit and how do I select my size?',
      answer:
        'Our garments feature distinct silhouettes ranging from streetwear oversized cuts to classic regular fits. We have a dedicated Official Size Guide page (accessible from the main menu and on every product page) with exact measurement charts (Length, Chest, Sleeve, Shoulder) in CM and Inches, complete with visual diagrams to help you choose your ideal size.',
    },
    {
      id: 6,
      category: 'orders',
      question: 'How can I contact customer support regarding my order?',
      answer:
        'If you have any questions about your order or shipping status, send us a Direct Message on Instagram @crusader.lb or email support. Please have your Order ID ready for faster assistance.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs =
    activeCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in faq-page">
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <HelpCircle size={16} />
          Customer Support
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginTop: '0.25rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Everything you need to know about Cash on Delivery in Lebanon, sizing, and fulfillment.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Questions' },
          { key: 'delivery', label: 'Delivery & COD' },
          { key: 'orders', label: 'Orders' },
          { key: 'returns', label: 'Exchanges & Returns' },
          { key: 'sizing', label: 'Fit & Sizing' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className="btn"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: activeCategory === tab.key ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: activeCategory === tab.key ? 'var(--color-accent-glow)' : 'var(--color-bg-secondary)',
              color: activeCategory === tab.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              className="glass-card glow-card-red"
              style={{
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onClick={() => toggleFaq(faq.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>{faq.question}</h3>
                <div style={{ color: 'var(--color-accent)' }}>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Banner */}
      <section
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(8, 8, 12, 0.9) 100%)',
          border: '1px solid rgba(37, 211, 102, 0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(220, 39, 67, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2743',
              flexShrink: 0,
            }}
          >
            <InstagramIcon size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Still have questions?</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)' }}>
              Send us a Direct Message on Instagram <strong>@crusader.lb</strong> for instant support.
            </p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/crusader.lb?igsh=MWVzd3VhbDdqY3M5NQ=="
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button
            variant="primary"
            style={{
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              borderColor: '#dc2743',
              color: 'white',
              fontWeight: 700,
              gap: '0.5rem',
            }}
          >
            <InstagramIcon size={18} />
            Instagram Support (@crusader.lb)
          </Button>
        </a>
      </section>
    </div>
  );
};
