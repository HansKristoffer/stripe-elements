/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { FormSubmitEvent, FormSubmitHandler, StripeDidLoadedHandler, StripeLoadedEvent } from "./components/stripe-card-element/stripe-card-element";
export namespace Components {
    interface StripeCardElement {
        "handleSubmit"?: FormSubmitHandler;
        /**
          * Get Stripe.js, and initialize elements
          * @param publishableKey
         */
        "initStripe": (publishableKey: string) => Promise<void>;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey": string;
        "showLabel": boolean;
        "stripeDidLoaded"?: StripeDidLoadedHandler;
    }
    interface StripeElementModal {
        /**
          * Close the modal
         */
        "closeModal": () => Promise<void>;
        /**
          * Modal state. If true, the modal will open
         */
        "open": boolean;
        /**
          * Open the modal
         */
        "openModal": () => Promise<void>;
        "showCloseButton": boolean;
        /**
          * Toggle modal state
         */
        "toggleModal": () => Promise<void>;
    }
}
declare global {
    interface HTMLStripeCardElementElement extends Components.StripeCardElement, HTMLStencilElement {
    }
    var HTMLStripeCardElementElement: {
        prototype: HTMLStripeCardElementElement;
        new (): HTMLStripeCardElementElement;
    };
    interface HTMLStripeElementModalElement extends Components.StripeElementModal, HTMLStencilElement {
    }
    var HTMLStripeElementModalElement: {
        prototype: HTMLStripeElementModalElement;
        new (): HTMLStripeElementModalElement;
    };
    interface HTMLElementTagNameMap {
        "stripe-card-element": HTMLStripeCardElementElement;
        "stripe-element-modal": HTMLStripeElementModalElement;
    }
}
declare namespace LocalJSX {
    interface StripeCardElement {
        "handleSubmit"?: FormSubmitHandler;
        "onFormSubmit"?: (event: CustomEvent<FormSubmitEvent>) => void;
        "onStripeLoaded"?: (event: CustomEvent<StripeLoadedEvent>) => void;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey"?: string;
        "showLabel"?: boolean;
        "stripeDidLoaded"?: StripeDidLoadedHandler;
    }
    interface StripeElementModal {
        /**
          * Modal state. If true, the modal will open
         */
        "open"?: boolean;
        "showCloseButton"?: boolean;
    }
    interface IntrinsicElements {
        "stripe-card-element": StripeCardElement;
        "stripe-element-modal": StripeElementModal;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "stripe-card-element": LocalJSX.StripeCardElement & JSXBase.HTMLAttributes<HTMLStripeCardElementElement>;
            "stripe-element-modal": LocalJSX.StripeElementModal & JSXBase.HTMLAttributes<HTMLStripeElementModalElement>;
        }
    }
}
