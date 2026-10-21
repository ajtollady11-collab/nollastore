import { site } from './site';
import { SHIPPING_COUNTRIES_TEXT } from './countries';

/**
 * FAQ content. Keep answers consistent with data/legal.ts (Shipping & Returns)
 * and data/site.ts (delivery). Anything not yet confirmed is marked PLACEHOLDER.
 */

export type FAQItem = { id: string; question: string; answer: string };

export const faqs: FAQItem[] = [
  {
    id: 'what-is-nuv',
    question: 'What is the Nolla Nuv™ blanket?',
    answer:
      'It’s our signature blanket, made from rex rabbit velvet: a dense faux fur (no real fur) with a deep, rippled surface. It comes in six colours and three sizes, and every blanket comes with a free Nimbus™ cloud pillow.',
  },
  {
    id: 'sizes',
    question: 'What sizes are available?',
    answer: 'Three: 100 × 150 cm, 150 × 200 cm and 200 × 230 cm. Prices for each size are shown when you choose one.',
  },
  {
    id: 'colours',
    question: 'What colours are available?',
    answer: 'White, Coffee, Pink, Green, Grey and Black. Colours can look a little different from screen to screen.',
  },
  {
    id: 'which-size',
    question: 'Which size should I choose?',
    answer:
      'The 100 × 150 cm is a smaller throw for one person on a sofa or armchair. The 150 × 200 cm and 200 × 230 cm give you more to wrap up in or share, and more coverage across a bed or sofa. Beds and sofas vary, so we’d suggest measuring yours and comparing it with our size guide.',
  },
  {
    id: 'free-pillow',
    question: 'Is the cloud pillow really free?',
    answer:
      'Yes. Every blanket comes with one Nimbus™ cloud pillow at no extra cost. There’s no code to enter: it’s added to your bag automatically. If you return your blanket, you’re welcome to keep the pillow.',
  },
  {
    id: 'delivery',
    question: 'How does delivery work?',
    answer:
      `We ship to ${SHIPPING_COUNTRIES_TEXT}, and shipping is free and tracked to all of them. We can’t deliver to other countries at the moment. Outside the UK you can also choose optional express insured shipping (£11.13) at checkout. Orders usually arrive in 4–10 working days. Delivery times are estimates rather than guarantees, and we’ll email your tracking details as soon as your order ships.`,
  },
  {
    id: 'currency',
    question: 'Which currency will I pay in?',
    answer:
      'You can browse in your own currency using the selector at the top of the page. Orders are charged in pounds (GBP), and if your card is in another currency your card provider converts it. Prices shown in currencies other than pounds and US dollars are converted at current exchange rates, so they’re approximate. Orders delivered to the US are charged at our US prices, converted to pounds.',
  },
  {
    id: 'returns',
    question: 'Can I return my order?',
    answer:
      'Yes. You can cancel for any reason within 14 days of receiving your order. Faulty or incorrect items are on us. Full details are on our Shipping & Returns page.',
  },
  {
    // PLACEHOLDER: replace with the supplier's confirmed washing and care instructions before launch
    id: 'care',
    question: 'How should I care for the blanket?',
    answer:
      'We’re confirming full care instructions with our maker and will add them here. Until then, please follow the care label sewn into your blanket.',
  },
  {
    id: 'together',
    question: 'Will my blanket and pillow arrive together?',
    answer:
      'Not always. Your blanket and pillow may arrive in separate packages, and you may receive separate tracking for each.',
  },
  {
    id: 'contact',
    question: 'How can I contact Nolla?',
    answer: `Email us at ${site.contactEmail}. For questions about an order, include your name and the email you used at checkout so we can find it quickly.`,
  },
];
