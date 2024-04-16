import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductForm } from "./product-form";
import { Product } from "@/lib/types";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";

export function Products({
  products,
  delProduct,
  addProduct,
  categories,
  loading,
}: {
  products: Product[];
  delProduct: Function;
  addProduct: Function;
  categories: string[];
  loading: boolean;
}) {
  return (
    <div>
      <div className="flex  items-center justify-between">
        <h2>Product List</h2>
        <ProductForm
          addProduct={addProduct}
          categories={categories}
        ></ProductForm>
      </div>
      {loading && (
        <div className="flex items-center justify-center h-20">
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="w-[160px]">
                <img src={product.imageUrl} alt={product.name} />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">${product.price}</TableCell>
              <TableCell>
                <span
                  className="cursor-pointer text-destructive"
                  onClick={() => delProduct(product.id)}
                  title="Delete Product"
                >
                  <TrashIcon /> 
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
