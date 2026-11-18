/**
 * Professional Corporate PDF & Printable Quote Generator for MsmeBooks.
 * Formats official quotations with NRS/FIRS compliant VAT breakdown,
 * customer TIN, corporate letterhead, bank wire settlement details, and terms.
 */

import { CartItem } from '../types/cart';
import { CurrencyInfo } from '../types';

export interface QuoteCustomerInfo {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  taxId?: string;
}

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  customer: QuoteCustomerInfo;
  items: CartItem[];
  subtotalNgn: number;
  savingsNgn: number;
  promoDiscountNgn: number;
  netTaxableNgn: number;
  vatRatePercent: number;
  vatAmountNgn: number;
  totalPayableNgn: number;
  activeCurrency: CurrencyInfo;
  formatCurrencyFn: (amountNgn: number) => string;
}

export function generateQuoteDocument(data: QuoteData): void {
  const {
    quoteNumber,
    date,
    validUntil,
    customer,
    items,
    subtotalNgn,
    savingsNgn,
    promoDiscountNgn,
    netTaxableNgn,
    vatRatePercent,
    vatAmountNgn,
    totalPayableNgn,
    activeCurrency,
    formatCurrencyFn,
  } = data;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MsmeBooks Official Corporate Quotation ${quoteNumber}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .quote-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid #0A4FD5;
    }
    .header-table td {
      vertical-align: top;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #0B192C;
      letter-spacing: -0.5px;
    }
    .brand-accent {
      color: #0A4FD5;
    }
    .badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      background: #E0E7FF;
      color: #0A4FD5;
      margin-left: 6px;
    }
    .company-sub {
      color: #64748B;
      font-size: 11px;
      margin-top: 4px;
    }
    .quote-meta-table {
      text-align: right;
    }
    .quote-badge-title {
      font-size: 18px;
      font-weight: 900;
      color: #0A4FD5;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .meta-item {
      font-size: 12px;
      color: #334155;
      margin-top: 3px;
    }
    .meta-item strong {
      color: #0F172A;
    }
    
    .parties-grid {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 20px;
    }
    .party-card {
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .party-card-title {
      font-size: 10px;
      font-weight: 800;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .party-name {
      font-size: 14px;
      font-weight: 700;
      color: #0B192C;
      margin-bottom: 4px;
    }
    .party-detail {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table th {
      background: #0B192C;
      color: #FFFFFF;
      text-align: left;
      padding: 10px 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #E2E8F0;
      font-size: 12px;
      vertical-align: top;
    }
    .items-table tr:nth-child(even) td {
      background: #F8FAFC;
    }
    .item-title {
      font-weight: 700;
      color: #0F172A;
    }
    .item-sub {
      font-size: 11px;
      color: #64748B;
      margin-top: 2px;
    }
    .addon-tag {
      display: inline-block;
      font-size: 10px;
      background: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #BFDBFE;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
      margin-right: 4px;
    }

    .totals-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .totals-box {
      width: 340px;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      overflow: hidden;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 14px;
      border-bottom: 1px solid #F1F5F9;
      font-size: 12px;
      color: #475569;
    }
    .totals-row.highlight {
      background: #F0FDF4;
      color: #166534;
      font-weight: 600;
    }
    .totals-row.vat-row {
      background: #EFF6FF;
      color: #1E40AF;
      font-weight: 600;
    }
    .totals-row.grand-total {
      background: #0B192C;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 800;
      padding: 12px 14px;
      border-bottom: none;
    }
    .grand-total-amount {
      color: #84CC16;
      font-size: 16px;
    }

    .payment-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .payment-title {
      font-size: 11px;
      font-weight: 800;
      color: #0A4FD5;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .bank-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      font-size: 11px;
    }
    .bank-card {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .bank-name {
      font-weight: 700;
      color: #0B192C;
      margin-bottom: 2px;
    }

    .approval-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 30px;
      padding-top: 16px;
      border-top: 1px dashed #CBD5E1;
    }
    .stamp-box {
      border: 2px solid #0A4FD5;
      border-radius: 8px;
      padding: 8px 12px;
      text-align: center;
      display: inline-block;
      color: #0A4FD5;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .sign-line {
      width: 220px;
      text-align: center;
    }
    .sign-bar {
      border-bottom: 1px solid #64748B;
      height: 35px;
      margin-bottom: 4px;
    }
    .sign-label {
      font-size: 10px;
      color: #64748B;
      text-transform: uppercase;
    }

    .footer-note {
      margin-top: 24px;
      text-align: center;
      font-size: 10px;
      color: #94A3B8;
    }
    
    .print-button-bar {
      margin-bottom: 20px;
      text-align: right;
    }
    .print-button {
      background: #0A4FD5;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      .print-button-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="quote-container">
    <div class="print-button-bar">
      <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>

    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="width: 60%;">
          <div class="brand-title">
            Msme<span class="brand-accent">Books</span>
            <span class="badge">OFFICIAL QUOTATION</span>
          </div>
          <div class="company-sub">
            MsmeBooks Enterprise Technologies Limited<br>
            CAC RC: 1789240 | FIRS E-Invoicing Reg: 24810932-0001<br>
            Plot 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria<br>
            Pan-African Hub: Westlands Office Park, Nairobi, Kenya<br>
            Email: billing@msmebooks.com | Web: www.msmebooks.com
          </div>
        </td>
        <td style="width: 40%;" class="quote-meta-table">
          <div class="quote-badge-title">Proforma Quote</div>
          <div class="meta-item">Quote Reference: <strong>${quoteNumber}</strong></div>
          <div class="meta-item">Date Issued: <strong>${date}</strong></div>
          <div class="meta-item">Valid Until: <strong>${validUntil}</strong></div>
          <div class="meta-item">Currency: <strong>${activeCurrency.code} (${activeCurrency.name})</strong></div>
          <div class="meta-item">Terms: <strong>100% Prepaid SaaS License</strong></div>
        </td>
      </tr>
    </table>

    <!-- Parties -->
    <div class="parties-grid">
      <div class="party-card">
        <div class="party-card-title">Quotation Prepared For</div>
        <div class="party-name">${customer.businessName || 'Valued Corporate Client'}</div>
        <div class="party-detail">
          Attn: ${customer.contactName || 'Managing Director / Procurement'}<br>
          Email: ${customer.email || 'procurement@clientcompany.com'}<br>
          Phone: ${customer.phone || '+234 800 000 0000'}<br>
          Location: ${customer.address || 'Commercial District'}, ${customer.country || 'Nigeria'}<br>
          Tax ID (TIN): <strong>${customer.taxId || 'Pending Corporate Filing'}</strong>
        </div>
      </div>

      <div class="party-card">
        <div class="party-card-title">Licensed Service Provider</div>
        <div class="party-name">MsmeBooks Cloud ERP & POS</div>
        <div class="party-detail">
          Cloud Infrastructure: Dual-Region West Africa & AWS Cape Town<br>
          Compliance: ISO/IEC 27001, NDPR, GDPR & PCI-DSS Tier 1<br>
          Tax Status: Fully Registered for Statutory Regional Tax Compliance (${vatRatePercent}%)<br>
          Support SLA: 99.98% Uptime with Dedicated Account Manager
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 45%;">Plan / Module Description</th>
          <th style="width: 15%; text-align: center;">Billing Cycle</th>
          <th style="width: 15%; text-align: center;">Qty / Duration</th>
          <th style="width: 25%; text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((item) => {
            const isYearly = item.billingPeriod === 'yearly';
            const durationLabel = isYearly
              ? `${item.quantity || 12} Mos (${((item.quantity || 12) / 12).toFixed(1).replace('.0', '')} Yr)`
              : `${item.quantity || 1} Mo`;
            
            let addOnTotal = 0;
            const addOnTags: string[] = [];
            if (item.addOns?.extraBranches) {
              addOnTotal += item.addOns.extraBranches * 5000;
              addOnTags.push(`+ Extra Branches (x${item.addOns.extraBranches})`);
            }
            if (item.addOns?.extraWarehouses) {
              addOnTotal += item.addOns.extraWarehouses * 8000;
              addOnTags.push(`+ Extra Warehouses (x${item.addOns.extraWarehouses})`);
            }
            if (item.addOns?.priorityPhoneSla) {
              addOnTotal += 12000;
              addOnTags.push(`+ 24/7 Dedicated Support SLA`);
            }
            if (item.volumeDetails) {
              addOnTags.push(`Flat Subscription: ${item.volumeDetails.users} ${item.volumeDetails.users === 1 ? 'Seat' : 'Seats'} • Unlimited Invoices & Transactions (₦0 fees)`);
            }

            const itemLineTotal = (item.basePriceNgn + addOnTotal) * (item.quantity || 1);

            return `
            <tr>
              <td>
                <div class="item-title">${item.planName} Tier Subscription</div>
                <div class="item-sub">Cloud ERP, Offline POS, Unlimited Transactions, Local Tax Filing</div>
                ${
                  addOnTags.length > 0
                    ? `<div>${addOnTags
                        .map((tag) => `<span class="addon-tag">${tag}</span>`)
                        .join('')}</div>`
                    : ''
                }
              </td>
              <td style="text-align: center; text-transform: capitalize;">
                <strong>${item.billingPeriod}</strong>
                ${isYearly ? '<br><small style="color: #166534;">(20% OFF)</small>' : ''}
              </td>
              <td style="text-align: center;">
                <strong>${durationLabel}</strong>
              </td>
              <td style="text-align: right; font-weight: 700;">
                ${formatCurrencyFn(itemLineTotal)}
              </td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals-container">
      <div class="totals-box">
        <div class="totals-row">
          <span>Gross Subtotal:</span>
          <span>${formatCurrencyFn(subtotalNgn)}</span>
        </div>
        ${
          savingsNgn > 0
            ? `<div class="totals-row highlight">
                <span>Annual Commitment Savings (20% OFF):</span>
                <span>-${formatCurrencyFn(savingsNgn)}</span>
              </div>`
            : ''
        }
        ${
          promoDiscountNgn > 0
            ? `<div class="totals-row highlight">
                <span>Promotional Approval Discount:</span>
                <span>-${formatCurrencyFn(promoDiscountNgn)}</span>
              </div>`
            : ''
        }
        <div class="totals-row" style="border-top: 1px solid #CBD5E1; font-weight: 600;">
          <span>Net Taxable Base:</span>
          <span>${formatCurrencyFn(netTaxableNgn)}</span>
        </div>
        <div class="totals-row vat-row">
          <span>Statutory VAT (${vatRatePercent}%):</span>
          <span>+${formatCurrencyFn(vatAmountNgn)}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Total Quotation Value:</span>
          <span class="grand-total-amount">${formatCurrencyFn(totalPayableNgn)}</span>
        </div>
      </div>
    </div>

    <!-- Bank Details for Corporate Wire / Internal Procurement Sign-off -->
    <div class="payment-box">
      <div class="payment-title">Official Settlement Bank Accounts for Internal Wire Approval</div>
      <div class="bank-grid">
        <div class="bank-card">
          <div class="bank-name">Zenith Bank PLC (NGN / USD)</div>
          <div>Account Name: MsmeBooks Enterprise Ltd</div>
          <div>Account No: <strong>1019482019</strong></div>
          <div>Sort Code: 057150013</div>
        </div>
        <div class="bank-card">
          <div class="bank-name">Standard Bank / Stanbic (Pan-Africa)</div>
          <div>Account Name: MsmeBooks Africa Group</div>
          <div>Account No: <strong>0098412854</strong></div>
          <div>Swift Code: SBICZALX</div>
        </div>
        <div class="bank-card">
          <div class="bank-name">M-Pesa Business Till (East Africa)</div>
          <div>Merchant: MsmeBooks Technologies</div>
          <div>Buy Goods Till: <strong>894210</strong></div>
          <div>Account: Quote Ref ${quoteNumber}</div>
        </div>
      </div>
    </div>

    <!-- Sign-off & Stamp -->
    <div class="approval-section">
      <div>
        <div class="stamp-box">
          ✓ CERTIFIED GENUINE QUOTATION<br>
          MSMEBOOKS ENTERPRISE TECHNOLOGIES<br>
          DIGITALLY SIGNED & VERIFIED
        </div>
      </div>

      <div class="sign-line">
        <div class="sign-bar"></div>
        <div class="sign-label">Authorized Client Approver / Date</div>
      </div>

      <div class="sign-line">
        <div class="sign-bar"></div>
        <div class="sign-label">MsmeBooks Enterprise Sales Director</div>
      </div>
    </div>

    <div class="footer-note">
      This quotation is valid for 30 calendar days from the date of issue. Subscriptions auto-activate upon remittance confirmation.<br>
      Licensed under Nigeria Data Protection Act 2023 & International Cloud Security Standards.
    </div>
  </div>

  <script>
    // Auto-prompt print if opened as dedicated printable page
    window.addEventListener('load', function() {
      // Small delay for font loading
      setTimeout(function() {
        if (window.location.search.indexOf('autoprint=1') !== -1) {
          window.print();
        }
      }, 500);
    });
  </script>
</body>
</html>
  `;

  // Open in new window or hidden iframe to print
  const quoteWindow = window.open('', '_blank');
  if (quoteWindow) {
    quoteWindow.document.open();
    quoteWindow.document.write(htmlContent);
    quoteWindow.document.close();
  } else {
    // If popups are blocked, download as HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MsmeBooks-Quotation-${quoteNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
