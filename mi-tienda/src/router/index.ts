import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProductoView from "../views/ProductoView.vue";
import CarritoView from "../views/CarritoView.vue"; 

const routes = [
  { path: "/", component: Home },
  { path: "/producto/:nombre", component: ProductoView },
  { path: "/carrito", component: CarritoView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
