
import { getTotalPurchasedQuantity, getTotalPurchasedQuantityFrozen, getTotalPurchasedQuantityOrganic} from "./supplier.js";
import { getTotalPurchasedQuantityFresh } from "./supplier.js";



// saves to local storage

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
//gets from local storage
export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
//key for frozen quaintity
const Frozen_Remainig_Key = 'Fozen_Remainig_Key'

//key for organic quaintity
const Organic_Remainig_Key = 'Organic_Remainig_Key'

//key for fresh quaintity
const Fresh_Remainig_Key = 'Fresh_Remainig_Key'
// key for packet information
const PACKAGES_KEY = 'packagedProducts';
// key for unpacketed quantitiy
const REMAINING_QUANTITY_KEY = 'remainingQuantity';
// Categories and starting stocl levels
export const categories = [
    { name: 'Small', weight: 0.1, stockLevel: 0 },
    { name: 'Medium', weight: 0.25, stockLevel: 0 },
    { name: 'Large', weight: 0.5, stockLevel: 0 },
    { name: 'Extra Large', weight: 1, stockLevel: 0 },
    { name: 'Family Pack', weight: 2, stockLevel: 0 },
    { name: 'Bulk Pack', weight: 5, stockLevel: 0 },
    { name: 'Premium', weight: 'custom', stockLevel: 0 }
];

const PRICING_KEY = 'pricingStructure';

// Gets the prices from local storage
export function getPricingStructure() {
    const storedPricing = localStorage.getItem(PRICING_KEY);
    return storedPricing ? JSON.parse(storedPricing) : [
        { category: 'Small', pricePerKg: 10 },
        { category: 'Medium', pricePerKg: 9 },
        { category: 'Large', pricePerKg: 8.5 },
        { category: 'Extra Large', pricePerKg: 8 },
        { category: 'Family Pack', pricePerKg: 7.5 },
        { category: 'Bulk Pack', pricePerKg: 7 },
        { category: 'Premium', pricePerKg: 12 }
    ];
}

// saves the prices to local storage
function savePricingStructure(pricingStructure) {
    localStorage.setItem(PRICING_KEY, JSON.stringify(pricingStructure));
}


let pricingStructure = getPricingStructure();
//Updates the prices
function updateCategoryPrice(categoryName, newPrice) {
    const category = pricingStructure.find(item => item.category === categoryName);
    if (category) {
        category.pricePerKg = newPrice;
        savePricingStructure(pricingStructure); //saces updated prices to local stroage
        alert(`${categoryName} price updated to ${newPrice}₺/kg`);
    } else {
        alert('Category not found!');
    }
}

function displayPricingStructure() {
    const outputElement = document.getElementById('pricingStructureOutput');
    if (!outputElement) return;
    const output = pricingStructure.map(item =>
        `${item.category} - ${item.pricePerKg}₺/kg`
    ).join('\n');

    outputElement.textContent = output;
}

document.addEventListener('DOMContentLoaded', displayPricingStructure);

// Updates the unpackagedweight when new is buyed
const newQ1 = parseFloat(localStorage.getItem('Fresh'))
addFreshPurchasedQuantity(newQ1);
function addFreshPurchasedQuantity(newQ1){
    let  remainingQuantity = getRemainingQuantityFresh();
    if (newQ1 > 0) {    
        remainingQuantity += newQ1; // add new quantity
        updateRemainingQuantityFresh(remainingQuantity); // update and save
        console.log('Remaining Quantity (After):', remainingQuantity);
        alert(`Purchased ${newQ1} kg. Updated remaining un-packaged quantity: ${remainingQuantity.toFixed(2)} kg`);
        localStorage.setItem('Fresh',0);
    } else {
        console.warn('No new Fresh to add. Difference is zero .');
    }

}

// Updates the unpackagedweight when new is buyed
const newQ2 = parseFloat(localStorage.getItem('Frozen'))
addFrozenPurchasedQuantity(newQ2);
function addFrozenPurchasedQuantity(newQ2){
    let  remainingQuantity = getRemainingQuantityFozen();
    if (newQ2 > 0) {    
        remainingQuantity += newQ2; 
        updateRemainingQuantityFrozen(remainingQuantity); 
        console.log('Remaining Quantity (After):', remainingQuantity);
        alert(`Purchased ${newQ2} kg. Updated remaining un-packaged quantity: ${remainingQuantity.toFixed(2)} kg`);
        localStorage.setItem('Frozen',0);
    } else {
        console.warn('No new Frozen to add. Difference is zero.');
    }

}

