import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic,
  Method,
} from 'axios';
import axios from 'axios';
import { baseUrl } from './config';

type HeaderValue = string | number | boolean;

export class HttpService {
  protected headersMap = new Map<string, HeaderValue>([
    ['Content-Type', 'application/json'],
  ]);
  protected requestConfig: AxiosRequestConfig = { baseURL: baseUrl };
  protected api: AxiosInstance | AxiosStatic;

  constructor(axiosApi?: AxiosInstance) {
    this.api = axiosApi || axios;
  }

  public withAuthTokenHeader = (token: string): HttpService => {
    this.headersMap.set('Authorization', `Bearer ${token}`);
    return this;
  };

  public withBody = <TBody>(body: TBody): HttpService => {
    this.requestConfig.data = body;
    return this;
  };

  public withMethod = (method: Method): HttpService => {
    this.requestConfig.method = method;
    return this;
  };

  public withUrl = (resourceUrl: string): HttpService => {
    this.requestConfig.url = resourceUrl;
    return this;
  };

  public async execute<TResponse>(): Promise<AxiosResponse<TResponse>> {
    this.requestConfig.headers = this.buildHeaders();
    const completeRequest = { ...this.requestConfig };
    this.resetRequestConfigDefaults();
    return this.api.request(completeRequest).catch((e) => {
      console.log('err is', e, completeRequest);
      throw e;
    });
  }

  protected buildHeaders = (): Record<string, HeaderValue> => {
    return Array.from(this.headersMap).reduce(
      (acc, val) => ({ ...acc, [val[0]]: val[1] }),
      {},
    );
  };

  protected resetRequestConfigDefaults = (): void => {
    this.requestConfig = {};
    this.requestConfig.baseURL = baseUrl;
    this.headersMap.clear();
    this.headersMap.set('Content-Type', 'application/json');
  };
}

export const httpService = new HttpService();
