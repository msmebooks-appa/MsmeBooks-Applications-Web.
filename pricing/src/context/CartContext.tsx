import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BillingPeriod, Currency } from '../types';
import {
  CartItem,
  CustomerBillingDetails,
  OrderInvoiceReceipt,
  PaymentGatewayId,
  PaymentRegionId,
  PromoCode,
} from '../types/cart';
import { PRICING_PLANS } from '../data/pricingData';
import {
  ALL_PAYMENT_GATEWAYS,
  getDefaultRegionForCurrency,
  getDefaultGatewayForCurrency,
} from '../data/paymentGateways';
import { validatePromoCode } from '../data/promoCodes';
import { useCurrency } from './CurrencyContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (
    planId: string,
    billingPeriod?: BillingPeriod,
    addOns?: CartItem['addOns'],
    customPriceNgn?: number,
    volumeDetails?: { users: number; transactions: number }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateBillingPeriod: (itemId: string, period: BillingPeriod) => void;
  updateAddOns: (itemId: string, addOns: CartItem['addOns']) => void;
  clearCart: () => void;

  // Drawer / Modals state
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isCheckoutOpen: boolean;
  openCheckout: (
    directPlanId?: string,
    billingPeriod?: BillingPeriod,
    customPriceNgn?: number,
    volumeDetails?: { users: number; transactions: number }
  ) => void;
  closeCheckout: () => void;

  // Gateway & Region selection
  selectedRegion: PaymentRegionId;
  setSelectedRegion: (region: PaymentRegionId) => void;
  selectedGatewayId: PaymentGatewayId;
  setSelectedGatewayId: (gatewayId: PaymentGatewayId) => void;

  // Promo Code
  promoCodeInput: string;
  setPromoCodeInput: (code: string) => void;
  appliedPromo: PromoCode | null;
  promoMessage: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Financial calculations (in NGN baseline)
  subtotalNgn: number;
  planSavingsNgn: number;
  promoDiscountNgn: number;
  totalDiscountNgn: number;
  netTaxableAmountNgn: number;
  vatRatePercent: number; // 7.5
  vatAmountNgn: number; // 7.5% exclusive VAT
  totalPayableNgn: number;

  // Invoice / Receipt handling
  lastInvoice: OrderInvoiceReceipt | null;
  isInvoiceModalOpen: boolean;
  openInvoiceModal: (invoice?: OrderInvoiceReceipt) => void;
  closeInvoiceModal: () => void;
  completePayment: (
    customer: CustomerBillingDetails,
    paymentMethodUsed: string,
    taxOverrides?: {
      vatRatePercent: number;
      vatAmountNgn: number;
      totalPayableNgn: number;
      taxAuthority?: string;
      taxSchemeName?: string;
      taxBreakdown?: Array<{ name: string; ratePercent: number; amountNgn: number }>;
      isTaxExempt?: boolean;
    }
  ) => Promise<OrderInvoiceReceipt>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currency } = useCurrency();

  // Initialize cart from localStorage or default with Professional Plan
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks-cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'cart-init-pro',
        planId: 'professional',
        planName: 'Professional',
        billingPeriod: 'yearly',
        basePriceNgn: 25600,
        quantity: 12, // 12 for yearly subscription
        addOns: {
          extraBranches: 0,
          extraWarehouses: 0,
          priorityPhoneSla: false,
        },
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<PaymentRegionId>(() =>
    getDefaultRegionForCurrency(currency)
  );
  const [selectedGatewayId, setSelectedGatewayId] = useState<PaymentGatewayId>(() =>
    getDefaultGatewayForCurrency(currency)
  );

  // Sync region and dynamically surface the premier gateway tailored for this currency
  useEffect(() => {
    const defaultRegion = getDefaultRegionForCurrency(currency);
    setSelectedRegion(defaultRegion);

    // Dynamically surface premier gateway tailored for this currency
    const premierGateway = getDefaultGatewayForCurrency(currency);
    setSelectedGatewayId(premierGateway);
  }, [currency]);

  // When region changes, ensure selected gateway is within this region
  useEffect(() => {
    const gateway = ALL_PAYMENT_GATEWAYS.find((g) => g.id === selectedGatewayId);
    if (!gateway || gateway.region !== selectedRegion) {
      const firstInRegion = ALL_PAYMENT_GATEWAYS.find((g) => g.region === selectedRegion);
      if (firstInRegion) {
        setSelectedGatewayId(firstInRegion.id);
      }
    }
  }, [selectedRegion, selectedGatewayId]);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('PANAFRICA25');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState('');

  // Invoice / Receipt State
  const [lastInvoice, setLastInvoice] = useState<OrderInvoiceReceipt | null>(() => {
    try {
      const saved = localStorage.getItem('msmebooks-last-invoice');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return null;
  });
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('msmebooks-cart', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  // Helper to get cycle duration in months
  const getCycleQuantityMonths = (period: BillingPeriod): number => {
    switch (period) {
      case 'monthly':
        return 1;
      case 'quarterly':
        return 3;
      case 'bi-yearly':
        return 6;
      case 'yearly':
        return 12;
      default:
        return 12;
    }
  };

  // Helper to calculate monthly rate in NGN
  const calculatePlanPriceNgn = (planId: string, billingPeriod: BillingPeriod): number => {
    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) return 25600;
    let discount = 0;
    if (billingPeriod === 'quarterly') discount = 5;
    else if (billingPeriod === 'bi-yearly') discount = 10;
    else if (billingPeriod === 'yearly') discount = 20;

    if (plan.customPricing) {
      const baseEnterprise = 160000;
      return Math.round(baseEnterprise * (1 - discount / 100));
    }
    return Math.round(plan.monthlyPrice * (1 - discount / 100));
  };

  const addItem = (
    planId: string,
    billingPeriod: BillingPeriod = 'yearly',
    addOns: CartItem['addOns'] = { extraBranches: 0, extraWarehouses: 0, priorityPhoneSla: false },
    customPriceNgn?: number,
    volumeDetails?: { users: number; transactions: number }
  ) => {
    const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];
    const baseMonthlyPrice =
      customPriceNgn !== undefined
        ? customPriceNgn
        : calculatePlanPriceNgn(plan.id, billingPeriod);
    const targetQuantity = getCycleQuantityMonths(billingPeriod);

    setItems((prev) => {
      // Replace or update item if same plan exists
      const existingIndex = prev.findIndex((i) => i.planId === planId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          billingPeriod,
          basePriceNgn: baseMonthlyPrice,
          quantity: targetQuantity,
          addOns: { ...updated[existingIndex].addOns, ...addOns },
          volumeDetails: volumeDetails || updated[existingIndex].volumeDetails,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}-${planId}`,
          planId: plan.id,
          planName: plan.name,
          billingPeriod,
          basePriceNgn: baseMonthlyPrice,
          quantity: targetQuantity,
          addOns,
          volumeDetails,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const updateBillingPeriod = (itemId: string, period: BillingPeriod) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const newMonthlyRate = calculatePlanPriceNgn(i.planId, period);
          const newQuantity = getCycleQuantityMonths(period);
          return {
            ...i,
            billingPeriod: period,
            basePriceNgn: newMonthlyRate,
            quantity: newQuantity,
          };
        }
        return i;
      })
    );
  };

  const updateAddOns = (itemId: string, addOns: CartItem['addOns']) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, addOns: { ...i.addOns, ...addOns } } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = (
    directPlanId?: string,
    billingPeriod: BillingPeriod = 'yearly',
    customPriceNgn?: number,
    volumeDetails?: { users: number; transactions: number }
  ) => {
    if (directPlanId) {
      addItem(directPlanId, billingPeriod, undefined, customPriceNgn, volumeDetails);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => setIsCheckoutOpen(false);

  // Financial Computations in NGN
  let subtotalNgn = 0;
  let planSavingsNgn = 0;

  items.forEach((item) => {
    const plan = PRICING_PLANS.find((p) => p.id === item.planId);
    let itemBaseTotal = item.basePriceNgn * item.quantity;

    // Add-on costs per month * quantity (months)
    const branchesCost = (item.addOns?.extraBranches || 0) * 5000 * item.quantity;
    const warehousesCost = (item.addOns?.extraWarehouses || 0) * 8000 * item.quantity;
    const prioritySlaCost = (item.addOns?.priorityPhoneSla ? 12000 : 0) * item.quantity;

    subtotalNgn += itemBaseTotal + branchesCost + warehousesCost + prioritySlaCost;

    // Calculate annual 20% plan discount savings
    if (item.billingPeriod === 'yearly' && plan && !plan.customPricing) {
      const standardMonthlyCost = plan.monthlyPrice * item.quantity;
      const actualCost = item.basePriceNgn * item.quantity;
      if (standardMonthlyCost > actualCost) {
        planSavingsNgn += standardMonthlyCost - actualCost;
      }
    }
  });

  // Calculate Promo Code Discount
  let promoDiscountNgn = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      promoDiscountNgn = Math.round((subtotalNgn * appliedPromo.discountValue) / 100);
    } else {
      promoDiscountNgn = Math.min(subtotalNgn, appliedPromo.discountValue);
    }
  }

  const applyPromoCode = (code: string): boolean => {
    const res = validatePromoCode(code, subtotalNgn);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      setPromoMessage(res.message);
      return true;
    } else {
      setPromoMessage(res.message);
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoMessage('');
  };

  // 7.5% Exclusive VAT
  const totalDiscountNgn = promoDiscountNgn;
  const netTaxableAmountNgn = Math.max(0, subtotalNgn - totalDiscountNgn);
  const vatRatePercent = 7.5;
  const vatAmountNgn = Math.round(netTaxableAmountNgn * 0.075);
  const totalPayableNgn = netTaxableAmountNgn + vatAmountNgn;

  // Invoice Modal
  const openInvoiceModal = (invoice?: OrderInvoiceReceipt) => {
    if (invoice) {
      setLastInvoice(invoice);
    }
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => setIsInvoiceModalOpen(false);

  // Complete Payment execution simulation
  const completePayment = async (
    customer: CustomerBillingDetails,
    paymentMethodUsed: string,
    taxOverrides?: {
      vatRatePercent: number;
      vatAmountNgn: number;
      totalPayableNgn: number;
      taxAuthority?: string;
      taxSchemeName?: string;
      taxBreakdown?: Array<{ name: string; ratePercent: number; amountNgn: number }>;
      isTaxExempt?: boolean;
    }
  ): Promise<OrderInvoiceReceipt> => {
    const gateway =
      ALL_PAYMENT_GATEWAYS.find((g) => g.id === selectedGatewayId) || ALL_PAYMENT_GATEWAYS[0];

    const finalVatRate = taxOverrides ? taxOverrides.vatRatePercent : vatRatePercent;
    const finalVatAmount = taxOverrides ? taxOverrides.vatAmountNgn : vatAmountNgn;
    const finalTotal = taxOverrides ? taxOverrides.totalPayableNgn : totalPayableNgn;

    // Generate authentic transaction references
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const prefix = gateway.id.toUpperCase().slice(0, 4);
    const invoiceNumber = `MSME-INV-${new Date().getFullYear()}-${randomSuffix}`;
    const receiptNumber = `MSME-REC-${randomSuffix}`;
    const transactionReference = `${prefix}_TX_${Date.now().toString().slice(-8)}${randomSuffix}`;

    const newInvoice: OrderInvoiceReceipt = {
      invoiceNumber,
      receiptNumber,
      transactionReference,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'PAID',
      customer,
      items: [...items],
      currency,
      subtotalNgn,
      planSavingsNgn,
      promoCode: appliedPromo?.code,
      promoDiscountNgn,
      netTaxableAmountNgn,
      vatRatePercent: finalVatRate,
      vatAmountNgn: finalVatAmount,
      totalPaidNgn: finalTotal,
      paymentGateway: gateway,
      paymentMethodUsed,
      taxAuthority: taxOverrides?.taxAuthority,
      taxSchemeName: taxOverrides?.taxSchemeName,
      taxBreakdown: taxOverrides?.taxBreakdown,
      isTaxExempt: taxOverrides?.isTaxExempt,
    };

    setLastInvoice(newInvoice);
    try {
      localStorage.setItem('msmebooks-last-invoice', JSON.stringify(newInvoice));
    } catch {
      // Ignore
    }

    setIsCheckoutOpen(false);
    setIsInvoiceModalOpen(true);
    return newInvoice;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
        addItem,
        removeItem,
        updateQuantity,
        updateBillingPeriod,
        updateAddOns,
        clearCart,

        isCartOpen,
        openCart,
        closeCart,

        isCheckoutOpen,
        openCheckout,
        closeCheckout,

        selectedRegion,
        setSelectedRegion,
        selectedGatewayId,
        setSelectedGatewayId,

        promoCodeInput,
        setPromoCodeInput,
        appliedPromo,
        promoMessage,
        applyPromoCode,
        removePromoCode,

        subtotalNgn,
        planSavingsNgn,
        promoDiscountNgn,
        totalDiscountNgn,
        netTaxableAmountNgn,
        vatRatePercent,
        vatAmountNgn,
        totalPayableNgn,

        lastInvoice,
        isInvoiceModalOpen,
        openInvoiceModal,
        closeInvoiceModal,
        completePayment,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
