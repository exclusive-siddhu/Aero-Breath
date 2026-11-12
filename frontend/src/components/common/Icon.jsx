import React from "react";

const icons = {
  air: (
    <path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h5a3 3 0 1 1-3 3" />
  ),

  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),

  station: (
    <>
      <path d="M12 13v8M8 21h8M8 8a6 6 0 0 1 8 0M4 4a12 12 0 0 1 16 0" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),

  heart: (
    <>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      <path d="M3 12h5l2-4 4 8 2-4h5" />
    </>
  ),

  chart: (
    <path d="M3 3v18h18M6 15l4-5 4 3 6-8" />
  ),

  research: (
    <path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3M8 14h8" />
  ),

  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,

  plus: <path d="M12 5v14M5 12h14" />,

  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),

  moon: (
    <path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z" />
  ),

  logout: (
    <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M10 12h11m-4-4 4 4-4 4" />
  ),

  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),

  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  refresh: (
    <path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2" />
  ),

  alert: (
    <>
      <path d="m10.3 3.8-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-14a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4m0 4h.01" />
    </>
  ),

  check: <path d="m5 12 4 4L19 6" />,

  close: <path d="m6 6 12 12M6 18 18 6" />,

  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),

  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),

  leaf: (
    <path d="M20 3C8 2 2 8 5 16c8 7 17 0 15-13ZM4 21 16 8" />
  ),

  edit: (
    <path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z" />
  ),

  trash: (
    <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
  )
};

export default function Icon({ name = "air", size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {icons[name] || icons.air}
    </svg>
  );
}