import type { LucideIcon } from "lucide-react";

export type InfoFieldType = "text" | "password" | "copy";

export type InfoField = {
  label: string;
  value?: string | number | null;
  type?: InfoFieldType;
};

export type InfoBlockData = {
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
};
