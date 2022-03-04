import { default as React } from 'react';
import type { PropEx } from '@cssfn/css-types';
import type { Placement as PopupPlacement, Middleware as PopupMiddleware, Strategy as PopupStrategy, ComputePositionReturn } from '@floating-ui/dom';
import { IndicatorProps } from '@nodestrap/indicator';
/**
 * Uses active & passive states.
 * @returns A `[Factory<Rule>, ReadonlyRefs, ReadonlyDecls]` represents active & passive state definitions.
 */
export declare const usesActivePassiveState: () => readonly [() => import("@cssfn/cssfn").Rule, import("@cssfn/css-var").ReadonlyRefs<import("@nodestrap/indicator").ActivePassiveVars>, import("@cssfn/css-var").ReadonlyDecls<import("@nodestrap/indicator").ActivePassiveVars>];
export declare const usesPopupLayout: () => import("@cssfn/cssfn").Rule;
export declare const usesPopupVariants: () => import("@cssfn/cssfn").Rule;
export declare const usesPopupStates: () => import("@cssfn/cssfn").Rule;
export declare const usePopupSheet: import("@cssfn/types").Factory<import("jss").Classes<"main">>;
export declare const cssProps: import("@cssfn/css-config").Refs<{
    filterActive: string;
    '@keyframes active': PropEx.Keyframes;
    '@keyframes passive': PropEx.Keyframes;
    animActive: (string | PropEx.Keyframes)[][];
    animPassive: (string | PropEx.Keyframes)[][];
}>, cssDecls: import("@cssfn/css-config").Decls<{
    filterActive: string;
    '@keyframes active': PropEx.Keyframes;
    '@keyframes passive': PropEx.Keyframes;
    animActive: (string | PropEx.Keyframes)[][];
    animPassive: (string | PropEx.Keyframes)[][];
}>, cssVals: import("@cssfn/css-config").Vals<{
    filterActive: string;
    '@keyframes active': PropEx.Keyframes;
    '@keyframes passive': PropEx.Keyframes;
    animActive: (string | PropEx.Keyframes)[][];
    animPassive: (string | PropEx.Keyframes)[][];
}>, cssConfig: import("@cssfn/css-config").CssConfigSettings;
export interface PopupProps<TElement extends HTMLElement = HTMLElement> extends IndicatorProps<TElement> {
    targetRef?: React.RefObject<HTMLElement> | HTMLElement | null;
    popupPlacement?: PopupPlacement;
    popupMiddleware?: PopupMiddleware[] | ((defaultMiddleware: PopupMiddleware[]) => Promise<PopupMiddleware[]>);
    popupStrategy?: PopupStrategy;
    popupAutoFlip?: boolean;
    popupAutoShift?: boolean;
    popupOffset?: number;
    popupShift?: number;
    onPopupUpdate?: (computedPosition: ComputePositionReturn) => Promise<void>;
    lazy?: boolean;
}
export declare function Popup<TElement extends HTMLElement = HTMLElement>(props: PopupProps<TElement>): JSX.Element;
export { Popup as default };
export type { PopupPlacement, PopupMiddleware, PopupStrategy };
