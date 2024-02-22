import { loggerHelper } from './logger';

describe('loggerHelper', () => {
  describe('makeType', () => {
    test('should format the given type ', () => {
      expect(loggerHelper.makeType('System')).toBe('[System]');
    });
  });
});
