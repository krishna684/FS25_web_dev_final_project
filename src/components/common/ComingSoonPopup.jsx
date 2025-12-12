import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";

/**
 * ComingSoonPopup
 * - Accepts a single React element as `trigger` (e.g. <Link>, <button>)
 * - Clones the trigger and injects an onClick handler (no wrapper div)
 * - Shows a small toast-like popup and auto-hides with proper timer cleanup
 */
const ComingSoonPopup = ({
  trigger,
  title = "Coming Soon",
  message = "This feature is coming soon.",
  duration = 2500,
  preventDefault = false,
}) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  // Ensure we don't leak timers if the component unmounts while the popup is visible.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (duration && duration > 0) {
      timerRef.current = setTimeout(() => {
        setOpen(false);
        timerRef.current = null;
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [open, duration]);

  const triggerEl = useMemo(() => {
    if (!isValidElement(trigger)) return null;

    const existingOnClick = trigger.props?.onClick;

    const onClick = (e) => {
      // Run the trigger's own handler first, in case it sets state/analytics.
      existingOnClick?.(e);

      if (preventDefault && e?.preventDefault) {
        e.preventDefault();
      }

      // If the consumer already prevented default, still show the popup.
      setOpen(true);
    };

    // Preserve any existing className/style/etc.
    return cloneElement(trigger, {
      onClick,
    });
  }, [trigger, preventDefault]);

  if (!triggerEl) return null;

  return (
    <>
      {triggerEl}
      {open && (
        <div className="coming-soon-popup" role="status" aria-live="polite">
          <div className="coming-soon-popup__icon" aria-hidden="true">
            <Info size={18} />
          </div>
          <div className="coming-soon-popup__content">
            <div className="coming-soon-popup__title">{title}</div>
            <div className="coming-soon-popup__message">{message}</div>
          </div>
          <button
            type="button"
            className="coming-soon-popup__close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ComingSoonPopup;

