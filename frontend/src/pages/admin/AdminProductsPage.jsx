import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Toast } from "../../components/shared/Toast";
import { getErrorMessage } from "../../lib/api/client";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "../../lib/api/products";

const inputClass =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: ""
};

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Could not load products."), type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || ""
    });
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim() || form.price === "" || form.stock === "") {
      setToast({ message: "Name, description, price, and stock are required.", type: "error" });
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim()
    };

    setIsSaving(true);
    setToast({ message: editingId ? "Updating product..." : "Creating product...", type: "info" });
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setToast({ message: "Product updated.", type: "success" });
      } else {
        await createProduct(payload);
        setToast({ message: "Product created.", type: "success" });
      }
      resetForm();
      await loadProducts();
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Save failed."), type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }
    setToast({ message: "Deleting product...", type: "info" });
    try {
      await deleteProduct(product._id);
      if (editingId === product._id) {
        resetForm();
      }
      setToast({ message: "Product deleted.", type: "success" });
      await loadProducts();
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Delete failed."), type: "error" });
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-5 px-4 py-6">
      <Toast message={toast.message} type={toast.type} />
      <h1 className="text-2xl font-bold text-slate-900">Manage products</h1>

      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-3">
          {isLoading ? (
            [1, 2, 3].map((item) => (
              <div className="h-20 rounded-2xl bg-white ring-1 ring-slate-200" key={item} />
            ))
          ) : products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-semibold text-slate-500">
              No products yet. Create one using the form.
            </p>
          ) : (
            products.map((product) => (
              <article
                className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200"
                key={product._id}
              >
                <img
                  className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                  src={product.image}
                  alt={product.name}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-slate-900">{product.name}</h3>
                  <p className="text-xs font-semibold text-slate-500">
                    ${product.price.toFixed(2)} · {product.stock} in stock
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  type="button"
                  onClick={() => startEdit(product)}
                >
                  <Pencil aria-hidden="true" size={15} />
                  Edit
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  type="button"
                  onClick={() => handleDelete(product)}
                >
                  <Trash2 aria-hidden="true" size={15} />
                  Delete
                </button>
              </article>
            ))
          )}
        </div>

        <form
          className="sticky top-20 grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 max-lg:static"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? "Edit product" : "New product"}
            </h2>
            {editingId && (
              <button
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                type="button"
                onClick={resetForm}
              >
                <X aria-hidden="true" size={15} />
                Cancel
              </button>
            )}
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="name">
            Name
            <input className={inputClass} id="name" name="name" value={form.name} onChange={updateField} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="description">
            Description
            <textarea
              className={`${inputClass} min-h-20`}
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="price">
              Price
              <input
                className={inputClass}
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateField}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="stock">
              Stock
              <input
                className={inputClass}
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={updateField}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="image">
            Image URL
            <input className={inputClass} id="image" name="image" value={form.image} onChange={updateField} />
          </label>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-500"
            type="submit"
            disabled={isSaving}
          >
            <Plus aria-hidden="true" size={16} />
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create product"}
          </button>
        </form>
      </section>
    </main>
  );
}
