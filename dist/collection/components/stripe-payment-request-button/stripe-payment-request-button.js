import { h, Host } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js';
export class StripePaymentRequestButton {
  constructor() {
    this.loadStripeStatus = '';
    /**
     * Overwrite the application name that registered
     * For wrapper library (like Capacitor)
     */
    this.applicationName = '@stripe-elements/stripe-elements';
    if (this.publishableKey !== undefined && this.paymentRequestOption !== undefined) {
      this.initStripe(this.publishableKey, {
        stripeAccount: this.stripeAccount,
      });
    }
    else {
      this.loadStripeStatus = 'failure';
    }
  }
  /**
   * Check isAvailable ApplePay or GooglePay.
   * If you run this method, you should run before initStripe.
   */
  async isAvailable(type) {
    if (this.publishableKey === undefined) {
      throw 'You should run this method run, after set publishableKey.';
    }
    const stripe = await loadStripe(this.publishableKey, {
      stripeAccount: this.stripeAccount,
    });
    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1099,
      },
      disableWallets: ['applePay', 'googlePay', 'browserCard'].filter(method => method !== type),
    });
    const paymentRequestSupport = await paymentRequest.canMakePayment();
    if (!paymentRequestSupport || (type === 'applePay' && !paymentRequestSupport[type]) || (type === 'googlePay' && !paymentRequestSupport[type])) {
      throw 'This device can not use.';
    }
  }
  /**
   * Register event handler for `paymentRequest.on('paymentmethod'` event.
   */
  async setPaymentMethodEventHandler(handler) {
    this.paymentMethodEventHandler = handler;
  }
  /**
   * Register event handler for `paymentRequest.on('shippingoptionchange'` event.
   */
  async setPaymentRequestShippingOptionEventHandler(handler) {
    this.shippingOptionEventHandler = handler;
  }
  /**
   * Register event handler for `paymentRequest.on('shippingaddresschange'` event.
   */
  async setPaymentRequestShippingAddressEventHandler(handler) {
    this.shippingAddressEventHandler = handler;
  }
  stripeLoadedEventHandler() {
    const event = {
      stripe: this.stripe,
    };
    if (this.stripeDidLoaded) {
      this.stripeDidLoaded(event);
    }
    this.stripeLoaded.emit(event);
  }
  /**
   * @param option
   * @private
   */
  async setPaymentRequestOption(option) {
    this.paymentRequestOption = option;
    return this;
  }
  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   * @param options
   */
  async initStripe(publishableKey, options = undefined) {
    this.loadStripeStatus = 'loading';
    loadStripe(publishableKey, {
      stripeAccount: options === null || options === void 0 ? void 0 : options.stripeAccount,
    })
      .then(stripe => {
      this.loadStripeStatus = 'success';
      stripe.registerAppInfo({
        name: this.applicationName,
      });
      this.stripe = stripe;
      return;
    })
      .catch(e => {
      console.log(e);
      this.loadStripeStatus = 'failure';
      return;
    })
      .then(() => {
      if (!this.stripe) {
        return;
      }
      // 後方互換のため、明確にfalseにしていないものはtrue扱い
      return this.initElement(!(options === null || options === void 0 ? void 0 : options.showButton) === false);
    })
      .then(() => {
      if (!this.stripe) {
        return;
      }
      this.stripeLoadedEventHandler();
    });
  }
  /**
   * Initialize Component using Stripe Element
   */
  async initElement(showButton = true) {
    const paymentRequest = this.stripe.paymentRequest(this.paymentRequestOption);
    // Check if the Payment Request is available (or Apple Pay on the Web).
    const paymentRequestSupport = await paymentRequest.canMakePayment();
    if (!paymentRequestSupport) {
      throw 'paymentRequest is not support.';
    }
    if (this.paymentMethodEventHandler) {
      paymentRequest.on('paymentmethod', event => {
        this.paymentMethodEventHandler(event, this.stripe);
      });
    }
    if (this.shippingOptionEventHandler) {
      paymentRequest.on('shippingoptionchange', event => {
        this.shippingOptionEventHandler(event, this.stripe);
      });
    }
    if (this.shippingAddressEventHandler) {
      paymentRequest.on('shippingaddresschange', event => {
        this.shippingAddressEventHandler(event, this.stripe);
      });
    }
    if (showButton) {
      // Display the Pay button by mounting the Element in the DOM.
      const elements = this.stripe.elements();
      const paymentRequestButton = elements.create('paymentRequestButton', {
        paymentRequest,
      });
      const paymentRequestButtonElement = this.el.querySelector('#payment-request-button');
      paymentRequestButton.mount(paymentRequestButtonElement);
      // Show the payment request section.
      this.el.querySelector('#payment-request').classList.add('visible');
    }
    else {
      /**
       * This method must be called as the result of a user interaction (for example, in a click handler).
       * https://stripe.com/docs/js/payment_request/show
       */
      paymentRequest.show();
    }
  }
  render() {
    return (h(Host, null, h("div", { id: "payment-request" }, h("div", { id: "payment-request-button" })), h("slot", null)));
  }
  static get is() { return "stripe-payment-request-button"; }
  static get originalStyleUrls() {
    return {
      "$": ["stripe-payment-request-button.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["stripe-payment-request-button.css"]
    };
  }
  static get properties() {
    return {
      "paymentMethodEventHandler": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "PaymentRequestPaymentMethodEventHandler",
          "resolved": "(event: PaymentRequestPaymentMethodEvent, stripe: Stripe) => Promise<void>",
          "references": {
            "PaymentRequestPaymentMethodEventHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\n element.setPaymentMethodEventHandler(async (event, stripe) => {\n// Confirm the PaymentIntent with the payment method returned from the payment request.\n  const {error} = await stripe.confirmCardPayment(\n    paymentIntent.client_secret,\n    {\n     payment_method: event.paymentMethod.id,\n     shipping: {\n       name: event.shippingAddress.recipient,\n       phone: event.shippingAddress.phone,\n       address: {\n         line1: event.shippingAddress.addressLine[0],\n         city: event.shippingAddress.city,\n         postal_code: event.shippingAddress.postalCode,\n         state: event.shippingAddress.region,\n         country: event.shippingAddress.country,\n       },\n     },\n   },\n   {handleActions: false}\n );\n```"
            }],
          "text": "Set handler of the `paymentRequest.on('paymentmethod'` event."
        }
      },
      "shippingOptionEventHandler": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "PaymentRequestShippingOptionEventHandler",
          "resolved": "(event: PaymentRequestShippingOptionEvent, stripe: Stripe) => Promise<void>",
          "references": {
            "PaymentRequestShippingOptionEventHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\n element.setPaymentRequestShippingOptionEventHandler(async (event, stripe) => {\n  event.updateWith({status: 'success'});\n })\n```"
            }],
          "text": "Set handler of the `paymentRequest.on('shippingoptionchange')` event"
        }
      },
      "shippingAddressEventHandler": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "PaymentRequestShippingAddressEventHandler",
          "resolved": "(event: PaymentRequestShippingAddressEvent, stripe: Stripe) => Promise<void>",
          "references": {
            "PaymentRequestShippingAddressEventHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\n element.setPaymentRequestShippingAddressEventHandler(async (event, stripe) => {\n  const response = await store.updatePaymentIntentWithShippingCost(\n    paymentIntent.id,\n    store.getLineItems(),\n    event.shippingOption\n  );\n })\n```"
            }],
          "text": "Set handler of the `paymentRequest.on('shippingaddresschange')` event"
        }
      },
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
        "reflect": false,
        "defaultValue": "'@stripe-elements/stripe-elements'"
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
      }
    };
  }
  static get states() {
    return {
      "loadStripeStatus": {},
      "stripe": {},
      "paymentRequestOption": {}
    };
  }
  static get events() {
    return [{
        "method": "stripeLoaded",
        "name": "stripeLoaded",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\nstripeElement\n .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {\n  stripe\n    .createSource({\n      type: 'ideal',\n      amount: 1099,\n      currency: 'eur',\n      owner: {\n        name: 'Jenny Rosen',\n      },\n      redirect: {\n        return_url: 'https://shop.example.com/crtA6B28E1',\n      },\n    })\n    .then(function(result) {\n      // Handle result.error or result.source\n    });\n  });\n```"
            }],
          "text": "Stripe Client loaded event"
        },
        "complexType": {
          "original": "StripeLoadedEvent",
          "resolved": "{ stripe: Stripe; }",
          "references": {
            "StripeLoadedEvent": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        }
      }];
  }
  static get methods() {
    return {
      "isAvailable": {
        "complexType": {
          "signature": "(type: 'applePay' | 'googlePay') => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "PaymentRequestWallet": {
              "location": "import",
              "path": "@stripe/stripe-js/types/stripe-js/payment-request"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Check isAvailable ApplePay or GooglePay.\nIf you run this method, you should run before initStripe.",
          "tags": []
        }
      },
      "setPaymentMethodEventHandler": {
        "complexType": {
          "signature": "(handler: PaymentRequestPaymentMethodEventHandler) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "PaymentRequestPaymentMethodEventHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Register event handler for `paymentRequest.on('paymentmethod'` event.",
          "tags": []
        }
      },
      "setPaymentRequestShippingOptionEventHandler": {
        "complexType": {
          "signature": "(handler: PaymentRequestShippingOptionEventHandler) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "PaymentRequestShippingOptionEventHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Register event handler for `paymentRequest.on('shippingoptionchange'` event.",
          "tags": []
        }
      },
      "setPaymentRequestShippingAddressEventHandler": {
        "complexType": {
          "signature": "(handler: PaymentRequestShippingAddressEventHandler) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "PaymentRequestShippingAddressEventHandler": {
              "location": "import",
              "path": "../../interfaces"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Register event handler for `paymentRequest.on('shippingaddresschange'` event.",
          "tags": []
        }
      },
      "setPaymentRequestOption": {
        "complexType": {
          "signature": "(option: PaymentRequestOptions) => Promise<this>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "option"
                }],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "PaymentRequestOptions": {
              "location": "import",
              "path": "@stripe/stripe-js"
            }
          },
          "return": "Promise<this>"
        },
        "docs": {
          "text": "",
          "tags": [{
              "name": "param",
              "text": "option"
            }, {
              "name": "private",
              "text": undefined
            }]
        }
      },
      "initStripe": {
        "complexType": {
          "signature": "(publishableKey: string, options?: { showButton?: boolean; stripeAccount?: string; }) => Promise<void>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "publishableKey"
                }],
              "text": ""
            }, {
              "tags": [{
                  "name": "param",
                  "text": "options"
                }],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Get Stripe.js, and initialize elements",
          "tags": [{
              "name": "param",
              "text": "publishableKey"
            }, {
              "name": "param",
              "text": "options"
            }]
        }
      }
    };
  }
  static get elementRef() { return "el"; }
}
