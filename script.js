// Informations de l'entreprise
const companyInfo = {
    name: "NOVA STARTUP TECHNOLOGIE CI",
    address: "Korhogo, Côte d'Ivoire",
    phone: "+225 05 54 10 18 73",
    email: "nstci@gmail.com",
    activities: "Création de sites web, développement de logiciels, Installation de systèmes vidéosurveillance, Formation"
};

// Identifiants de connexion (en production, cela devrait être géré côté serveur)
const validCredentials = {
    username: "admin",
    password: "Nova2025"
};

// Éléments DOM
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const userDisplay = document.getElementById('user-display');
const notification = document.getElementById('notification');

const documentType = document.getElementById('document-type');
const clientSelect = document.getElementById('client-select');
const paymentSection = document.getElementById('payment-section');
const clientName = document.getElementById('client-name');
const clientAddress = document.getElementById('client-address');
const clientPhone = document.getElementById('client-phone');
const clientEmail = document.getElementById('client-email');
const productReference = document.getElementById('product-reference');
const productDescription = document.getElementById('product-description');
const productQuantity = document.getElementById('product-quantity');
const productPrice = document.getElementById('product-price');
const productTva = document.getElementById('product-tva');
const addProductBtn = document.getElementById('add-product');
const productsList = document.getElementById('products-list');
const validity = document.getElementById('validity');
const deliveryTime = document.getElementById('delivery-time');
const paymentTerms = document.getElementById('payment-terms');
const warranty = document.getElementById('warranty');
const qrData = document.getElementById('qr-data');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const printBtn = document.getElementById('print-btn');
const pdfBtn = document.getElementById('pdf-btn');
const newDocBtn = document.getElementById('new-doc-btn');
const invoicePreview = document.getElementById('invoice-preview');
const paymentRef = document.getElementById('payment-ref');

// Tableau de bord
const monthDocs = document.getElementById('month-docs');
const monthRevenue = document.getElementById('month-revenue');
const activeClients = document.getElementById('active-clients');
const conversionRate = document.getElementById('conversion-rate');
const recentDocuments = document.getElementById('recent-documents');

// Gestion des clients
const newClientName = document.getElementById('new-client-name');
const newClientContact = document.getElementById('new-client-contact');
const newClientAddress = document.getElementById('new-client-address');
const newClientPhone = document.getElementById('new-client-phone');
const newClientEmail = document.getElementById('new-client-email');
const addClientBtn = document.getElementById('add-client');
const clientList = document.getElementById('client-list');

// Modèles
const templateName = document.getElementById('template-name');
const saveTemplateBtn = document.getElementById('save-template');
const templateList = document.getElementById('template-list');

// Paramètres
const settingsCompanyName = document.getElementById('settings-company-name');
const settingsCompanyAddress = document.getElementById('settings-company-address');
const settingsCompanyPhone = document.getElementById('settings-company-phone');
const settingsCompanyEmail = document.getElementById('settings-company-email');
const settingsCompanyActivities = document.getElementById('settings-company-activities');
const settingsCurrency = document.getElementById('settings-currency');
const settingsTva = document.getElementById('settings-tva');
const settingsValidity = document.getElementById('settings-validity');
const exportDataBtn = document.getElementById('export-data');
const importDataBtn = document.getElementById('import-data');
const importFile = document.getElementById('import-file');
const changePassword = document.getElementById('change-password');
const savePasswordBtn = document.getElementById('save-password');

// Données
let products = [];
let clients = [];
let templates = [];
let documents = [];
let isLoggedIn = false;
let settings = {
    currency: 'XOF',
    defaultTva: 18,
    defaultValidity: 30
};

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Fonction de connexion
function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (username === validCredentials.username && password === validCredentials.password) {
        isLoggedIn = true;
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        userDisplay.textContent = username;
        
        // Charger les données sauvegardées
        loadFromLocalStorage();
        updateDashboard();
        
        showNotification('Connexion réussie!', 'success');
    } else {
        loginError.style.display = 'block';
        passwordInput.value = '';
        showNotification('Identifiants incorrects', 'error');
    }
}

// Fonction de déconnexion
function logout() {
    isLoggedIn = false;
    appContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    usernameInput.value = '';
    passwordInput.value = '';
    loginError.style.display = 'none';
    showNotification('Déconnexion réussie', 'info');
}

