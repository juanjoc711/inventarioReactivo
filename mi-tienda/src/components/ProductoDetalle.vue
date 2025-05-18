<script setup lang="ts">
defineProps(["producto"]);
const emit = defineEmits(["actualizar-stock", "agregar-al-carrito"]);
</script>

<template>
  <div class="border rounded-lg shadow-lg p-6 bg-white text-center">
    <h2 class="text-2xl font-bold">{{ producto.nombre }}</h2>

    <p class="text-gray-600 text-lg">${{ producto.precio }}</p>
    <p class="text-sm text-gray-500">Stock: {{ producto.stock }}</p>
    <p
      class="text-lg font-bold"
      :style="{ color: producto.disponible ? 'green' : 'red' }"
    >
      {{ producto.disponible ? "Disponible" : "Agotado" }}
    </p>

    <div class="mt-4 flex justify-center gap-2">
      <button
        @click="(e) => { emit('actualizar-stock', 1); (e.target as HTMLElement)?.blur(); }"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        +
      </button>
      <button
        @click="(e) => { emit('actualizar-stock', -1); (e.target as HTMLElement)?.blur(); }"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        -
      </button>
      <button
        @click="(e) => { emit('agregar-al-carrito'); (e.target as HTMLElement)?.blur(); }"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        🛒
      </button>
    </div>
  </div>
</template>
