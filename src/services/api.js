// Base URL: usa la variable de entorno de Vite en producción
// y "localhost:5000" cuando no exista (desarrollo local).
const API_BASE_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
}/api`;

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /* ──────────────── Leads ──────────────── */
  getLeads() {
    return this.request('/leads');
  }

  createLead(leadData) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  updateLead(leadId, leadData) {
    return this.request(`/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  }

  deleteLead(leadId) {
    return this.request(`/leads/${leadId}`, {
      method: 'DELETE',
    });
  }

  getLead(leadId) {
    return this.request(`/leads/${leadId}`);
  }

  /* ─────────────── Dashboard ─────────────── */
  getDashboardMetrics() {
    return this.request('/dashboard/metrics');
  }

  /* ─────────────── Pipeline ─────────────── */
  getPipelineStats() {
    return this.request('/pipeline/stats');
  }

  /* ─────────────── Cobranza ─────────────── */
  getCobranzaData() {
    return this.request('/cobranza');
  }

  /* ─────────────── Configuración ─────────────── */
  setSpreadsheetConfig(spreadsheetId) {
    return this.request('/config/spreadsheet', {
      method: 'POST',
      body: JSON.stringify({ spreadsheet_id: spreadsheetId }),
    });
  }

  authenticateSheets() {
    return this.request('/config/auth', { method: 'POST' });
  }
}

export const apiService = new ApiService();
export default apiService;
