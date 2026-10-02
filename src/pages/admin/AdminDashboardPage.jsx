export default function AdminDashboardPage() {
  return (
    <section className="rounded-3xl border border-border/60 bg-card/70 p-8" data-testid="admin-dashboard-page">
      <h1 className="text-2xl font-semibold text-foreground">Admin dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage the storefront from here. Start with hero slides on the left.
      </p>
    </section>
  );
}
