import { ThemeProvider, BaseStyles, IconButton } from "@primer/react";
import { OrganizationIcon } from "@primer/octicons-react";
import styled from "styled-components";
import Icons from "./index";

import "./IconsDemo.css";

const SvgStyle = styled.div`
  span {
    margin-right: 15px;
    border: 1px dashed;
    border-color: yellow;
  },
  svg {
    border: 1px dashed;
    border-color: black;
  }
`;

function IconsGallery() {
  const names = Object.keys(Icons);
  names.map(name => {
      if (name === "default" || name === "Icon") return null;
      // @ts-expect-error ts-migrate(7053)
      const Component = Icons[name];
      return <Component key={name} size={64} />;
  });
  const icons = []
  for (const name of names) {
    if (name === "default") {
      continue;
    }
    // @ts-expect-error ts-migrate(7053)
    const IconComponent = Icons[name];
    const icon = <div key={name}>
      <span>
        {name}
      </span>
      <span>
        <IconComponent />
      </span>
      <span>
        <IconComponent size={64} />
      </span>
      <span>
        <IconComponent black />
      </span>
      <span style={{backgroundColor: "lightgrey"}}>
        <IconComponent light />
      </span>
      <span>
        <ThemeProvider colorMode="day">
          <IconButton size="medium" icon={IconComponent} />
        </ThemeProvider>
      </span>
      <span>
        <ThemeProvider colorMode="night">
          <IconButton size="medium" icon={IconComponent} />
        </ThemeProvider>
      </span>
      <hr/>
    </div>
    icons.push(icon)
  }
  return (
    <>
      {icons}
    </>
  )
}

const OcticonsGallery = () => {
  return <>
    <ThemeProvider colorMode="day">
      <IconButton size="medium" icon={OrganizationIcon} />
    </ThemeProvider>
    <ThemeProvider colorMode="night">
      <IconButton size="medium" icon={OrganizationIcon} />
    </ThemeProvider>
  </>
}

const IconsDemo = () => {
  return (
    <BaseStyles>
      <ThemeProvider dayScheme="light" nightScheme="dark_dimmed">
        <SvgStyle>
          <IconsGallery/>
        </SvgStyle>
        <OcticonsGallery/>
      </ThemeProvider>
    </BaseStyles>
  )
}

export default IconsDemo;
