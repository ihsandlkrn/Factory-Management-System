
//key for fresh quaintity
const Difference_Key = 'Difference'
// Supplier Management Module
const purchaseIdCounter=1
// Farmers' Information Module
export const farmersModule = {
    farmers: JSON.parse(localStorage.getItem('farmers')) || [],

    addFarmer(farmer) {
        // Check if a farmer with the same ID already exists
        
        if (this.farmers.some(existingFarmer => existingFarmer.id === farmer.id)) {
            alert('A farmer with this ID already exists.');
            return;
        }

        // Add the new farmer to the list
        this.farmers.push(farmer);
        this.saveFarmers();
        this.renderFarmersList();
        updateFarmerDropdown();
        updatePurchaseFarmerDropdown();  // Update dropdown for purchases
    },

    // Update farmer function
    updateFarmer(farmerId, updatedData) {
        const index = this.farmers.findIndex(farmer => farmer.id === farmerId);
        if (index !== -1) {
            const farmer = this.farmers[index];
            
            // Only update the fields that are not empty
            const updatedFarmer = {
                id: farmer.id,  // Keep the same ID (unchanged)
                name: updatedData.name || farmer.name, // If name is provided, update it; otherwise keep the old one
                contact: updatedData.contact || farmer.contact, // Same for contact
                location: updatedData.location || farmer.location // Same for location
            };

            this.farmers[index] = updatedFarmer; // Apply the updated values to the farmer object
            this.saveFarmers();
            this.renderFarmersList();
            updateFarmerDropdown();
            updatePurchaseFarmerDropdown(); // Update purchase dropdown
        } else {
            alert("Farmer not found!");
        }
    },

    deleteFarmer(farmerId) {
        // Remove the farmer with the given ID
        this.farmers = this.farmers.filter(farmer => farmer.id !== farmerId);
        
        // Save the updated farmers list to localStorage
        this.saveFarmers();
    
        // Re-render the farmers list and update the dropdown
        this.renderFarmersList();
        updateFarmerDropdown();
    },

    searchFarmers(query) {
        const results = this.farmers.filter(farmer => 
            farmer.name.toLowerCase().includes(query.toLowerCase()) ||
            farmer.location.toLowerCase().includes(query.toLowerCase())
        );
        this.renderSearchResults(results);
    },

    saveFarmers() {
        localStorage.setItem('farmers', JSON.stringify(this.farmers));
        console.log(this.farmers);
    },

    exportFarmers() {
        return this.farmers.map(farmer => ({ ...farmer }));
    },

    renderFarmersList() {
        const listContainer = document.querySelector('#farmers-list ul');
        if (!listContainer) return;
        listContainer.innerHTML = ''; // Clear the existing list
    
        this.farmers.forEach(farmer => {
            const listItem = document.createElement('li');
            listItem.textContent = `${farmer.id}: ${farmer.name} - ${farmer.location}`;
    
            // Create a delete button for each farmer
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                this.deleteFarmer(farmer.id);
            });
    
            // Append the delete button to the list item
            listItem.appendChild(deleteButton);
            listContainer.appendChild(listItem);
        });
    },
    
    renderSearchResults(results) {
        const searchResultsContainer = document.querySelector('#search-results');
        if (!searchResultsContainer) return;
        searchResultsContainer.innerHTML = '';
        results.forEach(farmer => {
            const listItem = document.createElement('li');
            listItem.textContent = `${farmer.id}: ${farmer.name} - ${farmer.location}`;
            searchResultsContainer.appendChild(listItem);
        });
    },
    exportFarmersToCSV() {
        const csvHeaders = ["ID", "Name", "Contact", "Location"];
        const rows = this.farmers.map(farmer => [
            farmer.id,
            farmer.name,
            farmer.contact,
            farmer.location
        ]);
    
        const csvContent = [
            csvHeaders.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "farmers_data.csv");
        link.style.display = "none";
        document.body.appendChild(link);
    
        link.click();
        document.body.removeChild(link);
    }
    
};