// Afficher/masquer la section paiement selon le type de document
function togglePaymentSection() {
    if (documentType.value === 'paiement' || documentType.value === 'acompte') {
        paymentSection.style.display = 'block';
    } else {
        paymentSection.style.display = 'none';
    }
    updateInvoicePreview();
}

// Charger les données depuis le localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('novaInvoiceData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Remplir les champs avec les données sauvegardées
        documentType.value = data.documentType || 'devis';
        clientName.value = data.clientName || '';
        clientAddress.value = data.clientAddress || '';
        clientPhone.value = data.clientPhone || '';
        clientEmail.value = data.clientEmail || '';
        validity.value = data.validity || settings.defaultValidity;
        deliveryTime.value = data.deliveryTime || '';
        paymentTerms.value = data.paymentTerms || '';
        warranty.value = data.warranty || '';
        qrData.value = data.qrData || 'NOVA STARTUP - 0554101873 - www.nstcisecure.netlify.app';
        
        // Charger les produits
        products = data.products || [];
        updateProductsList();
        
        // Charger les clients
        clients = data.clients || [];
        updateClientSelect();
        updateClientList();
        
        // Charger les modèles
        templates = data.templates || [];
        updateTemplateList();
        
        // Charger les documents
        documents = data.documents || [];
        
        // Charger les paramètres
        if (data.settings) {
            settings = data.settings;
            updateSettingsForm();
        }
        
        // Mettre à jour l'affichage
        togglePaymentSection();
    } else {
        // Valeurs par défaut
        togglePaymentSection();
    }
}

// Sauvegarder les données dans le localStorage
function saveToLocalStorage() {
    const data = {
        documentType: documentType.value,
        clientName: clientName.value,
        clientAddress: clientAddress.value,
        clientPhone: clientPhone.value,
        clientEmail: clientEmail.value,
        validity: validity.value,
        deliveryTime: deliveryTime.value,
        paymentTerms: paymentTerms.value,
        warranty: warranty.value,
        qrData: qrData.value,
        products: products,
        clients: clients,
        templates: templates,
        documents: documents,
        settings: settings
    };
    
    localStorage.setItem('novaInvoiceData', JSON.stringify(data));
    showNotification('Données sauvegardées avec succès!', 'success');
}

// Mettre à jour le formulaire des paramètres
function updateSettingsForm() {
    settingsCompanyName.value = companyInfo.name;
    settingsCompanyAddress.value = companyInfo.address;
    settingsCompanyPhone.value = companyInfo.phone;
    settingsCompanyEmail.value = companyInfo.email;
    settingsCompanyActivities.value = companyInfo.activities;
    
    settingsCurrency.value = settings.currency;
    settingsTva.value = settings.defaultTva;
    settingsValidity.value = settings.defaultValidity;
}

// Mettre à jour le tableau de bord
function updateDashboard() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Documents du mois
    const monthDocuments = documents.filter(doc => {
        const docDate = new Date(doc.date);
        return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
    });
    
    monthDocs.textContent = monthDocuments.length;
    
    // Chiffre d'affaires du mois
    const monthRevenueValue = monthDocuments.reduce((total, doc) => {
        return total + doc.total;
    }, 0);
    
    monthRevenue.textContent = formatCurrency(monthRevenueValue);
    
    // Clients actifs (ayant au moins un document dans les 3 derniers mois)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const activeClientsCount = clients.filter(client => {
        return documents.some(doc => 
            doc.clientName === client.name && new Date(doc.date) >= threeMonthsAgo
        );
    }).length;
    
    activeClients.textContent = activeClientsCount;
    
    // Taux de conversion (devis -> factures)
    const quotes = documents.filter(doc => doc.type === 'devis');
    const invoices = documents.filter(doc => doc.type === 'facture');
    
    const conversionRateValue = quotes.length > 0 ? 
        Math.round((invoices.length / quotes.length) * 100) : 0;
    
    conversionRate.textContent = `${conversionRateValue}%`;
    
    // Documents récents (5 derniers)
    const recentDocs = documents.slice(-5).reverse();
    recentDocuments.innerHTML = '';
    
    if (recentDocs.length === 0) {
        recentDocuments.innerHTML = '<p class="text-muted text-center">Aucun document récent</p>';
    } else {
        recentDocs.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'document-item';
            docElement.innerHTML = `
                <div>
                    <strong>${doc.type.toUpperCase()} - ${doc.number}</strong><br>
                    <small>${doc.clientName} - ${new Date(doc.date).toLocaleDateString('fr-FR')}</small>
                </div>
                <div>${formatCurrency(doc.total)}</div>
            `;
            recentDocuments.appendChild(docElement);
        });
    }
}

