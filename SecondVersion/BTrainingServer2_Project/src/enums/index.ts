export const Roles = ["user", "admin"] as const;
export type Role = (typeof Roles)[number];

export const Categories = {
    leg: "#08786B",
    core: "#9C7E62",
    arms: "#AF484C",
    chest: "#899E34",
    back: "#FF6A38",
    free: "#3D3C3E",
} as const;
export type Category = keyof typeof Categories;

export const Muscles = {
    shoulder: "#001219",
    bicep: "#005f73",
    tricep: "#0a9396",
    forearm: "#94d2bd",
    chest: "#e9d8a6",
    back: "#ee9b00",
    leg: "#ca6702",
    glutes: "#bb3e03",
    core: "#ae2012",
    other: "#9b2226",
} as const;
export type Muscle = keyof typeof Muscles;

export const Levels = {
    beginner1: "#AE91BF",
    beginner2: "#825A9B",
    beginner3: "#543A64",
    intermediate1: "#65ABFB",
    intermediate2: "#1680F9",
    intermediate3: "#0558B8",
    advanced1: "#FC9188",
    advanced2: "#FB685B",
    advanced3: "#FA5041",
    open: "#676668",
} as const;
export type Level = keyof typeof Levels;
