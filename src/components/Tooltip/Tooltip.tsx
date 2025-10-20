import { useState, useRef, useEffect, type FC } from "react";
import s from "./Tooltip.module.css";
import { createPortal } from "react-dom";
import { classNames } from "@/tools/class-names";
import { isServerSide } from "@/tools/is-server-side";
import { useIsClientSide } from "@/tools/useIsClientSide";

interface Props {
  label?: string | React.ReactElement;
  className?: any;
  children: React.ReactNode;
  duration?: number;
}

export const Tooltip: FC<Props> = ({
  label,
  className,
  children,
  duration = 0.15,
}: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const isClientSide = useIsClientSide();

  useEffect(() => {
    const root = rootRef.current;
    const arrow = arrowRef.current;
    const content = contentRef.current;

    if (!showTooltip || !root || !content || !arrow) {
      return;
    }

    const updatePosition = () => {
      const { top, bottom, left, right, width } = root.getBoundingClientRect();
      const rootWidth =
        right > window.innerWidth ? window.innerWidth - left : width;

      const { height: contentHeight, width: contentWidth } =
        content.getBoundingClientRect();

      const sideWidth = (contentWidth - rootWidth) / 2;
      let topPosition = top - contentHeight - TOOLTIP_OFFSET;
      let leftPosition = left - sideWidth;
      let arrowYPosition = top - TOOLTIP_OFFSET;
      let arrowXPosition = left + rootWidth / 2;

      arrow.style.borderTopColor = "var(--ion-color-dark)";
      arrow.style.borderBottomColor = "transparent";

      // сверху не помещаемся → снизу
      if (top - contentHeight - TOOLTIP_OFFSET < 0) {
        topPosition = bottom + TOOLTIP_OFFSET;
        arrowYPosition = bottom;
        arrow.style.borderTopColor = "transparent";
        arrow.style.borderBottomColor = "var(--ion-color-dark)";
      }

      // слева край
      if (left - sideWidth - TOOLTIP_OFFSET < 0) {
        leftPosition = TOOLTIP_OFFSET;
        if (contentWidth > rootWidth) {
          arrowXPosition = Math.max(
            left + rootWidth / 2,
            TOOLTIP_OFFSET + TOOLTIP_ARROW_THRESHOLD
          );
        }
      }
      // справа край
      else if (right + sideWidth + TOOLTIP_OFFSET > window.innerWidth) {
        leftPosition = window.innerWidth - contentWidth - TOOLTIP_OFFSET;
        if (contentWidth > rootWidth) {
          arrowXPosition = Math.min(
            left + rootWidth / 2,
            window.innerWidth - TOOLTIP_OFFSET - TOOLTIP_ARROW_THRESHOLD
          );
        }
      }

      arrow.style.top = `${arrowYPosition}px`;
      arrow.style.left = `${arrowXPosition}px`;
      content.style.top = `${topPosition}px`;
      content.style.left = `${leftPosition}px`;
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [showTooltip]);

  if (!isClientSide) {
    return children;
  }

  return (
    <div
      ref={rootRef}
      className={classNames(className, s.root)}
      onMouseEnter={() => label && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(false)}
    >
      {label &&
        showTooltip &&
        createPortal(
          <div
            ref={contentRef}
            className={classNames(s.content, s.displayed)}
            style={{ transitionDuration: `${duration}s` }}
          >
            <div className={s.tooltip}>
              <div className={s.label}>{label}</div>
            </div>
            <div
              ref={arrowRef}
              className={s.arrow}
              style={{ transitionDuration: `${duration}s` }}
            />
          </div>,
          window.document.body
        )}
      {children}
    </div>
  );
};

const TOOLTIP_OFFSET = 10;
const TOOLTIP_ARROW_THRESHOLD = 15;
