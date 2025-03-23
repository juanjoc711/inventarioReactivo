# 📘 Respuestas al Enunciado de la Tarea

Este documento responde a las preguntas planteadas en la práctica 1 sobre **reactividad en Vue**.

---

## 1️⃣ Vue no detecta cambios dentro de objetos reactivos de la forma que esperarías. ¿Cómo podrías observar un cambio en una propiedad anidada?

Cuando se utiliza `reactive()` en Vue 3, Vue **no observa automáticamente propiedades anidadas** en profundidad. Esto se debe a que `reactive()` crea un Proxy superficial y **solo intercepta accesos y asignaciones directas**.

### ✅ Solución

Usar `watch()` con una función que acceda explícitamente a la propiedad anidada.

### 📦 Ejemplo basado en el proyecto:

En este proyecto, cada producto es un objeto anidado dentro de una lista reactiva. Para detectar cambios en `stock` (una propiedad del objeto `producto`), usamos:

```ts
watch(
  () => producto.stock,
  (nuevoStock) => {
    producto.disponible = nuevoStock > 0;
  },
  { immediate: true }
);
```

Este patrón se aplica tanto en `Tienda.vue` como en `ProductoView.vue`.

### 🧠 Por qué funciona

- `() => producto.stock` obliga a Vue a observar esa propiedad específica.
- El `watch()` responde a cada cambio en `stock`, permitiendo actualizar automáticamente `disponible`.

---

## 2️⃣ `watch()` permite escuchar cambios en propiedades específicas dentro de `reactive()`, explica cómo funciona.

`watch()` permite reaccionar ante cambios de estado observando una fuente reactiva. La fuente puede ser un `ref`, una propiedad dentro de `reactive()`, o incluso una función que acceda a varias propiedades.

### 🧱 Estructura básica:

```ts
watch(
  fuente,
  (nuevoValor, valorAnterior) => {
    // código reactivo
  },
  opciones
);
```

### 🛠️ Aplicación en el proyecto:

```ts
const observarStock = (producto: Producto) => {
  watch(
    () => producto.stock,
    (nuevoStock) => {
      producto.disponible = nuevoStock > 0;
    },
    { immediate: true }
  );
};
```

Se llama a `observarStock()` por cada producto cuando se cargan desde Firebase.

### 🧠 Sobre `deep: true`

- No se necesita `deep: true` cuando se observa una propiedad específica con una función.
- Solo se requiere en objetos complejos si se desea reaccionar a cualquier cambio interno.

---

## 3️⃣ ¿Cómo harías que un `watch()` detecte cambios en `stock` dentro de un array de productos?

Vue no detecta automáticamente los cambios dentro de objetos contenidos en un array reactivo. Por lo tanto, para detectar cambios en la propiedad `stock` de cada producto, hay que crear un `watch()` por cada uno.

### ✅ Solución utilizada en el proyecto:

```ts
const productos = reactive<{ lista: Producto[] }>({ lista: [] });

const observarStock = (producto: Producto) => {
  watch(
    () => producto.stock,
    (nuevoStock) => {
      producto.disponible = nuevoStock > 0;
    },
    { immediate: true }
  );
};

const cargarProductos = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
productos.lista = querySnapshot.docs.map(doc => {
  const data = doc.data() as Producto;
  const producto = reactive({
    id: doc.id,
    nombre: data.nombre,
    precio: data.precio,
    stock: data.stock,
    imagen: data.imagen || "",
    disponible: data.stock > 0
  });
  observarStock(producto); // Activa reactividad real en cada producto
  return producto;
});

};
```

### 🧠 Por qué funciona

- Se convierte cada producto en un objeto reactivo usando reactive(), y luego se le aplica un watch() individual sobre stock. Esto asegura que Vue detecte correctamente los cambios internos de cada objeto dentro del array.
- Si el valor cambia (ya sea desde el frontend o por acción del usuario), `disponible` se actualiza en tiempo real.

---

## ✅ Conclusión

- Vue 3 no observa automáticamente cambios anidados: hay que ser explícito.
- `watch()` es la herramienta adecuada para vincular `stock` con `disponible`.
- En arrays de objetos (como productos en Firestore), es necesario un `watch()` por elemento.

La solución implementada cumple con todas las restricciones del enunciado, especialmente evitando `computed()` y usando únicamente `reactive()` y `watch()` de manera eficiente.

---

## 📚 Referencias

- 🔗 [Vue 3 - Reactivity Guide](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- 🔗 [Vue 3 - watch() API](https://vuejs.org/api/reactivity-core.html#watch)
- 🔗 [Vue 3 - Reactivity with reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
