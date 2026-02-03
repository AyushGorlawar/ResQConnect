// ==========================================
// ResQConnect - Emergency Rescue System
// JavaScript Application Logic
// ==========================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    initHamburgerMenu();
});

function initApp() {
    const currentPage = getCurrentPage();
    
    if (currentPage === 'form') {
        initRescueForm();
    } else if (currentPage === 'dashboard') {
        initDashboard();
    }
    
    // Smooth scroll for anchor links
    initSmoothScroll();
}

// ==========================================
// Hamburger Menu
// ==========================================

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    
    if (hamburger && navLinks) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================
// Utility Functions
// ==========================================

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('rescue-form')) return 'form';
    if (path.includes('admin-dashboard')) return 'dashboard';
    return 'home';
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function generateRequestId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `RQ${timestamp}${random}`;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ==========================================
// Local Storage Management
// ==========================================

function saveRequest(requestData) {
    let requests = getRequests();
    requests.push(requestData);
    localStorage.setItem('resqRequests', JSON.stringify(requests));
}

function getRequests() {
    const data = localStorage.getItem('resqRequests');
    return data ? JSON.parse(data) : [];
}

function updateRequestStatus(requestId, newStatus) {
    let requests = getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        requests[index].status = newStatus;
        requests[index].updatedAt = Date.now();
        localStorage.setItem('resqRequests', JSON.stringify(requests));
        return true;
    }
    return false;
}

function clearAllRequests() {
    if (confirm('Are you sure you want to clear all rescue requests? This action cannot be undone.')) {
        localStorage.removeItem('resqRequests');
        location.reload();
    }
}

// ==========================================
// Rescue Form Functionality
// ==========================================

function initRescueForm() {
    const form = document.getElementById('rescueForm');
    const getLocationBtn = document.getElementById('getLocationBtn');
    
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function getCurrentLocation() {
    const btn = document.getElementById('getLocationBtn');
    const statusDiv = document.getElementById('locationStatus');
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    
    if (!navigator.geolocation) {
        showLocationStatus('Geolocation is not supported by your browser', 'error');
        return;
    }
    
    // Update button state
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M9 2a7 7 0 017 7" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        Detecting Location...
    `;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            latInput.value = lat;
            lngInput.value = lng;
            
            showLocationStatus(`✓ Location detected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, 'success');
            
            // Reset button
            btn.disabled = false;
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 1a1 1 0 011 1v.5a6.5 6.5 0 016 6.5h.5a1 1 0 110 2H16a6.5 6.5 0 01-6 6.5v.5a1 1 0 11-2 0v-.5A6.5 6.5 0 012 11h-.5a1 1 0 110-2H2a6.5 6.5 0 016-6.5V2a1 1 0 011-1zm0 4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM9 8a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/>
                </svg>
                Location Detected ✓
            `;
            btn.classList.add('btn-success');
        },
        (error) => {
            let errorMsg = 'Unable to retrieve location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
                default:
                    errorMsg += 'Unknown error occurred.';
            }
            
            showLocationStatus(errorMsg, 'error');
            
            // Reset button
            btn.disabled = false;
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 1a1 1 0 011 1v.5a6.5 6.5 0 016 6.5h.5a1 1 0 110 2H16a6.5 6.5 0 01-6 6.5v.5a1 1 0 11-2 0v-.5A6.5 6.5 0 012 11h-.5a1 1 0 110-2H2a6.5 6.5 0 016-6.5V2a1 1 0 011-1zm0 4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM9 8a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/>
                </svg>
                Try Again
            `;
        }
    );
}

