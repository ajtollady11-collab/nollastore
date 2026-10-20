import { site } from './site';

/**
 * ─────────────────────────────────────────────────────────────
 *  LEGAL PAGES: Privacy Policy, Terms & Conditions, Shipping & Returns
 *  Each page is a list of sections. A section can have paragraphs (`p`)
 *  and/or a bullet list (`list`). Edit the wording here.
 *  Not legal advice: have these reviewed by a qualified person.
 * ─────────────────────────────────────────────────────────────
 */

export type LegalSection = { heading: string; p?: string[]; list?: string[]; after?: string[] };
export type LegalPageContent = { title: string; updated: string; intro: string; sections: LegalSection[] };

const EMAIL = site.contactEmail;
const UPDATED = '20 October 2026';

export const privacyPolicy: LegalPageContent = {
  title: 'Privacy policy.',
  updated: UPDATED,
  intro:
    'At Nolla, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, why we collect it and how we use it when you visit or purchase from our website.',
  sections: [
    {
      heading: '1. Who we are',
      p: [`Nolla is the business responsible for your personal information (the "data controller"). You can contact us at ${EMAIL}.`],
    },
    {
      heading: '2. Information we collect',
      p: ['When you use our website or place an order, we may collect:'],
      list: [
        'Your name',
        'Billing and delivery address',
        'Email address',
        'Telephone number, where provided',
        'Payment and transaction information',
        'Order history',
        'Information you provide when contacting us',
        'Website usage information, such as pages visited and interactions with our website',
        'Device and browser information, such as IP address and browser type',
      ],
      after: ['We do not store your full payment card details. Payments are processed securely by our payment provider, Square.'],
    },
    {
      heading: '3. How we use your information',
      p: ['We may use your information to:'],
      list: [
        'Process and deliver your orders',
        'Send order confirmations and delivery updates',
        'Provide customer support',
        'Process returns, refunds and exchanges',
        'Prevent fraud and protect our website',
        'Improve our products and website',
        'Send marketing emails where you have consented to receive them',
        'Comply with our legal and regulatory obligations',
      ],
    },
    {
      heading: '4. Our legal reasons for using your information',
      list: [
        'To fulfil our contract with you: processing, delivering and supporting your order.',
        'Your consent: marketing emails. You can unsubscribe at any time using the link in any email.',
        'Our legitimate interests: running, protecting and improving our website and business.',
        'Legal obligations: keeping records we are required to keep, such as for tax.',
      ],
    },
    {
      heading: '5. Cookies and similar technologies',
      p: [
        'Our website uses your browser’s storage to make the website work, for example to remember your cart and your delivery details on your device. If we introduce analytics or advertising cookies, we will ask for your consent first.',
        'You can control or clear cookies and stored data through your browser settings. Some website features may not work correctly if you do.',
      ],
    },
    {
      heading: '6. Sharing your information',
      p: ['We share relevant information with trusted third parties where necessary to run our business, including:'],
      list: [
        'Square: payment processing',
        'Our fulfilment partner (CJdropshipping) and delivery companies: to pack and deliver your order',
        'Klaviyo: to send emails you have signed up for',
        'Vercel: website hosting',
        'Customer service and analytics providers, where used',
      ],
      after: [
        'We only provide information that is reasonably necessary for these providers to perform their services. We do not sell your personal information.',
      ],
    },
    {
      heading: '7. International transfers',
      p: [
        'Some of these providers are based or process data outside the UK. For example, your name, delivery address and phone number are shared with our fulfilment partner in China so your order can be dispatched, and our payment, email and hosting providers may process data in the United States. Where this happens, we rely on the safeguards these providers put in place to protect your information.',
      ],
    },
    {
      heading: '8. Data security',
      p: [
        'We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, misuse or disclosure. However, no method of transmission or electronic storage is completely secure.',
      ],
    },
    {
      heading: '9. How long we keep your information',
      p: [
        'We keep personal information only for as long as reasonably necessary for the purposes in this policy, including to fulfil orders, resolve disputes, keep business records and comply with legal obligations. Order records are typically kept for six years for tax purposes. You can unsubscribe from marketing emails at any time.',
      ],
    },
    {
      heading: '10. Your rights',
      p: ['Depending on the circumstances, you have the right to:'],
      list: [
        'Request access to the information we hold about you',
        'Ask us to correct inaccurate information',
        'Ask us to delete information where legally applicable',
        'Object to or restrict certain processing',
        'Withdraw consent where processing is based on consent',
        'Request a copy of certain personal information',
      ],
      after: [
        `To exercise your rights, email us at ${EMAIL}.`,
        'If you are unhappy with how we have handled your information, you can complain to the Information Commissioner’s Office (ICO) at ico.org.uk.',
      ],
    },
    {
      heading: '11. Contact',
      p: [`If you have any questions about this Privacy Policy or how we handle your information, contact Nolla at ${EMAIL}.`],
    },
  ],
};

