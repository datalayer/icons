import React from "react";

const DEFAULT_SIZE = 16;

const DEFAULT_VIEWBOX = "0 0 24 24";

export type IconProps = {
  children?: React.ReactNode;
  outerProps?: React.SVGAttributes<any>;
  width?: number;
  height?: number;
  viewBox?: string;
  className?: string;
  light?: boolean;
  black?: boolean;
  color?: string;
  size?: number;
  onClick?: (ev: React.MouseEvent<SVGElement>) => void;
  theme?: Record<string, any>;
};

const Icon = ({
  children,
  className,
  onClick,
  theme,
  viewBox,
  ...rest
}: React.PropsWithChildren<IconProps>): React.ReactElement<React.ComponentProps<any>, any> => {

  const size = rest.size ? rest.size + "px" : `${DEFAULT_SIZE}px`;

  let fill = "#57606B";
  if (rest.color) fill = rest.color;
  else if (rest.light) fill = "#FFF";
  else if (rest.black) fill = "#000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox ?? DEFAULT_VIEWBOX}
      width={size}
      height={size}
      className={className}
      fill={fill}
      onClick={onClick}
      {...rest.outerProps}
      style={{
//        fill: "currentColor",
//        display: "inline-block",
//        verticalAlign: "text-bottom",
//        ...rest.outerProps?.style
      }}
    >
      {children}
    </svg>
  );

}

export default Icon;
