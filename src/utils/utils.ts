import { getPlatforms } from './platform';

export const checkPlatform = () => {
  const device = getPlatforms();

  if (device.includes('ios')) {
    return 'ios';
  }

  if (device.includes('android')) {
    return 'android';
  }
};

export const waitForElm = (el: HTMLStripePaymentElement, selector: string): Promise<HTMLElement> => {
  return new Promise(resolve => {
    if (el.querySelector(selector)) {
      return resolve(el.querySelector(selector) as HTMLElement);
    }

    const observer = new MutationObserver(() => {
      if (el.querySelector(selector)) {
        resolve(el.querySelector(selector) as HTMLElement);
        observer.disconnect();
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true
    });
  });
}
