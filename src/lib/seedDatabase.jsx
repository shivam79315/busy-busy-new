import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../api/firebase";
import { useState } from "react";

import {
  PRODUCT_CATALOG,
  PRODUCT_LIST_META,
  CATEGORY_GALLERY_IMAGES,
  CATEGORY_VARIANTS,
  CATEGORY_SPECIFICATIONS,
  CATEGORY_TECH_DETAILS,
  CATEGORY_FAQS,
  CATEGORY_REVIEWS,
} from "../lib/product-ui-data";

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false);

  async function clearCollection(name) {
    const snapshot = await getDocs(collection(db, name));
    const promises = snapshot.docs.map((d) => deleteDoc(doc(db, name, d.id)));
    await Promise.all(promises);
  }

  async function resetDatabase() {
    try {
      setLoading(true);
      await clearCollection("products");
      await clearCollection("orders");
      alert("Database cleared.");
    } catch (error) {
      console.error(error);
      alert("Error clearing database");
    } finally {
      setLoading(false);
    }
  }

  async function seedProducts() {
    try {
      setLoading(true);

      for (const product of PRODUCT_CATALOG) {
        const meta = PRODUCT_LIST_META[product.id] || {};

        const gallery =
          [product.image_url, ...(CATEGORY_GALLERY_IMAGES[product.category] || [])]
            .filter((v, i, arr) => arr.indexOf(v) === i);

        const variants = CATEGORY_VARIANTS[product.category] || [];
        const specifications = CATEGORY_SPECIFICATIONS[product.category] || [];
        const technicalDetails = CATEGORY_TECH_DETAILS[product.category] || [];
        const faqs = CATEGORY_FAQS[product.category] || [];
        const reviews = CATEGORY_REVIEWS[product.category] || [];

        const reviewCount = 127 + (meta.discount || 10);

        const reviewSummary = {
          average: product.rating,
          totalCount: reviewCount,
          recommendationPercent: Math.min(
            99,
            82 + Math.floor(product.rating * 3)
          ),
          breakdown: [
            { stars: 5, percent: Math.min(92, 62 + Math.floor(product.rating * 6)) },
            { stars: 4, percent: 22 },
            { stars: 3, percent: 10 },
            { stars: 2, percent: 4 },
            { stars: 1, percent: 2 },
          ],
        };

        await setDoc(doc(db, "products", product.id), {
          productId: product.id,

          title: product.name,
          description: product.description,
          category: product.category,

          price: product.price,
          stripePriceId: null,

          image: product.image_url,
          galleryImages: gallery,

          rating: product.rating,
          badge: product.badge,

          brand: meta.brand || "CoreLine",
          discount: meta.discount || 10,
          tags: meta.tags || [],

          variants,
          specifications,
          technicalDetails,
          faqs,
          reviews,
          reviewSummary,

          inStock: true,
          createdAt: Timestamp.now(),
        });
      }

      alert("Products seeded with full detail data.");
    } catch (error) {
      console.error(error);
      alert("Error seeding products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Database Tools</h2>

      <button
        onClick={resetDatabase}
        disabled={loading}
        className="w-full rounded-lg bg-red-500 px-4 py-2 text-white"
      >
        Clear Database
      </button>

      <button
        onClick={seedProducts}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 px-4 py-2 text-white"
      >
        Seed Full Products
      </button>
    </div>
  );
}