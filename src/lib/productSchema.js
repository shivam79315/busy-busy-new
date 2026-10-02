export const PRODUCT_CATEGORIES = ["audio", "footwear", "watches", "skincare"];

export const DEFAULT_SKU_ID = "default";

// Builds a stable, readable id from an option-value combination, e.g.
// { Color: "Black", Size: "M" } -> "black__m". No variants -> "default".
export function buildSkuId(optionValues) {
  const values = Object.values(optionValues || {});
  if (!values.length) return DEFAULT_SKU_ID;
  return values
    .map((value) => value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
    .join("__");
}

// Cartesian product of variant groups into one row per real combination.
// variants: [{ name: "Color", options: ["Black", "White"] }, ...]
export function buildSkuCombinations(variants) {
  const groups = (variants || []).filter((group) => group.name && group.options?.length);
  if (!groups.length) {
    return [{ id: DEFAULT_SKU_ID, optionValues: {} }];
  }

  let combinations = [{}];
  groups.forEach((group) => {
    const next = [];
    combinations.forEach((combo) => {
      group.options.forEach((option) => {
        next.push({ ...combo, [group.name]: option });
      });
    });
    combinations = next;
  });

  return combinations.map((optionValues) => ({
    id: buildSkuId(optionValues),
    optionValues,
  }));
}

export function validateProduct(data) {
  const errors = [];

  if (!data.title?.trim()) errors.push("Title is required.");
  if (!data.category || !PRODUCT_CATEGORIES.includes(data.category)) errors.push("Category must be a known category.");
  if (!data.image?.trim()) errors.push("Image URL is required.");
  if (typeof data.price !== "number" || Number.isNaN(data.price) || data.price < 0) {
    errors.push("Price must be a non-negative number.");
  }
  if (!Array.isArray(data.galleryImages)) errors.push("Gallery images must be an array.");
  if (!Array.isArray(data.tags)) errors.push("Tags must be an array.");
  if (!Array.isArray(data.variants)) errors.push("Variants must be an array.");

  return { valid: errors.length === 0, errors };
}
