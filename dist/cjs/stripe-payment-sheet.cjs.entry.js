'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-05abf79d.js');

const stripePaymentSheetModalCss = ":host{display:block}";

const StripePaymentSheet = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.closed = index.createEvent(this, "closed", 7);
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
    return (index.h("stripe-sheet", { open: this.open, showCloseButton: this.showCloseButton }, index.h("stripe-payment", { showLabel: this.showLabel, publishableKey: this.publishableKey, intentClientSecret: this.intentClientSecret, shouldUseDefaultFormSubmitAction: this.shouldUseDefaultFormSubmitAction, handleSubmit: this.handleSubmit, stripeDidLoaded: this.stripeDidLoaded, intentType: this.intentType, zip: this.zip, buttonLabel: this.buttonLabel, sheetTitle: this.sheetTitle, applicationName: this.applicationName })));
  }
  get el() { return index.getElement(this); }
};
StripePaymentSheet.style = stripePaymentSheetModalCss;

exports.stripe_payment_sheet = StripePaymentSheet;
