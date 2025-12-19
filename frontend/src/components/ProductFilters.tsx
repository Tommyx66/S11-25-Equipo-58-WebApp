"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { Righteous } from "next/font/google";

const righteous = Righteous({ subsets: ["latin"], weight: "400" });
interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { val: string; label: string }[];
}

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
      {label}
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-white border-gray-200 h-11 text-sm focus:ring-[#0F8354] rounded-lg">
        <SelectValue placeholder="Seleccionar" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.val}
            value={opt.val}
            className="text-sm cursor-pointer"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

interface ProductFiltersProps {
  filters: {
    categoria: string;
    precioMax: number[];
    impacto: string;
    marca: string;
    ordenar: string;
    material: string;
    origen: string;
  };
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  availableBrands: string[];
  availableMaterials: string[];
}

export function ProductFilters({
  filters,
  setFilter,
  resetFilters,
  availableBrands,
  availableMaterials,
}: ProductFiltersProps) {
  const categories = [
    "Todas",
    "Ropa",
    "Hogar",
    "Accesorios",
    "Cuidado Personal",
  ];

  return (
    <div className="mb-12 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2
          className={`${righteous.className} flex items-center gap-3 text-2xl md:text-3xl text-gray-900`}
        >
          <Filter className="h-6 w-6 text-[#0F8354]" strokeWidth={2.5} />
          Filtrar por categoría
        </h2>

        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 text-sm font-medium self-start md:self-auto transition-colors"
        >
          Limpiar filtro <X className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* FILA 1 */}
      <div className="flex flex-col xl:flex-row gap-8 mb-8">
        {/* Categorías */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = filters.categoria === category;
              return (
                <button
                  key={category}
                  onClick={() => setFilter("categoria", category)}
                  className={`
                            px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                            ${
                              isActive
                                ? "bg-[#0F8354] text-white shadow-md shadow-green-900/20 transform scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                            }
                        `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Precio Slider */}
        <div className="w-full xl:w-[350px] bg-white p-1 rounded-xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-500">Precio máximo</span>
              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                ${filters.precioMax[0].toLocaleString()}
              </span>
            </div>
            <Slider
              value={filters.precioMax}
              onValueChange={(val) => setFilter("precioMax", val)}
              max={200000}
              step={1000}
              className="py-2 [&>.relative>.bg-primary]:bg-[#0F8354] [&>.block]:border-[#0F8354] [&>.block]:bg-white"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>$0</span>
              <span>$200k</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILA 2*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FilterSelect
          label="Impacto de Huella"
          value={filters.impacto}
          onChange={(v) => setFilter("impacto", v)}
          options={[
            { val: "all", label: "Todos los niveles" },
            { val: "low", label: "Bajo Impacto" },
            { val: "medium", label: "Medio Impacto" },
            { val: "neutro", label: "Carbono Neutro" },
          ]}
        />

        <FilterSelect
          label="Marca"
          value={filters.marca}
          onChange={(v) => setFilter("marca", v)}
          options={[
            { val: "all", label: "Todas" },
            ...availableBrands.map((b) => ({ val: b, label: b })),
          ]}
        />

        <FilterSelect
          label="Material"
          value={filters.material}
          onChange={(v) => setFilter("material", v)}
          options={[
            { val: "all", label: "Todos" },
            ...availableMaterials.map((m) => ({
              val: m.toLowerCase(),
              label: m.charAt(0).toUpperCase() + m.slice(1).replace("_", " "),
            })),
          ]}
        />

        <FilterSelect
          label="Origen"
          value={filters.origen}
          onChange={(v) => setFilter("origen", v)}
          options={[
            { val: "all", label: "Todos" },
            { val: "local", label: "Producción Local" },
            { val: "international", label: "Internacional" },
          ]}
        />

        <FilterSelect
          label="Ordenar por"
          value={filters.ordenar}
          onChange={(v) => setFilter("ordenar", v)}
          options={[
            { val: "relevant", label: "Más relevantes" },
            { val: "price-asc", label: "Menor precio" },
            { val: "price-desc", label: "Mayor precio" },
          ]}
        />
      </div>
    </div>
  );
}
