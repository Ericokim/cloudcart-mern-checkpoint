import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../lib/api/client";
import { getProducts } from "../lib/api/products";

export function useProducts(filters) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const loadProducts = useCallback(async (retries = 0) => {
    setIsLoading(true);

    try {
      const data = await getProducts(filters);
      setProducts(data);
      setToast({ message: "", type: "info" });
      setIsLoading(false);
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => loadProducts(retries - 1), 800);
        return;
      }

      setToast({
        message: getErrorMessage(error, "Could not load products."),
        type: "error"
      });
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => loadProducts(5), 250);
    return () => clearTimeout(timeoutId);
  }, [loadProducts]);

  return { isLoading, loadProducts, products, setToast, toast };
}
