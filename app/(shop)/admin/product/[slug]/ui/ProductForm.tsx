/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import {
  Category,
  Product,
  ProductImage as ProductWithImage,
} from "@/interfaces";
import { Size } from "@/app/generated/prisma";

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";

interface Props {
  product: Partial<
    Omit<Product, "category"> & {
      categoryId?: string;
      ProductImage?: ProductWithImage[];
    }
  >;
  categories: Category[];
}

const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const existingImages = product.ProductImage || [];

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const totalImages = existingImages.length + selectedImages.length;
  const remainingSlots = 2 - existingImages.length;

  const { handleSubmit, register, control, getValues, setValue } =
    useForm<FormInputs>({
      defaultValues: {
        title: product.title ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        price: product.price ?? 0,
        inStock: product.inStock ?? 0,
        tags: product.tags?.join(",") ?? "",
        gender: product.gender ?? "unisex",
        sizes: product.sizes ?? [],
        categoryId: product.categoryId ?? "",
      },
    });

  const selectedSizes = useWatch({
    control,
    name: "sizes",
    defaultValue: product.sizes ?? [],
  });

  const onSizeChanged = (size: string) => {
    const current = new Set(getValues("sizes"));
    if (current.has(size)) current.delete(size);
    else current.add(size);
    setValue("sizes", Array.from(current), { shouldValidate: true });
  };

  const onImagesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const allowedFiles = filesArray.slice(0, remainingSlots);

    setSelectedImages((prev) => [...prev, ...allowedFiles].slice(0, 2));
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (id: number, url: string) => {
    const res = await deleteProductImage(id, url);
    if (!res?.ok) return alert(res?.message || "No se pudo eliminar la imagen");
    router.refresh();
  };

  const onSubmit = async (data: FormInputs) => {
    setErrors({});
    const formData = new FormData();

    if (product.id) formData.append("id", product.id);

    Object.entries(data).forEach(([key, value]) => {
      if (key === "sizes") {
        formData.append(key, (value as string[]).join(","));
      } else {
        formData.append(key, value as any);
      }
    });

    selectedImages.forEach((file) => formData.append("images", file));

    const res = await createUpdateProduct(formData);

    if (!res?.ok) {
      if (res?.errors) setErrors(res.errors);
      else alert(res?.message || "No se pudo guardar el producto");
      return;
    }

    router.replace("/admin/products");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-6"
    >
      {/* ================= LEFT SIDE ================= */}
      <div className="w-full space-y-4">
        {["title", "slug", "description", "price", "tags"].map((field) => (
          <label key={field} className="flex flex-col">
            <span className="font-semibold">{field.toUpperCase()}</span>
            {field === "description" ? (
              <textarea
                {...register(field as any)}
                className="p-2 border rounded-md bg-gray-100"
                rows={4}
              />
            ) : (
              <input
                {...register(field as any)}
                type={field === "price" ? "number" : "text"}
                className="p-2 border rounded-md bg-gray-100"
              />
            )}
            {errors[field] && (
              <span className="text-red-500 text-sm">{errors[field]?.[0]}</span>
            )}
          </label>
        ))}

        <label className="flex flex-col">
          <span className="font-semibold">Gender</span>
          <select
            {...register("gender", { required: true })}
            className="p-2 border rounded-md bg-gray-100"
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Category</span>
          <select
            {...register("categoryId", { required: true })}
            className="p-2 border rounded-md bg-gray-100"
          >
            <option value="">[Seleccione]</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="w-full rounded-md py-2 px-4 text-white font-semibold"
          style={{ backgroundColor: "var(--blue-save)" }}
        >
          Guardar
        </button>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full space-y-4">
        <label className="flex flex-col">
          <span className="font-semibold">Inventario</span>
          <input
            {...register("inStock", { required: true, min: 0 })}
            type="number"
            className="p-2 border rounded-md bg-gray-100"
          />
        </label>

        <div>
          <span className="font-semibold">Tallas</span>
          <div className="flex flex-wrap mt-1">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 text-center",
                  !selectedSizes.includes(size) && "bg-gray-100",
                )}
                style={
                  selectedSizes.includes(size)
                    ? { backgroundColor: "var(--blue-save)", color: "white" }
                    : {}
                }
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* ================= IMAGE INPUT ================= */}
        {totalImages < 2 && (
          <label className="flex flex-col">
            <span className="font-semibold">Fotos (máximo 2)</span>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/avif"
              onChange={onImagesChanged}
              className="p-2 border rounded-md bg-gray-100"
            />
          </label>
        )}

        {/* ====== NUEVAS IMÁGENES (PREVIEW + DELETE) ====== */}
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {selectedImages.map((file, idx) => (
              <div key={idx} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-40 object-cover rounded-md shadow"
                  alt={file.name}
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ====== IMÁGENES EXISTENTES ====== */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {existingImages.map((img) => (
              <div key={img.id}>
                <ProductImage
                  src={img.url}
                  alt={product.title ?? ""}
                  width={300}
                  height={300}
                  className="rounded-md shadow"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id, img.url)}
                  className="w-full mt-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};