export const termsAndConditions: LegalPageContent = {
  title: 'Terms & conditions.',
  updated: UPDATED,
  intro:
    'These Terms & Conditions apply when you use the Nolla website or purchase products from us. By placing an order through our website, you agree to these Terms & Conditions.',
  sections: [
    { heading: '1. About Nolla', p: [`Nolla is operated under the trading name Nolla. Email: ${EMAIL}.`] },
    {
      heading: '2. Products',
      p: [
        'We make reasonable efforts to ensure that product descriptions, photographs, colours and measurements on our website are accurate. However, colours may appear slightly different depending on your device or screen settings.',
        'Product availability may change without notice.',
      ],
    },
    {
      heading: '3. Prices',
      p: [
        'You can view prices in a number of currencies. Prices in currencies other than GBP and USD are converted from our GBP prices at current exchange rates and are approximate. Orders are charged in GBP (£); if you pay with a card in another currency, your card provider converts the amount and may charge a fee. The price that applies to your order is the GBP price shown at checkout.',
        'Where we show a limited-time offer next to a regular price, the offer applies only for as long as it is shown on our website.',
        'We reserve the right to correct pricing or product information errors. If an error materially affects an order you have placed, we will contact you before processing the order where reasonably possible.',
      ],
    },
    {
      heading: '4. Free gift and discount codes',
      p: [
        'Every Nuv™ blanket ordered includes a free Nimbus™ cloud pillow while stocks last. It is added to your order automatically. The gift has no cash value, cannot be exchanged, and you may keep it if you return your blanket.',
        'Discount codes must be entered before checkout, cannot be applied after an order has been placed, and can’t be combined unless we say otherwise.',
      ],
    },
    {
      heading: '5. Orders',
      p: [
        'When you place an order, you are making an offer to purchase the selected products. After placing your order you will receive a confirmation by email. An order confirmation does not mean that the order has been dispatched.',
        'We reserve the right to cancel an order where there is a genuine issue, such as a product being unavailable, an obvious pricing error or suspected fraudulent activity. If we cancel an order after payment has been taken, you will receive a full refund.',
      ],
    },
    {
      heading: '6. Payment',
      p: ['Payments are processed by our third-party payment provider, Square. We do not store your full payment card details.'],
    },
    {
      heading: '7. Delivery',
      p: [
        'UK delivery is free. International delivery is charged at checkout. Orders usually arrive in 4–10 working days. Delivery times are estimates, not guarantees.',
        'Orders containing more than one product may arrive in separate packages, as products may be fulfilled from different locations or become ready for dispatch at different times. If your order is split, you may receive separate tracking information for each package.',
        'Please see our Shipping & Returns page for more information.',
      ],
    },
    {
      heading: '8. Cancellations and returns',
      p: [
        'Your statutory consumer rights are not affected by these Terms.',
        'For online purchases, you have a legal right to cancel your order within 14 days of receiving your goods, without needing to give a reason. Full details are on our Shipping & Returns page.',
      ],
    },
    {
      heading: '9. Faulty or incorrect products',
      p: [
        `If your product arrives faulty, damaged or materially different from what you ordered, please contact us as soon as possible at ${EMAIL}. We will assess the issue and provide an appropriate remedy in line with your consumer rights.`,
      ],
    },
    {
      heading: '10. Website use',
      p: ['You agree not to:'],
      list: [
        'Use our website for unlawful purposes',
        'Attempt to gain unauthorised access to our website or systems',
        'Interfere with the operation or security of our website',
        'Copy or reproduce our content without permission',
      ],
    },
    {
      heading: '11. Intellectual property',
      p: [
        'All Nolla branding, logos, photographs, graphics, text and other website content are owned by or licensed to Nolla unless otherwise stated. You may not reproduce, distribute or commercially use our content without written permission.',
      ],
    },
    {
      heading: '12. Limitation of liability',
      p: ['Nothing in these Terms limits or excludes any liability that cannot legally be limited or excluded, including your statutory consumer rights.'],
    },
    {
      heading: '13. Changes',
      p: ['We may update these Terms from time to time. The version displayed on our website when you place your order applies to that order.'],
    },
    { heading: '14. Contact', p: [`For questions about these Terms, email ${EMAIL}.`] },
  ],
};

export const shippingReturns: LegalPageContent = {
  title: 'Shipping & returns.',
  updated: UPDATED,
  intro: 'How your Nolla gets to you, and what to do if it isn’t right.',
  sections: [
    {
      heading: 'Delivery',
      list: [
        'UK: free delivery.',
        'Outside the UK: standard delivery £6.71, or express insured shipping £11.13.',
        'Orders usually arrive in 4–10 working days.',
      ],
      after: [
        'Delivery times are estimates. Your order may arrive in more than one package, and you may receive separate tracking for each. We’ll email you tracking details as soon as your order ships.',
      ],
    },
    {
      heading: 'Your free gift',
      p: ['Every blanket comes with a free Nimbus™ cloud pillow, added to your order automatically. It may arrive in a separate package from your blanket.'],
    },
    {
      heading: 'Changed your mind? 14 days to cancel',
      p: [
        `You can cancel your order for any reason within 14 days of receiving it. Just email ${EMAIL} with your name and order details, and we’ll send you return instructions.`,
        'Once you’ve told us, you have a further 14 days to send the items back. Please return them unused and in their original condition and packaging where possible. You’re responsible for the cost of returning items unless they’re faulty or not what you ordered.',
        'You’re welcome to keep the free Nimbus™ cloud pillow.',
      ],
    },
    {
      heading: 'Refunds',
      p: [
        'We’ll refund you within 14 days of receiving the items back (or proof that you’ve sent them), to your original payment method. Your refund includes standard delivery charges you paid, but not any extra cost of express shipping.',
      ],
    },
    {
      heading: 'Faulty, damaged or wrong items',
      p: [
        `If something arrives faulty, damaged or isn’t what you ordered, email ${EMAIL} with your order details and a photo. Within 30 days of delivery you’re entitled to a full refund; after that, we’ll offer a repair, replacement or refund in line with your rights under the Consumer Rights Act 2015. We cover return costs for faulty or incorrect items.`,
      ],
    },
    {
      heading: 'Questions',
      p: [`Email ${EMAIL} and we’ll be happy to help.`],
    },
  ],
};
