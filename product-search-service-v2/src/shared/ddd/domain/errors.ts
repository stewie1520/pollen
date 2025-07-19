import safeJsonStringify from 'safe-json-stringify';
import { ExtendableError } from 'ts-error';

export class DomainError extends ExtendableError {
  constructor(
    message: string,
    private _details?: Record<string, any>,
  ) {
    super(message);
  }

  get details() {
    return this._details ? Object.freeze(this._details) : {};
  }

  get code() {
    return this.constructor.name;
  }
}

export class DatabaseOperationFailedError extends ExtendableError {
  constructor(
    message: string,
    private _originError: unknown,
    private _operationName: string,
  ) {
    super(message);
  }

  get originError() {
    if (!this._originError) {
      return {
        message: 'Unknown error',
      };
    }

    if (typeof this._originError === 'string') {
      return {
        message: this._originError,
      };
    }

    if (this._originError instanceof Error) {
      return this._originError;
    }

    return {
      message: safeJsonStringify(this._originError),
    };
  }

  get operationName() {
    return this._operationName;
  }
}
