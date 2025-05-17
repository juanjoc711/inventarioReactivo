import { defineStore } from "pinia";
import { actualizarStock } from "../api/api";

interface ProductoCarrito {
  id: number;
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
    async agregarProducto(producto: { id: number; nombre: string; precio: number }) {
      if (!producto) return;

      await actualizarStock(producto.id, -1);

      const existente = this.items.find(p => p.id === producto.id);
      if (existente) {
        existente.cantidad++;
      } else {
        this.items.push({ ...producto, cantidad: 1 });
      }
    },

    async quitarProducto(productoId: number) {
      const index = this.items.findIndex(p => p.id === productoId);
      if (index === -1) return;

      const producto = this.items[index];
      await actualizarStock(producto.id, producto.cantidad);

      this.items.splice(index, 1);
    },

    async restarUno(productoId: number) {
      const item = this.items.find(p => p.id === productoId);
      if (!item) return;

      await actualizarStock(productoId, 1);

      item.cantidad--;

      if (item.cantidad <= 0) {
        this.items = this.items.filter(p => p.id !== productoId);
      }
    }
  }
});
