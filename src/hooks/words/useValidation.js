import { useCallback, useState } from 'react'

export function useValidation(fields, values) {
  const [errors, setErrors] = useState({})

  const validateField = useCallback((name, value) => {
    if (!value.trim()) {
      return `${name} обязательно для заполнения`
    }
    return null
  }, [])

  const validateForm = useCallback(() => {
    const res = {}
    fields.forEach(({ name, required }) => {
      if (!required) return
      const error = validateField(name, values[name] || '')
      if (error) res[name] = error
    })
    setErrors(res)
    return Object.keys(res).length === 0
  }, [fields, values, validateField])

  return { errors, validateForm }
}
