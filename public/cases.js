// Case Management JavaScript
class CaseManager {
    constructor() {
        this.cases = [];
        this.clients = [];
        this.editingCaseId = null;
        this.init();
    }

    init() {
        this.loadClients();
        this.loadCases();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('case-form');
        const cancelBtn = document.getElementById('cancel-btn');
        const searchBtn = document.getElementById('search-btn');
        const clearSearchBtn = document.getElementById('clear-search-btn');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelBtn.addEventListener('click', () => this.cancelEdit());
        searchBtn.addEventListener('click', () => this.searchByClientPhone());
        clearSearchBtn.addEventListener('click', () => this.clearSearch());
    }

    async loadClients() {
        try {
            const response = await fetch('/api/clients');
            this.clients = await response.json();
            this.populateClientSelect();
        } catch (error) {
            this.showMessage('خطأ في تحميل العملاء: ' + error.message, 'error');
        }
    }

    async loadCases() {
        try {
            const response = await fetch('/api/cases');
            this.cases = await response.json();
            this.renderCases();
        } catch (error) {
            this.showMessage('خطأ في تحميل القضايا: ' + error.message, 'error');
        }
    }

    async searchByClientPhone() {
        const phoneNumber = document.getElementById('search-client-phone').value.trim();
        
        if (!phoneNumber) {
            this.showMessage('يرجى إدخال رقم هاتف العميل', 'error');
            return;
        }

        try {
            // Find client by phone number
            const client = this.clients.find(c => c.phone.includes(phoneNumber));
            
            if (!client) {
                this.showMessage('لم يتم العثور على عميل بهذا الرقم', 'error');
                return;
            }

            // Filter cases for this client
            const filteredCases = this.cases.filter(c => c.clientId._id === client._id);
            
            if (filteredCases.length === 0) {
                this.showMessage('لا توجد قضايا لهذا العميل', 'error');
                return;
            }

            // Render filtered cases
            this.renderCases(filteredCases);
            this.showMessage(`تم العثور على ${filteredCases.length} قضية للعميل ${client.name}`, 'success');
            
        } catch (error) {
            this.showMessage('خطأ في البحث: ' + error.message, 'error');
        }
    }

    clearSearch() {
        document.getElementById('search-client-phone').value = '';
        this.renderCases();
        this.showMessage('تم مسح البحث', 'success');
    }

    populateClientSelect() {
        const clientSelect = document.getElementById('clientId');
        clientSelect.innerHTML = '<option value="">اختر عميل</option>';
        
        this.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client._id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const caseData = Object.fromEntries(formData.entries());

        // Convert startDate to Date object
        caseData.startDate = new Date(caseData.startDate);

        try {
            if (this.editingCaseId) {
                // Update existing case
                const response = await fetch(`/api/cases/${this.editingCaseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(caseData)
                });

                if (response.ok) {
                    this.showMessage('تم تحديث القضية بنجاح!', 'success');
                    this.cancelEdit();
                } else {
                    const error = await response.json();
                    this.showMessage('خطأ في تحديث القضية: ' + error.message, 'error');
                }
            } else {
                // Create new case
                const response = await fetch('/api/cases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(caseData)
                });

                if (response.ok) {
                    this.showMessage('تم إضافة القضية بنجاح!', 'success');
                    e.target.reset();
                } else {
                    const error = await response.json();
                    this.showMessage('خطأ في إضافة القضية: ' + error.message, 'error');
                }
            }

            this.loadCases();
        } catch (error) {
            this.showMessage('خطأ: ' + error.message, 'error');
        }
    }

    async deleteCase(id) {
        if (!confirm('هل أنت متأكد من حذف هذه القضية؟')) {
            return;
        }

        try {
            const response = await fetch(`/api/cases/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showMessage('تم حذف القضية بنجاح!', 'success');
                this.loadCases();
            } else {
                const error = await response.json();
                this.showMessage('خطأ في حذف القضية: ' + error.message, 'error');
            }
        } catch (error) {
            this.showMessage('خطأ: ' + error.message, 'error');
        }
    }

    editCase(caseData) {
        this.editingCaseId = caseData._id;
        
        // Fill form with case data
        document.getElementById('caseNumber').value = caseData.caseNumber;
        document.getElementById('title').value = caseData.title;
        document.getElementById('court').value = caseData.court;
        document.getElementById('type').value = caseData.type;
        document.getElementById('clientId').value = caseData.clientId._id;
        document.getElementById('status').value = caseData.status;
        document.getElementById('startDate').value = new Date(caseData.startDate).toISOString().split('T')[0];
        document.getElementById('notes').value = caseData.notes || '';

        // Update UI
        document.getElementById('form-title').textContent = 'تعديل القضية';
        document.getElementById('submit-btn').textContent = 'تحديث القضية';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    cancelEdit() {
        this.editingCaseId = null;
        document.getElementById('case-form').reset();
        document.getElementById('form-title').textContent = 'إضافة قضية جديدة';
        document.getElementById('submit-btn').textContent = 'إضافة قضية';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getStatusText(status) {
        const statusMap = {
            'open': 'مفتوحة',
            'closed': 'مغلقة',
            'adjourned': 'مؤجلة'
        };
        return statusMap[status] || status;
    }

    renderCases(casesToRender = null) {
        const casesList = document.getElementById('cases-list');
        const cases = casesToRender || this.cases;
        
        if (cases.length === 0) {
            casesList.innerHTML = `
                <div class="empty-state">
                    <h3>لم يتم العثور على قضايا</h3>
                    <p>أضف قضيتك الأولى باستخدام النموذج أعلاه.</p>
                </div>
            `;
            return;
        }

        casesList.innerHTML = cases.map(caseData => `
            <div class="list-item">
                <h3>${caseData.title}</h3>
                <p><strong>رقم القضية:</strong> ${caseData.caseNumber}</p>
                <p><strong>المحكمة:</strong> ${caseData.court}</p>
                <p><strong>النوع:</strong> ${caseData.type}</p>
                <p><strong>الحالة:</strong> <span class="status ${caseData.status}">${this.getStatusText(caseData.status)}</span></p>
                <p><strong>تاريخ البداية:</strong> ${this.formatDate(caseData.startDate)}</p>
                ${caseData.notes ? `<p><strong>ملاحظات:</strong> ${caseData.notes}</p>` : ''}
                
                <div class="client-info">
                    <strong>العميل:</strong> ${caseData.clientId.name}<br>
                    <strong>الهاتف:</strong> ${caseData.clientId.phone}<br>
                    <strong>البريد الإلكتروني:</strong> ${caseData.clientId.email}
                </div>
                
                <div class="list-item-actions">
                    <button class="btn btn-warning" onclick="caseManager.editCase(${JSON.stringify(caseData).replace(/"/g, '&quot;')})">
                        تعديل
                    </button>
                    <button class="btn btn-danger" onclick="caseManager.deleteCase('${caseData._id}')">
                        حذف
                    </button>
                </div>
            </div>
        `).join('');
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.className = `message ${type} show`;
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    }
}

// Initialize the case manager when the page loads
const caseManager = new CaseManager();
