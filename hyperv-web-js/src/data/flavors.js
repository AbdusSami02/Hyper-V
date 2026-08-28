import canNeon from "@/assets/can-neon.png";
import canTurbo from "@/assets/can-turbo.png";
import canArctic from "@/assets/can-arctic.png";

export const flavors = [
  {
    id: "neon-rush",
    name: "Neon Rush",
    tagline: "Berry · Electric Grape",
    description:
      "Built for the after-dark grind. A violet berry surge that sharpens focus the second the city lights come on.",
    image: canNeon,
    price: 3.5,
    color: "#ff2d78",
    colorSoft: "#ff8fbe",
    stats: [
      { label: "Energy", value: 94 },
      { label: "Focus", value: 88 },
      { label: "Performance", value: 75 },
    ],
    notes: ["180mg Caffeine", "0g Sugar", "250ml Can"],
  },
  {
    id: "turbo-tropic",
    name: "Turbo Tropic",
    tagline: "Mango · Lime Overdrive",
    description:
      "Daylight fuel with a throttle. Ripe mango and cut lime paired with a fast, carb-free kick for training blocks and long shifts.",
    image: canTurbo,
    price: 3.5,
    color: "#ff9d2e",
    colorSoft: "#ffd166",
    stats: [
      { label: "Energy", value: 90 },
      { label: "Focus", value: 72 },
      { label: "Performance", value: 96 },
    ],
    notes: ["150mg Caffeine", "2g Sugar", "250ml Can"],
  },
  {
    id: "arctic-pulse",
    name: "Arctic Pulse",
    tagline: "Glacial Mint · Ice Citrus",
    description:
      "A cold reset. A menthol-clean citrus line that clears the head and drops perceived effort when the pressure spikes.",
    image: canArctic,
    price: 3.5,
    color: "#29c5ff",
    colorSoft: "#a3e8ff",
    stats: [
      { label: "Energy", value: 85 },
      { label: "Focus", value: 93 },
      { label: "Performance", value: 82 },
    ],
    notes: ["200mg Caffeine", "0g Sugar", "250ml Can"],
  },
];
