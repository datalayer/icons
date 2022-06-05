import React from "react";
import Icon, { IconProps } from "../Icon";

const SchoolIcon = (
  props: IconProps
): React.ReactElement<React.ComponentProps<any>, any> => {
  return (
    <Icon {...props} viewBox="2 2 44 44">
      <g fill="none" stroke="#57606B" stroke-width="4"><path stroke-linejoin="round" d="M4 33a2 2 0 0 1 2-2h6v-7l12-8l12 8v7h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4V33Z"></path><path stroke-linecap="round" d="M24 6v10"></path><path stroke-linecap="round" stroke-linejoin="round" d="M36 12V6s-1.5 3-6 0s-6 0-6 0v6s1.5-3 6 0s6 0 6 0Zm-8 32V31h-8v13m-2 0h12"></path></g>
    </Icon>
  );
}

export default SchoolIcon;
