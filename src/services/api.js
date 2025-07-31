const API_BASE_URL = 'http://localhost:5000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición')
      }
      
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Leads endpoints
  async getLeads() {
    return this.request('/leads')
  }

  async createLead(leadData) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    })
  }

  async updateLead(leadId, leadData) {
    return this.request(`/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    })
  }

  async deleteLead(leadId) {
    return this.request(`/leads/${leadId}`, {
      method: 'DELETE',
    })
  }

  async getLead(leadId) {
    return this.request(`/leads/${leadId}`)
  }

  // Dashboard endpoints
  async getDashboardMetrics() {
    return this.request('/dashboard/metrics')
  }

  // Pipeline endpoints
  async getPipelineStats() {
    return this.request('/pipeline/stats')
  }

  // Cobranza endpoints
  async getCobranzaData() {
    return this.request('/cobranza')
  }

  // Configuration endpoints
  async setSpreadsheetConfig(spreadsheetId) {
    return this.request('/config/spreadsheet', {
      method: 'POST',
      body: JSON.stringify({ spreadsheet_id: spreadsheetId }),
    })
  }

  async authenticateSheets() {
    return this.request('/config/auth', {
      method: 'POST',
    })
  }
}

export const apiService = new ApiService()
export default apiService

