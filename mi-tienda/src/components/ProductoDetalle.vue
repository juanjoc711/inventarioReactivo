<script setup lang="ts">

// Recibir el producto desde la vista padre
const props = defineProps(["producto"]);

// Emitir evento para volver a la vista general
const emitirCambio = defineEmits(["volver"]);
</script>

<template>
  <div class="container mx-auto p-6">
    <button @click="$emit('volver')" class="mb-4 text-blue-600 underline">⬅ Volver</button>
    <div class="border rounded-lg shadow-lg p-6 bg-white text-center">
      <h2 class="text-2xl font-bold">{{ producto.nombre }}</h2>
      <p class="text-gray-600 text-lg">${{ producto.precio }}</p>
      <p class="text-sm text-gray-500">Stock: {{ producto.stock }}</p>
      <p class="text-lg font-bold" :style="{ color: producto.disponible ? 'green' : 'red' }">
        {{ producto.disponible ? "Disponible" : "Agotado" }}
      </p>
    </div>
  </div>
</template>
