import { h } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js';
import { checkPlatform, waitForElm } from '../../utils/utils';
import { i18n } from '../../utils/i18n';
export class StripePayment {
  constructor() {
    /**
     * Status of the Stripe client initilizing process
     */
    this.loadStripeStatus = '';
    /**
     * Default submit handle type.
     * If you want to use `setupIntent`, should update this attribute.
     */
    this.intentType = 'payment';
    /**
     * If true, show zip code field
     */
    this.zip = true;
    /**
     * Payment sheet title
     * By default we recommended to use these string
     * - 'Add your payment information' -> PaymentSheet / PaymentFlow(Android)
     * - 'Add a card' -> PaymentFlow(iOS)
     * These strings will translated automatically by this library.
     */
    this.sheetTitle = 'Add your payment information';
    /**
     * Submit button label
     * By default we recommended to use these string
     * - 'Pay' -> PaymentSheet
     * - 'Add' -> PaymentFlow(Android)
     * - 'Add card' -> PaymentFlow(iOS)
     * - 'Add a card' -> PaymentFlow(iOS)
     * These strings will translated automatically by this library.
     *
     */
    this.buttonLabel = 'Pay';
    /**
     * The progress status of the checkout process
     */
    this.progress = '';
    /**
     * Error message
     */
    this.errorMessage = '';
    /**
     * zip code
     */
    this.zipCode = '';
    /**
     * Overwrite the application name that registered
     * For wrapper library (like Capacitor)
     */
    this.applicationName = '@stripe-elements/stripe-elements';
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
    if (this.publishableKey) {
      this.initStripe(this.publishableKey, {
        stripeAccount: this.stripeAccount,
      });
    }
    else {
      this.loadStripeStatus = 'failure';
    }
  }
  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   * @param options
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *    tripeElement.initStripe('pk_test_XXXXXXXXX')
   *  })
   * ```
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
      this.errorMessage = e.message;
      this.loadStripeStatus = 'failure';
      return;
    })
      .then(() => {
      if (!this.stripe) {
        return;
      }
      return this.initElement();
    })
      .then(() => {
      if (!this.stripe) {
        return;
      }
      this.stripeLoadedEventHandler();
    });
  }
  /**
   * Update the form submit progress
   * @param progress
   * @returns
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *    // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.
   *    stripeElement.setAttribute('should-use-default-form-submit-action', false)
   *    stripeElement.addEventListener('formSubmit', async props => {
   *      const {
   *        detail: { stripe, cardNumber, event },
   *      } = props;
   *      const result = await stripe.createPaymentMethod({
   *        type: 'card',
   *        card: cardNumber,
   *      });
   *      console.log(result);
   *      stripeElement.updateProgress('success')
   *    });
   * })
   */
  async updateProgress(progress) {
    this.progress = progress;
    return this;
  }
  /**
   * Set error message
   * @param errorMessage string
   * @returns
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *    // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.
   *    stripeElement.setAttribute('should-use-default-form-submit-action', false)
   *    stripeElement.addEventListener('formSubmit', async props => {
   *      try {
   *        throw new Error('debug')
   *      } catch (e) {
   *        stripeElement.setErrorMessage(`Error: ${e.message}`)
   *        stripeElement.updateProgress('failure')
   *      }
   *   });
   * })
   */
  async setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
    return this;
  }
  /**
   * @param option
   * @private
   */
  async setPaymentRequestOption(option) {
    this.paymentRequestOption = option;
    this.createPaymentRequestButton();
    return this;
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
  async formSubmitEventHandler() {
    const { cardCVC, cardExpiry, cardNumber, stripe } = this;
    this.formSubmit.emit({
      cardCVCElement: cardCVC,
      cardExpiryElement: cardExpiry,
      cardNumberElement: cardNumber,
      stripe,
    });
  }
  async defaultFormSubmitResultHandler(result) {
    this.defaultFormSubmitResult.emit(result);
  }
  componentWillUpdate() {
    if (!this.publishableKey) {
      return;
    }
    if (['success', 'loading'].includes(this.loadStripeStatus)) {
      return;
    }
    this.initStripe(this.publishableKey, {
      stripeAccount: this.stripeAccount,
    });
    this.createPaymentRequestButton();
  }
  /**
   * Default form submit action (just call a confirmCardPayment).
   * If you don't want use it, please set `should-use-default-form-submit-action="false"`
   * @param event
   * @param param1
   */
  async defaultFormSubmitAction(event, { stripe, cardNumberElement, intentClientSecret }) {
    event.preventDefault();
    try {
      const { intentType } = this;
      const result = await (() => {
        if (intentType === 'payment') {
          return stripe.confirmCardPayment(intentClientSecret, {
            payment_method: {
              card: cardNumberElement,
            },
          });
        }
        return stripe.confirmCardSetup(intentClientSecret, {
          payment_method: {
            card: cardNumberElement,
          },
        });
      })();
      this.defaultFormSubmitResultHandler(result);
    }
    catch (e) {
      this.defaultFormSubmitResultHandler(e);
      throw e;
    }
  }
  /**
   * Initialize Component using Stripe Element
   */
  async initElement() {
    const elements = this.stripe.elements();
    const handleCardError = ({ error }) => {
      if (error) {
        this.errorMessage = error.message;
      }
      else {
        this.errorMessage = '';
      }
    };
    this.cardNumber = elements.create('cardNumber', {
      placeholder: i18n.t('Card Number'),
    });
    const cardNumberElement = await waitForElm(this.el, '#card-number');
    this.cardNumber.mount(cardNumberElement);
    this.cardNumber.on('change', handleCardError);
    this.cardExpiry = elements.create('cardExpiry');
    const cardExpiryElement = await waitForElm(this.el, '#card-expiry');
    this.cardExpiry.mount(cardExpiryElement);
    this.cardExpiry.on('change', handleCardError);
    this.cardCVC = elements.create('cardCvc');
    const cardCVCElement = await waitForElm(this.el, '#card-cvc');
    this.cardCVC.mount(cardCVCElement);
    this.cardCVC.on('change', handleCardError);
    document.getElementById('stripe-card-element').addEventListener('submit', async (e) => {
      const { cardCVC, cardExpiry, cardNumber, stripe, intentClientSecret } = this;
      const submitEventProps = {
        cardCVCElement: cardCVC,
        cardExpiryElement: cardExpiry,
        cardNumberElement: cardNumber,
        stripe,
        intentClientSecret,
        zipCode: this.zipCode,
      };
      this.progress = 'loading';
      try {
        if (this.handleSubmit) {
          await this.handleSubmit(e, submitEventProps);
        }
        else if (this.shouldUseDefaultFormSubmitAction === true && intentClientSecret) {
          await this.defaultFormSubmitAction(e, submitEventProps);
        }
        else {
          e.preventDefault();
        }
        await this.formSubmitEventHandler();
        if (this.handleSubmit || this.shouldUseDefaultFormSubmitAction === true) {
          this.progress = 'success';
        }
      }
      catch (e) {
        this.errorMessage = e.message;
        this.progress = 'failure';
      }
    });
  }
  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }
  disconnectedCallback() {
    if (this.cardNumber) {
      this.cardNumber.unmount();
    }
    if (this.cardExpiry) {
      this.cardExpiry.unmount();
    }
    if (this.cardCVC) {
      this.cardCVC.unmount();
    }
  }
  /**
   * Create payment request button
   * It's just proxy of stripe-payment-request-button
   */
  createPaymentRequestButton() {
    const { showPaymentRequestButton, paymentRequestOption } = this;
    if (!showPaymentRequestButton || !paymentRequestOption) {
      return null;
    }
    if (!document) {
      return null;
    }
    const targetElement = document.getElementById('stripe-payment-request-button');
    const stripePaymentRequestElement = document.createElement('stripe-payment-request-button');
    targetElement.appendChild(stripePaymentRequestElement);
    const { paymentRequestPaymentMethodHandler, paymentRequestShippingOptionChangeHandler, paymentRequestShippingAddressChangeHandler } = paymentRequestOption;
    customElements.whenDefined('stripe-payment-request-button').then(() => {
      stripePaymentRequestElement.setPaymentRequestOption(paymentRequestOption);
      if (paymentRequestPaymentMethodHandler) {
        stripePaymentRequestElement.setPaymentMethodEventHandler(paymentRequestPaymentMethodHandler);
      }
      if (paymentRequestShippingOptionChangeHandler) {
        stripePaymentRequestElement.setPaymentRequestShippingOptionEventHandler(paymentRequestShippingOptionChangeHandler);
      }
      if (paymentRequestShippingAddressChangeHandler) {
        stripePaymentRequestElement.setPaymentRequestShippingAddressEventHandler(paymentRequestShippingAddressChangeHandler);
      }
      return stripePaymentRequestElement.initStripe(this.publishableKey);
    });
  }
  render() {
    const { errorMessage } = this;
    if (this.loadStripeStatus === 'failure') {
      return h("p", null, i18n.t('Failed to load Stripe'));
    }
    const disabled = this.progress === 'loading';
    return (h("div", { class: "stripe-payment-sheet-wrap" }, h("form", { id: "stripe-card-element" }, h("div", { class: "stripe-heading" }, i18n.t(this.sheetTitle)), h("div", { id: "stripe-payment-request-button" }), h("div", null, h("div", { class: "stripe-section-title" }, i18n.t('Card information'))), h("div", { class: "payment-info card visible" }, h("fieldset", { class: "stripe-input-box" }, h("div", null, h("label", null, this.showLabel ? h("lenged", null, i18n.t('Card Number')) : null, h("div", { id: "card-number" }))), h("div", { class: "stripe-input-column", style: { display: 'flex' } }, h("label", { style: { width: '50%' } }, this.showLabel ? h("lenged", null, i18n.t('MM / YY')) : null, h("div", { id: "card-expiry" })), h("label", { style: { width: '50%' } }, this.showLabel ? h("lenged", null, i18n.t('CVC')) : null, h("div", { id: "card-cvc" }))), h("div", { id: "card-errors", class: "element-errors" }, errorMessage))), this.zip ? (h("div", { style: { marginTop: '1.5rem' } }, h("div", { class: "stripe-section-title" }, i18n.t('Country or region')))) : null, this.zip ? (h("div", { class: "payment-info card visible" }, h("fieldset", { class: "stripe-input-box" }, h("div", null, h("label", null, this.showLabel ? h("lenged", null, i18n.t('Postal Code')) : null, h("input", { id: "zip", name: "zip", type: "text", inputmode: "numeric", class: "stripe-input-box StripeElement", style: { width: '100%' }, placeholder: i18n.t('Postal Code'), value: this.zipCode, onInput: e => {
        this.zipCode = e.target.value;
      } })))))) : null, h("div", { style: { marginTop: '32px' } }, h("button", { type: "submit", disabled: disabled }, this.progress === 'loading' ? i18n.t('Loading') : i18n.t(this.buttonLabel))))));
  }
  static get is() { return "stripe-payment"; }
  static get originalStyleUrls() {
    return {
      "$": ["stripe-payment-sheet.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["stripe-payment-sheet.css"]
    };
  }
  static get properties() {
    return {
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
          "tags": [],
          "text": "Default submit handle type.\nIf you want to use `setupIntent`, should update this attribute."
        },
        "attribute": "intent-type",
        "reflect": false,
        "defaultValue": "'payment'"
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
        "reflect": false,
        "defaultValue": "'Add your payment information'"
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
        "reflect": false,
        "defaultValue": "'Pay'"
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
      "showPaymentRequestButton": {
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
          "text": "If show PaymentRequest Button, should put true"
        },
        "attribute": "show-payment-request-button",
        "reflect": false
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
      }
    };
  }
  static get states() {
    return {
      "loadStripeStatus": {},
      "stripe": {},
      "progress": {},
      "errorMessage": {},
      "zipCode": {},
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
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n    stripeElement\n     .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {\n      stripe\n        .createSource({\n          type: 'ideal',\n          amount: 1099,\n          currency: 'eur',\n          owner: {\n            name: 'Jenny Rosen',\n          },\n          redirect: {\n            return_url: 'https://shop.example.com/crtA6B28E1',\n          },\n        })\n        .then(function(result) {\n          // Handle result.error or result.source\n        });\n      });\n  })\n```"
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
      }, {
        "method": "formSubmit",
        "name": "formSubmit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n    stripeElement\n      .addEventListener('formSubmit', async props => {\n        const {\n          detail: { stripe, cardNumber, event },\n        } = props;\n        const result = await stripe.createPaymentMethod({\n          type: 'card',\n          card: cardNumber,\n        });\n        console.log(result);\n      })\n  })"
            }],
          "text": "Form submit event"
        },
        "complexType": {
          "original": "FormSubmitEvent",
          "resolved": "{ stripe: Stripe; cardNumberElement: StripeCardNumberElement; cardExpiryElement: StripeCardExpiryElement; cardCVCElement: StripeCardCvcElement; intentClientSecret?: string; zipCode?: string; }",
          "references": {
            "FormSubmitEvent": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        }
      }, {
        "method": "defaultFormSubmitResult",
        "name": "defaultFormSubmitResult",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "example",
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n    stripeElement.addEventListener('defaultFormSubmitResult', async ({detail}) => {\n      if (detail instanceof Error) {\n        console.error(detail)\n      } else {\n        console.log(detail)\n      }\n    })\n  })"
            }],
          "text": "Recieve the result of defaultFormSubmit event"
        },
        "complexType": {
          "original": "DefaultFormSubmitResult",
          "resolved": "Error | { paymentIntent: PaymentIntent; error?: undefined; } | { paymentIntent?: undefined; error: StripeError; } | { setupIntent: SetupIntent; error?: undefined; } | { setupIntent?: undefined; error: StripeError; }",
          "references": {
            "DefaultFormSubmitResult": {
              "location": "import",
              "path": "../../interfaces"
            }
          }
        }
      }];
  }
  static get methods() {
    return {
      "initStripe": {
        "complexType": {
          "signature": "(publishableKey: string, options?: { stripeAccount?: string; }) => Promise<void>",
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
            }, {
              "name": "example",
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n   tripeElement.initStripe('pk_test_XXXXXXXXX')\n })\n```"
            }]
        }
      },
      "updateProgress": {
        "complexType": {
          "signature": "(progress: ProgressStatus) => Promise<this>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "progress"
                }],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "ProgressStatus": {
              "location": "import",
              "path": "../../interfaces"
            }
          },
          "return": "Promise<this>"
        },
        "docs": {
          "text": "Update the form submit progress",
          "tags": [{
              "name": "param",
              "text": "progress"
            }, {
              "name": "returns",
              "text": undefined
            }, {
              "name": "example",
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n   // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.\n   stripeElement.setAttribute('should-use-default-form-submit-action', false)\n   stripeElement.addEventListener('formSubmit', async props => {\n     const {\n       detail: { stripe, cardNumber, event },\n     } = props;\n     const result = await stripe.createPaymentMethod({\n       type: 'card',\n       card: cardNumber,\n     });\n     console.log(result);\n     stripeElement.updateProgress('success')\n   });\n})"
            }]
        }
      },
      "setErrorMessage": {
        "complexType": {
          "signature": "(errorMessage: string) => Promise<this>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "errorMessage string"
                }],
              "text": "string"
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<this>"
        },
        "docs": {
          "text": "Set error message",
          "tags": [{
              "name": "param",
              "text": "errorMessage string"
            }, {
              "name": "returns",
              "text": undefined
            }, {
              "name": "example",
              "text": "```\nconst stripeElement = document.createElement('stripe-card-element');\ncustomElements\n .whenDefined('stripe-card-element')\n .then(() => {\n   // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.\n   stripeElement.setAttribute('should-use-default-form-submit-action', false)\n   stripeElement.addEventListener('formSubmit', async props => {\n     try {\n       throw new Error('debug')\n     } catch (e) {\n       stripeElement.setErrorMessage(`Error: ${e.message}`)\n       stripeElement.updateProgress('failure')\n     }\n  });\n})"
            }]
        }
      },
      "setPaymentRequestOption": {
        "complexType": {
          "signature": "(option: PaymentRequestButtonOption) => Promise<this>",
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
            "PaymentRequestButtonOption": {
              "location": "import",
              "path": "../../interfaces"
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
      }
    };
  }
  static get elementRef() { return "el"; }
}
