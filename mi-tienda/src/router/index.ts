import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProductoView from "../views/ProductoView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/producto/:nombre", component: ProductoView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