function showLocationStatus(message, type) {
    const statusDiv = document.getElementById('locationStatus');
    statusDiv.textContent = message;
    statusDiv.className = `location-status ${type}`;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get urgency value from radio buttons
    const urgencyRadio = form.querySelector('input[name="urgency"]:checked');
    
    const requestData = {
        id: generateRequestId(),
        timestamp: Date.now(),
        status: 'pending',
        location: {
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            address: formData.get('address'),
            city: formData.get('city'),
            pincode: formData.get('pincode')
        },
        animal: {
            type: formData.get('animalType'),
            condition: formData.get('condition'),
            urgency: urgencyRadio ? urgencyRadio.value : 'medium',
            description: formData.get('description')
        },
        reporter: {
            name: formData.get('reporterName'),
            phone: formData.get('phone'),
            email: formData.get('email')
        },
        updatedAt: Date.now()
    };
    
    // Save to local storage
    saveRequest(requestData);
    
    // Show success message
    showSuccessMessage(requestData.id);
}

function showSuccessMessage(requestId) {
    const successModal = document.getElementById('successMessage');
    const requestIdSpan = document.getElementById('requestId');
    
    if (successModal && requestIdSpan) {
        requestIdSpan.textContent = requestId;
        successModal.style.display = 'flex';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==========================================
// Dashboard Functionality
// ==========================================

function initDashboard() {
    loadDashboardStats();
    loadRequests();
    
    // Event listeners
    document.getElementById('statusFilter')?.addEventListener('change', loadRequests);
    document.getElementById('urgencyFilter')?.addEventListener('change', loadRequests);
    document.getElementById('sortFilter')?.addEventListener('change', loadRequests);
    document.getElementById('refreshBtn')?.addEventListener('click', refreshDashboard);
    document.getElementById('clearDataBtn')?.addEventListener('click', clearAllRequests);
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    
    // Close modal on overlay click
    document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
}

function loadDashboardStats() {
    const requests = getRequests();
    
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        inProgress: requests.filter(r => r.status === 'in-progress').length,
        rescued: requests.filter(r => r.status === 'rescued').length
    };
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('pendingRequests').textContent = stats.pending;
    document.getElementById('inProgressRequests').textContent = stats.inProgress;
    document.getElementById('rescuedRequests').textContent = stats.rescued;
}

function loadRequests() {
    let requests = getRequests();
    
    // Apply filters
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const urgencyFilter = document.getElementById('urgencyFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'newest';
    
    // Filter by status
    if (statusFilter !== 'all') {
        requests = requests.filter(r => r.status === statusFilter);
    }
    
    // Filter by urgency
    if (urgencyFilter !== 'all') {
        requests = requests.filter(r => r.animal.urgency === urgencyFilter);
    }
    
    // Sort requests
    requests.sort((a, b) => {
        if (sortFilter === 'newest') {
            return b.timestamp - a.timestamp;
        } else if (sortFilter === 'oldest') {
            return a.timestamp - b.timestamp;
        } else if (sortFilter === 'urgency') {
            const urgencyOrder = { critical: 0, high: 1, medium: 2 };
            return urgencyOrder[a.animal.urgency] - urgencyOrder[b.animal.urgency];
        }
        return 0;
    });
    
    renderRequests(requests);
}

function renderRequests(requests) {
    const container = document.getElementById('requestsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) return;
    
    if (requests.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = requests.map(request => createRequestCard(request)).join('');
    
    // Add click handlers
    container.querySelectorAll('.request-card').forEach(card => {
        card.addEventListener('click', function() {
            const requestId = this.dataset.requestId;
            showRequestDetails(requestId);
        });
    });
    
    // Add status change handlers
    container.querySelectorAll('.btn-status-change').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const requestId = this.dataset.requestId;
            const newStatus = this.dataset.newStatus;
            changeRequestStatus(requestId, newStatus);
        });
    });
}

