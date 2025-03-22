<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Productos disponibles en el dropdown
const productos = ["Todos", "Laptop", "Mouse", "Teclado"];
const seleccion = ref("Todos");

// Obtener el router de Vue
const route = useRoute();
const router = useRouter();

// Función para cambiar la vista
const cambiarVista = () => {
  if (seleccion.value === "Todos") {
    router.push("/"); // Ir a la vista principal
  } else {
    router.push(`/producto/${seleccion.value}`); // Ir a la vista del producto seleccionado
  }
};

// Detectar cambios en la URL y actualizar el desplegable
watch(
  () => route.params.nombre,
  (nuevoNombre) => {
    seleccion.value = nuevoNombre ? String(nuevoNombre) : "Todos";
  },
  { immediate: true }
);
</script>

<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img src="/logo.webp" alt="Logo" class="w-10 h-10">
      <h1 class="text-xl font-bold">TechStore</h1>
    </div>

    <!-- Dropdown para seleccionar vista -->
    <select v-model="seleccion" @change="cambiarVista" class="bg-gray-700 text-white p-2 rounded">
      <option v-for="producto in productos" :key="producto" :value="producto">
        {{ producto }}
      </option>
    </select>
  </nav>
</template>
