import * as React from "react";

declare module "react" {
    interface DOMAttributes<T> {
        "data-selenium"?: string;
        "data-drag-anchor"?: boolean;
        "data-has-no-procedures"?: string;
        "data-proforma-field-id"?: string;
        "data-procedure-ref-id"?: number;
        "data-iframe-height"?: string;

        "data-is-poplist-item"?: string;
        "data-is-loading"?: string;
    }

    interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
        'data-epro-link-version'?: string;
        'data-epro-link-type'?: string;
        'data-epro-referral-service-id'?: string;
        'data-epro-referral-service-external-id'?: string;
        'data-epro-external-url'?: string;
        'data-epro-template-id'?: string;
        'data-epro-template-version-id'?: string;
        'data-epro-template-external-id'?: string;
    }

    function createElement<P, C>(
        type: React.ExoticComponent<P>,
        props: React.ClassAttributes<C> & P | null,
        ...children: React.ReactNode[]): React.ReactElement<P>;
}
