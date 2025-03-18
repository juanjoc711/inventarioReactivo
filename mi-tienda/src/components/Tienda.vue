<script setup lang="ts">
import { reactive, watch } from "vue";

// Definir lista de productos con reactive()
const productos = reactive([
  { nombre: "Laptop", precio: 1000, stock: 5, disponible: true },
  { nombre: "Mouse", precio: 50, stock: 2, disponible: true },
  { nombre: "Teclado", precio: 80, stock: 0, disponible: false },
]);

// Watch para actualizar la propiedad disponible
productos.forEach((producto) => {
  watch(
    () => producto.stock,
    (nuevoValor) => {
      producto.disponible = nuevoValor > 0;
    }
  );
});

// Funciones para modificar stock
const aumentarStock = (producto: { stock: number }) => {
  producto.stock++;
};
const disminuirStock = (producto: { stock: number }) => {
  if (producto.stock > 0) producto.stock--;
};
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Inventario de Productos</h1>
    
    <!-- Grid para alinear productos en 3 columnas en pantallas grandes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(producto, index) in productos" :key="index" 
           class="border rounded-lg shadow-lg p-6 bg-white flex flex-col items-center text-center">
        <h2 class="text-xl font-semibold">{{ producto.nombre }}</h2>
        <p class="text-gray-600 text-lg font-medium">${{ producto.precio }}</p>
        <p class="text-sm text-gray-500">Stock: {{ producto.stock }}</p>
        
        <!-- Color dinámico para disponibilidad con CSS en línea -->
        <p class="text-lg font-bold mt-2" :style="{ color: producto.disponible ? 'green' : 'red' }">
          {{ producto.disponible ? "Disponible" : "Agotado" }}
        </p>
        
        <div class="mt-4 flex gap-2">
          <button @click="aumentarStock(producto)" 
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            +
          </button>
          <button @click="disminuirStock(producto)" 
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            -
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
