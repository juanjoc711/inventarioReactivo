<script setup lang="ts">
import ProductoDetalle from "../components/ProductoDetalle.vue";
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useCarritoStore } from "../stores/useCarritoStore";

const route = useRoute();
const router = useRouter();
const carrito = useCarritoStore();

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
  disponible: boolean;
}

const producto = ref<Producto | null>(null);
const cargando = ref(true);
const error = ref("");

// Buscar producto por nombre
const cargarProducto = async (nombreProducto: string) => {
  try {
    cargando.value = true;
    error.value = "";

    const productosRef = collection(db, "productos");
    const q = query(productosRef, where("nombre", "==", nombreProducto));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as Producto;

      producto.value = {
        id: docSnap.id,
        nombre: data.nombre,
        precio: data.precio,
        stock: data.stock,
        imagen: data.imagen || "",
        disponible: data.stock > 0,
      };
    } else {
      error.value = "Producto no encontrado en la base de datos.";
    }
  } catch (err) {
    console.error("  Error al cargar el producto:", err);
    error.value = "Error al cargar el producto.";
  } finally {
    cargando.value = false;
  }
};

// Actualizar stock en Firestore
const actualizarStock = async (cantidad: number) => {
  if (!producto.value) return;

  const nuevoStock = producto.value.stock + cantidad;
  if (nuevoStock < 0) return;

  try {
    const productoRef = doc(db, "productos", producto.value.id);
    await updateDoc(productoRef, { stock: nuevoStock });

    producto.value.stock = nuevoStock;
    producto.value.disponible = nuevoStock > 0;
  } catch (err) {
    console.error("  Error al actualizar el stock:", err);
  }
};

// Agregar al carrito y reflejar stock local
const agregarAlCarritoDesdeDetalle = async () => {
  if (!producto.value || producto.value.stock <= 0) return;

  await carrito.agregarProducto(producto.value);

  producto.value.stock -= 1;
  producto.value.disponible = producto.value.stock > 0;
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
      v-if="producto"
      :producto="producto"
      @actualizar-stock="actualizarStock"
      @agregar-al-carrito="agregarAlCarritoDesdeDetalle"
    />
  </div>
</template>
