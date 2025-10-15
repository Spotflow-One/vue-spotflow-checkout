import type { SpotflowPaymentOptions } from '../types';
declare global {
    interface Window {
        SpotflowCheckout: any;
    }
}
export declare function useSpotflowPayment(): (options: SpotflowPaymentOptions) => Promise<void>;
