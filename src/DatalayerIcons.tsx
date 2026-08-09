
import { useState, useEffect, useRef } from 'react';
import {
  ThemeProvider,
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
import { SearchIcon } from '@primer/octicons-react';
import {
  useColorPalette,
  useThemeStore,
  getColorPalette,
} from '@datalayer/primer-addons';
import { toPng, toSvg } from 'html-to-image';
import * as dataIcons from "../icons-react";
import * as eggsIcons from "../icons-react/eggs";

const SWATCH_SIZE = 64;

// Preview columns shown for every icon. One source of truth keeps the header,
// the legend and the rows aligned.
const ICON_COLUMNS = [
  {
    key: 'colored',
    title: 'Colored',
    hint: 'Full brand artwork in its native multi-color palette.',
  },
  {
    key: 'mono',
    title: 'Monochrome',
    hint: 'Single flat color inherited from the current theme foreground.',
  },
  {
    key: 'accent',
    title: 'Accent',
    hint: 'Forced to one accent color through the color prop.',
  },
  {
    key: 'inverse',
    title: 'On dark',
    hint: 'Colored icon on the opposite color mode surface to check contrast.',
  },
] as const;

const GRID_TEMPLATE = `minmax(200px, 1.6fr) repeat(${ICON_COLUMNS.length}, ${SWATCH_SIZE + 28}px) minmax(110px, 150px)`;

// The inverse-preview column flips with the active mode: a light app previews
// on dark, a dark app previews on light.
const columnTitle = (key: string, fallback: string, isLight: boolean) =>
  key === 'inverse' ? (isLight ? 'On dark' : 'On light') : fallback;

const Swatch = (props: {
  children: React.ReactNode;
  sx?: Record<string, unknown>;
}) => (
  <Box
    sx={{
      width: SWATCH_SIZE,
      height: SWATCH_SIZE,
      mx: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'border.default',
      backgroundColor: 'canvas.subtle',
      ...props.sx,
    }}
  >
    {props.children}
  </Box>
);

// Small dashed-border chip used in the per-icon subline for the rendered
// (function-call) variants.
const DashedIcon = (props: { label: string; children: React.ReactNode }) => (
  <Box
    as="span"
    title={props.label}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 1,
      borderRadius: 2,
      border: '1px dashed',
      borderColor: 'border.default',
    }}
  >
    {props.children}
  </Box>
);

const IconTableHeader = () => {
  const palette = useColorPalette();
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: GRID_TEMPLATE,
        alignItems: 'center',
        gap: 3,
        px: 3,
        py: 3,
        backgroundColor: 'canvas.default',
        borderBottom: '2px solid',
        borderColor: 'border.default',
      }}
    >
      <Text sx={{ fontSize: 1, fontWeight: 'bold' }}>Icon</Text>
      {ICON_COLUMNS.map(col => (
        <Text
          key={col.key}
          sx={{
            display: 'block',
            textAlign: 'center',
            fontSize: 1,
            fontWeight: 'bold',
          }}
        >
          {columnTitle(col.key, col.title, palette.isLight)}
        </Text>
      ))}
      <Text sx={{ fontSize: 1, fontWeight: 'bold', textAlign: 'right' }}>
        Download
      </Text>
    </Box>
  );
};

