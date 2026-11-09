// React 19 types no longer declare a global `JSX` namespace; this app still
// annotates components with `JSX.Element`, so alias it to `React.JSX`.
import type { JSX as ReactJSX } from 'react'

declare global {
  namespace JSX {
    type Element = ReactJSX.Element
    type ElementClass = ReactJSX.ElementClass
    type IntrinsicElements = ReactJSX.IntrinsicElements
  }
}

export {}
