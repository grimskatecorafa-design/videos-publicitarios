// Dummy code: puramente estético, no es lógica real.
export const LANDING_CODE = `// Injecting Hero Section UI...
export default function Landing() {
  return (
    <main className="bg-stone-50 text-neutral-900">
      {/* Navigation */}
      <header className="flex justify-between px-12 py-6">
        <Logo>studio.</Logo>
        <Nav items={["Proyectos", "Servicios", "Contacto"]} />
      </header>
      {/* Hero */}
      <section className="h-screen grid place-items-center">
        <Badge dot="green">Disponible 2026</Badge>
        <h1 className="text-9xl font-light tracking-tighter">
          Less noise. <em>More design.</em>
        </h1>
        <Button variant="pill" glow="orange">
          Empezar proyecto →
        </Button>
      </section>
    </main>
  );
}`;

export const STORE_CODE = `<!-- E-Commerce Grid Layout -->
import { ProductGrid, ProductCard, CartDrawer } from "@/ui";

export default function Shop() {
  return (
    <Storefront theme="streetwear">
      <Hero title="NO RULES. JUST FITS." drop="FW26" />
      {/* Rendering mock catalog... */}
      <ProductGrid cols={4} gap="lg">
        {drops.map((item) => (
          <ProductCard
            image={item.placeholder}
            price={item.price}
            badge="NEW ARRIVAL"
            sizes={["S", "M", "L", "XL"]}
            hover="lift"
            quickAdd
          />
        ))}
      </ProductGrid>
      {/* Floating cart widget */}
      <CartDrawer side="right" blur />
    </Storefront>
  );
}`;
