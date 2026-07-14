import "./GlassSurface.css";

export default function GlassSurface({
  as: Tag = "div",
  className = "",
  radius = 29,
  blur = 29,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`glass ${className}`.trim()}
      style={{ "--glass-radius": `${radius}px`, "--glass-blur-local": `${blur}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
