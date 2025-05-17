<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { fetchProductos, actualizarStock as actualizarStockAPI } from "../api/api";
import { useCarritoStore } from "../stores/useCarritoStore";

const carrito = useCarritoStore();

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  disponible: boolean;
}

const productos = reactive<{ lista: Producto[] }>({ lista: [] });

const cargarProductos = async () => {
  productos.lista = await fetchProductos();
};

const actualizarStock = async (producto: Producto, cantidad: number) => {
  const actualizado = await actualizarStockAPI(producto.id, cantidad);
  producto.stock = actualizado.stock;
  producto.disponible = actualizado.disponible;
};

const agregarAlCarrito = async (producto: Producto) => {
  if (producto.stock > 0) {
    await carrito.agregarProducto(producto);
    const actualizado = await actualizarStockAPI(producto.id, -1);
    producto.stock = actualizado.stock;
    producto.disponible = actualizado.disponible;
  }
};

onMounted(cargarProductos);
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Inventario de Productos</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div
        v-for="producto in productos.lista"
        :key="producto.id"
        class="border rounded-lg shadow-lg p-6 bg-white flex flex-col items-center text-center"
      >
        <h2 class="text-xl font-semibold">{{ producto.nombre }}</h2>
        <p class="text-gray-600 text-lg font-medium">${{ producto.precio }}</p>
        <p class="text-sm text-gray-500">Stock: {{ producto.stock }}</p>
        <p class="text-lg font-bold mt-2" :style="{ color: producto.disponible ? 'green' : 'red' }">
          {{ producto.disponible ? "Disponible" : "Agotado" }}
        </p>

        <div class="mt-4 flex gap-2">
          <button @click="(e) => { actualizarStock(producto, 1); (e.target as HTMLElement)?.blur(); }"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            +
          </button>
          <button @click="(e) => { actualizarStock(producto, -1); (e.target as HTMLElement)?.blur(); }"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            -
          </button>
          <button @click="(e) => { agregarAlCarrito(producto); (e.target as HTMLElement)?.blur(); }"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            🛒
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
