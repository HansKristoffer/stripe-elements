import { h } from '@stencil/core';
export class StripePaymentSheet {
  constructor() {
    /**
     * Show the form label
     */
    this.showLabel = false;
    /**
     * The component will provide a function to call the `stripe.confirmCardPayment`API.
     * If you want to customize the behavior, should set false.
     * And listen the 'formSubmit' event on the element
     */
    this.shouldUseDefaultFormSubmitAction = true;
    /**
     * Default submit handle type.
     * If you want to use `setupIntent`, should update this attribute.
     * @example
     * ```
     * <stripe-payment-sheet intent-type="setup" />
     * ```
     */
    this.intentType = 'payment';
    /**
     * If true, the modal display close button
     */
    this.showCloseButton = true;
    /**
     * If true, show zip code field
     */
    this.zip = true;
    /**
     * Modal state.
     * If true, the modal will open
     */
    this.open = false;
  }
  componentDidLoad() {
    const modal = this.el.querySelector('stripe-sheet');
    modal.addEventListener('close', () => {
      this.closed.emit();
    });
  }
  /**
   * Get the inner component
   */
  async getStripePaymentSheetElement() {
    return this.el.querySelector('stripe-payment');
  }
  /**
   * open modal
   */
  async present() {
    this.open = true;
    return new Promise((resolve, reject) => {
      const paymentSheet = this.el.querySelector('stripe-payment');
      paymentSheet.addEventListener('formSubmit', async (props) => {
        resolve(props);
      });
      this.el.addEventListener('closed', () => reject());
    });
  }
  /**
   * Update Stripe client loading process
   */
  async updateProgress(progress) {
    const paymentSheet = this.el.querySelector('stripe-payment');
    return paymentSheet.updateProgress(progress);
  }
  /**
   * Remove the modal
   */
  async destroy() {
    const paymentSheet = this.el.querySelector('stripe-payment');
    paymentSheet.remove();
    this.el.remove();
  }
  /**
   *
   * Add payment request button
   */
  async setPaymentRequestButton(options) {
    const elements = this.el.getElementsByTagName('stripe-payment');
    if (elements.length < 1) {
      return;
    }
    const paymentSheetElement = elements[0];
    if (!paymentSheetElement) {
      return;
    }
    paymentSheetElement.setAttribute('show-payment-request-button', 'true');
    if (this.applicationName) {
      paymentSheetElement.setAttribute('application-name', this.applicationName);
    }
    paymentSheetElement.setPaymentRequestOption(options);
  }
  render() {
    return (h("stripe-sheet", { open: this.open, showCloseButton: this.showCloseButton }, h("stripe-payment", { showLabel: this.showLabel, publishableKey: this.publishableKey, intentClientSecret: this.intentClientSecret, shouldUseDefaultFormSubmitAction: this.shouldUseDefaultFormSubmitAction, handleSubmit: this.handleSubmit, stripeDidLoaded: this.stripeDidLoaded, intentType: this.intentType, zip: this.zip, buttonLabel: this.buttonLabel, sheetTitle: this.sheetTitle, applicationName: this.applicationName })));
  }
  static get is() { return "stripe-payment-sheet"; }
  static get originalStyleUrls() {
    return {
      "$": ["stripe-payment-sheet-modal.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["stripe-payment-sheet-modal.css"]
    };
  }
  static get properties() {
    return {
      "publishableKey": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Your Stripe publishable API key."
        },
        "attribute": "publishable-key",
        "reflect": false
      },
      "stripeAccount": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [{
              "name": "info",
              "text": "https://stripe.com/docs/connect/authentication"
            }],
          "text": "Optional. Making API calls for connected accounts"
        },
        "attribute": "stripe-account",
        "reflect": false
      },
      "applicationName": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Overwrite the application name that registered\nFor wrapper library (like Capacitor)"
        },
        "attribute": "application-name",
        "reflect": false
      },
      "showLabel": {
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
          "text": "Show the form label"
        },
        "attribute": "show-label",
        "reflect": false,
        "defaultValue": "false"
      },
      "sheetTitle": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Payment sheet title\nBy default we recommended to use these string\n- 'Add your payment information' -> PaymentSheet / PaymentFlow(Android)\n- 'Add a card' -> PaymentFlow(iOS)\nThese strings will translated automatically by this library."
        },
        "attribute": "sheet-title",
        "reflect": false
      },
      "buttonLabel": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Submit button label\nBy default we recommended to use these string\n- 'Pay' -> PaymentSheet\n- 'Add' -> PaymentFlow(Android)\n- 'Add card' -> PaymentFlow(iOS)\n- 'Add a card' -> PaymentFlow(iOS)\nThese strings will translated automatically by this library."
        },
        "attribute": "button-label",
        "reflect": false
      },
      "intentClientSecret": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n    stripeElement.setAttribute('intent-client-secret', 'dummy')\n  })\n```"
            }, {
              "name": "example",
              "text": "```\n<stripe-card-element intent-client-secret=\"dummy\" />\n```"
            }],
          "text": "The client secret from paymentIntent.create response"
        },
        "attribute": "intent-client-secret",
        "reflect": false
      },
      "shouldUseDefaultFormSubmitAction": {
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
          "text": "The component will provide a function to call the `stripe.confirmCardPayment`API.\nIf you want to customize the behavior, should set false.\nAnd listen the 'formSubmit' event on the element"
        },
        "attribute": "should-use-default-form-submit-action",
        "reflect": false,
        "defaultValue": "true"
      },
      "intentType": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "IntentType",
          "resolved": "\"payment\" | \"setup\"",
          "references": {
            "IntentType": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\n<stripe-payment-sheet intent-type=\"setup\" />\n```"
            }],
          "text": "Default submit handle type.\nIf you want to use `setupIntent`, should update this attribute."
        },
        "attribute": "intent-type",
        "reflect": false,
        "defaultValue": "'payment'"
      },
      "handleSubmit": {
        "type": "unknown",
        "mutable": true,
        "complexType": {
          "original": "FormSubmitHandler",
          "resolved": "(event: Event, props: FormSubmitEvent) => Promise<void>",
          "references": {
            "FormSubmitHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Form submit event handler"
        }
      },
      "stripeDidLoaded": {
        "type": "unknown",
        "mutable": true,
        "complexType": {
          "original": "StripeDidLoadedHandler",
          "resolved": "(event: StripeLoadedEvent) => Promise<void>",
          "references": {
            "StripeDidLoadedHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Stripe.js class loaded handler"
        }
      },
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
      "zip": {
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
          "text": "If true, show zip code field"
        },
        "attribute": "zip",
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
        "method": "closed",
        "name": "closed",
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
      "getStripePaymentSheetElement": {
        "complexType": {
          "signature": "() => Promise<HTMLStripePaymentElement>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLStripePaymentElement": {
              "location": "global"
            }
          },
          "return": "Promise<HTMLStripePaymentElement>"
        },
        "docs": {
          "text": "Get the inner component",
          "tags": []
        }
      },
      "present": {
        "complexType": {
          "signature": "() => Promise<unknown>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<unknown>"
        },
        "docs": {
          "text": "open modal",
          "tags": []
        }
      },
      "updateProgress": {
        "complexType": {
          "signature": "(progress: ProgressStatus) => Promise<HTMLStripePaymentElement>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLStripePaymentElement": {
              "location": "global"
            },
            "ProgressStatus": {
              "location": "import",
              "path": "../../interfaces"
            }
          },
          "return": "Promise<HTMLStripePaymentElement>"
        },
        "docs": {
          "text": "Update Stripe client loading process",
          "tags": []
        }
      },
      "destroy": {
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
          "text": "Remove the modal",
          "tags": []
        }
      },
      "setPaymentRequestButton": {
        "complexType": {
          "signature": "(options: PaymentRequestButtonOption) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "PaymentRequestButtonOption": {
              "location": "import",
              "path": "../../interfaces"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "\nAdd payment request button",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
}
