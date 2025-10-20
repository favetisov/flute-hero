export function ClefIcon({
  height = 90,
  stroke = "currentColor",
  ...restProps
}) {
  const width = height;
  // TODO - добавить ноты разйных длительностей
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      stroke={stroke}
      viewBox="0 0 100 100"
      {...restProps}
    >
      <line x1="3" x2="3" y1="0" y2="100" strokeWidth="3" />
      <line x1="20" x2="20" y1="0" y2="100" strokeWidth="3" />
      <line x1={20} x2={45} y1={40} y2={40} strokeWidth="4" />
      <line x1={20} x2={45} y1={60} y2={60} strokeWidth="4" />
    </svg>
  );
}
