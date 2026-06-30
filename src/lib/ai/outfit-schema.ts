import { z } from "zod";

export const OutfitSchema = z.object({
  selectedItemIds: z
    .array(z.string())
    .min(1)
    .max(8)
    .describe("IDs of wardrobe items that make up the outfit"),
  rationale: z
    .string()
    .describe(
      "Stylist rationale: why these pieces work together for this user's profile",
    ),
  occasion: z
    .string()
    .describe(
      "Primary occasion this outfit is suited for, e.g. casual, work, evening out",
    ),
  fitScore: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe(
      "How well this outfit matches the user's style profile, 1 (poor fit) to 10 (perfect fit)",
    ),
  stylingTips: z
    .string()
    .describe(
      "1-2 concrete styling tips: how to wear or accessorise this outfit",
    ),
  colorStory: z
    .string()
    .describe("Brief note on the color palette and why it works together"),
});

export type GeneratedOutfit = z.infer<typeof OutfitSchema>;
