import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";

const ComingSoonPopup = ({ trigger, message = "Coming Soon!", durationMs = 2000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    e?.preventDefault?.();
    setIsOpen(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(false), durationMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const wrappedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (e) => {
          // Preserve any existing click handler
          trigger.props?.onClick?.(e);
          // If the original handler prevented default, respect that.
          if (e?.defaultPrevented) return;
          handleClick(e);
        },
      })
    : trigger;

  return (
    <>
      {wrappedTrigger}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {message}
        </div>
      )}
    </>
  );
};

export default ComingSoonPopup;
