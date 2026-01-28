import { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Error handling strategies
 */
export type ErrorHandlingStrategy = "toast" | "throw" | "silent" | "custom";

/**
 * Options for API call error handling
 */
export interface ApiCallOptions {
  /** How to handle errors */
  onError?: ErrorHandlingStrategy;
  /** Custom error message to show (only used with 'toast' strategy) */
  errorMessage?: string;
  /** Custom error handler function (only used with 'custom' strategy) */
  customErrorHandler?: (error: unknown) => void;
  /** Whether to log error details to console */
  logError?: boolean;
}

/**
 * Maps HTTP status codes to user-friendly error messages
 * Provides limited information for security purposes
 */
const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Authentication required. Please log in.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 422:
      return "Validation error. Please check your input.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
      return "Service temporarily unavailable. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      if (status >= 500) {
        return "Server error. Please try again later.";
      }
      if (status >= 400) {
        return "Request failed. Please try again.";
      }
      return "An error occurred. Please try again.";
  }
};

/**
 * Extracts detailed error message from axios error response
 * Tries to get specific error messages from the API response
 */
function getDetailedErrorMessage(error: AxiosError): string | null {
  const errorData = error.response?.data;

  if (!errorData || typeof errorData !== "object") {
    return null;
  }

  // Check for top-level message
  if ("message" in errorData && typeof errorData.message === "string") {
    return errorData.message;
  }

  // Check for nested errors object (e.g., errors.email, errors.password)
  if ("errors" in errorData && typeof errorData.errors === "object") {
    const errors = errorData.errors as Record<string, unknown>;
    const firstErrorKey = Object.keys(errors)[0];

    if (firstErrorKey) {
      const firstError = errors[firstErrorKey];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return String(firstError[0]);
      }
      if (typeof firstError === "string") {
        return firstError;
      }
    }
  }

  // Check for error field
  if ("error" in errorData && typeof errorData.error === "string") {
    return errorData.error;
  }

  return null;
}

/**
 * Extracts a safe error message from an axios error
 * Returns generic messages based on status code for security
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    // Try to get detailed error message first
    const detailedMessage = getDetailedErrorMessage(error);
    if (detailedMessage) {
      return detailedMessage;
    }

    if (status) {
      return getErrorMessageByStatus(status);
    }

    // Network errors
    if (error.request && !error.response) {
      return "Network error. Please check your connection and try again.";
    }
  }

  // Generic error for non-axios errors
  if (error instanceof Error) {
    return error.message || "An error occurred. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Shows a toast error with safe error message based on status code
 */
export function handleErrorWithToast(
  error: unknown,
  customMessage?: string,
): void {
  const message = customMessage || getSafeErrorMessage(error);
  toast.error(message);
}

/**
 * Extracts error details for logging (server-side or development only)
 * Should not be exposed to users
 */
export function getErrorDetailsForLogging(error: unknown): {
  message: string;
  status?: number;
  data?: unknown;
  url?: string;
} {
  if (error instanceof AxiosError) {
    return {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Unknown error",
  };
}

/**
 * Handles an error based on the specified strategy
 */
function handleError(
  error: unknown,
  options: ApiCallOptions = {},
): never | void {
  const {
    onError = "throw",
    errorMessage,
    customErrorHandler,
    logError = true,
  } = options;

  // Log error details in development or if explicitly requested
  if (logError && (process.env.NODE_ENV === "development" || logError)) {
    const errorDetails = getErrorDetailsForLogging(error);
    console.error("API Error:", errorDetails);
  }

  switch (onError) {
    case "toast":
      handleErrorWithToast(error, errorMessage);
      return;
    case "silent":
      return;
    case "custom":
      if (customErrorHandler) {
        customErrorHandler(error);
        return;
      }
    // Fall through to throw if no custom handler provided
    case "throw":
    default:
      const message = errorMessage || getSafeErrorMessage(error);
      throw new Error(message);
  }
}

/**
 * Wraps an API call with automatic error handling
 *
 * @example
 * ```ts
 * const data = await apiCall(
 *   () => axiosInstance.get('/api/users'),
 *   { onError: 'toast', errorMessage: 'Failed to load users' }
 * );
 * ```
 */
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  options: ApiCallOptions = {},
): Promise<T> {
  try {
    return await apiFunction();
  } catch (error) {
    handleError(error, options);
    // This will never be reached if onError is 'throw', but TypeScript needs it
    throw error;
  }
}

/**
 * Wraps an API call that might return null/undefined
 * Useful for optional data fetching
 */
export async function apiCallOptional<T>(
  apiFunction: () => Promise<T>,
  options: ApiCallOptions = {},
): Promise<T | null> {
  try {
    return await apiFunction();
  } catch (error) {
    // For 404 errors, return null instead of throwing
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    handleError(error, options);
    throw error;
  }
}
