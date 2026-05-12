import { useState, useEffect, useRef } from 'react';
import {
  ThemeProvider,
  BaseStyles,
  IconButton,
  Text,
  Box,
  Link,
  TextInput,
  Tooltip,
  Flash,
  Heading,
  Button,
} from '@primer/react';
import { SearchIcon } from "@primer/octicons-react";
import {
  ThemedProvider,
  AppearanceControlsWithStore,
  useThemeStore,
  useColorPalette,
  getColorPalette,
} from '@datalayer/primer-addons';
import { toPng, toSvg } from 'html-to-image';
import styled from "styled-components";

import * as dataIcons from "../icons-react";
import * as eggsIcons from "../icons-react/eggs";

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

const IconLine = (props: { name: string, icon: any }) => {
  const { name, icon } = props;
  const palette = useColorPalette();
  const { theme } = useThemeStore();
  const inversePreviewMode: 'day' | 'night' = palette.isLight ? 'night' : 'day';
  const inversePalette = getColorPalette(theme, palette.isLight ? 'dark' : 'light');
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
    toPng(ref.current, { cacheBust: true, width: 1000, height: 1000 })
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
          <IconComponent
            colored
            size="large"
            ref={refColored}
          />
        </span>
      </SpanStyle>
      <BorderStyle>
        <SpanStyle>
          <span>
            <IconComponent
              colored
              size="large"
            />
          </span>
        </SpanStyle>
      </BorderStyle>
      <BorderStyle>
        <SpanStyle>
          <span>
            <IconComponent size="large" />
          </span>
        </SpanStyle>
      </BorderStyle>
      <BorderStyle>
        <Box sx={{ display: 'inline-flex', mr: '25px' }}>
          <ThemeProvider colorMode={inversePreviewMode}>
            <BaseStyles style={{ display: 'inline-flex' }}>
              <Box
                as="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1,
                  borderRadius: 2,
                  bg: 'canvas.default',
                  border: '1px solid',
                  borderColor: inversePalette.primary,
                  '--datalayer-icon-fg': inversePalette.primary,
                }}
              >
                <IconComponent colored size="large" inverseColormode={inversePreviewMode === 'night' ? 'dark' : 'light'} />
              </Box>
            </BaseStyles>
          </ThemeProvider>
        </Box>
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
  const IconComponent = icon;
  const SummaryIcon = () => (
    <IconComponent
      colored
      size="medium"
    />
  );
  return (
    <Box mr={1}>
      <Tooltip aria-label={name} text={name}>
        <IconButton
          aria-label={name}
          icon={SummaryIcon}
          variant="invisible"
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'border.default',
            borderRadius: 2,
          }}
        />
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
          return (
            <IconSummary
              name={name}
              icon={icons[name]}
              key={name}
            />
          );
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
  const palette = useColorPalette();
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
      <ThemedProvider useStore={useThemeStore}>
        <BaseStyles>
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              p: 4,
              '--datalayer-icon-fg': palette.primary,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
              <Box>
                <Heading as="h1" sx={{ m: 0, mb: 2, fontSize: 5 }}>
                  React icons for data products
                </Heading>
                <Text sx={{ color: 'fg.muted' }}>
                  ☰ 🎉 {Object.keys(icons).length} curated icons for data product design.
                </Text>
              </Box>
              <AppearanceControlsWithStore useStore={useThemeStore} />
            </Box>

            <Flash variant="warning" sx={{ mt: 3 }}>
              Some icons may not be 100% compatible with existing design guidelines.
              Please open an issue on{' '}
              <Link href="https://github.com/datalayer/icons/issues" target="_blank">
                github.com/datalayer/icons/issues
              </Link>
              .
            </Flash>

            <Box mt={3} mb={3}>
              <Text as="p" sx={{ m: 0 }}>
                Click on PNG or SVG to download an icon. Filter by name to inspect a single icon. Sources are in the{' '}
                <Link href="https://github.com/datalayer/icons" target="_blank">datalayer/icons repository</Link>.
              </Text>
              <Text as="p" sx={{ mt: 2, mb: 0, color: 'fg.muted' }}>
                Preview columns configuration: (1) themed colored icon, (2) themed colored icon with border, (3) themed plain icon, (4) themed previewed in inverse colormode.
              </Text>
              <Text as="p" sx={{ mt: 1, mb: 0, color: 'fg.muted' }}>
                Open{' '}
                <Link
                  href="https://github.com/datalayer/icons/blob/main/README.md"
                  target="_blank"
                >
                  code example
                </Link>
                {' '}for a concrete usage snippet.
              </Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
              <Box sx={{ flex: '1 1 340px', minWidth: 260 }}>
                <TextInput
                  block
                  value={filter}
                  leadingVisual={SearchIcon}
                  placeholder="Search icons"
                  autoFocus={true}
                  onChange={handleFilterChange}
                  sx={{
                    border: '1px solid',
                    borderColor: 'border.default',
                    borderRadius: 2,
                    backgroundColor: 'canvas.default',
                  }}
                />
              </Box>
              <Button as="a" href="https://github.com/datalayer/icons" target="_blank">
                Check the source
              </Button>
            </Box>

            {(filter === '') ?
              <DetailledIcons names={names} icons={icons} />
            :
              <SummaryIcons names={names} icons={icons} />
            }
          </Box>
        </BaseStyles>
      </ThemedProvider>
    </>
  )
}

export default DatalayerIcons;
