// react:
import {
    default as React,
    useRef,
    useCallback,
    useEffect,
    useState,
    useReducer,
}                           from 'react'         // base technology of our nodestrap components

// cssfn:
import type {
    PropEx,
}                           from '@cssfn/css-types'   // ts defs support for cssfn
import {
    // compositions:
    mainComposition,
    
    
    
    // styles:
    style,
    vars,
    imports,
    
    
    
    // rules:
    rule,
    states,
}                           from '@cssfn/cssfn'       // cssfn core
import {
    // hooks:
    createUseSheet,
}                           from '@cssfn/react-cssfn' // cssfn for react
import {
    createCssConfig,
    
    
    
    // utilities:
    usesGeneralProps,
    usesSuffixedProps,
    overwriteProps,
}                           from '@cssfn/css-config'  // Stores & retrieves configuration using *css custom properties* (css variables)

// nodestrap utilities:
import {
    useIsomorphicLayoutEffect,
}                           from '@nodestrap/hooks'
import {
    // utilities:
    setRef,
}                           from '@nodestrap/utilities'

// others libs:
import type {
    // general types:
    Placement  as PopupPlacement,
    Middleware as PopupMiddleware,
    Strategy   as PopupStrategy,
    
    ComputePositionReturn,
}                           from '@floating-ui/dom'