// Updates the unpackagedweight when new is buyed
const newQ3 = parseFloat(localStorage.getItem('Organic'))
addOrganicPurchasedQuantity(newQ3);
function addOrganicPurchasedQuantity(newQ3){
    let  remainingQuantity = getRemainingQuantityOrganic();
    if (newQ3 > 0) {    
        remainingQuantity += newQ3; 
        updateRemainingQuantityOrganic(remainingQuantity); 
        console.log('Remaining Quantity (After):', remainingQuantity);
        alert(`Purchased ${newQ3} kg. Updated remaining un-packaged quantity: ${remainingQuantity.toFixed(2)} kg`);
        localStorage.setItem('Organic',0);
    } else {
        console.warn('No new Organic to add. Difference is zero.');
    }

}


const newQ = parseFloat(localStorage.getItem('Difference'));



//calculates the remaining
export function getRemainingQuantityFozen(){
    const savedQuantity = parseFloat(localStorage.getItem(Frozen_Remainig_Key));
    if (savedQuantity !== null && !isNaN(savedQuantity)) {
        return parseFloat(savedQuantity); 
}else{
    // if the local storeage is empty return the purhased weight
    return getTotalPurchasedQuantityFrozen();
}
}

//calculates the remaining
export function getRemainingQuantityOrganic(){
    const savedQuantity = parseFloat(localStorage.getItem(Organic_Remainig_Key));
    if (savedQuantity !== null && !isNaN(savedQuantity)) {
        return parseFloat(savedQuantity); 
}else{
    // if the local storeage is empty return the purhased weight
    return getTotalPurchasedQuantityOrganic();
}
}

//calculates the remaining
export function getRemainingQuantityFresh(){
    const savedQuantity = parseFloat(localStorage.getItem(Fresh_Remainig_Key));
    if (savedQuantity !== null && !isNaN(savedQuantity)) {
        return parseFloat(savedQuantity); 
}else{
    // if the local storeage is empty return the purhased weight
    return getTotalPurchasedQuantityFresh();
}
}
// Gets the unpackeged quantitiy 
function getRemainingQuantity() {
    const savedQuantity = parseFloat(localStorage.getItem(REMAINING_QUANTITY_KEY));
    if (savedQuantity !== null && !isNaN(savedQuantity)) {
        return parseFloat(savedQuantity); 
}else{
    // if the local storeage is empty return the purhased weight
    return getTotalPurchasedQuantity();
}

}

// Updates the unpackaged weight and stores it into local storage
function updateRemainingQuantityFrozen(newQuantity) {
    localStorage.setItem(Frozen_Remainig_Key, newQuantity.toFixed(2));
    return newQuantity;
}

// Updates the unpackaged weight and stores it into local storage
function updateRemainingQuantityOrganic(newQuantity) {
    localStorage.setItem(Organic_Remainig_Key, newQuantity.toFixed(2));
    return newQuantity;
}

// Updates the unpackaged weight and stores it into local storage
function updateRemainingQuantityFresh(newQuantity) {
    localStorage.setItem(Fresh_Remainig_Key, newQuantity.toFixed(2));
    return newQuantity;
}
// Updates the unpackaged weight and stores it into local storage
function updateRemainingQuantity(newQuantity) {
    localStorage.setItem(REMAINING_QUANTITY_KEY, newQuantity.toFixed(2));
    return newQuantity;
}

// Stock level update with low stock alert
function updateStockLevel(categoryName, quantity) {
    const selectedCategory = categories.find(category => category.name === categoryName);
}

