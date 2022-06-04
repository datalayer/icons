import Icons from "./index";

function IconsDemo() {
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
    const Component = Icons[name];
    const icon = <div key={name} style={{margin: "15px"}}>
      <span style={{marginRight: "15px"}}>
        {name}
      </span>
      <span style={{marginRight: "15px"}}>
        <Component />
      </span>
      <span style={{marginRight: "15px"}}>
        <Component size={64} />
      </span>
      <span style={{marginRight: "15px"}}>
        <Component black />
      </span>
      <span style={{backgroundColor: "black", marginRight: "15px"}}>
        <Component light />
      </span>
    </div>
    icons.push(icon)
  }
  return (
    <>
      {icons}
    </>
  )
}

export default IconsDemo;
