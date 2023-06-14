export interface CoreRes<T = any> {
  result: number;
  data: T;
  errors?: any;
  errorMessage: string;
}

export class SuccessResponse<T = any>
  implements Omit<CoreRes<T>, 'errors' | 'errorMessage'>
{
  result: number;
  data: T;
  constructor(data: T) {
    this.result = 0;
    this.data = data;
  }
}

export class ErrorResponse<T = any> implements Omit<CoreRes<T>, 'data'> {
  errorMessage: string;
  errors?: any;
  result: number;
  constructor(errorMessage: string, errors?: any) {
    this.result = -1;
    this.errors = errors;
    this.errorMessage = errorMessage;
  }
}

export class WarningResponse<T = any> implements Omit<CoreRes<T>, 'data'> {
  errorMessage: string;
  errors: any;
  result: number;
  constructor(errors: any) {
    this.result = -2;
    this.errors = errors;
    this.errorMessage;
  }
}