// Packaging
export function packageProducts(categoryName, blueberryType, desiredPackCount, customWeight = null) {
    // Calculate the remaining
    let remainingQuantity;

    switch (blueberryType) {
        case 'Fresh':
            remainingQuantity = getRemainingQuantityFresh();
            if(remainingQuantity<200){
                console.log("Stocl Level is too low");
            }
            break;
        case 'Frozen':
            remainingQuantity = getRemainingQuantityFozen();
            if(remainingQuantity<200){
                console.log("Stocl Level is too low");
            }
            break;
        case 'Organic':
            remainingQuantity = getRemainingQuantityOrganic();
            if(remainingQuantity<200){
                console.log("Stocl Level is too low");
            }
            break;
        default:
            alert('Invalid blueberry type!');
            return;
    }

    // get the indormation for the chosen category
    const selectedCategory = categories.find(category => category.name === categoryName);

    if (!selectedCategory) {
        alert('Category not found!');
        return;
    }

    // Calculate the packets weight
    const weightPerPack = categoryName === 'Premium' ? parseFloat(customWeight) : selectedCategory.weight;

    if (isNaN(weightPerPack) || weightPerPack <= 0) {
        alert('Please enter a valid weight for the selected category.');
        return;
    }

    // Calculate the total weight
    const requiredQuantity = parseFloat(desiredPackCount * weightPerPack);

    if (remainingQuantity >= requiredQuantity) {
        // Create new packet
        const newPackage = {
            category: categoryName,
            blueberryType: blueberryType,
            weightPerPack: weightPerPack,
            count: desiredPackCount,
            totalWeight: requiredQuantity,
            date: new Date().toISOString(),
        };

        //save packages to the local storage
        const packagedProducts = getFromLocalStorage(PACKAGES_KEY);
        packagedProducts.push(newPackage);
        saveToLocalStorage(PACKAGES_KEY, packagedProducts);

        // Calculate the the remaining quantitiy
        switch (blueberryType) {
            case 'Fresh':
                updateRemainingQuantityFresh(remainingQuantity - requiredQuantity);
                break;
            case 'Frozen':
                updateRemainingQuantityFrozen(remainingQuantity - requiredQuantity);
                break;
            case 'Organic':
                updateRemainingQuantityOrganic(remainingQuantity - requiredQuantity);
                break;
        }
      

        // Inform the user
        alert(
            `Created ${desiredPackCount} packs of ${blueberryType} ${categoryName} (${weightPerPack} kg per pack). Remaining: ${(remainingQuantity - requiredQuantity).toFixed(2)} kg.`
            
        );

        // Update the packeged products
        updatePackagedProductsOutput();
        return true;
    } else {
        alert('Not enough un-packaged product to meet the desired quantity.');
        return false;
    }
}


// Display the packages
function updatePackagedProductsOutput() {
    const packagedProducts = getFromLocalStorage(PACKAGES_KEY);
    const outputElement = document.getElementById('packagedProductsOutput');

    if (!outputElement) {
        console.error('Element with ID "packagedProductsOutput" not found!');
        return;
    }

    if (packagedProducts.length === 0) {
        outputElement.textContent = 'No packaged products available.';
        return;
    }

    const output = packagedProducts.map((pack, index) =>
        `#${index + 1}: ${pack.count} packs of ${pack.category}, ${pack.blueberryType} (${pack.weightPerPack} kg per pack) - Total Weight: ${pack.totalWeight} kg - Date: ${new Date(pack.date).toLocaleString()}`
    ).join('\n');
    
    outputElement.textContent = output;
}
//Event listener for Remaining Quantitites
export function displayRemainingQuantities() {
    const remainingQuantityElement = document.getElementById('remainingQuantityOutput');
    if (!remainingQuantityElement) return;

    // Gets the remining for each type
    const freshRemaining = getRemainingQuantityFresh();
    const frozenRemaining = getRemainingQuantityFozen();
    const organicRemaining = getRemainingQuantityOrganic();

    // Display the remaining od each category
    remainingQuantityElement.innerHTML = `
        <p>Remaining Fresh Quantity: <span>${freshRemaining.toFixed(2)} kg</span></p>
        <p>Remaining Frozen Quantity: <span>${frozenRemaining.toFixed(2)} kg</span></p>
        <p>Remaining Organic Quantity: <span>${organicRemaining.toFixed(2)} kg</span></p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    displayRemainingQuantities();
});


function getPackagedProductsSummaryFresh(packagedProducts,blueberryType) {
    const summary = {};
    packagedProducts.forEach(product => {
        if(product.blueberryType==='Fresh'){
            const { category, count } = product;
            summary[category] = (summary[category] || 0) + count;
        }
    });
    return summary;
}

// gets the summary
const packagedProductsFresh = getFromLocalStorage(PACKAGES_KEY);
const summaryFresh = getPackagedProductsSummaryFresh(packagedProductsFresh);


// In the  packagedProducts it calculates the numbers of each category
function getPackagedProductsSummary(packagedProducts) {
    const summary = {};
    packagedProducts.forEach(product => {
        const { category, count } = product;
        summary[category] = (summary[category] || 0) + count;
    });
    return summary;
}
// gets the summary
const packagedProducts = getFromLocalStorage(PACKAGES_KEY);
const summary = getPackagedProductsSummary(packagedProducts);
const Products_Summary_Key ='Products_Summary';
// Fills the html
function displayProductsSummaryFromLocalStorage() {
    const summaryData = getFromLocalStorage('ProductsSummary');
    const tableBody = document.getElementById('productsSummaryTable');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
 
    if (!summaryData) {
        console.warn('No Products Summary found in localStorage');
        return;
    }
 
    
    Object.entries(summaryData).forEach(([type, summary]) => {
        Object.entries(summary).forEach(([packageType, totalQuantity]) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${type} - ${packageType}</td><td>${totalQuantity}</td>`;
            tableBody.appendChild(row);
        });
    });
}

