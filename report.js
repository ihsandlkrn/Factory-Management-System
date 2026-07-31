// Comprehensive Report Generation Module

import { calculateTotalRevenue } from './sales.js';
import { purchasesModule } from './supplier.js';
import { 
    getRemainingQuantityFresh, 
    getRemainingQuantityFozen, 
    getRemainingQuantityOrganic 
} from './category.js';
import { getFromLocalStorage } from './category.js';

const TAX_RATE = 0.18; // Tax rate (e.g., 18%)
const PACKAGES_KEY = 'packagedProducts';

function generateComprehensiveReport() {
    // Step 1: Calculate total income from sales
    const totalIncome = calculateTotalRevenue();

    // Step 2: Calculate total expenses from purchases
    const totalExpenses = purchasesModule.purchases.reduce((sum, purchase) => sum + (purchase.quantity * purchase.pricePerKg), 0);

    // Step 3: Calculate tax applied
    const taxApplied = totalIncome * TAX_RATE;

    // Step 4: Calculate net profit
    const netProfit = totalIncome - totalExpenses - taxApplied;

    // Step 5: Number of products sold per category (kilograms and package counts)
    const packagedProducts = getFromLocalStorage(PACKAGES_KEY);
    const categorySales = {};
    packagedProducts.forEach((pack) => {
        const key = `${pack.blueberryType} - ${pack.category}`;
        if (!categorySales[key]) {
            categorySales[key] = { kilograms: 0, packages: 0 };
        }
        categorySales[key].kilograms += pack.totalWeight;
        categorySales[key].packages += pack.count;
    });

    // Step 6: Remaining stock per category
    const remainingStock = {
        Fresh: getRemainingQuantityFresh(),
        Frozen: getRemainingQuantityFozen(),
        Organic: getRemainingQuantityOrganic()
    };

    // Combine all data into a report object
    const report = {
        totalIncome,
        totalExpenses,
        taxApplied,
        netProfit,
        productsSoldPerCategory: categorySales,
        remainingStock
    };

    // Log or return the report
    
    return report;
}

// Example Usage
const report = generateComprehensiveReport();


// HTML Integration
function displayReportInHTML() {
    const report = generateComprehensiveReport();

    const totalIncomeEl = document.getElementById('totalIncome');
    if (!totalIncomeEl) return;

    // Update HTML elements with report data
    totalIncomeEl.textContent = `Total Income: ${report.totalIncome.toFixed(2)} ₺`;
    document.getElementById('totalExpenses').textContent = `Total Expenses: ${report.totalExpenses.toFixed(2)} ₺`;
    document.getElementById('taxApplied').textContent = `Tax Applied: ${report.taxApplied.toFixed(2)} ₺`;
    document.getElementById('netProfit').textContent = `Net Profit: ${report.netProfit.toFixed(2)} ₺`;

    const productsSoldElement = document.getElementById('productsSoldPerCategory');
    if (productsSoldElement) {
        productsSoldElement.innerHTML = '';
        for (const [category, data] of Object.entries(report.productsSoldPerCategory)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${category}: ${data.kilograms.toFixed(2)} kg (${data.packages} packages)`;
            productsSoldElement.appendChild(listItem);
        }
    }

    const remainingStockElement = document.getElementById('remainingStock');
    if (remainingStockElement) {
        remainingStockElement.innerHTML = '';
        for (const [category, quantity] of Object.entries(report.remainingStock)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${category}: ${quantity.toFixed(2)} kg`;
            remainingStockElement.appendChild(listItem);
        }
    }
}

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the "Generate Report" button
    const generateReportButton = document.getElementById('generateReportButton');
    if (generateReportButton) {
        generateReportButton.addEventListener('click', displayReportInHTML);
    } else {
        console.error('Generate Report button not found in the DOM.');
    }

    console.log('Event listeners initialized for report generation.');
});
