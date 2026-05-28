import { API_BASE_URL } from './config';
import { ApiRequestError, type ApiErrorResponse } from '../types/api';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

function getAuthHeaders(): HeadersInit {
  return {};
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...init } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...getAuthHeaders(),
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    const fallbackMessage = getFallbackMessage(response.status);
    const message = errorBody?.traceId
      ? `${errorBody.message ?? fallbackMessage} TraceId: ${errorBody.traceId}`
      : errorBody?.message ?? fallbackMessage;

    throw new ApiRequestError(message, response.status, errorBody?.traceId, errorBody?.detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function getFallbackMessage(status: number) {
  if (status === 400) {
    return 'Nao foi possivel validar os dados enviados.';
  }

  if (status === 401) {
    return 'Sessao nao autorizada.';
  }

  if (status === 404) {
    return 'Recurso nao encontrado.';
  }

  if (status >= 500) {
    return 'Erro inesperado no servidor.';
  }

  return `Erro HTTP ${status}`;
}
