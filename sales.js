import {  categories,packageProducts,getPricingStructure } from './category.js';


const pricingStructure = getPricingStructure();

// Sales Management Module
export const salesModule = {
    orders: JSON.parse(localStorage.getItem('orders')) || [],
    revenue: {},

    // Log a new order
    logOrder(order) {
        const orderId = this.generateOrderId();
        const totalPrice = order.quantity * order.unitPrice;
        const orderDate = new Date().toISOString(); // Add the current date
    
        const newOrder = {
            orderId,
            ...order,
            totalPrice,
            date: orderDate, // Save the date
            status: 'Pending', // Default case
        };
    
        this.orders.push(newOrder);
        this.saveOrdersToLocalStorage(); 
        this.updateRevenue(order.category, totalPrice);
    
        console.log(`Order logged:`, newOrder);
    },
    saveOrdersToLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    },
    
    loadOrdersFromLocalStorage() {
        const storedOrders = localStorage.getItem('orders');
        this.orders = storedOrders ? JSON.parse(storedOrders) : [];
    },

    // Generate a unique Order ID
    generateOrderId() {
        return `ORD-${Date.now()}`;
    },

    // Update order status
    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
        order.status = newStatus;
        this.saveOrdersToLocalStorage(); 
        console.log(`Order ${orderId} status updated to ${newStatus}`);
    } else {
        console.error(`Order with ID ${orderId} not found.`);
    }
    },

    // Search orders
    searchOrders({ status, customer, category }) {
        return this.orders.filter(order => 
            (!status || order.status === status) &&
            (!customer || order.customer.name.toLowerCase().includes(customer.toLowerCase())) &&
            (!category || order.category === category)
        );
    },

    // Calculate revenue
    updateRevenue(category, amount) {
        this.revenue[category] = (this.revenue[category] || 0) + amount;
        localStorage.setItem('revenue', JSON.stringify(this.revenue));
    },


    // Save orders to localStorage
    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    },

    
    
};

//display de orders 
function displayOrders() {
    const orders = salesModule.orders; // Gets all the orders
    const tableBody = document.querySelector('#orderDetailsTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; // cleans the table
    orders.forEach(order => {
        const row = document.createElement('tr');
 
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customer.name}</td>
            <td>${order.category}</td>
            <td>${order.blueberryType}</td>
            <td>${order.quantity}</td>
            <td>${order.totalPrice.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td> <!-- Format and Display the Date -->
            <td>${order.status}</td>
            <td>
                <select class="statusDropdown" data-order-id="${order.orderId}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processed" ${order.status === 'Processed' ? 'selected' : ''}>Processed</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
        `;
 
        tableBody.appendChild(row);
    });
}


//Updates Categories Dropdown 
function populateCategoryDropdown() {
    const categoryDropdown = document.getElementById('productCategory');
    if (!categoryDropdown) return;
    categoryDropdown.innerHTML = ''; 
 
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
    });
}
//Filter the orders
function filterOrders(criteria) {
    const { customerName, category, status } = criteria;

    // gets all orders
    const orders = salesModule.orders;

    // filtering
    const filteredOrders = orders.filter(order => {
        const matchesCustomer = customerName ? order.customer.name.toLowerCase().includes(customerName.toLowerCase()) : true;
        const matchesCategory = category ? order.category === category : true;
        const matchesStatus = status ? order.status === status : true;

        return matchesCustomer && matchesCategory && matchesStatus;
    });

    return filteredOrders;
}
//display the filtered orders
function displayFilteredOrders(orders) {
    const tableBody = document.getElementById('filteredOrdersTable');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
 
    orders.forEach(order => {
        const row = document.createElement('tr');
 
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customer.name}</td>
            <td>${order.category}</td>
            <td>${order.quantity}</td>
            <td>${order.status}</td>
        `;
 
        tableBody.appendChild(row);
    });
 
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No orders found.</td></tr>';
    }
}
//total revenue
export function calculateTotalRevenue() {
    const orders = salesModule.orders;

    return orders.reduce((total, order) => {
        const orderRevenue = order.quantity * order.unitPrice;
        return total + orderRevenue;
    }, 0);
}

