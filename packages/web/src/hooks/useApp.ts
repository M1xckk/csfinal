import { useState } from "react";
import { useApi } from "./useApi";
import { Category, Product } from "@/lib/types";

export const useApp = () => {
  const { fetchApi } = useApi();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all" as string);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await fetchApi("/category");
      console.log(data);
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }

    await fetchApi("/cs")
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/product", {
        method: "POST",
        body: JSON.stringify({ category: selectedCategory }),
      });
      console.log(data);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch products:", error);
    }
  };

  const addProduct = async (values: any) => {
    console.log(values);

    let imageUrl = await fetchApi("/upload", { method: "POST" }).then(
      (data) => data.url as string
    );
    console.log(imageUrl);

    const image = values.image as File;

    await fetch(imageUrl, {
      method: "PUT",
      body: image,
      headers: {
        "Content-Type": image.type,
      },
    });

    imageUrl = imageUrl.split("?")[0];

    const { name, category, price } = values;
    await fetchApi("/product", {
      method: "PUT",
      body: JSON.stringify({ name, category, price, imageUrl }),
    }).then(() => {
      loadProducts();
    });
  };

  const delProduct = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchApi(`/product/${id}`, {
        method: "DELETE",
      });
      console.log(data);
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return {
    loading,
    categories,
    setCategories,
    loadCategories,
    selectedCategory,
    setSelectedCategory,
    products,
    loadProducts,
    addProduct,
    delProduct,
  };
};
