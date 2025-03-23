<script setup lang="ts">
import { ref, onMounted } from "vue";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useCarritoStore } from "../stores/useCarritoStore";

const carrito = useCarritoStore();

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
  disponible: boolean;
}

const productos = ref<Producto[]>([]);

const cargarProductos = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  productos.value = querySnapshot.docs.map(doc => {
    const data = doc.data() as Producto;
    return {
      id: doc.id,
      nombre: data.nombre,
      precio: data.precio,
      stock: data.stock,
      imagen: data.imagen || "",
      disponible: data.stock > 0
    };
  });
};

const actualizarStock = async (producto: Producto, cantidad: number) => {
  if (producto.stock + cantidad >= 0) {
    const productoRef = doc(db, "productos", producto.id);
    await updateDoc(productoRef, { stock: producto.stock + cantidad });
    cargarProductos();
  }
};

const agregarAlCarrito = async (producto: Producto) => {
  if (producto.stock > 0) {
    await carrito.agregarProducto(producto);
    await cargarProductos(); 
  }
};


onMounted(cargarProductos);
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Inventario de Productos</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div
        v-for="producto in productos"
        :key="producto.id"
        class="border rounded-lg shadow-lg p-6 bg-white flex flex-col items-center text-center"
      >
        <img :src="producto.imagen" :alt="producto.nombre" class="w-32 h-32 object-cover mb-4 rounded-lg" />
        <h2 class="text-xl font-semibold">{{ producto.nombre }}</h2>
        <p class="text-gray-600 text-lg font-medium">${{ producto.precio }}</p>
        <p class="text-sm text-gray-500">Stock: {{ producto.stock }}</p>
        <p class="text-lg font-bold mt-2" :style="{ color: producto.disponible ? 'green' : 'red' }">
          {{ producto.disponible ? "Disponible" : "Agotado" }}
        </p>

        <div class="mt-4 flex gap-2">
          <button @click="actualizarStock(producto, 1)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            +
          </button>
          <button @click="actualizarStock(producto, -1)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            -
          </button>
          <button
            @click="agregarAlCarrito(producto)"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
