import { useCallback, useState } from 'react'
import { validators } from '../../utils/validation'

export function useValidation(schema, values) {
  const [errors, setErrors] = useState({})

  const validateField = useCallback((fieldName) => {
    const { rules = [] } = schema[fieldName] || {}
    for (const rule of rules) {
      const validator =
        typeof rule === 'string' ? validators[rule] :
        typeof rule === 'function' ? rule :
        null

      if (!validator) continue

      const error = validator(values[fieldName] ?? '')
      if (error) return error
    }
    return null
  }, [schema, values])

  const validateForm = useCallback(() => {
    const result = {}
    Object.keys(schema).forEach(name => {
      const error = validateField(name)
      if (error) result[name] = error
    })
    setErrors(result)
    return Object.keys(result).length === 0
  }, [schema, validateField])

  return { errors, validateField, validateForm }
}
