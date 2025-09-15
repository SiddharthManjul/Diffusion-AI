/**
 * Validation utilities using Zod
 */

import { z } from 'zod';
import { ValidationError } from './errors';

/**
 * Validate data against a schema
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = errorMessage || 'Validation failed';
      throw new ValidationError(message, {
        issues: error.issues,
        receivedData: data,
      });
    }
    throw error;
  }
}

/**
 * Safely validate data and return result with success flag
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: new ValidationError('Validation failed', {
          issues: error.issues,
          receivedData: data,
        }),
      };
    }
    return {
      success: false,
      error: new ValidationError('Unknown validation error', {
        originalError: error,
        receivedData: data,
      }),
    };
  }
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  id: z.string().min(1, 'ID cannot be empty'),
  url: z.string().url('Invalid URL format'),
  email: z.string().email('Invalid email format'),
  port: z.number().int().min(1).max(65535, 'Port must be between 1 and 65535'),
  positiveNumber: z.number().positive('Must be a positive number'),
  nonEmptyString: z.string().min(1, 'String cannot be empty'),
  optionalString: z.string().optional(),
  timestamp: z.number().int().positive('Invalid timestamp'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Invalid version format (expected x.y.z)'),
} as const;

/**
 * Create a schema for objects with unknown properties
 */
export function createFlexibleObjectSchema<T extends z.ZodRawShape>(
  shape: T
): z.ZodObject<T, 'strip', z.ZodTypeAny> {
  return z.object(shape).strip();
}

/**
 * Create a schema for arrays with minimum length
 */
export function createMinLengthArraySchema<T extends z.ZodTypeAny>(
  itemSchema: T,
  minLength: number
): z.ZodArray<T> {
  return z.array(itemSchema).min(minLength, `Array must have at least ${minLength} items`);
}
