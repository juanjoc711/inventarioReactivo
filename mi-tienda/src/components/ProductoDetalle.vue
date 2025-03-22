<script setup lang="ts">

// Recibir el producto desde la vista padre
const props = defineProps(["producto"]);

// Emitir evento para actualizar el stock
const emit = defineEmits(["actualizar-stock"]);
</script>

<template>
  <div class="border rounded-lg shadow-lg p-6 bg-white text-center">
    <h2 class="text-2xl font-bold">{{ producto.nombre }}</h2>
    
    <!-- Mostrar imagen -->
    <img :src="producto.imagen" :alt="producto.nombre" class="w-48 h-48 object-cover mx-auto my-4 rounded-lg" />

    <p class="text-gray-600 text-lg">${{ producto.precio }}</p>
    <p class="text-sm text-gray-500">Stock: {{ producto.stock }}</p>
    <p class="text-lg font-bold" :style="{ color: producto.disponible ? 'green' : 'red' }">
      {{ producto.disponible ? "Disponible" : "Agotado" }}
    </p>

    <!-- Botones para modificar stock -->
    <div class="mt-4 flex justify-center gap-2">
      <button 
        @click="emit('actualizar-stock', 1)" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        +
      </button>
      <button 
        @click="emit('actualizar-stock', -1)" 
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        -
      </button>
    </div>
  </div>
</template>
