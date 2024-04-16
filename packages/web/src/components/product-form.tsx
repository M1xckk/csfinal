import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.number().positive(),
  image: z.unknown(),
});

export function ProductForm({ categories, addProduct }: any) {
  const [open, setOpen] = useState(false);
  const [errMessage, setErrMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [filePreviewURL, setFilePreviewURL] = useState<string | undefined>();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) return;

    if (!values.image) {
      setErrMessage("Please select an image");
      return;
    }

    setLoading(true);
    await addProduct(values);
    form.reset();
    setOpen(false);
    setFilePreviewURL(undefined);
    setLoading(false);
  }

  useEffect(() => {
    setErrMessage(undefined);
  }, [filePreviewURL]);

  return (
    <Drawer
      open={open}
      // onClose={() => setOpen(false)}
      onOpenChange={(v) => setOpen(v)}
    >
      <DrawerTrigger>
        <Button onClick={() => setOpen(true)}>New Product</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Product</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-20 w-full flex flex-col justify-between pb-10"
          >
            <div className="flex gap-5 w-full">
              <div className="flex-grow">
                <div>
                  <FormField
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <Label>
                          Image
                          {filePreviewURL && (
                            <img
                              className="max-w-40 m-auto"
                              src={filePreviewURL}
                            />
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            // onBlur={field.handleBlur}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (filePreviewURL) {
                                URL.revokeObjectURL(filePreviewURL);
                              }
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setFilePreviewURL(url);
                              } else {
                                setFilePreviewURL(undefined);
                              }
                              field.onChange(file);
                            }}
                          />
                        </Label>
                        <FormMessage />
                        <div className=" text-red-600">{errMessage}</div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex-grow flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category:any) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
