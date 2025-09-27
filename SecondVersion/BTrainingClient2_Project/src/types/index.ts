import type { IconType } from "react-icons";

export type StatItemType = {
    label: string;
    value: string | number;
    subText?: string | null;
    icon: IconType;
};
