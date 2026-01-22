export class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data: T | null,
    public readonly error: string | null,
    public readonly errors: Record<string, string[]> | null
  ) {}

  static ok<T>(data: T): Result<T> {
    return new Result<T>(true, data, null, null);
  }

  static fail<T = never>(error: string): Result<T> {
    return new Result<T>(false, null, error, null);
  }

  static failWithErrors<T = never>(errors: Record<string, string[]>): Result<T> {
    return new Result<T>(false, null, null, errors);
  }

  isSuccess(): this is Result<T> & { data: T } {
    return this.success;
  }

  isFailure(): this is Result<T> & { error: string } | Result<T> & { errors: Record<string, string[]> } {
    return !this.success;
  }
}