function createRequestCard(request) {
    const statusClass = `badge-${request.status}`;
    const urgencyClass = `urgency-${request.animal.urgency}`;
    const urgencyBadgeClass = `badge-${request.animal.urgency}`;
    
    return `
        <div class="request-card ${urgencyClass}" data-request-id="${request.id}">
            <div class="request-header">
                <div class="request-id">${request.id}</div>
                <div class="request-badges">
                    <span class="badge ${statusClass}">${request.status.replace('-', ' ')}</span>
                    <span class="badge ${urgencyBadgeClass}">${request.animal.urgency}</span>
                </div>
            </div>
            
            <div class="request-info">
                <div class="request-animal">${request.animal.type} - ${request.animal.condition}</div>
                <div class="request-condition">${request.animal.description || 'No additional details provided'}</div>
            </div>
            
            <div class="request-location">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" clip-rule="evenodd"/>
                </svg>
                <span>${request.location.address}, ${request.location.city} - ${request.location.pincode}</span>
            </div>
            
            <div class="request-meta">
                <div class="request-reporter">
                    <strong>${request.reporter.name}</strong> • ${request.reporter.phone}
                </div>
                <div class="request-time">${formatTimestamp(request.timestamp)}</div>
            </div>
            
            ${request.status !== 'rescued' ? `
                <div class="request-actions">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm btn-action btn-status-change" 
                                data-request-id="${request.id}" 
                                data-new-status="in-progress">
                            Start Rescue
                        </button>
                    ` : ''}
                    ${request.status === 'in-progress' ? `
                        <button class="btn btn-primary btn-sm btn-action btn-status-change" 
                                data-request-id="${request.id}" 
                                data-new-status="rescued">
                            Mark as Rescued
                        </button>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

function showRequestDetails(requestId) {
    const requests = getRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request) return;
    
    const modal = document.getElementById('requestModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const statusBadge = `<span class="badge badge-${request.status}">${request.status.replace('-', ' ')}</span>`;
    const urgencyBadge = `<span class="badge badge-${request.animal.urgency}">${request.animal.urgency}</span>`;
    
    modalBody.innerHTML = `
        <div class="modal-section">
            <h3 class="modal-section-title">Request Information</h3>
            <div class="modal-detail">
                <span class="modal-detail-label">Request ID:</span>
                <span class="modal-detail-value">${request.id}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Status:</span>
                <span class="modal-detail-value">${statusBadge}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Urgency:</span>
                <span class="modal-detail-value">${urgencyBadge}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Reported:</span>
                <span class="modal-detail-value">${new Date(request.timestamp).toLocaleString('en-IN')}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Animal Details</h3>
            <div class="modal-detail">
                <span class="modal-detail-label">Type:</span>
                <span class="modal-detail-value">${request.animal.type}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Condition:</span>
                <span class="modal-detail-value">${request.animal.condition}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Description:</span>
                <span class="modal-detail-value">${request.animal.description || 'None provided'}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Location</h3>
            <div class="modal-detail">
                <span class="modal-detail-label">Address:</span>
                <span class="modal-detail-value">${request.location.address}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">City:</span>
                <span class="modal-detail-value">${request.location.city}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Pincode:</span>
                <span class="modal-detail-value">${request.location.pincode}</span>
            </div>
            ${request.location.latitude && request.location.longitude ? `
                <div class="modal-detail">
                    <span class="modal-detail-label">Coordinates:</span>
                    <span class="modal-detail-value">${request.location.latitude}, ${request.location.longitude}</span>
                </div>
            ` : ''}
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Reporter Information</h3>
            <div class="modal-detail">
                <span class="modal-detail-label">Name:</span>
                <span class="modal-detail-value">${request.reporter.name}</span>
            </div>
            <div class="modal-detail">
                <span class="modal-detail-label">Phone:</span>
                <span class="modal-detail-value"><a href="tel:${request.reporter.phone}">${request.reporter.phone}</a></span>
            </div>
            ${request.reporter.email ? `
                <div class="modal-detail">
                    <span class="modal-detail-label">Email:</span>
                    <span class="modal-detail-value"><a href="mailto:${request.reporter.email}">${request.reporter.email}</a></span>
                </div>
            ` : ''}
        </div>
        
        ${request.status !== 'rescued' ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Actions</h3>
                <div style="display: flex; gap: var(--spacing-3); flex-wrap: wrap;">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-primary btn-status-change" 
                                data-request-id="${request.id}" 
                                data-new-status="in-progress"
                                onclick="changeRequestStatus('${request.id}', 'in-progress'); closeModal();">
                            Start Rescue
                        </button>
                    ` : ''}
                    ${request.status === 'in-progress' ? `
                        <button class="btn btn-primary btn-status-change" 
                                data-request-id="${request.id}" 
                                data-new-status="rescued"
                                onclick="changeRequestStatus('${request.id}', 'rescued'); closeModal();">
                            Mark as Rescued
                        </button>
                    ` : ''}
                    ${request.status === 'in-progress' ? `
                        <button class="btn btn-outline btn-status-change" 
                                data-request-id="${request.id}" 
                                data-new-status="pending"
                                onclick="changeRequestStatus('${request.id}', 'pending'); closeModal();">
                            Move to Pending
                        </button>
                    ` : ''}
                </div>
            </div>
        ` : ''}
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('requestModal');
    if (modal) modal.style.display = 'none';
}

function changeRequestStatus(requestId, newStatus) {
    if (updateRequestStatus(requestId, newStatus)) {
        loadDashboardStats();
        loadRequests();
    }
}

function refreshDashboard() {
    loadDashboardStats();
    loadRequests();
    
    // Visual feedback
    const btn = document.getElementById('refreshBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M8 2a6 6 0 016 6" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        Refreshing...
    `;
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }, 500);
}

