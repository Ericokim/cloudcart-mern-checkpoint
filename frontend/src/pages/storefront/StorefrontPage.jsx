import { useState } from "react";
import { Toast } from "../../components/shared/Toast";
import { CartPanel } from "../../components/storefront/CartPanel";
import { Hero } from "../../components/storefront/Hero";
import { ProductFilters } from "../../components/storefront/ProductFilters";
import { ProductGrid } from "../../components/storefront/ProductGrid";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { createOrder } from "../../lib/api/orders";
import { getErrorMessage } from "../../lib/api/client";

export function StorefrontPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    sort: "newest",
    stock: "all"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, loadProducts, products, setToast, toast } = useProducts(filters);
  const { addToCart, cart, clearCart, removeFromCart, total, updateQuantity } = useCart();

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value
    }));
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !deliveryAddress.trim() || cart.length === 0) {
      setToast({
        message: "Add your name, email, delivery address, and at least one product.",
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);
    setToast({ message: "Placing order...", type: "info" });

    try {
      const order = await createOrder({
        customerEmail,
        customerName,
        customerPhone,
        deliveryAddress,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      clearCart();
      setCustomerEmail("");
      setCustomerName("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setToast({
        message: `Order placed. Total: $${order.total.toFixed(2)}`,
        type: "success"
      });
      await loadProducts();
    } catch (error) {
      setToast({
        message: getErrorMessage(error, "Order failed."),
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-5 px-4 py-6">
      <Toast message={toast.message} type={toast.type} />
      <Hero />

      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <ProductFilters
            filters={filters}
            isLoading={isLoading}
            onChange={updateFilter}
            onRefresh={loadProducts}
            resultCount={products.length}
          />
          <ProductGrid
            isLoading={isLoading}
            products={products}
            onAddToCart={addToCart}
            onRefresh={loadProducts}
          />
        </div>
        <CartPanel
          cart={cart}
          cartTotal={total}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          deliveryAddress={deliveryAddress}
          isSubmitting={isSubmitting}
          onCustomerEmailChange={setCustomerEmail}
          onCustomerNameChange={setCustomerName}
          onCustomerPhoneChange={setCustomerPhone}
          onDeliveryAddressChange={setDeliveryAddress}
          onPlaceOrder={placeOrder}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      </section>
    </main>
  );
}
