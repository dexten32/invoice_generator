const prisma = require('../lib/prisma');

/**
 * Service to handle business logic for Invoices.
 */
class InvoiceService {
  /**
   * Calculates subtotal, tax amount, and total amount for an invoice.
   * @param {Array} items - List of invoice items.
   * @param {number} taxRate - Overall tax rate (percentage).
   * @param {number} discount - Discount amount in currency.
   * @returns {Object} - Computed totals.
   */
  calculateTotals(items, taxRate, discount) {
    let subtotal = 0;
    const formattedItems = items.map(item => {
      const quantity = Math.max(0, Number(item.quantity) || 1);
      const rate = Math.max(0, Number(item.rate) || 0);
      const lineTotal = Math.round(quantity * rate * 100) / 100;
      subtotal += lineTotal;

      return {
        serviceId: item.serviceId || null,
        serviceNameSnapshot: item.description || 'Custom Item',
        unitPrice: rate,
        quantity,
        gstRate: Number(item.gstRate) || 0,
        hsnSacSnapshot: item.hsnSac || null,
        lineTotal,
      };
    });

    const finalSubtotal = Math.round(subtotal * 100) / 100;
    const safeDiscount = Math.min(Math.max(0, Number(discount) || 0), finalSubtotal);
    const taxableAmount = Math.max(0, finalSubtotal - safeDiscount);
    const safeTaxRate = Math.max(0, Number(taxRate) || 0);
    const taxAmount = Math.round(taxableAmount * (safeTaxRate / 100) * 100) / 100;
    const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

    return {
      items: formattedItems,
      subtotal: finalSubtotal,
      taxAmount,
      totalAmount,
    };
  }

  /**
   * Generates the next sequential invoice number.
   * Efficiently finds the latest invoice instead of fetching all.
   * @returns {Promise<string>} - The next invoice number (e.g., INV-005).
   */
  async getNextInvoiceNumber() {
    const latestInvoice = await prisma.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' },
      select: { invoiceNumber: true }
    });

    let maxSerial = 0;
    if (latestInvoice && latestInvoice.invoiceNumber) {
      const match = latestInvoice.invoiceNumber.match(/(\d+)$/);
      if (match) {
        maxSerial = parseInt(match[1], 10);
      }
    }

    // However, string sorting (desc) might be tricky with INV-9 vs INV-10.
    // If INV-10 exists, 'INV-9' > 'INV-10' in string sort.
    // To be perfectly safe, we'll try a slightly better approach if possible, 
    // but the current implementation in the route was also parsing.
    // Re-evaluating: let's fetch the top 100 to be safer against sorting quirks with strings.
    
    const recentInvoices = await prisma.invoice.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true }
    });

    for (const inv of recentInvoices) {
      if (inv.invoiceNumber) {
        const match = inv.invoiceNumber.match(/(\d+)$/);
        if (match) {
          const serial = parseInt(match[1], 10);
          if (serial > maxSerial) maxSerial = serial;
        }
      }
    }

    const nextSerial = maxSerial + 1;
    return `INV-${nextSerial.toString().padStart(3, '0')}`;
  }

  /**
   * Creates a new invoice with its items in a transaction.
   */
  async createInvoice(data, userId) {
    const { meta, client, items, taxRate, discount } = data;

    if (!meta?.invoiceNumber) {
      throw new Error('Invoice number is required.');
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: meta.invoiceNumber }
    });
    if (existingInvoice) {
      throw new Error(`Invoice number ${meta.invoiceNumber} already exists.`);
    }

    const company = await prisma.company.findFirst();
    if (!company) {
      throw new Error('Company profile not found. Please set up your business profile first.');
    }

    const { items: formattedItems, subtotal, taxAmount, totalAmount } = this.calculateTotals(items, taxRate, discount);

    let issueDate = new Date();
    if (meta?.date) {
      const parsedDate = new Date(meta.date);
      if (!isNaN(parsedDate)) issueDate = parsedDate;
    }

    return await prisma.invoice.create({
      data: {
        invoiceNumber: meta.invoiceNumber,
        companyId: company.id,
        customerId: client.id,
        createdById: userId,
        issueDate,
        subtotal,
        taxAmount,
        totalAmount,
        status: 'SENT',
        items: { create: formattedItems }
      },
      include: {
        items: true,
        customer: true,
        company: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  /**
   * Fetches all invoices with related data.
   */
  async getAllInvoices() {
    return await prisma.invoice.findMany({
      include: {
        customer: true,
        company: true,
        items: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: {
        issueDate: 'desc',
      },
    });
  }
}

module.exports = new InvoiceService();
