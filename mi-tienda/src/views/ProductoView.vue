<script setup lang="ts">
import ProductoDetalle from "../components/ProductoDetalle.vue";
import { reactive, watch, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchProductos, actualizarStock as actualizarStockAPI } from "../api/api";
import { useCarritoStore } from "../stores/useCarritoStore";

const route = useRoute();
const router = useRouter();
const carrito = useCarritoStore();

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  disponible: boolean;
}

const producto = reactive<Producto>({
  id: 0,
  nombre: "",
  precio: 0,
  stock: 0,
  disponible: false
});

const cargando = ref(true);
const error = ref("");

// Cargar producto por nombre
const cargarProducto = async (nombreProducto: string) => {
  try {
    cargando.value = true;
    error.value = "";

    const productos = await fetchProductos();
    const encontrado = productos.find((p: Producto) => p.nombre.toLowerCase() === nombreProducto.toLowerCase());

    if (encontrado) {
      producto.id = encontrado.id;
      producto.nombre = encontrado.nombre;
      producto.precio = encontrado.precio;
      producto.stock = encontrado.stock;
      producto.disponible = encontrado.disponible;
    } else {
      error.value = "Producto no encontrado.";
    }
  } catch (err) {
    console.error("Error al cargar el producto:", err);
    error.value = "Error al cargar el producto.";
  } finally {
    cargando.value = false;
  }
};

const actualizarStock = async (cantidad: number) => {
  const nuevoStock = producto.stock + cantidad;
  if (nuevoStock < 0) return;

  const actualizado = await actualizarStockAPI(producto.id, cantidad);
  producto.stock = actualizado.stock;
  producto.disponible = actualizado.disponible;
};

const agregarAlCarritoDesdeDetalle = async () => {
  if (producto.stock <= 0) return;

  await carrito.agregarProducto({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio
  });

const actualizado = await actualizarStockAPI(producto.id, 0);
  producto.stock = actualizado.stock;
  producto.disponible = actualizado.disponible;
};

onMounted(() => {
  if (route.params.nombre) {
    cargarProducto(route.params.nombre as string);
  }
});

watch(
  () => route.params.nombre,
  (nuevoNombre) => {
    if (nuevoNombre) {
      cargarProducto(nuevoNombre as string);
    }
  }
);
</script>

<template>
  <div class="container mx-auto p-6">
    <button @click="router.push('/')" class="mb-4 text-blue-600 underline">⬅ Volver</button>

    <div v-if="cargando" class="text-center text-gray-600">Cargando producto...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <ProductoDetalle
      v-if="producto.id"
      :producto="producto"
      @actualizar-stock="actualizarStock"
      @agregar-al-carrito="agregarAlCarritoDesdeDetalle"
    />
  </div>
</template>
