import {
  type ComponentType,
  type KeyboardEvent,
  type SVGProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Dialog,
  Flash,
  Heading,
  Link,
  Text,
  TextInput,
} from "@primer/react";
import { DownloadIcon, SearchIcon } from "@primer/octicons-react";
import {
  getColorPalette,
  useColorPalette,
  useThemeStore,
} from "@datalayer/primer-addons";
import { toJpeg, toPng } from "html-to-image";
import * as dataIconExports from "@datalayer/icons-react";
import * as eggIconExports from "@datalayer/icons-react/eggs";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: "small" | "medium" | "large" | number;
    colored?: boolean;
    themed?: boolean;
    colormode?: boolean | "light" | "dark";
  }
>;
type IconCollection = Record<string, IconComponent>;
type SelectedIcon = { name: string; icon: IconComponent };
type DownloadFormat = "png" | "jpg" | "svg";
type VariantKey = "colored" | "mono" | "accent" | "inverse";
type IconVariant = {
  key: VariantKey;
  title: string;
  hint: string;
  example: string;
};

const dataIcons = dataIconExports as IconCollection;
const eggsIcons = eggIconExports as IconCollection;
const SWATCH_SIZE = 64;
const GRID_TEMPLATE = `minmax(210px, 1.6fr) repeat(4, ${SWATCH_SIZE + 28}px) 92px`;

/** What an example names the component when no icon is in hand. */
const ANY_ICON_NAME = "DatalayerIcon";

/**
 * The treatments an icon supports, with the code each one is written as.
 *
 * @param isLight Whether the page is on its light color mode
 * @param iconName The icon the examples are written for; a stand-in name is
 *   used for the legend of the page, which speaks of no icon in particular
 */