// Mettre à jour la liste des clients dans le select
function updateClientSelect() {
    clientSelect.innerHTML = '<option value="">-- Nouveau client --</option>';
    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });
}

// Mettre à jour la liste des clients
function updateClientList() {
    clientList.innerHTML = '';
    
    if (clients.length === 0) {
        clientList.innerHTML = '<p class="text-muted text-center">Aucun client enregistré</p>';
    } else {
        clients.forEach(client => {
            const clientElement = document.createElement('div');
            clientElement.className = 'client-item';
            clientElement.innerHTML = `
                <div>
                    <strong>${client.name}</strong><br>
                    <small>${client.contact} - ${client.phone}</small>
                </div>
                <div>
                    <button class="btn btn-primary btn-sm use-client" data-id="${client.id}">Utiliser</button>
                    <button class="btn btn-danger btn-sm delete-client" data-id="${client.id}">Supprimer</button>
                </div>
            `;
            clientList.appendChild(clientElement);
        });
        
        // Ajouter les écouteurs d'événements
        document.querySelectorAll('.use-client').forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = this.getAttribute('data-id');
                const client = clients.find(c => c.id == clientId);
                
                if (client) {
                    clientName.value = client.name;
                    clientAddress.value = client.address;
                    clientPhone.value = client.phone;
                    clientEmail.value = client.email;
                    
                    // Activer l'onglet de création de document
                    const invoiceTab = new bootstrap.Tab(document.querySelector('#invoice-tab'));
                    invoiceTab.show();
                    
                    updateInvoicePreview();
                }
            });
        });
        
        document.querySelectorAll('.delete-client').forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = this.getAttribute('data-id');
                
                if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
                    clients = clients.filter(c => c.id != clientId);
                    updateClientSelect();
                    updateClientList();
                    saveToLocalStorage();
                }
            });
        });
    }
}

// Mettre à jour la liste des modèles
function updateTemplateList() {
    templateList.innerHTML = '';
    
    if (templates.length === 0) {
        templateList.innerHTML = '<p class="text-muted text-center">Aucun modèle enregistré</p>';
    } else {
        templates.forEach(template => {
            const templateElement = document.createElement('div');
            templateElement.className = 'template-item';
            templateElement.innerHTML = `
                <div>
                    <strong>${template.name}</strong><br>
                    <small>${template.products.length} produit(s) - Créé le ${new Date(template.date).toLocaleDateString('fr-FR')}</small>
                </div>
            `;
            
            templateElement.addEventListener('click', function() {
                // Charger le modèle
                products = [...template.products];
                updateProductsList();
                updateInvoicePreview();
                
                // Activer l'onglet de création de document
                const invoiceTab = new bootstrap.Tab(document.querySelector('#invoice-tab'));
                invoiceTab.show();
            });
            
            templateList.appendChild(templateElement);
        });
    }
}

// Ajouter un produit
function addProduct() {
    const reference = productReference.value.trim();
    const description = productDescription.value.trim();
    const quantity = parseInt(productQuantity.value);
    const price = parseFloat(productPrice.value);
    const tva = parseFloat(productTva.value);
    
    if (!reference || !description || quantity <= 0 || price < 0) {
        alert('Veuillez remplir tous les champs du produit correctement');
        return;
    }
    
    products.push({
        id: Date.now(),
        reference,
        description,
        quantity,
        price,
        tva
    });
    
    // Réinitialiser les champs
    productReference.value = '';
    productDescription.value = '';
    productQuantity.value = '1';
    productPrice.value = '0';
    productTva.value = settings.defaultTva.toString();
    
    updateProductsList();
    updateInvoicePreview();
}

// Supprimer un produit
function removeProduct(id) {
    products = products.filter(product => product.id !== id);
    updateProductsList();
    updateInvoicePreview();
}

