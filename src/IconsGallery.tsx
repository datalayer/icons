import React, { useRef, useCallback } from "react";
import ReactDOMServer from 'react-dom/server';
import { ThemeProvider, BaseStyles, IconButton, Pagehead, Heading, Text, Box, Link } from "@primer/react";
import { toPng } from 'html-to-image'
import styled from "styled-components";
import allIcons from "./index";

import "./IconsGallery.css";

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

const IconLine = (props: { name: string }) => {
  const { name } = props;
  const refSvg = useRef<any>(null);
  const refPngDayColoredStyled = useRef<any>(null);
  const refPngNightColredStyled = useRef<any>(null);
  const refPngDayStyled = useRef<any>(null);
  const refPngNightStyled = useRef<any>(null);
  const downloadPNG = useCallback((e: React.MouseEvent<HTMLElement>, ref: React.MutableRefObject<any>, type: string) => {
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
  }, [refPngDayColoredStyled, refPngNightColredStyled]);
  const downloadSVG = useCallback((e: React.MouseEvent<HTMLElement>, ref: React.MutableRefObject<any>) => {
    e.preventDefault();
    const link = document.createElement('a')
    link.download = `${name}.svg`
    const svg = ref.current.children[0].children[0];
    link.href = `data:image/svg+xml;utf8,${ReactDOMServer.renderToStaticMarkup(svg)}`;
    link.click()
  }, [refSvg]);
  // @ts-expect-error ts-migrate(7053)
  const IconComponent = allIcons[name];
  const StyledIcon = () => <IconComponent className="inline-block select-none align-text-bottom overflow-visible" />;
  const ColoredStyledIcon = () => <IconComponent colored className="inline-block select-none align-text-bottom overflow-visible" />;
  const icon = <Box alignItems="center" justifyContent="space-between">
    <BorderStyle>
      <SpanStyle>
        <span>
          <IconComponent colored size="large" className="inline-block select-none align-text-bottom overflow-visible" ref={refSvg} onClick={(e: React.MouseEvent<HTMLElement>) => downloadSVG(e, refSvg)}/>
        </span>
      </SpanStyle>
    </BorderStyle>
    <BorderStyle>
      <SpanStyle>
        <span>
          <IconComponent size="large" className="inline-block select-none align-text-bottom overflow-visible" />
        </span>
      </SpanStyle>
    </BorderStyle>
    <ThemeProvider colorMode="day">
      <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={ColoredStyledIcon} ref={refPngDayColoredStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refPngDayColoredStyled, "day_colored")}/>
    </ThemeProvider>
    <ThemeProvider colorMode="night">
      <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={ColoredStyledIcon} ref={refPngNightColredStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refPngNightColredStyled, "night_colored")}/>
    </ThemeProvider>
    <ThemeProvider colorMode="day">
      <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={StyledIcon} ref={refPngDayStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refPngDayStyled, "day")}/>
    </ThemeProvider>
    <ThemeProvider colorMode="night">
      <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={StyledIcon} ref={refPngNightStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refPngNightStyled, "night")}/>
    </ThemeProvider>
    <BorderStyle>
      <SpanStyle>
        <span>
          {ColoredStyledIcon()}
        </span>
      </SpanStyle>
      <SpanStyle>
        <span>
          {StyledIcon()}
        </span>
      </SpanStyle>
    </BorderStyle>
    <SpanStyle>
      <span>
        {name}
      </span>
    </SpanStyle>
    <Box m={3}></Box>
  </Box>
  return icon;
}

const IconsList = () => {
  const names = Object.keys(allIcons);
  const icons = []
  for (const name of names) {
    const icon = <IconLine name={name} key={name}/>
    icons.push(icon)
  }
  return (
    <>
      {icons}
    </>
  )
}

const IconsGallery = () => {
  return (
    <ThemeProvider dayScheme="light" nightScheme="dark_dimmed">
      <BaseStyles>
        <Pagehead>
          <Heading>
            Ξ 🎉 Datalayer Icons Gallery
          </Heading>
        </Pagehead>
        <Box mt={3} mb={3}>
          <Text>Sources available under MIT license in the <Link href="https://github.com/datalayer/icons" target="_blank">GitHub datalayer/icons repository</Link>.</Text>
        </Box>
        <Box mb={3}>
          <Text>Click on a button to download an icon in SVG or PNG format ({Object.keys(allIcons).length} icons available).</Text>
        </Box>
        <IconsList/>
      </BaseStyles>
    </ThemeProvider>
  )
}

export default IconsGallery;
