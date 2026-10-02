import { useMemo, useState } from "react";
import { ChevronDown, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "@/components/admin/ProductForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/hooks/useProducts";
import { useDeleteProduct, useSaveSkus, useUpdateProduct } from "@/hooks/useAdminProducts";
import { useSkus } from "@/hooks/useSkus";
import { getErrorMessage } from "@/lib/error-message";

const COLUMNS = [
  { key: "image", label: "Image", defaultVisible: true },
  { key: "title", label: "Title", defaultVisible: true },
  { key: "category", label: "Category", defaultVisible: true },
  { key: "brand", label: "Brand", defaultVisible: false },
  { key: "price", label: "Price", defaultVisible: true },
  { key: "discount", label: "Discount", defaultVisible: false },
  { key: "rating", label: "Rating", defaultVisible: false },
  { key: "variants", label: "Variants", defaultVisible: true },
  { key: "badge", label: "Badge", defaultVisible: false },
  { key: "tags", label: "Tags", defaultVisible: false },
  { key: "stripePriceId", label: "Stripe Price ID", defaultVisible: false },
];

const renderCell = (key, product) => {
  switch (key) {
    case "image":
      return (
        <img
          src={product.image}
          alt={product.title}
          className="h-12 w-12 rounded-md border border-border/60 object-cover"
        />
      );
    case "title":
      return <span className="font-medium">{product.title}</span>;
    case "category":
      return <span className="capitalize">{product.category}</span>;
    case "brand":
      return product.brand;
    case "price":
      return `$${product.price}`;
    case "discount":
      return product.discount ? `${product.discount}%` : "—";
    case "rating":
      return (
        <>
          {product.rating ?? "—"}
          {product.reviewSummary?.totalCount ? (
            <span className="ml-1 text-xs text-muted-foreground">
              ({product.reviewSummary.totalCount})
            </span>
          ) : null}
        </>
      );
    case "variants":
      return product.variants?.length
        ? `${product.variants.length} group${product.variants.length === 1 ? "" : "s"}`
        : "No variants";
    case "badge":
      return product.badge || "—";
    case "tags":
      return (
        <div className="flex flex-wrap gap-1">
          {(product.tags || []).map((tag) => (
            <Badge key={tag} variant="secondary" className="whitespace-nowrap">
              {tag}
            </Badge>
          ))}
        </div>
      );
    case "stripePriceId":
      return product.stripePriceId || "—";
    default:
      return null;
  }
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const saveSkus = useSaveSkus();
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    () => new Set(COLUMNS.filter((column) => column.defaultVisible).map((column) => column.key))
  );
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: editingSkus, isLoading: isLoadingSkus } = useSkus(editingProduct?.id);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const activeColumns = COLUMNS.filter((column) => visibleColumns.has(column.key));

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products || [];

    return (products || []).filter((product) => {
      const haystack = [product.title, product.category, product.brand, product.productId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [products, search]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Product deleted.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete product."));
    }
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleEditSubmit = async ({ skus, ...productValues }) => {
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: productValues });
      await saveSkus.mutateAsync({ productId: editingProduct.id, skus });
      toast.success("Product updated.");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save product."));
    }
  };

  return (
    <section className="flex h-[calc(100vh-150px)] flex-col space-y-4" data-testid="admin-products-page">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage the product catalog.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, category, or brand"
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {COLUMNS.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.has(column.key)}
                  onCheckedChange={() => toggleColumn(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card/70 [&>div]:h-full">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              {activeColumns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={activeColumns.length + 1} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={activeColumns.length + 1} className="text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}

            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                {activeColumns.map((column) => (
                  <TableCell key={column.key}>{renderCell(column.key, product)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      aria-label="Edit product"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete product"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 p-0">
          <DialogHeader className="border-b border-border/60 px-6 py-4">
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          {editingProduct && isLoadingSkus && (
            <p className="px-6 py-4 text-sm text-muted-foreground">Loading variants...</p>
          )}
          {editingProduct && !isLoadingSkus && (
            <ProductForm
              initialValues={editingProduct}
              initialSkus={editingSkus}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isSubmitting={updateProduct.isPending || saveSkus.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