//Grouped Revenue
function calculateRevenueAndUnitsByCategoryAndType() {
    const orders = salesModule.orders;

    const dataByCategoryAndType = {};

    orders.forEach(order => {
        const key = `${order.category} - ${order.blueberryType}`; 

        if (!dataByCategoryAndType[key]) {
            dataByCategoryAndType[key] = { revenue: 0, units: 0 };
        }

        dataByCategoryAndType[key].revenue += order.quantity * order.unitPrice; 
        dataByCategoryAndType[key].units += order.quantity; 
    });

    return dataByCategoryAndType;
}


function displayRevenueAndUnitsByCategoryAndType() {
    const dataByCategoryAndType = calculateRevenueAndUnitsByCategoryAndType();
    const tableBody = document.getElementById('revenueByCategoryAndTypeTable');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
 
    Object.entries(dataByCategoryAndType).forEach(([key, data]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${key}</td>
            <td>${data.units}</td>
            <td>${data.revenue.toFixed(2)} ₺</td>
        `;
        tableBody.appendChild(row);
    });
}

// Generate detailed sales report by category, customer, or time period
function generateDetailedSalesReport({ category = null, customer = null, startDate = null, endDate = null }) {
    const filteredOrders = salesModule.orders.filter(order => {
        const matchesCategory = category ? order.category === category : true;
        const matchesCustomer = customer ? order.customer.name.toLowerCase().includes(customer.toLowerCase()) : true;
        const matchesDateRange = startDate && endDate 
            ? new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate)
            : true;

        return matchesCategory && matchesCustomer && matchesDateRange;
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalUnitsSold = filteredOrders.reduce((sum, order) => sum + order.quantity, 0);

    return { filteredOrders, totalRevenue, totalUnitsSold };
}

// Event Listener for Report Generation
const generateReportForm = document.getElementById('generateReportForm');
if (generateReportForm) {
    generateReportForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const category = document.getElementById('reportCategory').value;
        const customer = document.getElementById('reportCustomer').value;
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
    
        const report = generateDetailedSalesReport({ category, customer, startDate, endDate });
    
        // Display the report
        const reportOutput = document.getElementById('generatedReportOutput');
        if (reportOutput) {
            reportOutput.textContent = JSON.stringify(report, null, 2);
        }
    
        // Visualize the report
        visualizeSalesData(report.filteredOrders);
    });
}


let salesChartInstance = null; // Holds the current Chart.js instance

// Visualize sales data with a bar chart
function visualizeSalesData(filteredOrders) {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const categories = [...new Set(filteredOrders.map(order => order.category))];
    const data = categories.map(category => {
        const categoryOrders = filteredOrders.filter(order => order.category === category);
        return categoryOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    });
 
    // Destroy the previous chart instance if it exists
    if (salesChartInstance) {
        salesChartInstance.destroy();
    }
 
    // Create a new chart
    salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Sales Revenue by Category',
                data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            }]
        }
    });
}


// Export Report as CSV
const exportCsvBtn = document.getElementById('exportCsv');
if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
        const reportOutput = document.getElementById('generatedReportOutput');
        if (!reportOutput || !reportOutput.textContent) return;
        const report = JSON.parse(reportOutput.textContent);
        const csvRows = ['Category,Customer,Quantity,Total Price'];
    
        report.filteredOrders.forEach(order => {
            csvRows.push(`${order.category},${order.orderId},${order.quantity},${order.totalPrice}`);
        });
    
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales_report.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
}





// Example Usage
const reportData = generateDetailedSalesReport({ startDate: '2024-12-01', endDate: '2024-12-20' });
visualizeSalesData(reportData.filteredOrders);


//shows the revenues when page loaded
document.addEventListener('DOMContentLoaded', () => {
    updateRevenueDetails();
});

//updates the revanue when new order comes
function updateRevenueDetails() {
    // total revenue
    const totalRevenue = calculateTotalRevenue();
    const totalRevenueOutput = document.getElementById('totalRevenueOutput');
    if (totalRevenueOutput) {
        totalRevenueOutput.textContent = `Total Revenue: ${totalRevenue.toFixed(2)} ₺`;
    }
 
    // revenues based on categories
    displayRevenueAndUnitsByCategoryAndType();
}




//event listener for filtering
const filterOrdersForm = document.getElementById('filterOrdersForm');
if (filterOrdersForm) {
    filterOrdersForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        // gets the criterias
        const customerName = document.getElementById('searchCustomer').value;
        const category = document.getElementById('searchCategory').value;
        const status = document.getElementById('searchStatus').value;
    
        // filters the orders
        const filteredOrders = filterOrders({ customerName, category, status });
    
        // Shows the results
        displayFilteredOrders(filteredOrders);
    });
}


// Add categories to the dropdosn when page loaded
document.addEventListener('DOMContentLoaded', populateCategoryDropdown);
//reads the orders from local storage
document.addEventListener('DOMContentLoaded', () => {
    salesModule.loadOrdersFromLocalStorage(); // Gets the orders from local stoage
    displayOrders(); // Updates table
});

//Automaticly shows the unit prices
const productCategoryEl = document.getElementById('productCategory');
if (productCategoryEl) {
    productCategoryEl.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        const categoryPricing = pricingStructure.find(item => item.category === selectedCategory);
    
        const unitPriceEl = document.getElementById('unitPrice');
        if (categoryPricing && unitPriceEl) {
            unitPriceEl.value = categoryPricing.pricePerKg; // fills the prices
        } else if (unitPriceEl) {
            unitPriceEl.value = '';
            console.warn('Selected category not found in pricing structure!');
        }
    });
}




document.addEventListener('change', (event) => {
    if (event.target.classList.contains('statusDropdown')) {
        const orderId = event.target.getAttribute('data-order-id');
        const newStatus = event.target.value;

        salesModule.updateOrderStatus(orderId, newStatus);
        alert(`Order ${orderId} status updated to ${newStatus}`);
    }
});
//event listener for Log Order
const logOrderForm = document.getElementById('logOrderForm');
if (logOrderForm) {
    logOrderForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const selectedCategory = document.getElementById('productCategory').value;
        const categoryPricing = pricingStructure.find(item => item.category === selectedCategory);
    
    
        if (!categoryPricing) {
            alert('Selected category not found in pricing structure!');
            return;
        }
    
        const blueberryType = document.getElementById('blueberryType').value;
    
        const order = {
            customer: {
                name: document.getElementById('customerName').value,
                contact: document.getElementById('contactInfo').value,
                shipping: document.getElementById('shippingInfo').value,
            },
            category: selectedCategory,
            blueberryType: blueberryType,
            quantity: parseInt(document.getElementById('quantityOrdered').value),
            unitPrice: categoryPricing.pricePerKg,
            customWeight: selectedCategory === 'Premium' ? parseFloat(document.getElementById('customWeight').value) : null,
            packCount: selectedCategory === 'Premium' ? parseInt(document.getElementById('packCount').value) : null,
        };
        console.log('Category:', selectedCategory);
        console.log('Blueberry Type:', blueberryType);
        console.log('Pack Count:', parseInt(document.getElementById('quantityOrdered').value));
        console.log('Custom Weight:', selectedCategory);
        console.log('BlueberryType:',order.blueberryType);
    
        let isPackaged;
        if (order.category === 'Premium') {
            isPackaged = packageProducts(order.category, order.blueberryType, order.packCount, order.customWeight);
        } else {
            isPackaged = packageProducts(order.category, order.blueberryType, order.quantity);
        }
    
        // Dont updates the local storage id packaging is not successful
        if (!isPackaged) {
            alert('Order could not be processed due to insufficient stock.Please wait until the new stocks are available');
            return;
        }
    
        // If packaging is successful than update the local storage
        salesModule.logOrder(order);
        displayOrders();
        updateRevenueDetails();
        displayRevenueAndUnitsByCategoryAndType();
        updateRevenueDetails();
        
        alert('Order successfully logged!');
    });
}
 
//shows the hidden parts when premium selected
const productCategorySelect = document.getElementById('productCategory');
if (productCategorySelect) {
    productCategorySelect.addEventListener('change', function () {
        const premiumOptions = document.getElementById('premiumOptions');
        if (premiumOptions) {
            if (this.value === 'Premium') {
                premiumOptions.style.display = 'block';
            } else {
                premiumOptions.style.display = 'none';
            }
        }
    });
}


