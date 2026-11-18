import { InvoiceRecord, CustomerBillingInfo, CartItem, VAT_RATE } from '../data/paymentGateways';
import { SupportedCurrency } from '../data/currencies';
import { COURSES, TRAINING_BUNDLES } from '../data/mockData';

const INVOICES_STORAGE_KEY = 'msmebooks_customer_invoices_v1';

export const getCustomerInvoices = (): InvoiceRecord[] => {
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // Seed realistic initial paid invoices so customers and auditors immediately have historical records
    const initialInvoices: InvoiceRecord[] = [
      {
        id: 'inv-seed-01',
        invoiceNumber: 'INV-2026-AFR-88421',
        date: 'Oct 28, 2026',
        time: '14:23 GMT+1',
        dueDate: 'Oct 28, 2026',
        status: 'PAID',
        customer: {
          fullName: 'Amara Okafor',
          email: 'nextsoftmsmebooks@gmail.com',
          phone: '+234 803 456 7890',
          companyName: 'Apex Microfinance & Retail Ventures',
          country: 'Nigeria',
          regionId: 'west_africa',
          tin: 'TIN-NG-24901842-001',
          address: '42 Commercial Avenue, Yaba Tech Corridor',
          city: 'Lagos'
        },
        items: [
          {
            id: 'item-01',
            type: 'course',
            title: COURSES[0].title,
            category: COURSES[0].category,
            thumbnail: COURSES[0].thumbnail,
            priceNgn: COURSES[0].priceNgn,
            originalPriceNgn: COURSES[0].priceNgn,
            courseId: COURSES[0].id,
            duration: `${COURSES[0].durationHours} hrs`,
            level: COURSES[0].level,
            instructorName: COURSES[0].instructor.name
          }
        ],
        subtotalNgn: COURSES[0].priceNgn,
        discountCode: 'MSME2026',
        discountPercentage: 15,
        discountAmountNgn: Math.round(COURSES[0].priceNgn * 0.15),
        netTaxableNgn: Math.round(COURSES[0].priceNgn * 0.85),
        vatRate: VAT_RATE,
        vatAmountNgn: Math.round(Math.round(COURSES[0].priceNgn * 0.85) * VAT_RATE),
        totalAmountNgn: Math.round(Math.round(COURSES[0].priceNgn * 0.85) * (1 + VAT_RATE)),
        currency: 'NGN',
        paymentGatewayId: 'paystack',
        paymentGatewayName: 'Paystack Instant Checkout',
        transactionReference: 'PSTK_TRX_9921408192_OK',
        paidAt: '2026-10-28T14:23:45Z'
      },
      {
        id: 'inv-seed-02',
        invoiceNumber: 'INV-2026-AFR-79012',
        date: 'Sep 15, 2026',
        time: '09:12 EAT',
        dueDate: 'Sep 15, 2026',
        status: 'PAID',
        customer: {
          fullName: 'Kofi Mensah',
          email: 'nextsoftmsmebooks@gmail.com',
          phone: '+254 712 345 678',
          companyName: 'Kilifi Agro-Logistics Ltd',
          country: 'Kenya',
          regionId: 'east_africa',
          tin: 'PIN-KE-P051289190Z',
          address: 'Moi Avenue, Enterprise Tower Suite 4B',
          city: 'Nairobi'
        },
        items: [
          {
            id: 'item-02',
            type: 'bundle',
            title: TRAINING_BUNDLES[0].title,
            category: TRAINING_BUNDLES[0].category,
            priceNgn: TRAINING_BUNDLES[0].discountedPriceNgn,
            originalPriceNgn: TRAINING_BUNDLES[0].originalPriceNgn,
            bundleId: TRAINING_BUNDLES[0].id,
            duration: '40 hrs',
            level: 'Executive Track'
          }
        ],
        subtotalNgn: TRAINING_BUNDLES[0].discountedPriceNgn,
        discountCode: 'PANAFRICAN',
        discountPercentage: 25,
        discountAmountNgn: Math.round(TRAINING_BUNDLES[0].discountedPriceNgn * 0.25),
        netTaxableNgn: Math.round(TRAINING_BUNDLES[0].discountedPriceNgn * 0.75),
        vatRate: VAT_RATE,
        vatAmountNgn: Math.round(Math.round(TRAINING_BUNDLES[0].discountedPriceNgn * 0.75) * VAT_RATE),
        totalAmountNgn: Math.round(Math.round(TRAINING_BUNDLES[0].discountedPriceNgn * 0.75) * (1 + VAT_RATE)),
        currency: 'KES',
        paymentGatewayId: 'mpesa',
        paymentGatewayName: 'Safaricom M-Pesa STK Push',
        transactionReference: 'MPESA_REF_QJ8419X_SUCCESS',
        paidAt: '2026-09-15T09:12:10Z'
      }
    ];

    try {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(initialInvoices));
    } catch {}

    return initialInvoices;
  } catch (err) {
    console.warn('[InvoiceStorage] Error retrieving invoices:', err);
    return [];
  }
};

export const saveCustomerInvoice = (invoice: InvoiceRecord): void => {
  try {
    const existing = getCustomerInvoices();
    const updated = [invoice, ...existing.filter((i) => i.id !== invoice.id)];
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('msmebooks_invoices_changed'));
    }
  } catch (err) {
    console.error('[InvoiceStorage] Failed to save invoice:', err);
  }
};

export const generateInvoiceNumber = (): string => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `INV-2026-AFR-${randomSuffix}`;
};

export const generateTransactionRef = (gatewayId: string): string => {
  const prefix = gatewayId.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}_TRX_${random}_OK`;
};
