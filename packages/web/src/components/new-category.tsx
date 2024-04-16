import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Label } from "./ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

export function NewCategory({ setCategories }:any) {
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useKindeAuth();

  const addCategory = async () => {
    if(loading) return
    
    setLoading(true);
    console.log("add category", category);

    const token = await getToken();

    fetch(import.meta.env.VITE_APP_API_URL + "/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ name: category }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategory("");
        setCategories(data.list);
        setLoading(false);
      });
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="category">new category</Label>
      <Input
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      ></Input>

      <Button onClick={() => addCategory()} disabled={!category.trim()}>
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Add Category
      </Button>
    </div>
  );
}
