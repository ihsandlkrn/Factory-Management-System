import { calculateTotalRevenue } from './sales.js';
import { purchasesModule } from './supplier.js';
import { getTotalPurchasedQuantityFresh, getTotalPurchasedQuantityFrozen, getTotalPurchasedQuantityOrganic } from './supplier.js';
import { getPricingStructure } from './category.js';

const TAX_RATE = 0.18; // 18%

export function calculateExpenses() {
    // Get all purchases
    const purchases = purchasesModule.purchases;

    // Calculate expenses by summing up quantity * pricePerKg for each purchase
    const totalExpense = purchases.reduce((total, purchase) => {
        return total + (purchase.quantity * purchase.pricePerKg);
    }, 0);

    console.log('Total Expense:', totalExpense.toFixed(2));
    return totalExpense;
}



export function calculateTaxes(income) {
    return income * TAX_RATE;
}

export function calculateNetProfit() {
    const income = calculateTotalRevenue(); // From Sales module
    const expenses = calculateExpenses();
    const taxes = calculateTaxes(income);

    return {
        income,
        expenses,
        taxes,
        netProfit: income - (expenses + taxes),
    };
}

export function displayFinancialReport() {
    const { income, expenses, taxes, netProfit } = calculateNetProfit();

    const reportElement = document.getElementById('financialReport');
    if (!reportElement) return;

    reportElement.innerHTML = `
        <p><strong>Total Income:</strong> ${income.toFixed(2)} ₺</p>
        <p><strong>Total Expenses:</strong> ${expenses.toFixed(2)} ₺</p>
        <p><strong>Taxes:</strong> ${taxes.toFixed(2)} ₺</p>
        <p><strong>Net Profit:</strong> ${netProfit.toFixed(2)} ₺</p>
    `;
}

// Auto-update financial report when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayFinancialReport();
});
