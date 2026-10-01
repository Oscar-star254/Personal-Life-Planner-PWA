export type IconName = "alert" | "bag" | "bell" | "book" | "box" | "calendar" | "chart" | "check" | "chevron" | "chevronLeft" | "clipboard" | "clock" | "close" | "download" | "file" | "grid" | "heart" | "home" | "lock" | "moon" | "plus" | "settings" | "spark" | "sun" | "target" | "up" | "upload" | "users" | "wallet" | "wifiOff";

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z" /><path d="M8 7h8M8 11h6" /></>,
  bag: <><path d="M5 8h14l1 12H4z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  plus: <path d="M12 5v14M5 12h14" />, grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" />, sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12" /><path d="M16 12h4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />, chevronLeft: <path d="m15 18-6-6 6-6" />, check: <path d="m5 12 4 4L19 6" />,
  spark: <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" />, clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m15 9 5-5" /></>, clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 10h6M9 14h5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>, users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6M16 5a3 3 0 0 1 0 6M17 14c2.4.5 4 2.4 4 5" /></>,
  box: <><path d="m4 7 8-4 8 4-8 4z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>, up: <path d="m6 15 6-6 4 4 4-4M14 9h6v6" />,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>, alert: <><path d="M10.3 3.7 2.7 17a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />, download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>, upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
  file: <><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h6" /></>, lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>, wifiOff: <><path d="m2 2 20 20M8.5 8.5A10 10 0 0 1 21 9M5 12.5a10 10 0 0 1 1.5-1M8.5 16a5 5 0 0 1 7 0M12 20h.01" /></>,
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
