import React, { useState, useEffect, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { useDebounce } from "react-use";
import { CTABanner, Button } from "@primer/react-brand";
import { ThemeProvider, BaseStyles, IconButton, Text, Box, Link, TextInput, Tooltip } from "@primer/react";
import { CloseableFlash } from "@datalayer/primer-addons";
import { SearchIcon, AlertIcon } from "@primer/octicons-react";
import { toPng } from 'html-to-image';
import styled from "styled-components";
import { MinimalFooter } from "./footer/MinimalFooter";
import * as dataIcons from "../react/data";
import * as eggsIcons from "../react/eggs";

import '@primer/react-brand/lib/css/main.css'

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

const IconLine = (props: { name: string, icon: any}) => {
  const { name, icon } = props;
  const refSvg = useRef<any>(null);
  const refPngDayColoredStyled = useRef<any>(null);
  const refPngNightColredStyled = useRef<any>(null);
  const refPngDayStyled = useRef<any>(null);
  const refPngNightStyled = useRef<any>(null);
  const downloadPNG = (e: React.MouseEvent<HTMLElement>, ref: React.MutableRefObject<any>, type: string) => {
    e.preventDefault();
    if (ref.current === null) {
      return
    }
    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = `${name}_${type}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.log(err)
      })
  };
  const downloadSVG = (e: React.MouseEvent<HTMLElement>, ref: React.MutableRefObject<any>) => {
    e.preventDefault();
    const link = document.createElement('a')
    link.download = `${name}.svg`;
    const svg = ref.current.children[0].children[0];
    link.href = `data:image/svg+xml;utf8,${ReactDOMServer.renderToStaticMarkup(svg)}`;
    link.click();
  };
  const IconComponent = icon;
  const StyledIcon = () => <IconComponent />;
  const ColoredStyledIcon = () => <IconComponent colored />;
  const iconLine = (
    <Box alignItems="center" justifyContent="space-between">
      <SpanStyle>
        <span>
          <IconComponent colored size="large" ref={refSvg} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refSvg, "plain")}/>
        </span>
      </SpanStyle>
      <BorderStyle>
        <SpanStyle>
          <span>
            <IconComponent size="large" />
          </span>
        </SpanStyle>
      </BorderStyle>
      <BorderStyle>
        <SpanStyle>
          <span>
            <ThemeProvider colorMode="night">
              {/* TODO use the color from the theme */}
              <IconComponent color="rgb(173, 186, 199)" size="large" />
            </ThemeProvider>
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
  )
  return iconLine;
}

const IconSummary = (props: { name: string, icon: any }) => {
  const { name, icon } = props;
  const refSvg = useRef<any>(null);
  const IconComponent = icon;
  return (
    <Box mr={1}>
      <Tooltip aria-label={name}>
        <IconComponent colored size="large" ref={refSvg} />
      </Tooltip>
    </Box>
  )
}

const SummaryIcons = (props: {names: string[], icons: any}) => {
  const { names, icons } = props;
  return (
    <>
      <Box sx={{display: 'flex'}}>
        {names.map((name) => {
          return <IconSummary name={name} icon={icons[name]} key={name}/>
        })}
      </Box>
    </>
  )
}

const DetailledIcons = (props: {names: string[], icons: any}) => {
  const { names, icons } = props;
  return (
    <>
      {names.map((name) => {
        return <IconLine name={name} icon={icons[name]} key={name}/>
      })}
    </>
  )
}

const DatalayerIcons = () => {
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [icons, setIcons] = useState<any>(dataIcons);
  const [names, setNames] = useState(Object.keys(dataIcons));
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const q = queryParams.get("q");
    q ? setFilter(q) : setFilter('');
    q ? setDebouncedFilter(q) : setDebouncedFilter('');
    const eggs = queryParams.get("eggs");
    if (eggs !== null) {
      setIcons(eggsIcons);
      setNames(Object.keys(eggsIcons));
    }  
  }, []);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
  const [_, __] = useDebounce(
    () => {
      const f = filter.toLocaleLowerCase();
      const filteredNames = Object.keys(icons).filter((name => name.toLowerCase().includes(f)));
      setNames(filteredNames);
      setDebouncedFilter(filter);
    },
    1000,
    [filter]
  );
  return (
    <ThemeProvider dayScheme="light" nightScheme="dark_dimmed">
      <BaseStyles>
        <CloseableFlash leadingIcon={AlertIcon} variant="warning">
          Some of our icons may not be 100% compatible with existing design guidelines.
          Please open an issue on <Link href="https://github.com/datalayer/icons/issues">https://github.com/datalayer/icons/issues</Link> to help with that.
        </CloseableFlash>
        <Box pl={3} pr={3} pt={5}>
          <CTABanner>
            <CTABanner.Heading>React.js icons for Datalayer</CTABanner.Heading>
            <CTABanner.Description>
            Ξ 🎉 {names.length} curated icons for data product design.
            </CTABanner.Description>
            <CTABanner.ButtonGroup>
              <Button as="a" href="https://github.com/datalayer/icons">Check the source</Button>
            </CTABanner.ButtonGroup>
          </CTABanner>
          <Box style={{maxWidth: 1200, margin: 'auto'}}>
            <Box mt={3} mb={3}>
              <Text>Click on a button to download an icon in SVG or PNG format. Sources available in the <Link href="https://github.com/datalayer/icons" target="_blank">datalayer/icons GitHub repository</Link>.</Text>
            </Box>
            <Box mb={3}>
              <TextInput
                block
                value={filter}
                leadingVisual={SearchIcon}
                placeholder="Search icons"
                autoFocus={true}
                onChange={handleFilterChange}
              />
            </Box>
            {(debouncedFilter === '') ?
              <DetailledIcons names={names} icons={icons} />
            :
              <SummaryIcons names={names} icons={icons} />
            }
          </Box>
        </Box>
        <MinimalFooter/>
      </BaseStyles>
    </ThemeProvider>
  )
}

export default DatalayerIcons;
