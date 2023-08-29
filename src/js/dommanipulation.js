import createBadge from './badges';
import isValid from './validating';
import verifyPaymentSystem from './verifying';

export default class DOMManipulation {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.onSubmit = this.onSubmit.bind(this);
  }

  bindToDOM() {
    this.parentEl.innerHTML = DOMManipulation.markup;

    this.parentEl.insertAdjacentElement('afterbegin', createBadge());

    this.element = this.parentEl.querySelector(DOMManipulation.selector);
    this.submit = this.parentEl.querySelector(DOMManipulation.submitSelector);
    this.input = this.parentEl.querySelector(DOMManipulation.inputSelector);

    this.submit.addEventListener('click', this.onSubmit);
  }

  static get markup() {
    return `
      <div class="wrapper">
        <ul class="card-icons">
          <li>
            <span class="card visa" title="Visa">Visa</span>
          </li>
          <li>
            <span class="card master" title="Master">Master</span>
          </li>
          <li>
            <span class="card ames" title="American Express">American Express</span>
          </li>
          <li>
            <span class="card discover" title="Discover">Discover</span>
          </li>
          <li>
            <span class="card jcb" title="JCB">JCB</span>
          </li>
          <li>
            <span class="card diners_club" title="Diner Club">Diners Club</span>
          </li>
          <li>
            <span class="card mir" title="Мир">Мир</span>
          </li>
        </ul>
        <form id="form" class="form-inline">
          <input type="text" class="form-control" placeholder="Credit card number">
          <button class="card-validate-btn" type="submit">Validate card</button>
        </form>
      </div>
    `;
  }

  static get inputSelector() {
    return '.form-control';
  }

  static get selector() {
    return '.wrapper';
  }

  static get submitSelector() {
    return '.card-validate-btn';
  }

  onSubmit(evt) {
    evt.preventDefault();
    if (isValid(this.input.value)) {
      this.showVerifyingCard(verifyPaymentSystem(this.input.value));
    } else {
      this.showVerifyingCard('None');
    }
    this.input.value = '';
  }

  showVerifyingCard(cl) {
    if (cl === 'None') {
      const card = this.parentEl.querySelector('.isvalid');
      if (card) {
        card.classList.remove('isvalid');
      }
    } else {
      this.parentEl.querySelector(`.${cl}`).classList.add('isvalid');
    }
  }
}
