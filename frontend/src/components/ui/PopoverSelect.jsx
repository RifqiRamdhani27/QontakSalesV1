import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CaretDown } from "@phosphor-icons/react";

export function useOutsideClose() {
  const ref = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { ref, menuRef, open, setOpen };
}

export function useDropdown() {
  const triggerRef = useRef(null);
  const [rect, setRect] = useState(null);

  const open = useCallback(() => {
    const node = triggerRef.current;
    if (!node) return;
    setRect(node.getBoundingClientRect());
  }, []);

  const openAt = useCallback((nextRect) => setRect(nextRect), []);
  const close = useCallback(() => setRect(null), []);
  const toggle = useCallback(() => {
    if (rect) {
      setRect(null);
      return;
    }
    open();
  }, [rect, open]);

  return {
    triggerRef,
    rect,
    isOpen: Boolean(rect),
    open,
    openAt,
    close,
    toggle,
  };
}

export function DropdownPanel({
  rect,
  onClose,
  children,
  minWidth,
  maxWidth,
  maxHeight = 320,
  align = "left",
  variant = "pixel",
  triggerRef,
  contentRef,
  className,
  width,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!rect || triggerRef) return;
    const panel = panelRef.current;
    const h = panel ? panel.offsetHeight : maxHeight;
    const w = panel ? panel.offsetWidth : minWidth || rect.width;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const spaceBelow = vh - rect.bottom;
    const openUp =
      spaceBelow < Math.min(h, maxHeight) + 16 && rect.top > spaceBelow;
    const top = openUp
      ? Math.max(8, rect.top - Math.min(h, maxHeight) - 4)
      : rect.bottom + 4;
    let left = align === "right" ? rect.right - w : rect.left;
    left = Math.max(8, Math.min(left, vw - w - 8));

    setPos({
      top,
      left,
      maxHeight: Math.max(
        160,
        Math.min(maxHeight, openUp ? rect.top - 16 : spaceBelow - 16),
      ),
    });
  }, [rect, align, maxHeight, minWidth, triggerRef]);

  useLayoutEffect(() => {
    if (!rect || !triggerRef) return;
    let frame;
    const updatePosition = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const anchor = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      if (
        anchor.bottom <= 0 ||
        anchor.top >= viewportHeight ||
        anchor.right <= 0 ||
        anchor.left >= viewportWidth
      ) {
        onClose();
        return;
      }
      const panelWidth = Math.min(
        width ?? minWidth ?? anchor.width,
        Math.max(0, viewportWidth - 16),
      );
      const below = Math.max(0, viewportHeight - anchor.bottom - 12);
      const above = Math.max(0, anchor.top - 12);
      const desiredHeight = Math.min(panel.scrollHeight, maxHeight);
      const openUp = below < desiredHeight && above > below;
      const availableHeight = Math.min(maxHeight, openUp ? above : below);
      const panelHeight = Math.min(panel.scrollHeight, availableHeight);
      const next = {
        top: openUp ? anchor.top - panelHeight - 4 : anchor.bottom + 4,
        left: Math.max(
          8,
          Math.min(
            align === "right" ? anchor.right - panelWidth : anchor.left,
            viewportWidth - panelWidth - 8,
          ),
        ),
        width: panelWidth,
        maxHeight: availableHeight,
      };
      setPos((current) =>
        current && Object.keys(next).every((key) => current[key] === next[key])
          ? current
          : next,
      );
    };
    const schedulePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(schedulePosition)
        : null;
    if (triggerRef.current) observer?.observe(triggerRef.current);
    if (panelRef.current) observer?.observe(panelRef.current);
    window.addEventListener("scroll", schedulePosition, true);
    window.addEventListener("resize", schedulePosition);
    window.visualViewport?.addEventListener("resize", schedulePosition);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedulePosition, true);
      window.removeEventListener("resize", schedulePosition);
      window.visualViewport?.removeEventListener("resize", schedulePosition);
    };
  }, [rect, triggerRef, align, maxHeight, minWidth, width, onClose]);

  useEffect(() => {
    if (!rect) return;
    const onDocDown = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      if (triggerRef?.current?.contains(event.target)) return;
      if (!triggerRef && event.target?.closest?.("[data-dropdown-trigger]")) return;
      onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
        if (triggerRef) {
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }
        return;
      }
      if (!triggerRef || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const panel = panelRef.current;
      const active = document.activeElement;
      if (!panel?.contains(active) && !triggerRef.current?.contains(active)) return;
      if (active?.matches("input:not([type='checkbox']), textarea") && ["Home", "End"].includes(event.key)) return;
      const items = [...panel.querySelectorAll("button:not(:disabled), input[type='checkbox']:not(:disabled), [role='option'][tabindex]")];
      if (items.length === 0) return;
      const index = items.indexOf(active);
      const next = event.key === "Home" ? 0
        : event.key === "End" ? items.length - 1
          : event.key === "ArrowUp" ? (index <= 0 ? items.length - 1 : index - 1)
            : (index + 1) % items.length;
      event.preventDefault();
      items[next].focus({ preventScroll: true });
      items[next].scrollIntoView({ block: "nearest" });
    };
    const onFocus = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      if (triggerRef?.current?.contains(event.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    if (triggerRef) document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
      if (triggerRef) document.removeEventListener("focusin", onFocus);
    };
  }, [rect, onClose, triggerRef]);

  if (!rect) return null;

  const isLegacy = variant === "legacy";
  const isSettings = variant === "settings";

  return createPortal(
    <div
      ref={(node) => {
        panelRef.current = node;
        if (contentRef) contentRef.current = node;
      }}
      className={className}
      data-qontak-settings=""
      data-settings-dropdown={isSettings ? "" : undefined}
      style={{
        position: "fixed",
        top: pos?.top ?? rect.bottom + 4,
        left: pos?.left ?? rect.left,
        width: triggerRef ? pos?.width : width,
        minWidth: triggerRef ? undefined : minWidth ?? rect.width,
        maxWidth: triggerRef ? "calc(100vw - 16px)" : maxWidth ?? "none",
        maxHeight: pos?.maxHeight ?? maxHeight,
        zIndex: 10050,
        overflowY: "auto",
        overflowX: "hidden",
        ...(isSettings ? {} : {
          fontFamily: "inherit",
          background: "#fff",
          border: isLegacy
            ? "1px solid rgba(0,0,0,.15)"
            : "1px solid var(--chakra-colors-border, #e4ecfc)",
          borderRadius: isLegacy ? 4 : 6,
          boxShadow: isLegacy
            ? "0 6px 12px rgba(0,0,0,.175)"
            : "0 8px 24px rgba(16,24,40,.12)",
          padding: isLegacy ? "5px 0" : 4,
        }),
        visibility: pos ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export default function PopoverSelect({
  value,
  placeholder,
  groups,
  onSelect,
  includeAll,
  closeAfterSelect = true,
  floating = false,
}) {
  const { ref, menuRef, open, setOpen } = useOutsideClose();
  const triggerRef = useRef(null);

  const flat = includeAll
    ? [{ label: "", options: ["All transaction types"] }, ...groups]
    : groups;

  const options = flat.map((group, groupIndex) => (
    <div key={groupIndex}>
      {group.label && (
        <p className="m-0 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
          {group.label}
        </p>
      )}
      {group.options.map((option) => (
        <button
          key={option}
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
          onClick={() => {
            onSelect(option);
            if (closeAfterSelect) setOpen(false);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  ));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-brand focus:outline-none"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={floating ? open : undefined}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <CaretDown
          size={14}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (floating ? (
        <DropdownPanel
          rect={triggerRef.current?.getBoundingClientRect()}
          triggerRef={triggerRef}
          contentRef={menuRef}
          onClose={() => setOpen(false)}
          variant="settings"
          maxHeight={288}
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options}
        </DropdownPanel>
      ) : (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options}
        </div>
      ))}
    </div>
  );
}
