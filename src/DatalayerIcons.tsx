import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "react-use";
import { CTABanner, Button } from "@primer/react-brand";
import { ThemeProvider, BaseStyles, IconButton, Text, Box, Link, TextInput, Tooltip } from "@primer/react";
import { CloseableFlash } from "@datalayer/primer-addons";
import { SearchIcon, AlertIcon } from "@primer/octicons-react";
import { toPng, toSvg } from 'html-to-image';
import styled from "styled-components";
import { MinimalFooter } from "./footer/MinimalFooter";
import * as dataIcons from "../react";
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
  const refColored = useRef<any>(null);
  const refDayColoredStyled = useRef<any>(null);
  const refNightColredStyled = useRef<any>(null);
  const refDayStyled = useRef<any>(null);
  const refNightStyled = useRef<any>(null);
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
    if (ref.current === null) {
      return
    }
    toSvg(ref.current, { cacheBust: true, })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `${name}.svg`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err: Error) => {
      console.log(err)
    })
  };
  const IconComponent = icon;
  const StyledIcon = () => <IconComponent />;
  const ColoredStyledIcon = () => <IconComponent colored />;
  const iconLine = (
    <Box alignItems="center" justifyContent="space-between">
      <SpanStyle>
        <span>
          <IconComponent colored size="large" ref={refColored}/>
        </span>
      </SpanStyle>
      <BorderStyle>
        <SpanStyle>
          <span>
            <IconComponent colored size="large"/>
          </span>
        </SpanStyle>
      </BorderStyle>
      <BorderStyle>
        <SpanStyle>
          <span>
            <IconComponent size="large"/>
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
        <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={ColoredStyledIcon} ref={refDayColoredStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refDayColoredStyled, "day_colored")}/>
      </ThemeProvider>
      <ThemeProvider colorMode="night">
        <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={ColoredStyledIcon} ref={refNightColredStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refNightColredStyled, "night_colored")}/>
      </ThemeProvider>
      <ThemeProvider colorMode="day">
        <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={StyledIcon} ref={refDayStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refDayStyled, "day")}/>
      </ThemeProvider>
      <ThemeProvider colorMode="night">
        <IconButton aria-labelledby="" size="medium" sx={{marginRight: "15px"}} icon={StyledIcon} ref={refNightStyled} onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refNightStyled, "night")}/>
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
        <Link href="" title="Download PNG" onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refColored, "plain")}>
          <span>
            PNG
          </span>
        </Link>
      </SpanStyle>
      <SpanStyle>
        <Link href="" title="Download SVG" onClick={(e: React.MouseEvent<HTMLElement>) => downloadSVG(e, refColored)}>
          <span>
            SVG
          </span>
        </Link>
      </SpanStyle>
      <SpanStyle>
        <span>
          {name}
        </span>
      </SpanStyle>
      <Box m={3}/>
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
//  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [icons, setIcons] = useState<any>(dataIcons);
  const [names, setNames] = useState(Object.keys(dataIcons));
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const q = queryParams.get("q");
    q ? setFilter(q) : setFilter('');
//    q ? setDebouncedFilter(q) : setDebouncedFilter('');
    const eggs = queryParams.get("eggs");
    if (eggs !== null) {
      setIcons(eggsIcons);
      setNames(Object.keys(eggsIcons));
    }  
  }, []);
  const changeUrl = (title: string, url: string) => {
    const obj = {
      Title: title,
      Url: url,
    };
    history.pushState(obj, obj.Title, obj.Url);
  }
  const filterIcons = (filter: string) => {
    if (filter === '') {
      setNames(Object.keys(icons));
      changeUrl(document.title, window.location.protocol + "//" + window.location.host);
    } else {
      const f = filter.toLocaleLowerCase();
      const filteredNames = Object.keys(icons).filter((name => name.toLowerCase().includes(f)));
      setNames(filteredNames);
      changeUrl(document.title, window.location.protocol + "//" + window.location.host + "?q=" + f);
    }
  }
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    filterIcons(event.target.value);
  };
  useEffect(() => {
    if (filter) filterIcons(filter);
  }, [filter]);
  /*
  const [_, __] = useDebounce(
    () => {
      setDebouncedFilter(filter);
      filterIcons();
    },
    0,
    [filter]
  );
  */
  return (
    <>
      <ThemeProvider dayScheme="light" nightScheme="dark_dimmed">
        <BaseStyles>
          <CloseableFlash leadingIcon={AlertIcon} variant="warning">
            Some of our icons may not be 100% compatible with existing design guidelines.
            Please open an issue on <Link href="https://github.com/datalayer/icons/issues">https://github.com/datalayer/icons/issues</Link> to help with that.
          </CloseableFlash>
          <Box mt={3}>
            <CTABanner>
              <CTABanner.Heading style={{margin: 0}}>React.js icons for data products</CTABanner.Heading>
              <CTABanner.Description>
                Ξ 🎉 {Object.keys(icons).length} curated icons for data product design.
              </CTABanner.Description>
              <CTABanner.ButtonGroup>
                <Button as="a" href="https://github.com/datalayer/icons">Check the source</Button>
              </CTABanner.ButtonGroup>
            </CTABanner>
            <Box style={{maxWidth: 1200, margin: 'auto'}}>
              <Box mt={3} mb={3}>
                <Text>Click on "PNG" or "SVG" to download an icon. Some icons are not rendered as they should in the list, type its name in the filter box to select individually and visualize it correctly. The sources are available in the <Link href="https://github.com/datalayer/icons" target="_blank">datalayer/icons GitHub repository</Link>.</Text>
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
              {(filter === '') ?
                <DetailledIcons names={names} icons={icons} />
              :
                <SummaryIcons names={names} icons={icons} />
              }
            </Box>
          </Box>
          <MinimalFooter>
            <MinimalFooter.Link href="https://datalayer.io" target="_blank">
              Datalayer
            </MinimalFooter.Link>
            <MinimalFooter.Link href="https://datalayer.run" target="_blank">
              Run
            </MinimalFooter.Link>
            <MinimalFooter.Link href="https://datalayer.io" target="_blank">
              App
            </MinimalFooter.Link>
            <MinimalFooter.Link href="https://datalayer.tech" target="_blank">
              Tech
            </MinimalFooter.Link>
          </MinimalFooter>
        </BaseStyles>
      </ThemeProvider>
    </>
  )
}

export default DatalayerIcons;
