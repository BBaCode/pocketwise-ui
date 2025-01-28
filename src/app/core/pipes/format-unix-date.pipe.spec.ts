import { FormatUnixDatePipe } from './format-unix-date.pipe';

describe('FormatUnixDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatUnixDatePipe();
    expect(pipe).toBeTruthy();
  });
});
