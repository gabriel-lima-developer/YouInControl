export type ApiErrorResponse = {
  message: string;
  traceId?: string;
  detail?: string | null;
};

export class ApiRequestError extends Error {
  status: number;
  traceId?: string;
  detail?: string | null;

  constructor(message: string, status: number, traceId?: string, detail?: string | null) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.traceId = traceId;
    this.detail = detail;
  }
}
