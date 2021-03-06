import Button from './Button';

export default class Remove extends Button {
  static defaultProps = {
    text: 'Remove',
  };

  async process() {
    return this.getParent().remove();
  }
}
