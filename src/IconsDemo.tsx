import React, { useRef, useCallback } from "react";
import { ThemeProvider, BaseStyles, IconButton, Heading, Text, Box } from "@primer/react";
import { toPng } from 'html-to-image'
import styled from "styled-components";
import Icons from "./index";

import "./IconsDemo.css";

const SpanStyle = styled.span`
  span {
    margin-right: 25px;
  },
`;

const BorderStyle = styled.span`
  svg {
    border-color: black;
    border: 1px dashed;
  }
`;

const IconLine = (props: {name: string}) => {
  const { name } = props;
  const refDay = useRef<any>(null);
  const refNight = useRef<any>(null);
  const downloadPng = useCallback((e: React.MouseEvent<HTMLElement>, ref: React.MutableRefObject<any>, type: string) => {
    e.preventDefault();
    if (ref.current === null) {
      return
    }
    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl: string) => {
        const link = document.createElement('a')
        link.download = `${name}_${type}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }, [refDay, refNight]);
/*
  const downloadJpg = useCallback(() => {
    if (ref.current === null) {
      return
    }
    toJpeg(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${name}.jpg`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref]);
*/
  // @ts-expect-error ts-migrate(7053)
  const IconComponent = Icons[name];
  const icon = <div>
    <ThemeProvider colorMode="day">
      <IconButton size="medium" sx={{marginRight: "15px"}} icon={IconComponent} ref={refDay} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPng(e, refDay, "day")}/>
    </ThemeProvider>
    <ThemeProvider colorMode="night">
      <IconButton size="medium" sx={{marginRight: "15px"}} icon={IconComponent} ref={refNight} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPng(e, refNight, "night")}/>
    </ThemeProvider>
    <SpanStyle>
      <span>
        {name}
      </span>
    </SpanStyle>
    <BorderStyle>
      <SpanStyle>
        <span>
          <IconComponent />
        </span>
      </SpanStyle>
      <SpanStyle>
        <span style={{backgroundColor: "lightgrey"}}>
          <IconComponent light />
        </span>
      </SpanStyle>
      <SpanStyle>
        <span>
          <IconComponent black />
        </span>
      </SpanStyle>
    </BorderStyle>
    <BorderStyle>
      <span>
        <IconComponent size={64} />
      </span>
    </BorderStyle>
  </div>
  return icon;
}

const IconsGallery = () => {
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
    const icon = <IconLine name={name}  key={name}/>
    icons.push(icon)
  }
  return (
    <>
      {icons}
    </>
  )
}

const IconsDemo = () => {
  return (
    <BaseStyles>
      <ThemeProvider dayScheme="light" nightScheme="dark_dimmed">
        <Heading sx={{fontSize: 5, mb: 2}}>Datalayer Icons Gallery</Heading>
        <Box>
          <Text>Sources available under MIT license in the <a href="https://github.com/datalayer/icons" target="_blank">icons repository</a>.</Text>
        </Box>
        <Box mb={3}>
          <Text>Click on a button to download a PNG.</Text>
        </Box>
        <IconsGallery/>
      </ThemeProvider>
    </BaseStyles>
  )
}

export default IconsDemo;