function iconVariants(isLight: boolean, iconName = ANY_ICON_NAME): IconVariant[] {
  const inverseMode = isLight ? "dark" : "light";
  return [
    {
      key: "mono",
      title: "Monochrome",
      hint: "One theme hue with tonal contrast that preserves artwork details.",
      example: `<${iconName} />`,
    },
    {
      key: "colored",
      title: "Colored",
      hint: "Full brand artwork in its native multi-color palette.",
      example: `<${iconName} colored />`,
    },
    {
      key: "accent",
      title: "Accent",
      hint: "One supplied accent hue with the original tonal detail preserved.",
      example: `<${iconName} color={palette.flame} />`,
    },
    {
      key: "inverse",
      title: `On ${inverseMode}`,
      hint: `Colored artwork on the ${inverseMode} theme surface to check contrast.`,
      example: `<${iconName} colored colormode="${inverseMode}" />`,
    },
  ];
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

function serializeSvg(container: HTMLElement) {
  const source = container.querySelector("svg");
  if (!source)
    throw new Error("The icon preview does not contain an SVG element.");

  const clone = source.cloneNode(true) as SVGSVGElement;
  const sourceElements = [source, ...source.querySelectorAll("*")];
  const cloneElements = [clone, ...clone.querySelectorAll("*")];
  sourceElements.forEach((element, index) => {
    const target = cloneElements[index] as SVGElement;
    const computed = window.getComputedStyle(element);
    target.style.fill = computed.fill;
    target.style.stroke = computed.stroke;
    target.style.color = computed.color;
    target.style.opacity = computed.opacity;
    target.style.strokeWidth = computed.strokeWidth;
  });
  clone.querySelectorAll("style").forEach((style) => style.remove());
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "512");
  clone.setAttribute("height", "512");
  clone.removeAttribute("aria-hidden");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    new XMLSerializer().serializeToString(clone),
  )}`;
}

async function downloadVariant(
  container: HTMLElement,
  name: string,
  variant: VariantKey,
  format: DownloadFormat,
) {
  const filename = `${name}_${variant}.${format}`;
  if (format === "svg") {
    triggerDownload(serializeSvg(container), filename);
    return;
  }
  const options = {
    cacheBust: true,
    pixelRatio: 4,
    ...(format === "jpg"
      ? {
          backgroundColor: window.getComputedStyle(container).backgroundColor,
          quality: 0.96,
        }
      : {}),
  };
  const dataUrl =
    format === "jpg"
      ? await toJpeg(container, options)
      : await toPng(container, options);
  triggerDownload(dataUrl, filename);
}

function VariantIcon({
  icon: Icon,
  variant,
  size,
}: {
  icon: IconComponent;
  variant: VariantKey;
  size: number;
}) {
  const palette = useColorPalette();
  const inverseMode: "light" | "dark" = palette.isLight ? "dark" : "light";
  if (variant === "colored") return <Icon colored size={size} />;
  if (variant === "accent") return <Icon size={size} color={palette.flame} />;
  if (variant === "inverse") {
    return <Icon colored size={size} colormode={inverseMode} />;
  }
  return <Icon size={size} />;
}

function useVariantSurface(variant: VariantKey) {
  const palette = useColorPalette();
  const { theme } = useThemeStore();
  const inverseMode: "light" | "dark" = palette.isLight ? "dark" : "light";
  const inversePalette = getColorPalette(theme, inverseMode);
  if (variant !== "inverse") {
    return {
      backgroundColor: "canvas.subtle",
      borderColor: "border.default",
    };
  }
  return {
    backgroundColor: inversePalette.bg,
    borderColor: inversePalette.primary,
    color: inversePalette.primary,
    "--datalayer-icon-fg": inversePalette.primary,
  };
}

function Swatch({
  icon,
  variant,
}: {
  icon: IconComponent;
  variant: VariantKey;
}) {
  const surface = useVariantSurface(variant);
  return (
    <Box
      sx={{
        width: SWATCH_SIZE,
        height: SWATCH_SIZE,
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        border: "1px solid",
        ...surface,
      }}
    >
      <VariantIcon icon={icon} variant={variant} size={42} />
    </Box>
  );
}

function DetailVariant({
  icon,
  variant,
  setExportNode,
  onDownload,
  downloading,
}: {
  icon: IconComponent;
  variant: IconVariant;
  setExportNode: (node: HTMLDivElement | null) => void;
  onDownload: (format: DownloadFormat) => void;
  downloading: boolean;
}) {
  const surface = useVariantSurface(variant.key);
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        ref={setExportNode}
        sx={{
          height: 176,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...surface,
        }}
      >
        <VariantIcon icon={icon} variant={variant.key} size={112} />
      </Box>
      <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "border.default" }}>
        <Text sx={{ display: "block", fontWeight: 600 }}>{variant.title}</Text>
        <Text
          as="code"
          sx={{
            display: "block",
            mt: 1,
            fontSize: 0,
            color: "fg.muted",
            overflowWrap: "anywhere",
          }}
        >
          {variant.example}
        </Text>
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          {(["png", "jpg", "svg"] as DownloadFormat[]).map((format) => (
            <Button
              key={format}
              size="small"
              leadingVisual={DownloadIcon}
              disabled={downloading}
              onClick={() => onDownload(format)}
            >
              {format.toUpperCase()}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function IconDetailsDialog({
  selected,
  onClose,
}: {
  selected: SelectedIcon;
  onClose: () => void;
}) {
  // The examples name the very icon being looked at, so they can be copied
  // into a page as they read.
  const variants = iconVariants(useColorPalette().isLight, selected.name);
  const exportNodes = useRef<Partial<Record<VariantKey, HTMLDivElement>>>({});
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (
    variant: VariantKey,
    format: DownloadFormat,
  ) => {
    const node = exportNodes.current[variant];
    if (!node) return;
    const job = `${variant}-${format}`;
    setDownloading(job);
    try {
      await downloadVariant(node, selected.name, variant, format);
    } catch (error) {
      console.error(`Unable to download ${selected.name} as ${format}.`, error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Dialog
      title={selected.name}
      subtitle="Preview and download each supported icon treatment."
      width="xlarge"
      height="large"
      /*
       * Taller than the 640px `large` stands for, which is the tallest the
       * dialog names: the four treatments sit two by two, and a card is its
       * preview plus the code and the downloads under it, so the second row
       * is cut in half. Bounded by the window, as the dialog bounds itself.
       */
      sx={{ height: 'min(820px, calc(100dvh - 64px))' }}
      onClose={onClose}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: ["1fr", "1fr 1fr"],
          gap: 3,
          p: 3,
        }}
      >
        {variants.map((variant) => (
          <DetailVariant
            key={variant.key}
            icon={selected.icon}
            variant={variant}
            setExportNode={(node) => {
              if (node) exportNodes.current[variant.key] = node;
            }}
            onDownload={(format) => void handleDownload(variant.key, format)}
            downloading={downloading !== null}
          />
        ))}
      </Box>
    </Dialog>
  );
}

function IconTableHeader() {
  const variants = iconVariants(useColorPalette().isLight);
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE,
        alignItems: "center",
        gap: 3,
        px: 3,
        py: 3,
        backgroundColor: "canvas.default",
      }}
    >
      <Text sx={{ fontSize: 1, fontWeight: 600 }}>Icon</Text>
      {variants.map((variant) => (
        <Text
          key={variant.key}
          sx={{ fontSize: 1, fontWeight: 600, textAlign: "center" }}
        >
          {variant.title}
        </Text>
      ))}
      <Text sx={{ fontSize: 1, fontWeight: 600, textAlign: "right" }}>
        Details
      </Text>
    </Box>
  );
}

function IconLine({
  name,
  icon,
  onSelect,
}: SelectedIcon & { onSelect: (icon: SelectedIcon) => void }) {
  const open = () => onSelect({ name, icon });
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };
  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={`View ${name} details`}
      onClick={open}
      onKeyDown={handleKeyDown}
      sx={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE,
        alignItems: "center",
        gap: 3,
        px: 3,
        py: 2,
        borderTop: "1px solid",
        borderColor: "border.muted",
        cursor: "pointer",
        ":hover": { backgroundColor: "canvas.subtle" },
        ":focus-visible": {
          outline: "2px solid",
          outlineColor: "accent.fg",
          outlineOffset: -2,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
        <Box as="span" sx={{ display: "inline-flex", flexShrink: 0 }}>
          <VariantIcon icon={icon} variant="colored" size={32} />
        </Box>
        <Text
          sx={{
            fontFamily: "mono",
            fontSize: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Text>
      </Box>
      {(["mono", "colored", "accent", "inverse"] as VariantKey[]).map(
        (variant) => (
          <Swatch key={variant} icon={icon} variant={variant} />
        ),
      )}
      <Button
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
      >
        View
      </Button>
    </Box>
  );
}

function SearchResults({
  names,
  icons,
  onSelect,
}: {
  names: string[];
  icons: IconCollection;
  onSelect: (icon: SelectedIcon) => void;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 3,
      }}
    >
      {names.map((name) => {
        const Icon = icons[name];
        return (
          <Box
            as="button"
            type="button"
            key={name}
            onClick={() => onSelect({ name, icon: Icon })}
            sx={{
              minWidth: 0,
              height: 176,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              color: "fg.default",
              backgroundColor: "canvas.subtle",
              border: "1px solid",
              borderColor: "border.default",
              borderRadius: 2,
              cursor: "pointer",
              ":hover": {
                borderColor: "accent.fg",
                backgroundColor: "canvas.default",
              },
              ":focus-visible": {
                outline: "2px solid",
                outlineColor: "accent.fg",
                outlineOffset: 2,
              },
            }}
          >
            <Icon colored size={96} />
            <Text
              sx={{
                maxWidth: "100%",
                fontFamily: "mono",
                fontSize: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}

export function DatalayerIcons() {
  const palette = useColorPalette();
  const [filter, setFilter] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [icons] = useState<IconCollection>(() => {
    if (typeof window === "undefined") return dataIcons;
    return new URLSearchParams(window.location.search).has("eggs")
      ? eggsIcons
      : dataIcons;
  });
  const [selected, setSelected] = useState<SelectedIcon | null>(null);
  const variants = iconVariants(palette.isLight);
  const names = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase();
    return Object.keys(icons).filter(
      (name) => !query || name.toLocaleLowerCase().includes(query),
    );
  }, [filter, icons]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (filter.trim()) url.searchParams.set("q", filter.trim());
    else url.searchParams.delete("q");
    window.history.replaceState({}, document.title, url);
  }, [filter]);

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          "--datalayer-icon-fg": palette.primary,
        }}
      >
        <Heading as="h1" sx={{ m: 0, mb: 2, fontSize: 5 }}>
          React icons for data products
        </Heading>
        <Text sx={{ color: "fg.muted" }}>
          {Object.keys(icons).length} curated icons for data product design.
        </Text>

        <Flash variant="warning" sx={{ mt: 3 }}>
          Some icons may not be fully compatible with existing design
          guidelines. Report issues on{" "}
          <Link
            href="https://github.com/datalayer/icons/issues"
            target="_blank"
          >
            GitHub
          </Link>
          .
        </Flash>

        <Text as="p" sx={{ mt: 3, mb: 0 }}>
          Browse each icon in four theme-aware treatments. Select any row or
          search result to inspect larger previews and download PNG, JPG, or SVG
          variants.
        </Text>

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gap: 2,
            gridTemplateColumns: ["1fr", "1fr 1fr", "repeat(4, 1fr)"],
          }}
        >
          {variants.map((variant) => (
            <Box
              key={variant.key}
              sx={{
                border: "1px solid",
                borderColor: "border.muted",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Text sx={{ display: "block", fontWeight: 600, mb: 1 }}>
                {variant.title}
              </Text>
              <Text
                sx={{
                  display: "block",
                  minHeight: 40,
                  fontSize: 1,
                  color: "fg.muted",
                }}
              >
                {variant.hint}
              </Text>
              <Text
                as="code"
                sx={{
                  display: "block",
                  mt: 2,
                  fontSize: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {variant.example}
              </Text>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, mb: 3 }}>
          <TextInput
            block
            value={filter}
            leadingVisual={SearchIcon}
            placeholder="Search icons"
            aria-label="Search icons"
            onChange={(event) => setFilter(event.target.value)}
          />
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text sx={{ fontSize: 1, color: "fg.muted" }}>
              {names.length} {names.length === 1 ? "icon" : "icons"}
            </Text>
            {filter ? (
              <Button
                size="small"
                variant="invisible"
                onClick={() => setFilter("")}
              >
                Clear
              </Button>
            ) : null}
          </Box>
        </Box>

        {filter.trim() ? (
          <SearchResults names={names} icons={icons} onSelect={setSelected} />
        ) : (
          <Box
            sx={{
              overflowX: "auto",
              border: "1px solid",
              borderColor: "border.default",
              borderRadius: 2,
            }}
          >
            <Box sx={{ minWidth: 900 }}>
              <IconTableHeader />
              {names.map((name) => (
                <IconLine
                  key={name}
                  name={name}
                  icon={icons[name]}
                  onSelect={setSelected}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
      {selected ? (
        <IconDetailsDialog
          selected={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </Box>
  );
}

export default DatalayerIcons;
