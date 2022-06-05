import Icons from "./index";

import "./IconsDemo.css";

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
    const icon = <div key={name}>
      <span>
        {name}
      </span>
      <span>
        <Component />
      </span>
      <span>
        <Component size={64} />
      </span>
      <span>
        <Component black />
      </span>
      <span style={{backgroundColor: "lightgrey"}}>
        <Component light />
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

export default IconsDemo;
