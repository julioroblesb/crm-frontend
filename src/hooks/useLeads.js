import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const useLeads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getLeads()
      if (response.success) {
        setLeads(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.createLead(leadData)
      if (response.success) {
        await fetchLeads() // Refrescar la lista
        return response
      } else {
        setError(response.error)
        return response
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (leadId, leadData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.updateLead(leadId, leadData)
      if (response.success) {
        await fetchLeads() // Refrescar la lista
        return response
      } else {
        setError(response.error)
        return response
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteLead = async (leadId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.deleteLead(leadId)
      if (response.success) {
        await fetchLeads() // Refrescar la lista
        return response
      } else {
        setError(response.error)
        return response
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead
  }
}

export const useDashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getDashboardMetrics()
      if (response.success) {
        setMetrics(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return {
    metrics,
    loading,
    error,
    fetchMetrics
  }
}

export const usePipeline = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getPipelineStats()
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    fetchStats
  }
}

export const useCobranza = () => {
  const [cobranzaData, setCobranzaData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCobranza = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getCobranzaData()
      if (response.success) {
        setCobranzaData(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCobranza()
  }, [])

  return {
    cobranzaData,
    loading,
    error,
    fetchCobranza
  }
}