// nodestrap components:
import {
    // hooks:
    usesSizeVariant,
}                           from '@nodestrap/basic'
import {
    // hooks:
    usesEnableDisableState,
    
    isActived,
    isActivating,
    isPassivating,
    isPassived,
    usesActivePassiveState as indicatorUsesActivePassiveState,
    useActivePassiveState,
    
    
    
    // styles:
    usesIndicatorLayout,
    usesIndicatorVariants,
    
    
    
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@nodestrap/indicator'



// hooks:

// states:

//#region activePassive
/**
 * Uses active & passive states.
 * @returns A `[Factory<Rule>, ReadonlyRefs, ReadonlyDecls]` represents active & passive state definitions.
 */
export const usesActivePassiveState = () => {
    // dependencies:
    const [activePassive, activePassiveRefs, activePassiveDecls, ...restActivePassive] = indicatorUsesActivePassiveState();
    
    
    
    return [
        () => style({
            ...imports([
                activePassive(),
            ]),
            ...states([
                isActived({
                    ...vars({
                        [activePassiveDecls.filter] : cssProps.filterActive,
                    }),
                }),
                isActivating({
                    ...vars({
                        [activePassiveDecls.filter] : cssProps.filterActive,
                        [activePassiveDecls.anim  ] : cssProps.animActive,
                    }),
                }),
                isPassivating({
                    ...vars({
                        [activePassiveDecls.filter] : cssProps.filterActive,
                        [activePassiveDecls.anim  ] : cssProps.animPassive,
                    }),
                }),
            ]),
        }),
        activePassiveRefs,
        activePassiveDecls,
        ...restActivePassive,
    ] as const;
};
//#endregion activePassive



// styles:
export const usesPopupLayout = () => {
    return style({
        ...imports([
            // layouts:
            usesIndicatorLayout(),
        ]),
        ...style({
            // layouts:
            display: 'block',
            
            
            // positions:
            ...rule('.overlay', {
                zIndex: 1080,
            }),
            
            
            
            // customize:
            ...usesGeneralProps(cssProps), // apply general cssProps
        }),
    });
};
export const usesPopupVariants = () => {
    // dependencies:
    
    // layouts:
    const [sizes] = usesSizeVariant((sizeName) => style({
        // overwrites propName = propName{SizeName}:
        ...overwriteProps(cssDecls, usesSuffixedProps(cssProps, sizeName)),
    }));
    
    
    
    return style({
        ...imports([
            // variants:
            usesIndicatorVariants(),
            
            // layouts:
            sizes(),
        ]),
    });
};
export const usesPopupStates = () => {
    // dependencies:
    
    // states:
    const [enableDisable] = usesEnableDisableState();
    const [activePassive] = usesActivePassiveState();
    
    
    
    return style({
        ...imports([
            // states:
            enableDisable(),
            activePassive(),
        ]),
        ...states([
            isPassived({
                // appearances:
                display: 'none', // hide the popup
            }),
        ]),
    });
};

export const usePopupSheet = createUseSheet(() => [
    mainComposition(
        imports([
            // layouts:
            usesPopupLayout(),
            
            // variants:
            usesPopupVariants(),
            
            // states:
            usesPopupStates(),
        ]),
    ),
], /*sheetId :*/'usjjnl1scl'); // an unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// configs:
export const [cssProps, cssDecls, cssVals, cssConfig] = createCssConfig(() => {
    //#region keyframes
    const keyframesActive    : PropEx.Keyframes = {
        from  : {
            opacity   : 0,
            transform : 'scale(0)',
        },
        '70%' : {
            transform : 'scale(1.02)',
        },
        to    : {
            opacity   : 1,
            transform : 'scale(1)',
        },
    };
    const keyframesPassive   : PropEx.Keyframes = {
        from  : keyframesActive.to,
        '30%' : keyframesActive['70%'],
        to    : keyframesActive.from,
    };
    //#endregion keyframes
    
    
    
    return {
        //#region animations
        filterActive         : 'initial',
        
        '@keyframes active'  : keyframesActive,
        '@keyframes passive' : keyframesPassive,
        animActive           : [['300ms', 'ease-out', 'both', keyframesActive ]],
        animPassive          : [['500ms', 'ease-out', 'both', keyframesPassive]],
        //#endregion animations
    };
}, { prefix: 'pop' });



// utilities:
class FloatingInstance {
    private cleanup   : () => void;
    private destroyed : boolean;
    
    
    
    constructor(cleanup: () => void) {
        this.cleanup   = cleanup;
        this.destroyed = false; // mark as un-destroyed
    }

    
    
    public destroy() {
        if (this.destroyed) return; // already destroyed => nothing to do
        this.cleanup();             // performing destruction
        this.destroyed = true;      // mark as destroyed
    }
    public get isExists(): boolean {
        return !this.destroyed;
    }
}
const isFloatingExists = (floatingInstance: FloatingInstance|null): floatingInstance is FloatingInstance => !!floatingInstance && floatingInstance.isExists;

interface Coordinate {
    x         : number
    y         : number
    placement : PopupPlacement}
const coordinateReducer = (coordinate: Coordinate|null, newCoordinate: Coordinate|null): Coordinate|null => {
    if (
        (newCoordinate === coordinate)
        ||
        (
            !!newCoordinate
            &&
            !!coordinate
            &&
            (newCoordinate.x === coordinate.x)
            &&
            (newCoordinate.y === coordinate.y)
            &&
            (newCoordinate.placement === coordinate.placement)
        )
    ) return coordinate;
    
    return newCoordinate;
};



// react components:

export interface PopupProps<TElement extends HTMLElement = HTMLElement>
    extends
        IndicatorProps<TElement>
{
    // popups:
    targetRef?       : React.RefObject<HTMLElement>|HTMLElement|null // getter ref
    popupPlacement?  : PopupPlacement
    popupMiddleware? : PopupMiddleware[] | ((defaultMiddleware: PopupMiddleware[]) => Promise<PopupMiddleware[]>)
    popupStrategy?   : PopupStrategy
    
    popupAutoFlip?   : boolean
    popupAutoShift?  : boolean
    popupOffset?     : number
    popupShift?      : number
    
    onPopupUpdate?   : (computedPosition: ComputePositionReturn) => Promise<void>
    
    
    // performances:
    lazy?            : boolean
}
export function Popup<TElement extends HTMLElement = HTMLElement>(props: PopupProps<TElement>) {
    // styles:
    const sheet              = usePopupSheet();
    
    
    
    // states:
    const activePassiveState = useActivePassiveState(props);
    const isVisible          = activePassiveState.active || (!!activePassiveState.class); // visible = showing, shown, hidding ; !visible = hidden
    
    const [popupPos, setPopupPos] = useReducer(coordinateReducer, null);
    
    
    
    // rest props:
    const {
        // popups:
        targetRef,
        popupPlacement = 'top',
        popupMiddleware,
        popupStrategy  = 'absolute',
        
        popupAutoFlip  = false,
        popupAutoShift = false,
        popupOffset    = 0,
        popupShift     = 0,
        
        onPopupUpdate,
        
        
        // performances:
        lazy = false,
        
        
        // children:
        children,
    ...restProps} = props;
    
    
    
    // callbacks:
    const handlePopupUpdate = useCallback(async (computedPosition: ComputePositionReturn) => {
        onPopupUpdate?.(computedPosition);
        
        
        
        setPopupPos({
            x         : computedPosition.x,
            y         : computedPosition.y,
            placement : computedPosition.placement,
        });
    }, [onPopupUpdate]);
    
    
    
    // dom effects:
    const popupRef                                = useRef<TElement|null>(null);
    const [floatingInstance, setFloatingInstance] = useState<FloatingInstance|null>(null); // useState() instead of useRef(), so it triggers re-render after floating-ui is assigned
    const floatingRace                            = useRef<boolean>(false);
    const createFloatingCb = useCallback(() => {
        if (!isVisible)  return; // <Popup> is fully hidden => no need to update
        
        
        
        // create a new floating-ui if not already assigned
        if (!isFloatingExists(floatingInstance)) {
            const target = (targetRef instanceof HTMLElement) ? targetRef : targetRef?.current;
            const popup  = popupRef.current;
            if (!target) return; // target was not specified => nothing to do
            if (!popup)  return; // popup was unloaded       => nothing to do
            
            
            
            if (floatingRace.current) return; // prevents a race condition of useIsomorphicLayoutEffect() & useEffect()
            floatingRace.current = true;
            
            
            
            // loading floating-ui:
            (async () => {
                const { computePosition, flip, shift, offset, autoUpdate } = await import(/* webpackChunkName: 'floating-ui' */ '@floating-ui/dom');
                
                
                
                // the updater:
                const handleUpdate = async () => {
                    const computedPosition = await computePosition(target, popup, {
                        strategy   : popupStrategy,
                        placement  : popupPlacement,
                        middleware : await (async () => {
                            const defaultMiddleware: PopupMiddleware[] = [
                                ...((popupOffset || popupShift) ? [offset({ // requires to be placed at the first order
                                    mainAxis  : popupOffset,
                                    crossAxis : popupShift,
                                })] : []),
                                
                                ...(popupAutoFlip  ? [flip() ] : []),
                                ...(popupAutoShift ? [shift()] : []),
                            ];
                            return popupMiddleware ? (Array.isArray(popupMiddleware) ? popupMiddleware : (await popupMiddleware(defaultMiddleware))) : defaultMiddleware;
                        })(),
                    });
                    
                    
                    
                    handlePopupUpdate(computedPosition);
                };
                
                
                
                // the first update:
                await handleUpdate();
                
                
                
                // the live updater:
                const cleanup = autoUpdate(target, popup, handleUpdate);
                
                
                
                // now the floating-ui is loaded & fully functioning => then trigger to re-render the <Popup active={true}>:
                setFloatingInstance(new FloatingInstance(cleanup));
            })();
        } // if
        
        
        
        // cleanups:
        return () => {
            // destroy the floating-ui if was assigned
            if (isFloatingExists(floatingInstance)) {
                if (!floatingRace.current) return; // prevents a race condition of useIsomorphicLayoutEffect() & useEffect()
                floatingRace.current = false;
                
                
                
                floatingInstance.destroy(); // kill the live updater
            } // if
        };
    }, [
        // conditions:
        isVisible,
        floatingInstance,
        
        
        // popups:
        targetRef,
        popupPlacement,
        popupMiddleware,
        popupStrategy,
        
        popupAutoFlip,
        popupAutoShift,
        popupOffset,
        popupShift,
        
        handlePopupUpdate,
    ]); // (re)create the function on every time the popup's properties changes
    
    // (re)run the function on every time the function's reference changes:
    // a race of useLayoutEffect() & useEffect()
    // the first race  => if `targetRef` is already set => win
    // the second race => it should win if `targetRef` is configured
    useIsomorphicLayoutEffect(createFloatingCb, [createFloatingCb]); // the first  chance (best  , not flickering): in case of `targetRef` is not <Popup>'s parent
    useEffect(                createFloatingCb, [createFloatingCb]); // the second chance (better,  do flickering): in case of `targetRef` is <Popup>'s parent
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...restProps}
            
            
            // essentials:
            elmRef={(elm) => {
                setRef(props.elmRef, elm);
                
                setRef(popupRef, elm);
            }}
            
            
            // accessibilities:
            active={
                props.active
                &&
                (
                    !targetRef                         // no `targetRef` specified => no need for floating-ui
                    ||
                    !!floatingInstance                 // wait until floating-ui is ready or ever ready (do not show if floating-ui is not ready, the appearance might look ugly)
                 // isFloatingExists(floatingInstance) // wait until floating-ui is ready (do not show if floating-ui is not ready, the appearance might look ugly)
                )
            }
            
            
            // classes:
            mainClass={props.mainClass ?? sheet.main}
            classes={[...(props.classes ?? []),
                ((targetRef && popupPos) && popupPos.placement) || null,
                (targetRef && 'overlay') || null,
            ]}
            style={{
                position : (targetRef && popupStrategy) || undefined,
                left     : (targetRef && popupPos) ? `${popupPos.x}px` : undefined,
                top      : (targetRef && popupPos) ? `${popupPos.y}px` : undefined,
                
                ...(props.style ?? {}),
            }}
            
            
            // events:
            onAnimationEnd={(e) => {
                props.onAnimationEnd?.(e);
                
                
                
                // states:
                activePassiveState.handleAnimationEnd(e);
            }}
        >
            { (!lazy || isVisible) && children }
        </Indicator>
    );
}
export { Popup as default }

export type { PopupPlacement, PopupMiddleware, PopupStrategy }
