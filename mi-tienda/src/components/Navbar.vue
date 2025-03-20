<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const nombreTienda = "TechStore";

// Estado para seleccionar un producto
const productoSeleccionado = ref("Todos");

// Cambiar la vista al seleccionar un producto
const cambiarVista = () => {
  if (productoSeleccionado.value === "Todos") {
    router.push("/");
  } else {
    router.push(`/producto/${productoSeleccionado.value}`);
  }
};
</script>

<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <!-- Logo y nombre -->
    <div class="flex items-center gap-3">
      <img src="/logo.webp" alt="Logo" class="h-10 w-10" />
      <h1 class="text-xl font-bold">{{ nombreTienda }}</h1>
    </div>

    <!-- Selección de producto -->
    <div>
      <select
        v-model="productoSeleccionado"
        @change="cambiarVista"
        class="bg-gray-700 text-white p-2 rounded"
      >
        <option value="Todos">Ventana Principal</option>
        <option value="Laptop">Laptop</option>
        <option value="Mouse">Mouse</option>
        <option value="Teclado">Teclado</option>
      </select>
    </div>
  </nav>
</template>
