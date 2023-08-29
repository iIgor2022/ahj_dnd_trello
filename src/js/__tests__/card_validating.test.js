/** @jest-environment jsdom */
import DOMManipulation from '../dommanipulation';

test.each([
  ['371449635398431', '.ames', true],
  ['4111111111111112', '.visa', false],
])('Card number %s, class %s, expected %s', (value, received, expected) => {
  document.body.innerHTML = '';

  const container = document.querySelector('body');
  const validator = new DOMManipulation(container);

  validator.bindToDOM();

  validator.input.value = value;
  validator.submit.click();

  expect(validator.element.querySelector(received).classList.contains('isvalid')).toEqual(expected);
});
