import { createSystem, defaultConfig } from "@chakra-ui/react";

const config = {
  globalCss: {
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .bg-brand": {
      backgroundColor: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .bg-brand\\/5": {
      backgroundColor: "rgb(37 99 235 / 5%)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .bg-brand\\/10": {
      backgroundColor: "rgb(37 99 235 / 10%)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .hover\\:bg-brand-dark:hover": {
      backgroundColor: "#1d4ed8",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .text-brand": {
      color: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .accent-brand": {
      accentColor: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .border-brand": {
      borderColor: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .border-brand\\/30": {
      borderColor: "rgb(37 99 235 / 30%)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .border-l-brand": {
      borderLeftColor: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .border-t-brand": {
      borderTopColor: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .focus\\:border-brand:focus": {
      borderColor: "var(--chakra-colors-primary, #2563eb)",
    },
    ":is([data-qontak-settings], [data-qontak-profile], [data-qontak-invitation]) .peer:checked ~ .peer-checked\\:bg-brand": {
      backgroundColor: "var(--chakra-colors-primary, #2563eb)",
    },
  },
  theme: {
    tokens: {
      colors: {
        primary: { value: "#2563EB" },
        onPrimary: { value: "#FFFFFF" },
        secondary: { value: "#3B82F6" },
        accent: { value: "#059669" },
        background: { value: "#F8FAFC" },
        foreground: { value: "#0F172A" },
        muted: { value: "#F1F5FD" },
        border: { value: "#E4ECFC" },
        destructive: { value: "#DC2626" },
        stageNew: { value: "#3B82F6" },
        stageContacted: { value: "#F59E0B" },
        stageNegotiation: { value: "#8B5CF6" },
        stageWon: { value: "#059669" },
        stageLost: { value: "#DC2626" },
      },
      fonts: {
        heading: { value: "'Plus Jakarta Sans', sans-serif" },
        body: { value: "'Inter', 'Open Sans', sans-serif" },
      },
    },
  },
};

export const system = createSystem(defaultConfig, config);
