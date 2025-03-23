import { defineStore } from "pinia";
import { db } from "../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface ProductoCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export const useCarritoStore = defineStore("carrito", {
  state: () => ({
    items: [] as ProductoCarrito[]
  }),

  getters: {
    totalCantidad(state) {
      return state.items.reduce((total, item) => total + item.cantidad, 0);
    },
    totalPrecio(state) {
      return state.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
    }
  },

  actions: {
    async agregarProducto(producto: { id: string; nombre: string; precio: number }) {
      const docRef = doc(db, "productos", producto.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      if (data.stock <= 0) return;

      await updateDoc(docRef, { stock: data.stock - 1 });

      const existente = this.items.find(p => p.id === producto.id);
      if (existente) {
        existente.cantidad++;
      } else {
        this.items.push({ ...producto, cantidad: 1 });
      }
    },

    async quitarProducto(productoId: string) {
      const index = this.items.findIndex(p => p.id === productoId);
      if (index === -1) return;

      const producto = this.items[index];
      const docRef = doc(db, "productos", producto.id);
      const docSnap = await getDoc(docRef);
      const stockActual = docSnap.exists() ? docSnap.data().stock : 0;

      await updateDoc(docRef, { stock: stockActual + producto.cantidad });
      this.items.splice(index, 1);
    },

    async restarUno(productoId: string) {
      const item = this.items.find(p => p.id === productoId);
      if (!item) return;

      const docRef = doc(db, "productos", productoId);
      const docSnap = await getDoc(docRef);
      const stockActual = docSnap.exists() ? docSnap.data().stock : 0;

      item.cantidad--;
      await updateDoc(docRef, { stock: stockActual + 1 });

      if (item.cantidad <= 0) {
        this.items = this.items.filter(p => p.id !== productoId);
      }
    }
  }
});
