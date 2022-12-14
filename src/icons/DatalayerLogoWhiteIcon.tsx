import React from "react";
import Icon, { IconProps } from "../Icon";

const DatalayerLogoWhiteIcon = (
  props: IconProps
): React.ReactElement<React.ComponentProps<any>, any> => {
  return (
    <Icon {...props} viewBox="0 0 16 16">
      <rect
        width="16"
        height="3.2"
        x="0"
        y="0"
        style={{ fill: "#FFFFFF" }}
        />
      <rect
        width="16"
        height="3.2"
        x="0"
        y="6.4"
        style={{ fill: "#FFFFFF" }}
        />
      <rect
        width="16"
        height="3.2"
        x="0"
        y="12.8"
        style={{ fill: "#FFFFFF" }}
        />
    </Icon>
  );
}

export default DatalayerLogoWhiteIcon;
