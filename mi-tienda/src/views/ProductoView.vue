<script setup lang="ts">
import ProductoDetalle from "../components/ProductoDetalle.vue";
import { reactive, watch, ref, onMounted } from "vue";
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

//  Producto como objeto reactivo 
const producto = reactive<Producto>({
  id: "",
  nombre: "",
  precio: 0,
  stock: 0,
  imagen: "",
  disponible: false
});

const cargando = ref(true);
const error = ref("");

//  Watch reactivo: disponible sigue automáticamente al stock
watch(
  () => producto.stock,
  (nuevoStock) => {
    producto.disponible = nuevoStock > 0;
  }
);

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

      //  Asignación manual a reactive
      producto.id = docSnap.id;
      producto.nombre = data.nombre;
      producto.precio = data.precio;
      producto.stock = data.stock;
      producto.imagen = data.imagen || "";
      producto.disponible = data.stock > 0;
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
  const nuevoStock = producto.stock + cantidad;
  if (nuevoStock < 0) return;

  try {
    const productoRef = doc(db, "productos", producto.id);
    await updateDoc(productoRef, { stock: nuevoStock });
    producto.stock = nuevoStock;
    //  disponible se actualiza automáticamente por el watch
  } catch (err) {
    console.error("  Error al actualizar el stock:", err);
  }
};

// Agregar al carrito
const agregarAlCarritoDesdeDetalle = async () => {
  if (producto.stock <= 0) return;
  await carrito.agregarProducto(producto);
  producto.stock -= 1;
  //  disponible se actualiza automáticamente por el watch
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
