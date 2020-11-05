export default function Teapot({ className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="164"
      height="117"
      viewBox="0 0 164 117"
      className={className}
      style={{
        fill: "currentcolor",
        maxWidth: "6rem",
        height: "auto",
        ...style,
      }}
    >
      <g id="teapot">
        <path d="M63.796,110.171 C59.864,110.171 54.925,110.316 50.9929818,110.316 C50.978,90.857 60.234,67.424 68.714,58.058 C73.108,58.058 78.947,58.058 83.341,58.058 C74.578,66.84 64.555,91.834 63.796,110.171 L63.796,110.171 Z M129.334,47.778 C111.45,47.778 93.565,47.778 75.681,47.778 C81.624,42.83 88.957,38.805 97.652,37.138 C94.416,24.12 110.099,24.262 107.595,37.254 C117.201,37.979 124.185,42.672 129.334,47.778 L129.334,47.778 Z M163.235,116.173 C166.089,86.613 154.869,64.119 139.337,52.345 C114.978,52.345 90.618,52.345 66.258,52.345 C60.833,57.769 60.438,58.434 57.008,65.296 C43.498,47.584 19.003,42.304 3.2948262e-05,43.094 C-0.009,46.178 0.054,47.238 0.405,50.971 C25.524,53.35 22.037,77.461 44.056,99.753 C43.439,104.994 43.516,110.931 44.056,116.172 C83.834,116.481 123.458,115.864 163.235,116.173 Z" />
        <path d="M59.195,45.234 C57.345,45.311 55.495,45.316 53.645,45.249 C53.645,-15.15 151.289,-14.934 151.289,45.466 C149.439,45.533 147.625,45.529 145.739,45.524 C145.161,5.911 60.352,3.888 59.195,45.234 Z" />
      </g>
    </svg>
  );
}