// Purchase Records Module
export const purchasesModule = {
    purchases: JSON.parse(localStorage.getItem('purchases')) || [],
    purchaseIdCounter: JSON.parse(localStorage.getItem('purchaseIdCounter')) || 1,
    addPurchase(purchase) {
        
        const totalCost = purchase.quantity * purchase.pricePerKg;
        console.log(purchase)

        // Create a unique ID for the new purchase
        const purchaseWithId = {
            id: this.purchaseIdCounter,
            ...purchase,
            blueberryType: purchase.blueberryType || 'Fresh',
            totalCost
        };
        

        // Increment the counter for next purchase
        this.purchaseIdCounter++;
        

        // Save the new purchase and update the counter in localStorage
        this.purchases.push(purchaseWithId);
        this.savePurchases();
        this.renderPurchasesList();
        
        // Save the updated counter in localStorage
        localStorage.setItem('purchaseIdCounter', JSON.stringify(this.purchaseIdCounter));
    },
    // Sort purchases by selected criterion (date, farmer, amount)
    sortPurchases(criterion) {
        switch (criterion) {
            case 'date':
                this.purchases.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'farmer':
                this.purchases.sort((a, b) => a.farmerId - b.farmerId);
                break;
            case 'amount':
                this.purchases.sort((a, b) => a.totalCost - b.totalCost);
                break;
            default:
                break;
        }
        this.renderPurchasesList();
    },
    getPurchasesByFarmer(farmerId) {
        return this.purchases.filter(purchase => purchase.farmerId === farmerId);
    },
    

    getPurchasesByDateRange(startDate, endDate) {
        return this.purchases.filter(purchase => {
            const purchaseDate = new Date(purchase.date);
            return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
        });
    },

    savePurchases() {
        localStorage.setItem('purchases', JSON.stringify(this.purchases));
    },
    // Generate summary by farmer or date range
    generateSummary(farmerId = null, startDate = null, endDate = null) {
        // Filter purchases based on the selected criteria
        let filteredPurchases = this.purchases;

        if (farmerId) {
            filteredPurchases = filteredPurchases.filter(purchase => purchase.farmerId == farmerId);
        }

        if (startDate) {
            filteredPurchases = filteredPurchases.filter(purchase => new Date(purchase.date) >= new Date(startDate));
        }

        if (endDate) {
            filteredPurchases = filteredPurchases.filter(purchase => new Date(purchase.date) <= new Date(endDate));
        }

        // Summarize filtered purchases
        const totalQuantity = filteredPurchases.reduce((total, purchase) => total + purchase.quantity, 0);
        const totalAmount = filteredPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);

        // Display the summary
        const summaryElement = document.querySelector('#purchase-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <h3>Purchase Summary</h3>
                <p>Total Quantity: ${totalQuantity} kg</p>
                <p>Total Amount: $${totalAmount.toFixed(2)}</p>
            `;
        }
    },
    
    // Calculate total expenses for the selected period
    calculateExpenses(timePeriod, startDate, endDate) {
        let filteredPurchases = this.purchases;

        // Filter purchases based on the selected date range
        if (startDate) {
            filteredPurchases = filteredPurchases.filter(purchase => new Date(purchase.date) >= new Date(startDate));
        }

        if (endDate) {
            filteredPurchases = filteredPurchases.filter(purchase => new Date(purchase.date) <= new Date(endDate));
        }

        // Filter purchases based on time period (daily, weekly, monthly)
        if (timePeriod) {
            filteredPurchases = filteredPurchases.filter(purchase => {
                const purchaseDate = new Date(purchase.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                if (timePeriod === 'daily') {
                    return purchaseDate.toDateString() === start.toDateString();
                } else if (timePeriod === 'weekly') {
                    const diff = Math.floor((purchaseDate - start) / (1000 * 3600 * 24)); // Calculate the number of days difference
                    return diff >= 0 && diff < 7; // Check if within the current week
                } else if (timePeriod === 'monthly') {
                    return purchaseDate.getMonth() === start.getMonth() && purchaseDate.getFullYear() === start.getFullYear();
                }
            });
        }

        // Calculate the total cost
        const totalExpenses = filteredPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);
        return totalExpenses;
    },
     

    // Render the expense report based on selected time period
    generateExpenseReport(timePeriod, startDate, endDate) {
        const totalExpenses = this.calculateExpenses(timePeriod, startDate, endDate);
        
        const reportElement = document.querySelector('#expense-report');
        if (reportElement) {
            reportElement.innerHTML = `
                <h3>Expense Report</h3>
                <p>Total Expenses for the ${timePeriod} period: $${totalExpenses.toFixed(2)}</p>
            `;
        }
    },

    getTotalExpenses() {
        
        return this.purchases.reduce((total, purchase) => total + purchase.quantity, 0);
    },

    // Render purchase records list
    renderPurchasesList() {
        const listContainer = document.querySelector('#purchases-list ul');
        if (!listContainer) return;
        listContainer.innerHTML = ''; // Clean the existing list
        this.purchases.forEach(purchase => {
            const listItem = document.createElement('li');
            listItem.textContent = `Purchase ID: ${purchase.id}, Farmer ID: ${purchase.farmerId},Type: ${purchase.blueberryType},  Date: ${purchase.date}, Quantity: ${purchase.quantity}kg @ $${purchase.pricePerKg}/kg = $${purchase.totalCost}`;
            listContainer.appendChild(listItem);
        });
    }
};
//Calcultes the amount of fresh
export function getTotalPurchasedQuantityFresh() {
    return purchasesModule.purchases
        .filter(purchase => 
            purchase.blueberryType && 
            purchase.blueberryType.trim().toLowerCase() === 'fresh'
        )
        .reduce((total, purchase) => total + purchase.quantity, 0);
}

//Calcultes the amount of Frozen
export function getTotalPurchasedQuantityFrozen() {
    return purchasesModule.purchases
        .filter(purchase => 
            purchase.blueberryType && 
            purchase.blueberryType.trim().toLowerCase() === 'frozen'
        )
        .reduce((total, purchase) => total + purchase.quantity, 0);
}

//Calcultes the amount of organic
export function getTotalPurchasedQuantityOrganic() {
    return purchasesModule.purchases
        .filter(purchase => 
            purchase.blueberryType && 
            purchase.blueberryType.trim().toLowerCase() === 'organic'
        )
        .reduce((total, purchase) => total + purchase.quantity, 0);
}


// In purchasesModule
export  function getTotalPurchasedQuantity() {
    return purchasesModule.purchases.reduce((total, purchase) => total + purchase.quantity, 0);
}

// Event listener for generating the expense report
const button = document.getElementById('generate-expense-report')
if(button){
    button.addEventListener('click', () => {
    
        const timePeriod = document.querySelector('#time-period').value;
        const startDate = document.querySelector('#expense-start-date').value;
        const endDate = document.querySelector('#expense-end-date').value;
    
        purchasesModule.generateExpenseReport(timePeriod, startDate, endDate);
    })
};

// Updates dropdowns for selecting farmer in both purchase form and update form
// Update farmer dropdown with farmer information
function updateFarmerDropdown() {
    const updateDropdown = document.querySelector('#update-farmer-id');
    if (!updateDropdown) return;
    updateDropdown.innerHTML = '<option value="">Select Farmer</option>';
 
    // Add each farmer to the dropdown with their ID and name
    farmersModule.farmers.forEach(farmer => {
        const option = document.createElement('option');
        option.value = farmer.id;
        option.textContent = `${farmer.name} (ID: ${farmer.id})`;  // Add ID next to name
        updateDropdown.appendChild(option);
    });
 
    // Pre-fill the form with selected farmer's data
    updateDropdown.addEventListener('change', (e) => {
        const selectedFarmerId = e.target.value;
        const selectedFarmer = farmersModule.farmers.find(farmer => farmer.id === selectedFarmerId);
 
        if (selectedFarmer) {
            document.querySelector('#update-farmer-name').value = selectedFarmer.name;
            document.querySelector('#update-farmer-contact').value = selectedFarmer.contact;
            document.querySelector('#update-farmer-location').value = selectedFarmer.location;
        } else {
            // Clear the form if no farmer is selected
            document.querySelector('#update-farmer-name').value = '';
            document.querySelector('#update-farmer-contact').value = '';
            document.querySelector('#update-farmer-location').value = '';
        }
    });
}

// Update the dropdown list for the purchase farmer selection
function updatePurchaseFarmerDropdown() {
    const dropdown = document.querySelector('#purchase-farmer-id');
    if (!dropdown) return;
    dropdown.innerHTML = '<option value="">Select Farmer</option>'; // Reset the dropdown
 
    farmersModule.farmers.forEach(farmer => {
        const option = document.createElement('option');
        option.value = farmer.id; // Farmer ID as the value
        option.textContent = `${farmer.name} (${farmer.location})`; // Display text
        dropdown.appendChild(option);
    });
}
// Populate the farmer select dropdown with unique farmer IDs
function populateFarmerSelect() {
    const farmerSelect = document.querySelector('#farmer-id-filter');
    if (!farmerSelect) return;
    const farmerIds = [...new Set(purchasesModule.purchases.map(purchase => purchase.farmerId))]; // Unique farmer IDs
 
    // Clear existing options
    farmerSelect.innerHTML = '<option value="">Select Farmer</option>';
 
    farmerIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `Farmer ID: ${id}`;
        farmerSelect.appendChild(option);
    });
}

// Call populateFarmerSelect on page load to fill the dropdown
document.addEventListener('DOMContentLoaded', () => {
    populateFarmerSelect();
});

document.addEventListener('DOMContentLoaded', () => {
    // Populate the dropdown with farmers on page load
    updateFarmerDropdown();
 
    // Handle the update farmer form submission
    const updateFarmerForm = document.querySelector('#update-farmer-form');
    if (updateFarmerForm) {
        updateFarmerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission
    
            const farmerId = document.querySelector('#update-farmer-id').value;
            const updatedName = document.querySelector('#update-farmer-name').value;
            const updatedContact = document.querySelector('#update-farmer-contact').value;
            const updatedLocation = document.querySelector('#update-farmer-location').value;
    
            // Check if a farmer is selected
            if (farmerId) {
                const updatedData = {
                    name: updatedName || undefined,   // If the field is empty, set it to undefined
                    contact: updatedContact || undefined, // Same for contact
                    location: updatedLocation || undefined // Same for location
                };
                // Update the farmer using the ID and new data
                farmersModule.updateFarmer(farmerId, updatedData);
    
                // Clear the form after update
                updateFarmerForm.reset();
            } else {
                alert('Please select a farmer to update!');
            }
        });
    }
});

// Event listeners for sort buttons
document.addEventListener('DOMContentLoaded', function() {
    const element = document.getElementById('sort-date');
    if (element) {
        element.addEventListener('click', function() {
            purchasesModule.sortPurchases('date');
        });
    } else {
        console.error('Element with ID "sort-date" not found!');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const element = document.getElementById('sort-farmer');
    if (element) {
        element.addEventListener('click', function() {
            purchasesModule.sortPurchases('farmer');
        });
    } else {
        console.error('Element with ID "sort-farmer" not found!');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const element = document.getElementById('sort-amount');
    if (element) {
        element.addEventListener('click', function() {
            purchasesModule.sortPurchases('amount');
        });
    } else {
        console.error('Element with ID "sort-amount" not found!');
    }
});

// When the page is loaded, update the dropdowns
document.addEventListener('DOMContentLoaded', () => {
    updateFarmerDropdown(); // Update the dropdowns with farmer data on page load
    
});

// Event listener for generating the purchase summary
const generateSummaryBtn = document.querySelector('#generate-summary');
if (generateSummaryBtn) {
    generateSummaryBtn.addEventListener('click', () => {
        const farmerId = document.querySelector('#farmer-id-filter').value;
        const startDate = document.querySelector('#start-date').value;
        const endDate = document.querySelector('#end-date').value;
    
        purchasesModule.generateSummary(farmerId, startDate, endDate);
    });
}

//Calculates the new purchesed quantity for Fresh blueberries.
const oldTotalQuantitiyKeyFresh = 'oldQuantitiyFresh';
const Fresh_Berry_Key = 'Fresh';
function calculateDifferenceFresh() {
    const oldTotalQuantityFresh = parseInt(localStorage.getItem(oldTotalQuantitiyKeyFresh)) || 0; 
    const newTotalQuantityFresh = getTotalPurchasedQuantityFresh(); 

    // Calculate the 
    const resultQuantity = newTotalQuantityFresh - oldTotalQuantityFresh;

    // save the new value to the local storage
    localStorage.setItem(oldTotalQuantitiyKeyFresh, newTotalQuantityFresh.toString());
    localStorage.setItem(Fresh_Berry_Key,resultQuantity);
}

//Calculates the new purchesed quantity for Frozen blueberries.
const oldTotalQuantitiyKeyFrozen = 'oldQuantitiyFrozen';
const Frozen_Berry_Key = 'Frozen';
function calculateDifferenceFozen() {
    const oldTotalQuantityFrozen = parseInt(localStorage.getItem(oldTotalQuantitiyKeyFrozen)) || 0; 
    const newTotalQuantityFrozen = getTotalPurchasedQuantityFrozen(); 

    
    const resultQuantity = newTotalQuantityFrozen - oldTotalQuantityFrozen;

    
    localStorage.setItem(oldTotalQuantitiyKeyFrozen, newTotalQuantityFrozen.toString());
    localStorage.setItem(Frozen_Berry_Key,resultQuantity);

    
}

//Calculates the new purchesed quantity for Organic blueberries.
const oldTotalQuantitiyKeyOrganic = 'oldQuantitiyOrganic';
const Organic_Berry_Key = 'Organic';
function calculateDifferenceOrganic() {
    const oldTotalQuantityOrganic = parseInt(localStorage.getItem(oldTotalQuantitiyKeyOrganic)) || 0; 
    const newTotalQuantityOrganic = getTotalPurchasedQuantityOrganic(); 

    
    const resultQuantity = newTotalQuantityOrganic - oldTotalQuantityOrganic;

    
    localStorage.setItem(oldTotalQuantitiyKeyOrganic, newTotalQuantityOrganic.toString());
    localStorage.setItem(Organic_Berry_Key,resultQuantity);

    
}
function calculateDifference() {
    const newTotalQuantity = getTotalPurchasedQuantity();
    

    const oldTotalQuantity = parseInt(localStorage.getItem('oldQuantitiy')) || 0;
    

    const resultQuantity = newTotalQuantity - oldTotalQuantity;
    console.log('Difference:', resultQuantity); 

    localStorage.setItem('oldQuantitiy', newTotalQuantity.toString());
    localStorage.setItem(Difference_Key,resultQuantity);
}


// Event Listeners for Integration
document.addEventListener('DOMContentLoaded', () => {
    // Farmers Module Integration
    const addFarmerForm = document.querySelector('#add-farmer-form');
    if (addFarmerForm) {
        addFarmerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const farmer = {
                id: document.querySelector('#farmer-id').value,
                name: document.querySelector('#farmer-name').value,
                contact: document.querySelector('#farmer-contact').value,
                location: document.querySelector('#farmer-location').value
            };
            if(farmer.id<0){
                alert("Please enter a valid id");
                return;
            }
            farmersModule.addFarmer(farmer);
            addFarmerForm.reset();
        });
    }

    const searchBtn = document.querySelector('#search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = document.querySelector('#search-query').value;
            farmersModule.searchFarmers(query);
        });
    }

    farmersModule.renderFarmersList();

    
    
    // Purchases Module Integration
    const addPurchaseForm = document.querySelector('#add-purchase-form');
    if (addPurchaseForm) {
        addPurchaseForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
        
            const farmerId = document.querySelector('#purchase-farmer-id').value;
            if (!farmerId) {
                alert('Please select a farmer.');
                return; 
            }
        
            const purchase = {
                farmerId: farmerId,
                date: document.querySelector('#purchase-date').value,
                quantity: parseFloat(document.querySelector('#purchase-quantity').value),
                pricePerKg: parseFloat(document.querySelector('#purchase-price').value),
                blueberryType: document.querySelector('#blueberry-type').value
            };
            if(purchase.quantity  <0){
                alert("Please enter valid quantity");
                return;
            }
            if(purchase.pricePerKg  <0){
                alert("Please enter valid price kg");
                return;
            }
            purchasesModule.addPurchase(purchase);
            const freshDiff = calculateDifferenceFresh();
            const FrozenDiff = calculateDifferenceFozen();
            const OrganicDiff = calculateDifferenceOrganic();
            const totalDiff = calculateDifference();
    
            addPurchaseForm.reset(); 
        });
    }
    
    purchasesModule.renderPurchasesList(); 
});

const exportFarmerDetailsBtn = document.getElementById("export-farmer-details");
if (exportFarmerDetailsBtn) {
    exportFarmerDetailsBtn.addEventListener("click", () => {
        farmersModule.exportFarmersToCSV();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    getTotalPurchasedQuantityFresh();
});
updatePurchaseFarmerDropdown();
updateFarmerDropdown();
