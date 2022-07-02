import { useRef, useCallback } from "react";
import { toPng, toJpeg } from 'html-to-image'
// import Pdf from 'react-to-pdf';
import { ThemeProvider, BaseStyles, IconButton } from "@primer/react";
import styled from "styled-components";
import Icons from "./index";

import "./IconsDemo.css";

const SvgStyle = styled.span`
  span {
    border-color: black;
    margin-right: 25px;
  },
  svg {
    border-color: black;
    border: 1px dashed;
  }
`;

const IconLine = (props: {name: string}) => {
  const { name } = props;
  const ref = useRef<any>(null);
  const downloadPng = useCallback(() => {
    if (ref.current === null) {
      return
    }
    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl: string) => {
        const link = document.createElement('a')
        link.download = `${name}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }, [ref]);
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

  // @ts-expect-error ts-migrate(7053)
  const IconComponent = Icons[name];
  const icon = <div>
    <SvgStyle>
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
    </SvgStyle>
    <ThemeProvider colorMode="day">
      <IconButton size="medium" icon={IconComponent} ref={ref}/>
    </ThemeProvider>
    <ThemeProvider colorMode="night">
      <IconButton size="medium" icon={IconComponent} />
    </ThemeProvider>
    <button type="button" onClick={downloadPng}>Save png</button>
    <button type="button" onClick={downloadJpg}>Save jpeg</button>
{/*
    <Pdf targetRef={ref} filename={`${name}.pdf`} x={10} y={10} scale={0.4}>
      {({ toPdf }) => (
        <button type="button" onClick={toPdf}>Generate pdf</button>
      )}
    </Pdf>
*/}
      <hr/>
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
        <IconsGallery/>
      </ThemeProvider>
    </BaseStyles>
  )
}

export default IconsDemo;