const IconLine = (props: { name: string, icon: any }) => {
  const { name, icon } = props;
  const palette = useColorPalette();
  const { theme } = useThemeStore();
  const inversePreviewMode: 'light' | 'dark' = palette.isLight ? 'dark' : 'light';
  const inversePalette = getColorPalette(theme, inversePreviewMode);
  const refColored = useRef<any>(null);
  const refDayColoredStyled = useRef<any>(null);
  const refNightColoredStyled = useRef<any>(null);
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
    <Box
      sx={{
        borderTop: '1px solid',
        borderColor: 'border.muted',
        ':hover': { backgroundColor: 'canvas.subtle' },
      }}
    >
      {/* Primary row: labeled variant columns */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID_TEMPLATE,
          alignItems: 'center',
          gap: 3,
          px: 3,
          pt: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Box as="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
            <IconComponent colored size="medium" />
          </Box>
          <Text
            sx={{
              fontFamily: 'mono',
              fontSize: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={name}
          >
            {name}
          </Text>
        </Box>

        {/* Colored: also the source node for PNG/SVG export */}
        <Swatch>
          <Box as="span" ref={refColored} sx={{ display: 'inline-flex' }}>
            <IconComponent colored size="large" />
          </Box>
        </Swatch>

        {/* Monochrome: inherits --datalayer-icon-fg from the theme */}
        <Swatch>
          <IconComponent size="large" />
        </Swatch>

        {/* Accent: explicit color prop */}
        <Swatch>
          <IconComponent size="large" color={palette.flame} />
        </Swatch>

        {/* Inverse: surface + icon color follow the opposite color mode */}
        <Swatch
          sx={{
            backgroundColor: inversePalette.bg,
            borderColor: inversePalette.primary,
            '--datalayer-icon-fg': inversePalette.primary,
          }}
        >
          <IconComponent colored size="large" colormoded={inversePreviewMode} />
        </Swatch>

        {/* Downloads */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
          <Link
            href=""
            title="Download colored PNG"
            onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refColored, 'colored')}
          >
            PNG
          </Link>
          <Link
            href=""
            title="Download SVG"
            onClick={(e: React.MouseEvent<HTMLElement>) => downloadSVG(e, refColored)}
          >
            SVG
          </Link>
        </Box>
      </Box>

      {/* Subline: click-to-download buttons + rendered (dashed) variants */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          px: 3,
          pt: 1,
          pb: 2,
        }}
      >
        <Text sx={{ fontSize: 0, color: 'fg.muted', mr: 1 }}>
          Click to download PNG
        </Text>
        <ThemeProvider colorMode="day">
          <IconButton
            aria-label={`${name} colored on light`}
            size="small"
            icon={ColoredStyledIcon}
            ref={refDayColoredStyled}
            onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refDayColoredStyled, 'day_colored')}
          />
        </ThemeProvider>
        <ThemeProvider colorMode="night">
          <IconButton
            aria-label={`${name} colored on dark`}
            size="small"
            icon={ColoredStyledIcon}
            ref={refNightColoredStyled}
            onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refNightColoredStyled, 'night_colored')}
          />
        </ThemeProvider>
        <ThemeProvider colorMode="day">
          <IconButton
            aria-label={`${name} monochrome on light`}
            size="small"
            icon={StyledIcon}
            ref={refDayStyled}
            onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refDayStyled, 'day')}
          />
        </ThemeProvider>
        <ThemeProvider colorMode="night">
          <IconButton
            aria-label={`${name} monochrome on dark`}
            size="small"
            icon={StyledIcon}
            ref={refNightStyled}
            onClick={(e: React.MouseEvent<HTMLElement>) => downloadPNG(e, refNightStyled, 'night')}
          />
        </ThemeProvider>

        <Box sx={{ width: '1px', alignSelf: 'stretch', mx: 2, backgroundColor: 'border.muted' }} />

        <Text sx={{ fontSize: 0, color: 'fg.muted', mr: 1 }}>Rendered</Text>
        <DashedIcon label="Colored, rendered inline">
          {ColoredStyledIcon()}
        </DashedIcon>
        <DashedIcon label="Monochrome, rendered inline">
          {StyledIcon()}
        </DashedIcon>
      </Box>
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
          return <IconSummary name={name} icon={icons[name]} key={name}/>
        })}
      </Box>
    </>
  )
}

const DetailledIcons = (props: {names: string[], icons: any}) => {
  const { names, icons } = props;
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <IconTableHeader />
      {names.map((name) => (
        <IconLine name={name} icon={icons[name]} key={name} />
      ))}
    </Box>
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
      <Box sx={{ px: 4, py: 4 }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
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
            Every row renders the same icon four ways across the columns below,
            with a subline of one-click PNG downloads and inline-rendered
            variants. Search to inspect a single icon, and use the PNG / SVG
            links to download it. Sources live in the{' '}
            <Link href="https://github.com/datalayer/icons" target="_blank">datalayer/icons repository</Link>.
          </Text>

          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: [
                '1fr',
                '1fr 1fr',
                'repeat(2, 1fr)',
                'repeat(4, 1fr)',
              ],
            }}
          >
            {ICON_COLUMNS.map(col => (
              <Box
                key={col.key}
                sx={{
                  border: '1px solid',
                  borderColor: 'border.muted',
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Text sx={{ display: 'block', fontWeight: 'bold', mb: 1 }}>
                  {columnTitle(col.key, col.title, palette.isLight)}
                </Text>
                <Text sx={{ display: 'block', fontSize: 1, color: 'fg.muted' }}>
                  {col.hint}
                </Text>
              </Box>
            ))}
          </Box>

          <Text as="p" sx={{ mt: 3, mb: 0, color: 'fg.muted' }}>
            The inverse-preview column flips with the active mode — it shows the
            icon on dark while you browse in light, and on light while you browse
            in dark — pulling its surface and icon color from the theme palette so
            it previews correctly across the Datalayer, Ivory and Sun themes. Open
            the{' '}
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
              }}
            />
          </Box>
          <Button onClick={() => filterIcons(filter)}>Apply</Button>
        </Box>

        {(filter === '') ?
          <DetailledIcons names={names} icons={icons} />
        :
          <SummaryIcons names={names} icons={icons} />
        }
        </Box>
      </Box>
    </>
  )
}

export default DatalayerIcons;
