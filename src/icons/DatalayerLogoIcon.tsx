import React from "react";
import Icon, { IconProps } from "../Icon";

const DatalayerLogoIcon = (
  props: IconProps
): React.ReactElement<React.ComponentProps<any>, any> => {
  return (
    <Icon {...props} viewBox="0 0 16 16">
      <rect
        width="16"
        height="3.2"
        x="0"
        y="0"
        />
      <rect
        width="16"
        height="3.2"
        x="0"
        y="6.4"
        />
      <rect
        width="16"
        height="3.2"
        x="0"
        y="12.8"
        />
    </Icon>
  );
}

export default DatalayerLogoIcon;
