// https://github.com/primer/react/issues/2103

// react-override.d.ts
import 'react'

declare module 'react' {
  /**
   * Temporary override for Primer/react to typecheck properly, since it uses `React.FC` internally
   */

  // eslint-disable-next-line @typescript-eslint/ban-types
  export interface FunctionComponent<P = {}> {
    (props: React.PropsWithChildren<P>, context?: any): ReactElement<any, any> | null
    propTypes?: WeakValidationMap<P> | undefined
    contextTypes?: ValidationMap<any> | undefined
    defaultProps?: Partial<P> | undefined
    displayName?: string | undefined
  }
}
