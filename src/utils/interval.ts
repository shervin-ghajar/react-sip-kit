import { CallbackFunction } from '../types';

export function interval(
  callback: CallbackFunction,
  count = 1,
  time = 500,
  onClear?: CallbackFunction,
) {
  let counter = 0;
  let timer = setInterval(() => {
    callback();
    counter++;
    if (counter === count) {
      clearInterval(timer);
      onClear?.();
    }
  }, time);
}
