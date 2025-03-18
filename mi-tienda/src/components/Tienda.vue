<script setup lang="ts">
import { reactive, watch } from "vue";

// Definir lista de productos con reactive()
const productos = reactive([
  { nombre: "Laptop", precio: 1000, stock: 5, disponible: true },
  { nombre: "Mouse", precio: 50, stock: 2, disponible: true },
  { nombre: "Teclado", precio: 80, stock: 0, disponible: false },
]);

// Usamos watch() para actualizar la propiedad disponible
productos.forEach((producto, index) => {
  watch(
    () => producto.stock,
    (nuevoValor) => {
      productos[index].disponible = nuevoValor > 0;
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
  <div>
    <h1>Inventario</h1>
    <ul>
      <li v-for="(producto, index) in productos" :key="index">
        <strong>{{ producto.nombre }}</strong> - ${{ producto.precio }}
        <p>Stock: {{ producto.stock }}</p>
        <p :style="{ color: producto.disponible ? 'green' : 'red' }">
          {{ producto.disponible ? "Disponible" : "Agotado" }}
        </p>
        <button @click="aumentarStock(producto)">Aumentar Stock</button>
        <button @click="disminuirStock(producto)">Disminuir Stock</button>
      </li>
    </ul>
  </div>
</template>
