import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/services/http/client";
import { apiMessage } from "@/utils/errors";

/**
 * The reference store. Copy this shape for new stores: isLoading and error
 * refs, try / catch / finally, a normalised message, and a rethrow so the
 * calling component can react.
 *
 * Nothing routes to it - it targets a /products endpoint the mock data does
 * not have, and exists to be read.
 */

export interface Product {
  id: number;
  name: string;
  price: number;
}

export type ProductDraft = Omit<Product, "id">;

export const useProductStore = defineStore("products", () => {
  /**STATE */
  const products = ref<Product[]>([]);
  const product = ref<Product | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**ACTIONS */
  async function fetchProducts(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await api.get<Product[]>("/products");
      products.value = data;
    } catch (err) {
      error.value = apiMessage(err, "Failed to fetch products.");
      console.error("Error fetching products:", err);
      /**throw so the component can react; the message is already recorded */
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProductById(productId: number): Promise<void> {
    isLoading.value = true;
    error.value = null;
    product.value = null;

    try {
      const { data } = await api.get<Product>(`/products/${productId}`);
      product.value = data;
    } catch (err) {
      error.value = apiMessage(err, "Product not found.");
      console.error("Error fetching product:", err);
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function addProduct(draft: ProductDraft): Promise<Product> {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await api.post<Product, ProductDraft>(
        "/products",
        draft,
      );
      /**Add the new product to the start of the local array */
      products.value = [data, ...products.value];
      return data;
    } catch (err) {
      error.value = apiMessage(err, "Failed to add product.");
      console.error("Error adding product:", err);
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProduct(
    productId: number,
    draft: Partial<ProductDraft>,
  ): Promise<Product> {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await api.patch<Product, Partial<ProductDraft>>(
        `/products/${productId}`,
        draft,
      );
      products.value = products.value.map((item) =>
        item.id === productId ? data : item,
      );
      if (product.value?.id === productId) product.value = data;
      return data;
    } catch (err) {
      error.value = apiMessage(err, "Failed to update product.");
      console.error("Error updating product:", err);
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteProduct(productId: number): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      await api.delete(`/products/${productId}`);
      products.value = products.value.filter((item) => item.id !== productId);
      if (product.value?.id === productId) product.value = null;
    } catch (err) {
      error.value = apiMessage(err, "Failed to delete product.");
      console.error("Error deleting product:", err);
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    products,
    product,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };
});
