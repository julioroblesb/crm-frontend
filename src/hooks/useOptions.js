import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const useOptions = () => {
  const [options, setOptions] = useState({
    fuente: [],
    pipeline: [],
    estado: [],
    vendedor: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getOptions()
      if (response.success) {
        setOptions(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addOption = async (field, option) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.addOption(field, option)
      if (response.success) {
        await fetchOptions() // Refrescar las opciones
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

  const updateOption = async (field, oldOption, newOption) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.updateOption(field, oldOption, newOption)
      if (response.success) {
        await fetchOptions() // Refrescar las opciones
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

  const deleteOption = async (field, option) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.deleteOption(field, option)
      if (response.success) {
        await fetchOptions() // Refrescar las opciones
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

  const getFieldOptions = async (field) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getFieldOptions(field)
      if (response.success) {
        return response.data
      } else {
        setError(response.error)
        return []
      }
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  return {
    options,
    loading,
    error,
    fetchOptions,
    addOption,
    updateOption,
    deleteOption,
    getFieldOptions
  }
}

