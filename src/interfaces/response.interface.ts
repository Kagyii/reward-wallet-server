export interface IResponse {
  statusCode?: number;
  message: string;
  data: Record<string, any> | Array<Record<string, any>>;
  meta?: Record<string, any>;
}
