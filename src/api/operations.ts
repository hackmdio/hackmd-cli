import type {OperationId} from '@hackmd/api/raw'

import {operationRegistry} from '@hackmd/api/raw'

export type Operation = {
  call: unknown;
  method: string;
  parameters: ReadonlyArray<{in: string; name: string; required: boolean; type: string}>;
  path: string;
  requestBody?: {
    binaryFields: ReadonlyArray<{name: string; required: boolean}>;
    contentTypes: readonly string[];
    required: boolean;
  };
  responses: Record<string, readonly string[]>;
}

export function getOperation(id: string): Operation {
  if (!Object.hasOwn(operationRegistry, id)) {
    throw new Error(`Unknown operation "${id}". Run "hackmd-cli api operations" to list the installed API client's operations.`)
  }

  return operationRegistry[id as OperationId]
}

export function parsePairs(values: string[], separator: string, kind: string): Record<string, string> {
  const result: Record<string, string> = Object.create(null)
  for (const value of values) {
    const index = value.indexOf(separator)
    if (index <= 0) throw new Error(`Invalid --${kind} value "${value}"; expected key${separator}value`)
    const key = value.slice(0, index).trim()
    if (!key || Object.hasOwn(result, key)) throw new Error(`Duplicate or empty --${kind} key "${key}"`)
    result[key] = value.slice(index + separator.length).trim()
  }

  return result
}

export function validateParameters(operation: Operation, location: 'path' | 'query', input: Record<string, string>): Record<string, boolean | number | string> {
  const parameters = operation.parameters.filter(parameter => parameter.in === location)
  const allowed = new Map(parameters.map(parameter => [parameter.name, parameter]))
  for (const parameter of parameters) {
    if (parameter.required && !Object.hasOwn(input, parameter.name)) {
      throw new Error(`Missing required --${location} ${parameter.name}=...`)
    }
  }

  const result: Record<string, boolean | number | string> = {}
  for (const [key, value] of Object.entries(input)) {
    const parameter = allowed.get(key)
    if (!parameter) throw new Error(`Unknown --${location} parameter "${key}" for ${operation.method} ${operation.path}`)
    if (parameter.type === 'number' || parameter.type === 'integer') {
      const number = Number(value)
      if (value === '' || !Number.isFinite(number) || (parameter.type === 'integer' && !Number.isInteger(number))) {
        throw new Error(`--${location} ${key} must be a ${parameter.type}`)
      }

      result[key] = number
    } else if (parameter.type === 'boolean') {
      if (value !== 'true' && value !== 'false') throw new Error(`--${location} ${key} must be true or false`)
      result[key] = value === 'true'
    } else {
      result[key] = value
    }
  }

  return result
}
