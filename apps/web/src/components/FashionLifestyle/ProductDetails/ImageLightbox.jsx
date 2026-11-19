"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";

const MAX_SCALE = 4;
const STEP_SCALE = 2.5;
const SWIPE_PX = 60;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Full-screen product image viewer: arrows / swipe to change image, and
// zoom with pinch, double-tap, double-click, mouse wheel or the +/- buttons.
// Drag pans while zoomed. Esc closes, arrow keys change image.
const ImageLightbox = ({ images, index, onIndexChange, onClose, alt }) => {
  const stageRef = useRef(null);
  const closeRef = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastTap = useRef(0);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const count = images.length;
  const go = useCallback(
    (delta) => {
      if (count < 2) return;
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange],
  );

  // New image: reset zoom (during render, so the old zoom never flashes).
  const [viewIndex, setViewIndex] = useState(index);
  if (viewIndex !== index) {
    setViewIndex(index);
    setView({ scale: 1, x: 0, y: 0 });
  }

  // Keep the pan inside the image for a given scale.
  const bound = useCallback((scale, x, y) => {
    const el = stageRef.current;
    if (!el || scale <= 1) return { scale: 1, x: 0, y: 0 };
    const { width, height } = el.getBoundingClientRect();
    const mx = ((scale - 1) * width) / 2;
    const my = ((scale - 1) * height) / 2;
    return { scale, x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
  }, []);

  // Zoom to `scale` (a number, or a function of the current scale), keeping
  // the point (cx, cy) (client coords) still.
  const zoomAt = useCallback(
    (scale, cx, cy) => {
      setView((v) => {
        const s = clamp(
          typeof scale === "function" ? scale(v.scale) : scale,
          1,
          MAX_SCALE,
        );
        const el = stageRef.current;
        if (!el) return v;
        const r = el.getBoundingClientRect();
        const px = (cx ?? r.left + r.width / 2) - (r.left + r.width / 2);
        const py = (cy ?? r.top + r.height / 2) - (r.top + r.height / 2);
        const k = s / v.scale;
        return bound(s, px - (px - v.x) * k, py - (py - v.y) * k);
      });
    },
    [bound],
  );

  // Keyboard, scroll lock and focus.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [go, onClose]);

  // Wheel zoom needs a non-passive listener to stop the page from scrolling.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.002);
      zoomAt((s) => s * factor, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      gesture.current = {
        type: "pinch",
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        scale: view.scale,
      };
    } else if (pts.length === 1) {
      gesture.current = {
        type: "drag",
        startX: e.clientX,
        startY: e.clientY,
        x: view.x,
        y: view.y,
        moved: false,
      };
      setDragging(true);
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];
    if (g.type === "pinch" && pts.length >= 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      zoomAt(
        g.scale * (dist / g.dist),
        (pts[0].x + pts[1].x) / 2,
        (pts[0].y + pts[1].y) / 2,
      );
    } else if (g.type === "drag") {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) g.moved = true;
      if (view.scale > 1) setView(bound(view.scale, g.x + dx, g.y + dy));
    }
  };

  const onPointerUp = (e) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) {
      // Pinch ended with one finger left: continue as a drag from here.
      const [p] = pointers.current.values();
      gesture.current = {
        type: "drag",
        startX: p.x,
        startY: p.y,
        x: view.x,
        y: view.y,
        moved: true,
      };
      return;
    }
    gesture.current = null;
    setDragging(false);
    if (!g || g.type !== "drag") return;

    const dx = e.clientX - g.startX;
    if (view.scale === 1 && Math.abs(dx) > SWIPE_PX) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    if (g.moved) return;

    // Tap / click: double tap toggles zoom at that point.
    const now = Date.now();
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      if (view.scale > 1) setView({ scale: 1, x: 0, y: 0 });
      else zoomAt(STEP_SCALE, e.clientX, e.clientY);
    } else {
      lastTap.current = now;
    }
  };

  const zoomed = view.scale > 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product images"
      className="fixed inset-0 z-100 flex flex-col bg-black/95 text-[#FFFFFF]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        <span className="text-sm tabular-nums text-white/80">
          {count > 1 ? `${index + 1} / ${count}` : ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => zoomAt((s) => s / 1.5)}
            disabled={!zoomed}
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:bg-white/10 disabled:opacity-30"
          >
            <FiZoomOut />
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-white/70">
            {Math.round(view.scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoomAt((s) => s * 1.5)}
            disabled={view.scale >= MAX_SCALE}
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:bg-white/10 disabled:opacity-30"
          >
            <FiZoomIn />
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-2xl transition hover:bg-white/10"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`absolute inset-0 touch-none select-none overflow-hidden ${
            zoomed
              ? dragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-zoom-in"
          }`}
        >
          <div
            className={`relative h-full w-full will-change-transform ${
              dragging ? "" : "transition-transform duration-200 ease-out"
            }`}
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
            }}
          >
            <Image
              src={images[index]}
              alt={alt}
              fill
              sizes="100vw"
              quality={90}
              draggable={false}
              className="pointer-events-none object-contain"
            />
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur-sm transition hover:bg-white/20 sm:flex"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur-sm transition hover:bg-white/20 sm:flex"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-3 py-3 scrollbar-none">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-[#FFFFFF]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <p className="pb-3 text-center text-xs text-white/50">
        {zoomed
          ? "Drag to move · double-tap to reset"
          : "Pinch, scroll or double-tap to zoom"}
      </p>
    </div>,
    document.body,
  );
};

export default ImageLightbox;
