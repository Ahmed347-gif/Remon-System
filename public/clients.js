// Client Management JavaScript
class ClientManager {
    constructor() {
        this.clients = [];
        this.editingClientId = null;
        this.init();
    }

    init() {
        this.loadClients();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('client-form');
        const cancelBtn = document.getElementById('cancel-btn');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    async loadClients() {
        try {
            const response = await fetch('/api/clients');
            this.clients = await response.json();
            this.renderClients();
        } catch (error) {
            this.showMessage('خطأ في تحميل العملاء: ' + error.message, 'error');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const clientData = Object.fromEntries(formData.entries());

        try {
            if (this.editingClientId) {
                // Update existing client
                const response = await fetch(`/api/clients/${this.editingClientId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clientData)
                });

                if (response.ok) {
                    this.showMessage('تم تحديث العميل بنجاح!', 'success');
                    this.cancelEdit();
                } else {
                    const error = await response.json();
                    this.showMessage('خطأ في تحديث العميل: ' + error.message, 'error');
                }
            } else {
                // Create new client
                const response = await fetch('/api/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clientData)
                });

                if (response.ok) {
                    this.showMessage('تم إضافة العميل بنجاح!', 'success');
                    e.target.reset();
                } else {
                    const error = await response.json();
                    this.showMessage('خطأ في إضافة العميل: ' + error.message, 'error');
                }
            }

            this.loadClients();
        } catch (error) {
            this.showMessage('خطأ: ' + error.message, 'error');
        }
    }

    async deleteClient(id) {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) {
            return;
        }

        try {
            const response = await fetch(`/api/clients/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showMessage('تم حذف العميل بنجاح!', 'success');
                this.loadClients();
            } else {
                const error = await response.json();
                this.showMessage('خطأ في حذف العميل: ' + error.message, 'error');
            }
        } catch (error) {
            this.showMessage('خطأ: ' + error.message, 'error');
        }
    }

    editClient(client) {
        this.editingClientId = client._id;
        
        // Fill form with client data
        document.getElementById('name').value = client.name;
        document.getElementById('phone').value = client.phone;
        document.getElementById('email').value = client.email;
        document.getElementById('address').value = client.address;

        // Update UI
        document.getElementById('form-title').textContent = 'تعديل العميل';
        document.getElementById('submit-btn').textContent = 'تحديث العميل';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    cancelEdit() {
        this.editingClientId = null;
        document.getElementById('client-form').reset();
        document.getElementById('form-title').textContent = 'إضافة عميل جديد';
        document.getElementById('submit-btn').textContent = 'إضافة عميل';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    renderClients() {
        const clientsList = document.getElementById('clients-list');
        
        if (this.clients.length === 0) {
            clientsList.innerHTML = `
                <div class="empty-state">
                    <h3>لم يتم العثور على عملاء</h3>
                    <p>أضف عميلك الأول باستخدام النموذج أعلاه.</p>
                </div>
            `;
            return;
        }

        clientsList.innerHTML = this.clients.map(client => `
            <div class="list-item">
                <h3>${client.name}</h3>
                <p><strong>الهاتف:</strong> ${client.phone}</p>
                <p><strong>البريد الإلكتروني:</strong> ${client.email}</p>
                <p><strong>العنوان:</strong> ${client.address}</p>
                <div class="list-item-actions">
                    <button class="btn btn-warning" onclick="clientManager.editClient(${JSON.stringify(client).replace(/"/g, '&quot;')})">
                        تعديل
                    </button>
                    <button class="btn btn-danger" onclick="clientManager.deleteClient('${client._id}')">
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

// Initialize the client manager when the page loads
const clientManager = new ClientManager();
