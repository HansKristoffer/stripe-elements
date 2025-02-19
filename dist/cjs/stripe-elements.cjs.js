'use strict';

const index = require('./index-05abf79d.js');

/*
 Stencil Client Patch Browser v2.18.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('stripe-elements.cjs.js', document.baseURI).href));
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["ion-icon.cjs",[[1,"ion-icon",{"mode":[1025],"color":[1],"ios":[1],"md":[1],"flipRtl":[4,"flip-rtl"],"name":[513],"src":[1],"icon":[8],"size":[1],"lazy":[4],"sanitize":[4],"svgContent":[32],"isVisible":[32],"ariaLabel":[32]}]]],["stripe-payment-request-button.cjs",[[4,"stripe-payment-request-button",{"paymentMethodEventHandler":[16],"shippingOptionEventHandler":[16],"shippingAddressEventHandler":[16],"publishableKey":[1,"publishable-key"],"stripeAccount":[1,"stripe-account"],"applicationName":[1,"application-name"],"stripeDidLoaded":[1040],"loadStripeStatus":[32],"stripe":[32],"paymentRequestOption":[32],"isAvailable":[64],"setPaymentMethodEventHandler":[64],"setPaymentRequestShippingOptionEventHandler":[64],"setPaymentRequestShippingAddressEventHandler":[64],"setPaymentRequestOption":[64],"initStripe":[64]}]]],["stripe-payment_2.cjs",[[0,"stripe-payment",{"intentType":[1,"intent-type"],"zip":[4],"sheetTitle":[1,"sheet-title"],"buttonLabel":[1,"button-label"],"publishableKey":[1,"publishable-key"],"stripeAccount":[1,"stripe-account"],"applicationName":[1,"application-name"],"showLabel":[4,"show-label"],"intentClientSecret":[1,"intent-client-secret"],"shouldUseDefaultFormSubmitAction":[4,"should-use-default-form-submit-action"],"showPaymentRequestButton":[4,"show-payment-request-button"],"handleSubmit":[1040],"stripeDidLoaded":[1040],"loadStripeStatus":[32],"stripe":[32],"progress":[32],"errorMessage":[32],"zipCode":[32],"paymentRequestOption":[32],"initStripe":[64],"updateProgress":[64],"setErrorMessage":[64],"setPaymentRequestOption":[64]}],[1,"stripe-sheet",{"showCloseButton":[4,"show-close-button"],"open":[4],"toggleModal":[64],"openModal":[64],"closeModal":[64]}]]],["stripe-payment-sheet.cjs",[[0,"stripe-payment-sheet",{"publishableKey":[1,"publishable-key"],"stripeAccount":[1,"stripe-account"],"applicationName":[1,"application-name"],"showLabel":[4,"show-label"],"sheetTitle":[1,"sheet-title"],"buttonLabel":[1,"button-label"],"intentClientSecret":[1,"intent-client-secret"],"shouldUseDefaultFormSubmitAction":[4,"should-use-default-form-submit-action"],"intentType":[1,"intent-type"],"handleSubmit":[1040],"stripeDidLoaded":[1040],"showCloseButton":[4,"show-close-button"],"zip":[4],"open":[4],"getStripePaymentSheetElement":[64],"present":[64],"updateProgress":[64],"destroy":[64],"setPaymentRequestButton":[64]}]]]], options);
});
