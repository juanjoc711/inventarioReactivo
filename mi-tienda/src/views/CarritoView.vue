<script setup lang="ts">
import { useCarritoStore } from "../stores/useCarritoStore";
import { useRouter } from "vue-router";

const carrito = useCarritoStore();
const router = useRouter();
</script>

<template>
  <div class="container mx-auto p-6">
    <button @click="router.push('/')" class="mb-4 text-blue-600 underline">⬅ Volver</button>

    <h1 class="text-2xl font-bold mb-4">🛒 Tu Carrito</h1>

    <div v-if="carrito.items.length === 0" class="text-gray-600">El carrito está vacío.</div>

    <div v-else>
      <div
        v-for="item in carrito.items"
        :key="item.id"
        class="border-b py-4 flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ item.nombre }}</p>
          <p class="text-sm text-gray-500">Cantidad: {{ item.cantidad }}</p>
        </div>

        <div class="flex items-center gap-2">
          <p>${{ item.precio * item.cantidad }}</p>
          <button
            @click="(e) => { carrito.restarUno(item.id); (e.target as HTMLElement)?.blur(); }"
            class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            -
          </button>
          <button
            @click="(e) => { carrito.quitarProducto(item.id); (e.target as HTMLElement)?.blur(); }"
            class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            🗑
          </button>
        </div>
      </div>

      <div class="mt-6 text-right font-bold text-lg">
        Total: ${{ carrito.totalPrecio }}
      </div>
    </div>
  </div>
</template>
