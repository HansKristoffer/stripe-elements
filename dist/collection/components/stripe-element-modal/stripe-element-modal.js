import { Host, h } from '@stencil/core';
import { checkPlatform } from '../../utils/utils';
export class StripeSheet {
  constructor() {
    /**
     * If true, the modal display close button
     */
    this.showCloseButton = true;
    /**
     * Modal state.
     * If true, the modal will open
     */
    this.open = false;
  }
  /**
   * Toggle modal state
   */
  async toggleModal() {
    this.open = !this.open;
    if (this.open === false) {
      this.close.emit();
    }
  }
  /**
   * Open the modal
   */
  async openModal() {
    this.open = true;
  }
  /**
   * Close the modal
   */
  async closeModal() {
    this.open = false;
    this.close.emit();
  }
  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }
  render() {
    const { open, showCloseButton } = this;
    return (h(Host, null, h("div", { class: `modal-row${open ? ' open' : ''}`, onClick: () => this.closeModal() }, h("div", { class: "modal-child", onClick: e => e.stopPropagation() }, showCloseButton ? (h("div", { class: "modal-close-button-wrap" }, h("ion-icon", { name: "close", size: "large", class: "modal-close-button", onClick: () => this.closeModal() }))) : null, h("slot", null)))));
  }
  static get is() { return "stripe-sheet"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["stripe-element-modal.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["stripe-element-modal.css"]
    };
  }
  static get properties() {
    return {
      "showCloseButton": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If true, the modal display close button"
        },
        "attribute": "show-close-button",
        "reflect": false,
        "defaultValue": "true"
      },
      "open": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Modal state.\nIf true, the modal will open"
        },
        "attribute": "open",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
  static get events() {
    return [{
        "method": "close",
        "name": "close",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "toggleModal": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Toggle modal state",
          "tags": []
        }
      },
      "openModal": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Open the modal",
          "tags": []
        }
      },
      "closeModal": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Close the modal",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
}
