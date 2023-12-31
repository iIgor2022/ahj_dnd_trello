import createBadge from './badges';
import Card from './card';

export default class Controller {
  constructor(container) {
    this.container = container;
    this.draggingElement = null;
    this.draggingProection = null;

    document.querySelector('body').appendChild(createBadge());
  }

  init() {
    this.getSave();
    document.addEventListener('click', this.click.bind(this));
  }

  click(element) {
    const { target } = element;

    if (target.classList.contains('add-card')) {
      target.classList.add('invisible');
      target.closest('.column').querySelector('.add').classList.remove('invisible');
    } else if (target.classList.contains('close')) {
      target.closest('.add').classList.add('invisible');
      target.closest('.column').querySelector('.add-card').classList.remove('invisible');
    } else if (target.classList.contains('add-button')) {
      const input = target.closest('.add').querySelector('.add-input');
      if (input.value) {
        input.closest('.column').querySelector('.cards').append((Card.create(input.value).element));
        target.closest('.column').querySelector('.add').classList.add('invisible');
        target.closest('.column').querySelector('.add-card').classList.remove('invisible');
        this.save();
        input.value = '';
      }
    } else if (target.classList.contains('card-delete')) {
      const card = element.target.closest('.card');
      card.remove();
      this.save();
    }
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["save", "getSave"] }] */
  save() {
    const arr = [];
    [...document.querySelectorAll('.cards')].forEach((el) => arr.push(el.innerHTML));
    localStorage.setItem('cards', arr);
  }

  getSave() {
    const storage = localStorage.getItem('cards');

    if (storage) {
      const fromStorageArray = storage.split(',');
      [...document.querySelectorAll('.cards')].forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.innerHTML = fromStorageArray[index];
      });
    }
  }

  setDraggingElement(node) {
    this.draggingElement = new Card(node);
    this.draggingElement.element.classList.add('dragging');
  }

  replaceDragging() {
    this.draggingProection.replaceWith(this.draggingElement.element);
    this.draggingElement.element.style = this.draggingElement.styles;
    this.draggingElement.element.classList.remove('dragging');
  }

  clear() {
    this.draggingElement = null;
    this.draggingProection = null;
  }

  onMouseDown = (event) => {
    const { target } = event;

    if (target.classList.contains('card')) {
      this.shiftX = event.offsetX;
      this.shiftY = event.offsetY;
      this.setDraggingElement(target);
      this.draggingElement.styles = `left: ${event.pageX - this.shiftX}px; top: ${event.pageY - this.shiftY}px;`;
      this.proectionAct(event);
    }
  };

  onMouseUp = () => {
    if (this.draggingElement) {
      this.replaceDragging();
      this.clear();
    }
  };

  proectionAct(event) {
    const { target } = event;
    const element = this.draggingElement;
    const proection = this.draggingProection;
    const { y, height } = target.getBoundingClientRect();

    if (target.classList.contains('card') && !target.classList.contains('proection')) {
      const appendPosition = y + height / 2 > event.clientY
        ? 'beforebegin'
        : 'afterend';

      if (proection) {
        proection.remove();
        target.insertAdjacentElement(appendPosition, proection);
      } else {
        this.draggingProection = element.proection;
      }
    } else if (target.classList.contains('column') && target.querySelector('.cards').childElementCount === 0) {
      if (proection) {
        proection.remove();
        target.querySelector('.cards').appendChild(proection);
      } else {
        this.draggingProection = element.proection;
      }
    }
  }

  onMouseMove = (event) => {
    if (this.draggingElement) {
      const { pageX, pageY } = event;
      const element = this.draggingElement;
      const { width, height } = this.draggingElement.styles;

      element.styles = `
        position: absolute;
        left: ${pageX - this.shiftX}px;
        top: ${pageY - this.shiftY}px;
        pointer-events: none;
        width: ${width};
        height: ${height};
      `;
      this.proectionAct(event);
    }
    this.save();
  };
}