// Mettre à jour la liste des produits
function updateProductsList() {
    if (products.length === 0) {
        productsList.innerHTML = '<div class="empty-products">Aucun produit ajouté</div>';
        return;
    }
    
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <div><strong>${product.reference}</strong>: ${product.description}</div>
            <div>Qté: ${product.quantity}</div>
            <div>Prix: ${formatCurrency(product.price)}</div>
            <div>Total: ${formatCurrency(product.quantity * product.price)}</div>
            <button class="btn btn-danger btn-sm" data-id="${product.id}">Supprimer</button>
        `;
        
        // Ajouter l'écouteur d'événement pour le bouton supprimer
        const deleteBtn = productElement.querySelector('button');
        deleteBtn.addEventListener('click', function() {
            removeProduct(product.id);
        });
        
        productsList.appendChild(productElement);
    });
}

// Formater les montants en CFA
function formatCurrency(amount) {
    if (settings.currency === 'XOF') {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    } else if (settings.currency === 'EUR') {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    } else {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
}

// Calculer les totaux
function calculateTotals() {
    let subtotal = 0;
    let totalTVA = 0;
    
    products.forEach(product => {
        const productTotal = product.quantity * product.price;
        subtotal += productTotal;
        totalTVA += productTotal * (product.tva / 100);
    });
    
    const total = subtotal + totalTVA;
    
    return { subtotal, totalTVA, total };
}

// Générer le QR code
function generateQRCode() {
    const qrContainer = document.getElementById('qr-code');
    if (qrContainer) {
        qrContainer.innerHTML = '';
        const data = qrData.value || 'NOVA STARTUP - 0554101873';
        if (data) {
            new QRCode(qrContainer, {
                text: data,
                width: 100,
                height: 100,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            qrContainer.innerHTML = '<div>Information manquante</div>';
        }
    }
}

// Mettre à jour l'affichage de la facture
function updateInvoicePreview() {
    const documentTitles = {
        'devis': 'DEVIS',
        'facture': 'FACTURE',
        'paiement': 'REÇU DE PAIEMENT',
        'acompte': 'FACTURE D\'ACOMPTE'
    };
    
    const today = new Date();
    const validityDate = new Date();
    validityDate.setDate(today.getDate() + parseInt(validity.value));
    
    const { subtotal, totalTVA, total } = calculateTotals();
    
    // Obtenir le mode de paiement sélectionné
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || '';
    
    // Générer les lignes de produits
    let productsHTML = '';
    products.forEach(product => {
        const productTotal = product.quantity * product.price;
        const productTVA = productTotal * (product.tva / 100);
        
        productsHTML += `
            <tr>
                <td class="description">
                    <strong>${product.reference}</strong><br>
                    ${product.description}
                </td>
                <td class="quantity">${product.quantity}</td>
                <td class="unit-price">${formatCurrency(product.price)}</td>
                <td class="total">${formatCurrency(productTotal)}</td>
            </tr>
            ${product.tva > 0 ? `
            <tr>
                <td colspan="3" style="text-align: right; padding-right: 15px;">TVA (${product.tva}%)</td>
                <td class="total">${formatCurrency(productTVA)}</td>
            </tr>
            ` : ''}
        `;
    });
    
    // HTML pour la section paiement si nécessaire
    let paymentHTML = '';
    if (documentType.value === 'paiement' || documentType.value === 'acompte') {
        paymentHTML = `
            <div class="invoice-section">
                <div class="invoice-section-title">INFORMATIONS DE PAIEMENT</div>
                <p><strong>Référence:</strong> ${paymentRef.value || 'Non spécifiée'}</p>
                <p><strong>Mode de paiement:</strong> ${paymentMethod}</p>
                <p><strong>Montant payé:</strong> ${formatCurrency(total)}</p>
                <p><strong>Date du paiement:</strong> ${today.toLocaleDateString('fr-FR')}</p>
            </div>
        `;
    }
    
    invoicePreview.innerHTML = `
        <div class="invoice-header">
            <div class="company-info">
                <h1>${companyInfo.name}</h1>
                <p>${companyInfo.address}</p>
                <p>Tél: ${companyInfo.phone}</p>
                <p>Email: ${companyInfo.email}</p>
                <p>${companyInfo.activities}</p>
            </div>
            
            <div class="document-info">
                <h2>${documentTitles[documentType.value]}</h2>
                <p>N°: <span id="invoice-number">${documentType.value.toUpperCase()}-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}</span></p>
                <p>Date: <span id="invoice-date">${today.toLocaleDateString('fr-FR')}</span></p>
            </div>
        </div>
        
        <div class="invoice-section">
            <div class="invoice-section-title">INFORMATIONS CLIENT</div>
            <div class="client-info">
                <p><strong>Nom/Raison sociale:</strong> ${clientName.value}</p>
                <p><strong>Adresse:</strong> ${clientAddress.value}</p>
                <p><strong>Téléphone:</strong> ${clientPhone.value}</p>
                <p><strong>Email:</strong> ${clientEmail.value}</p>
            </div>
        </div>
        
        ${paymentHTML}
        
        <div class="invoice-section">
            <div class="invoice-section-title">DESCRIPTION DES ARTICLES</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th class="description">Désignation</th>
                        <th class="quantity">Quantité</th>
                        <th class="unit-price">Prix Unitaire</th>
                        <th class="total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHTML || '<tr><td colspan="4" style="text-align: center;">Aucun produit ajouté</td></tr>'}
                </tbody>
            </table>
        </div>
        
        <div class="invoice-section">
            <div class="totals">
                <div class="total-row">
                    <span>Sous-total:</span>
                    <span id="subtotal">${formatCurrency(subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>Total TVA:</span>
                    <span id="vat-amount">${formatCurrency(totalTVA)}</span>
                </div>
                <div class="total-row final">
                    <span>TOTAL TTC:</span>
                    <span id="total-ttc">${formatCurrency(total)}</span>
                </div>
            </div>
        </div>
        
        <div class="invoice-section conditions">
            <div class="invoice-section-title">CONDITIONS</div>
            <p><strong>Validité de l'offre:</strong> ${validity.value} jours (jusqu'au ${validityDate.toLocaleDateString('fr-FR')})</p>
            <p><strong>Délai de livraison/installation:</strong> ${deliveryTime.value}</p>
            <p><strong>Conditions de paiement:</strong> ${paymentTerms.value}</p>
            <p><strong>Garantie:</strong> ${warranty.value}</p>
        </div>
        
        <div class="signature-area">
            <div>
                <p>Fait à Korhogo, le ${today.toLocaleDateString('fr-FR')}</p>
                <p style="margin-top: 50px;">Le Responsable</p>
            </div>
            <div>
                <div id="qr-code" class="qr-code">
                    <!-- QR Code sera généré ici -->
                </div>
                <p style="text-align: center; margin-top: 5px; font-size: 12px;">Signature numérique</p>
            </div>
        </div>
    `;
    
    // Générer le QR code après avoir mis à jour l'affichage
    setTimeout(generateQRCode, 100);
}

// Sauvegarder le document
function saveDocument() {
    if (products.length === 0) {
        alert('Veuillez ajouter au moins un produit avant de sauvegarder');
        return;
    }
    
    const today = new Date();
    const documentNumber = `${documentType.value.toUpperCase()}-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(documents.length + 1).padStart(3, '0')}`;
    
    const { total } = calculateTotals();
    
    const document = {
        id: Date.now(),
        type: documentType.value,
        number: documentNumber,
        date: today.toISOString(),
        clientName: clientName.value,
        clientAddress: clientAddress.value,
        clientPhone: clientPhone.value,
        clientEmail: clientEmail.value,
        products: [...products],
        subtotal: calculateTotals().subtotal,
        tva: calculateTotals().totalTVA,
        total: total,
        validity: validity.value,
        deliveryTime: deliveryTime.value,
        paymentTerms: paymentTerms.value,
        warranty: warranty.value
    };
    
    documents.push(document);
    saveToLocalStorage();
    updateDashboard();
    
    // Si le client n'existe pas encore, l'ajouter
    if (clientName.value && !clients.some(c => c.name === clientName.value)) {
        addClientFromForm();
    }
}

// Ajouter un client à partir du formulaire
function addClientFromForm() {
    if (!clientName.value.trim()) return;
    
    const client = {
        id: Date.now(),
        name: clientName.value,
        contact: clientName.value, // Par défaut, même que le nom
        address: clientAddress.value,
        phone: clientPhone.value,
        email: clientEmail.value
    };
    
    clients.push(client);
    updateClientSelect();
    updateClientList();
    saveToLocalStorage();
}

// Ajouter un client via le formulaire dédié
function addClient() {
    if (!newClientName.value.trim()) {
        alert('Veuillez saisir au moins un nom pour le client');
        return;
    }
    
    const client = {
        id: Date.now(),
        name: newClientName.value,
        contact: newClientContact.value || newClientName.value,
        address: newClientAddress.value,
        phone: newClientPhone.value,
        email: newClientEmail.value
    };
    
    clients.push(client);
    updateClientSelect();
    updateClientList();
    saveToLocalStorage();
    
    // Réinitialiser le formulaire
    newClientName.value = '';
    newClientContact.value = '';
    newClientAddress.value = '';
    newClientPhone.value = '';
    newClientEmail.value = '';
    
    showNotification('Client ajouté avec succès!', 'success');
}

// Sauvegarder un modèle
function saveTemplate() {
    if (products.length === 0) {
        alert('Veuillez ajouter au moins un produit avant de sauvegarder comme modèle');
        return;
    }
    
    if (!templateName.value.trim()) {
        alert('Veuillez donner un nom à votre modèle');
        return;
    }
    
    const template = {
        id: Date.now(),
        name: templateName.value,
        date: new Date().toISOString(),
        products: [...products]
    };
    
    templates.push(template);
    updateTemplateList();
    saveToLocalStorage();
    
    templateName.value = '';
    showNotification('Modèle sauvegardé avec succès!', 'success');
}

// Réinitialiser le formulaire
function resetForm() {
    if (confirm("Voulez-vous vraiment réinitialiser toutes les données ?")) {
        // Réinitialiser les champs
        documentType.value = 'devis';
        clientName.value = '';
        clientAddress.value = '';
        clientPhone.value = '';
        clientEmail.value = '';
        validity.value = settings.defaultValidity;
        deliveryTime.value = 'Sous 15 jours ouvrables';
        paymentTerms.value = '70% à la commande, solde à la livraison';
        warranty.value = '3 mois pièces et main d\'œuvre';
        qrData.value = 'NOVA STARTUP - 0554101873 - www.nstcisecure.netlify.app';
        paymentRef.value = '';
        
        // Réinitialiser les produits
        products = [];
        updateProductsList();
        updateInvoicePreview();
        togglePaymentSection();
    }
}

// Nouveau document
function newDocument() {
    if (confirm("Voulez-vous créer un nouveau document ? Les données non sauvegardées seront perdues.")) {
        resetForm();
    }
}

// Imprimer la facture
function printInvoice() {
    window.print();
}

// Générer un PDF (version simplifiée)
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Capturer directement la prévisualisation
    html2canvas(document.getElementById('invoice-preview'), {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Dimensions
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Ajouter l'image au PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Sauvegarder
        const today = new Date();
        const fileName = `${documentType.value}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}.pdf`;
        pdf.save(fileName);
        
        showNotification('PDF généré avec succès!', 'success');
    }).catch(error => {
        console.error('Erreur lors de la génération du PDF:', error);
        showNotification('Erreur lors de la génération du PDF', 'error');
    });
}

// Exporter les données
function exportData() {
    const data = {
        clients: clients,
        templates: templates,
        documents: documents,
        settings: settings,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nova-startup-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    showNotification('Données exportées avec succès!', 'success');
}

// Importer des données
function importData() {
    importFile.click();
}

// Changer le mot de passe
function changePasswordFunc() {
    const newPassword = changePassword.value.trim();
    
    if (newPassword.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    validCredentials.password = newPassword;
    changePassword.value = '';
    showNotification('Mot de passe mis à jour avec succès!', 'success');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les écouteurs d'événements
    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    
    documentType.addEventListener('change', togglePaymentSection);
    addProductBtn.addEventListener('click', addProduct);
    saveBtn.addEventListener('click', saveDocument);
    resetBtn.addEventListener('click', resetForm);
    printBtn.addEventListener('click', printInvoice);
    pdfBtn.addEventListener('click', generatePDF);
    newDocBtn.addEventListener('click', newDocument);
    
    // Gestion des clients
    addClientBtn.addEventListener('click', addClient);
    
    // Modèles
    saveTemplateBtn.addEventListener('click', saveTemplate);
    
    // Paramètres
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', importData);
    importFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.clients) clients = data.clients;
                    if (data.templates) templates = data.templates;
                    if (data.documents) documents = data.documents;
                    if (data.settings) settings = data.settings;
                    
                    updateClientSelect();
                    updateClientList();
                    updateTemplateList();
                    updateSettingsForm();
                    saveToLocalStorage();
                    updateDashboard();
                    
                    showNotification('Données importées avec succès!', 'success');
                } catch (err) {
                    alert('Erreur lors de l\'importation des données: ' + err.message);
                }
            };
            reader.readAsText(file);
        }
    });
    
    savePasswordBtn.addEventListener('click', changePasswordFunc);
    
    // Permettre la connexion avec la touche Entrée
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // Mettre à jour l'affichage quand les champs changent
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateInvoicePreview);
    });
    
    // Mettre à jour l'affichage initial
    updateInvoicePreview();
});