function saveProductsSummaryToLocalStorage() {
    const packagedProducts = getFromLocalStorage(PACKAGES_KEY);
    const blueberryTypes = ['Fresh', 'Frozen', 'Organic'];
    const summaryData = {};

    blueberryTypes.forEach((type) => {
        const filteredProducts = packagedProducts.filter(pack => pack.blueberryType === type);
        const summary = getPackagedProductsSummary(filteredProducts);

        summaryData[type] = summary; // Her tür için özet ekleniyor
    });

    // Save the summary to the local storage
    saveToLocalStorage('ProductsSummary', summaryData);
    console.log('Products Summary saved to localStorage:', summaryData);
}

document.addEventListener('DOMContentLoaded', () => {
    saveProductsSummaryToLocalStorage(); 
    displayProductsSummaryFromLocalStorage(); 
});


//Premium purhase
const categoryDropdown = document.getElementById('category');
if (categoryDropdown) {
    categoryDropdown.addEventListener('change', function () {
        const customWeightInput = document.getElementById('customWeightInput');
        if (customWeightInput) {
            if (this.value === 'Premium') {
                customWeightInput.style.display = 'block';
            } else {
                customWeightInput.style.display = 'none';
            }
        }
    });
}

// Starts packaging wehn form submited
const packageForm = document.getElementById('packageForm');
if (packageForm) {
    packageForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const category = document.getElementById('category').value;
        const blueberryType = document.getElementById('blueberryType').value; // Get blueberry type from the dropdown
        const packCount = parseInt(document.getElementById('packCount').value);
        const customWeight = parseFloat(document.getElementById('customWeight').value);
    
        if (isNaN(packCount) || packCount <= 0) {
            alert('Please enter a valid number of packs');
            return;
        }
    
        let success = false;
        // Custom weight for premiums
        if (category === 'Premium') {
            if (isNaN(customWeight) || customWeight <= 0) {
                alert('Please enter a valid custom weight');
                return;
            }
            success = packageProducts(category,blueberryType, packCount, customWeight);
        } else {
            success = packageProducts(category,blueberryType, packCount);
        }
    
        if (success) {
            // Refresh UI elements
            saveProductsSummaryToLocalStorage();
            displayProductsSummaryFromLocalStorage();
            displayRemainingQuantities();
        }
    });
}

// Update the remaining when page loaded
document.addEventListener('DOMContentLoaded', () => {
    updatePackagedProductsOutput();
});

const priceUpdateForm = document.getElementById('priceUpdateForm');
if (priceUpdateForm) {
    priceUpdateForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        const category = document.getElementById('priceUpdateCategory').value;
        const newPrice = parseFloat(document.getElementById('newPrice').value);
    
        if (isNaN(newPrice) || newPrice <= 0) {
            alert('Please enter a valid price');
            return;
        }
    
        updateCategoryPrice(category, newPrice);
        displayPricingStructure();
    });
}
function saveAllUnpackagedQuantities() {
    
    const quantities = {
        Frozen: getRemainingQuantityFozen(),
        Fresh: getRemainingQuantityFresh(),
        Organic: getRemainingQuantityOrganic()
    };

    
    localStorage.setItem('UnpackagedQuantities', JSON.stringify(quantities));

    console.log('All unpackaged quantities saved to localStorage:', quantities);
}
saveAllUnpackagedQuantities();

