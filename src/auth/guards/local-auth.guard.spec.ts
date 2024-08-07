import { LocalAuthGuard } from './local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('LocalAuthGuard', () => {
  let localAuthGuard: LocalAuthGuard;

  beforeEach(() => {
    localAuthGuard = new LocalAuthGuard();
  });

  it('should be defined', () => {
    expect(localAuthGuard).toBeDefined();
  });

  it('should call canActivate method and return true', () => {
    const context = {} as ExecutionContext;
    jest.spyOn(localAuthGuard, 'canActivate').mockReturnValue(true);

    const result = localAuthGuard.canActivate(context);

    expect(localAuthGuard.canActivate).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });
});
