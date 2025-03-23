<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCarritoStore } from "../stores/useCarritoStore";

const productos = ["Todos", "Laptop", "Mouse", "Teclado"];
const seleccion = ref("Todos");

const router = useRouter();
const route = useRoute();

const carrito = useCarritoStore();
const totalCarrito = computed(() => carrito.totalCantidad);

const cambiarVista = () => {
  if (seleccion.value === "Todos") {
    router.push("/");
  } else {
    router.push(`/producto/${seleccion.value}`);
  }
};

watch(
  () => route.params.nombre,
  (nuevoNombre) => {
    seleccion.value = nuevoNombre ? String(nuevoNombre) : "Todos";
  },
  { immediate: true }
);

watch(
  () => route.path,
  (nuevaRuta) => {
    if (nuevaRuta === "/") {
      seleccion.value = "Todos";
    }
  },
  { immediate: true }
);
</script>

<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img src="/logo.webp" alt="Logo" class="w-10 h-10" />
      <h1 class="text-xl font-bold">TechStore</h1>
    </div>

    <div class="flex items-center gap-6">
      <select
        v-model="seleccion"
        @change="cambiarVista"
        class="bg-gray-700 text-white p-2 rounded"
      >
        <option v-for="producto in productos" :key="producto" :value="producto">
          {{ producto }}
        </option>
      </select>

      <router-link to="/carrito" class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.2 6m13.2-6l1.2 6M9 21h6" />
        </svg>
        <span v-if="totalCarrito > 0" class="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full px-2">
          {{ totalCarrito }}
        </span>
      </router-link>
    </div>
  </nav>
</template>
