<script setup lang="ts">
import ProductoDetalle from "../components/ProductoDetalle.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Obtener la ruta y el router
const route = useRoute();
const router = useRouter();

// Estado para almacenar el nombre del producto y el objeto del producto
const nombreProducto = ref(route.params.nombre);
const productos = ref([
  { nombre: "Laptop", precio: 1000, stock: 5, disponible: true },
  { nombre: "Mouse", precio: 50, stock: 2, disponible: true },
  { nombre: "Teclado", precio: 80, stock: 0, disponible: false },
]);

// Encontrar el producto seleccionado
const producto = ref(productos.value.find((p) => p.nombre === nombreProducto.value));

// **Detectar cambios en la URL y actualizar el producto**
watch(
  () => route.params.nombre,
  (nuevoNombre) => {
    nombreProducto.value = nuevoNombre;
    producto.value = productos.value.find((p) => p.nombre === nuevoNombre);

    // Si no encuentra el producto, volver a la vista principal
    if (!producto.value) {
      router.push("/");
    }
  }
);
</script>

<template>
  <div class="container mx-auto p-6">
    <ProductoDetalle v-if="producto" :producto="producto" @volver="router.push('/')" />
    <p v-else class="text-red-500 text-center">Producto no encontrado.</p>
  </div>
</template>
