import { Note, NoteDuration } from "@/models/note.model";

export function NoteIcon({
  note = new Note({ duration: NoteDuration.whole }),
  height = 16,
  fill = "currentColor",
  ...restProps
}) {
  const width = height;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox="0 0 100 100"
      {...restProps}
    >
      <ellipse
        style={{
          fill: [NoteDuration.whole, NoteDuration.half].includes(note.duration)
            ? "var(--background)"
            : fill,
          stroke: fill,
          strokeWidth: 3,
          transform: "skewX(-10deg)",
        }}
        cx="50"
        cy="75"
        rx="16"
        ry="14"
      />
      {[
        NoteDuration.half,
        NoteDuration.quarter,
        NoteDuration.eighth,
        NoteDuration.sixteenth,
      ].includes(note.duration) && (
        <rect x="50" y="0" width="4" height="72" fill={fill} rx="4" />
      )}
      {[NoteDuration.eighth, NoteDuration.sixteenth].includes(
        note.duration
      ) && <path d="M52 0 L 67 25" stroke={fill} strokeWidth="4" fill="none" />}
      {NoteDuration.sixteenth === note.duration && (
        <path d="M52 15 L 67 40" stroke={fill} strokeWidth="4" fill="none" />
      )}
    </svg>
  );
}
