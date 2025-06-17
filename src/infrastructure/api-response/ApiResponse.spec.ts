import { ApiResponse } from './ApiResponse';
import { IApiResponse } from './interfaces/IApiResponse';

describe('ApiResponse', () => {
  let apiResponse: IApiResponse;

  beforeEach(() => {
    apiResponse = new ApiResponse();
  });

  describe('setMessage', () => {
    it('should set the message and return the instance', () => {
      const message = 'Test message';
      const result = apiResponse.setMessage(message);

      expect(result).toBe(apiResponse);
      expect(apiResponse.message).toBe(message);
    });
  });

  describe('setStatus', () => {
    it('should set the status and return the instance', () => {
      const status = 404;
      const result = apiResponse.setStatus(status);

      expect(result).toBe(apiResponse);
      expect(apiResponse.status).toBe(status);
    });
  });

  describe('addData', () => {
    it('should add data to the response and return the instance', () => {
      const data = { key: 'value' };
      const result = apiResponse.addData(data);

      expect(result).toBe(apiResponse);
      expect(apiResponse.key).toBe('value');
    });
  });

  describe('buildSuccess', () => {
    it('should build a success response with the given message, data, and status', () => {
      const message = 'Success';
      const data = { key: 'value' };
      const status = 200;
      const result = apiResponse.buildSuccess(message, data, status);

      expect(result.message).toBe(message);
      expect(result.status).toBe(status);
      expect(result.key).toBe('value');
    });

    it('should use default status if not provided', () => {
      const message = 'Success';
      const data = { key: 'value' };
      const result = apiResponse.buildSuccess(message, data);

      expect(result.message).toBe(message);
      expect(result.status).toBe(200);
      expect(result.key).toBe('value');
    });
  });

  describe('buildError', () => {
    it('should build an error response with the given message and status', () => {
      const message = 'Error';
      const status = 400;
      const result = apiResponse.buildError(message, status);

      expect(result.message).toBe(message);
      expect(result.status).toBe(status);
    });

    it('should use default status if not provided', () => {
      const message = 'Error';
      const result = apiResponse.buildError(message);

      expect(result.message).toBe(message);
      expect(result.status).toBe(400);
    });
  });
});
