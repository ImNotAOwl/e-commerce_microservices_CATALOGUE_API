import { IApiResponse } from './interfaces/IApiResponse';

export class ApiResponse implements IApiResponse {
  status: number = 200;
  message: string = '';
  [key: string]: unknown; // Permet d'ajouter dynamiquement d'autres propriétés

  private reset() {
    for (const key in this) {
      if (key !== 'status' && key !== 'message') delete this[key];
    }
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setStatus(status: number) {
    this.status = status;
    return this;
  }

  addData(data: object) {
    Object.assign(this, data);
    return this;
  }

  buildSuccess(message: string, data: object, status: number = 200) {
    this.reset();
    this.setStatus(status).setMessage(message).addData(data);
    return this;
  }

  buildError(message: string, status: number = 400) {
    this.reset();
    this.setStatus(status).setMessage(message);
    return this;
  }
}