// ==========================================
// Add Sample Data for Testing (Development Only)
// ==========================================

function addSampleData() {
    const sampleRequests = [
        {
            id: generateRequestId(),
            timestamp: Date.now() - 3600000,
            status: 'pending',
            location: {
                latitude: '19.0760',
                longitude: '72.8777',
                address: 'Near Marine Drive Beach',
                city: 'Mumbai',
                pincode: '400020'
            },
            animal: {
                type: 'dog',
                condition: 'injured',
                urgency: 'critical',
                description: 'Hit by vehicle, bleeding from leg, unable to move'
            },
            reporter: {
                name: 'Priya Sharma',
                phone: '+91 98765 43210',
                email: 'priya@example.com'
            },
            updatedAt: Date.now() - 3600000
        },
        {
            id: generateRequestId(),
            timestamp: Date.now() - 7200000,
            status: 'in-progress',
            location: {
                latitude: '28.7041',
                longitude: '77.1025',
                address: 'Connaught Place Metro Station',
                city: 'New Delhi',
                pincode: '110001'
            },
            animal: {
                type: 'cat',
                condition: 'trapped',
                urgency: 'high',
                description: 'Stuck in drainage pipe, meowing continuously'
            },
            reporter: {
                name: 'Rahul Verma',
                phone: '+91 98765 43211',
                email: ''
            },
            updatedAt: Date.now() - 1800000
        },
        {
            id: generateRequestId(),
            timestamp: Date.now() - 86400000,
            status: 'rescued',
            location: {
                latitude: '12.9716',
                longitude: '77.5946',
                address: 'Indiranagar Metro',
                city: 'Bangalore',
                pincode: '560038'
            },
            animal: {
                type: 'bird',
                condition: 'sick',
                urgency: 'medium',
                description: 'Pigeon with injured wing, unable to fly'
            },
            reporter: {
                name: 'Anjali Reddy',
                phone: '+91 98765 43212',
                email: 'anjali@example.com'
            },
            updatedAt: Date.now() - 43200000
        }
    ];
    
    sampleRequests.forEach(request => saveRequest(request));
    console.log('Sample data added successfully!');
}

// Expose function to window for easy testing
window.addSampleData = addSampleData;
window.clearAllRequests = clearAllRequests;
