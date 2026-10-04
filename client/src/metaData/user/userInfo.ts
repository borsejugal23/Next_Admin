import type { InfoBlockData, InfoField } from "@/types/userInfo";
import type { User } from "@/types/user";
import { UserDetailTab } from "@/types/user";
import {
  Activity,
  Banknote,
  Briefcase,
  Building2,
  GraduationCap,
  MapPin,
  MonitorCloud,
  ShieldCheck,
  User as UserIcon,
  Wallet,
} from "lucide-react";

const field = (
  label: string,
  value?: string | number | null,
  type?: InfoField["type"],
): InfoField | null => {
  if (value == null || value === "") return null;
  return { label, value, type };
};

const compactFields = (fields: Array<InfoField | null>) =>
  fields.filter((item): item is InfoField => item !== null);

const getAboutBlocks = (user: User): InfoBlockData[] => {
  const { lat, lng } = user.address?.coordinates ?? {};

  return [
    {
      title: "Personal Information",
      icon: UserIcon,
      fields: compactFields([
        field(
          "Full Name",
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        ),
        field("Username", user.username),
        field("Maiden Name", user.maidenName),
        field("Birth Date", user.birthDate),
        field("Age", user.age),
        field("Gender", user.gender),
        field("Email", user.email),
        field("Phone", user.phone),
        field("Blood Group", user.bloodGroup),
        field("SSN", user.ssn),
        field("EIN", user.ein),
        field("User Agent", user.userAgent),
      ]),
    },
    {
      title: "Appearance",
      icon: Activity,
      fields: compactFields([
        field("Height", user.height ? `${user.height} cm` : null),
        field("Weight", user.weight ? `${user.weight} kg` : null),
        field("Eye Color", user.eyeColor),
        field(
          "Hair",
          user.hair?.color && user.hair?.type
            ? `${user.hair.color}, ${user.hair.type}`
            : (user.hair?.color ?? user.hair?.type),
        ),
      ]),
    },
    {
      title: "Address",
      icon: MapPin,
      mapCoordinates: lat != null && lng != null ? { lat, lng } : undefined,
      fields: compactFields([
        field(
          "Address",
          [
            user.address?.address,
            user.address?.city,
            user.address?.state,
            user.address?.postalCode,
            user.address?.country,
          ]
            .filter(Boolean)
            .join(", "),
        ),
        field("State", user.address?.state),
        field(
          "Coordinates",
          lat != null && lng != null ? `${lat}, ${lng}` : null,
        ),
      ]),
    },
    {
      title: "Basic Info",
      icon: ShieldCheck,
      fields: compactFields([
        field("ID", user.id),
        field("Role", user.role),
        field("Password", user.password, "password"),
        field("IP Address", user.ip),
        field("MAC Address", user.macAddress),
      ]),
    },
  ].filter((block) => block.fields.length > 0 || block.mapCoordinates);
};

const getWorkAndLifeBlocks = (user: User): InfoBlockData[] => {
  return [
    {
      title: "Company",
      icon: Building2,
      fields: compactFields([
        field("Department", user.company?.department),
        field("Company Name", user.company?.name),
        field("Job Title", user.company?.title),
        field(
          "Company Address",
          [
            user.company?.address?.address,
            user.company?.address?.city,
            user.company?.address?.state,
            user.company?.address?.country,
          ]
            .filter(Boolean)
            .join(", "),
        ),
      ]),
    },
    {
      title: "Education",
      icon: GraduationCap,
      fields: compactFields([field("University", user.university)]),
    },
  ].filter((block) => block.fields.length > 0);
};

const getFinancialBlocks = (user: User): InfoBlockData[] => {
  return [
    {
      title: "Bank Details",
      icon: Banknote,
      fields: compactFields([
        field("Card Type", user.bank?.cardType),
        field("Card Number", user.bank?.cardNumber),
        field("Card Expiry", user.bank?.cardExpire),
        field("Currency", user.bank?.currency),
        field("IBAN", user.bank?.iban),
      ]),
    },
    {
      title: "Crypto Wallet",
      icon: Wallet,
      fields: compactFields([
        field("Coin", user.crypto?.coin),
        field("Network", user.crypto?.network),
        field("Wallet Address", user.crypto?.wallet, "copy"),
      ]),
    },
  ].filter((block) => block.fields.length > 0);
};

const getSecurityBlocks = (user: User): InfoBlockData[] => {
  return [
    {
      title: "Security",
      icon: ShieldCheck,
      fields: compactFields([
        field("SSN", user.ssn),
        field("EIN", user.ein),
        field("Password", user.password, "password"),
        field("IP Address", user.ip),
        field("MAC Address", user.macAddress),
      ]),
    },
    {
      title: "Activity",
      icon: Briefcase,
      fields: compactFields([
        field("User Agent", user.userAgent),
        field("IP Address", user.ip),
        field("MAC Address", user.macAddress),
      ]),
    },
  ].filter((block) => block.fields.length > 0);
};

const getServicesBlocks = (user: User): InfoBlockData[] => {
  return [
    {
      title: "Services",
      icon: MonitorCloud,
      fields: compactFields([
        field("Coin", user.crypto?.coin),
        field("Network", user.crypto?.network),
        field("Wallet Address", user.crypto?.wallet, "copy"),
      ]),
    },
  ].filter((block) => block.fields.length > 0);
};

// const getActivityBlocks = (user: User): InfoBlockData[] => {
//   return [].filter((block) => block.fields.length > 0);
// };

const tabBlockGetters: Record<
  Exclude<UserDetailTab, UserDetailTab.CART | UserDetailTab.REVIEW>,
  (user: User) => InfoBlockData[]
> = {
  [UserDetailTab.ABOUT]: getAboutBlocks,
  [UserDetailTab.WORK_AND_LIFE]: getWorkAndLifeBlocks,
  [UserDetailTab.FINANCIAL]: getFinancialBlocks,
  [UserDetailTab.SECURITY]: getSecurityBlocks,
  [UserDetailTab.SERVICES]: getServicesBlocks,
};

export const getUserTabBlocks = (
  user: User,
  tab: Exclude<UserDetailTab, UserDetailTab.REVIEW | UserDetailTab.CART>,
): InfoBlockData[] => tabBlockGetters[tab](user);
