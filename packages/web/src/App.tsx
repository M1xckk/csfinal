import { useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { AuthForm } from "./components/auth-form";
import { Products } from "./components/products";
import { NewCategory } from "./components/new-category";
import { useApp } from "./hooks/useApp";
import { DividerHorizontalIcon } from "@radix-ui/react-icons";

function App() {
  const { user, isAuthenticated, logout, getToken } = useKindeAuth();
  const {
    categories,
    setCategories,
    loadCategories,
    products,
    loadProducts,
    addProduct,
    delProduct,
    selectedCategory,
    setSelectedCategory,
    loading,
  } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      getToken().then((token) => {
        console.log(token);
      });
      loadCategories();
      loadProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  return isAuthenticated ? (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between h-16 border-b px-4">
        <div>ProdSnap</div>
        <div className="flex items-center gap-4">
          <h2>{user?.email}</h2>
          <button onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </header>
      <div className="flex flex-grow">
        <div className=" w-1/5 border-r h-100 p-4">
          <h2 className=" mb-4 pb-4 border-b">Categories</h2>
          <div
            className={`p-2 cursor-pointer  hover:bg-blue-300 ${
              selectedCategory == "all" ? " text-blue-500" : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            <h3>All</h3>
          </div>
          {categories.map((category) => (
            <div
              key={category.name}
              className={`p-2 cursor-pointer  hover:bg-blue-300 ${
                selectedCategory === category.name ? "text-blue-500" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <h3>{category.name}</h3>
            </div>
          ))}
          <DividerHorizontalIcon className="w-full h-6 my-4"></DividerHorizontalIcon>
          <NewCategory setCategories={setCategories}></NewCategory>
        </div>
        <div className="flex-grow p-4">
          <Products
            loading={loading}
            products={products}
            delProduct={delProduct}
            addProduct={addProduct}
            categories={categories.map((category) => category.name)}
          ></Products>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <AuthForm></AuthForm>
    </div>
  );
}

export default App;
