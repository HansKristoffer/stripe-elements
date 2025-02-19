'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-05abf79d.js');
const stripe_esm = require('./stripe.esm-648239f0.js');

const stripePaymentRequestButtonCss = ":host{display:block}";

const StripePaymentRequestButton = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.stripeLoaded = index.createEvent(this, "stripeLoaded", 7);
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
    const stripe = await stripe_esm.loadStripe(this.publishableKey, {
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
    stripe_esm.loadStripe(publishableKey, {
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
    return (index.h(index.Host, null, index.h("div", { id: "payment-request" }, index.h("div", { id: "payment-request-button" })), index.h("slot", null)));
  }
  get el() { return index.getElement(this); }
};
StripePaymentRequestButton.style = stripePaymentRequestButtonCss;

exports.stripe_payment_request_button = StripePaymentRequestButton;
