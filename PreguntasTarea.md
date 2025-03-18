#  Respuestas al Enunciado de la Tarea

Este documento responde a las preguntas planteadas en la tarea sobre reactividad en Vue 3 utilizando `reactive()` y `watch()`, evitando el uso de `computed()`.

## 1️ Vue no detecta cambios dentro de objetos reactivos de la forma que esperarías. ¿Cómo podrías observar un cambio en una propiedad anidada?

En Vue 3, cuando usamos `reactive()`, Vue no detecta automáticamente cambios en propiedades anidadas porque `reactive()` trabaja con proxies y no realiza una observación profunda por defecto.

###  Solución: Usar `watch()` con una función que acceda a la propiedad específica

Si tenemos un objeto anidado dentro de `reactive()`, debemos observar la propiedad específica dentro del objeto:

```typescript
import { reactive, watch } from "vue";

const producto = reactive({
  nombre: "Laptop",
  detalles: {
    stock: 10,
  },
});

// Observar cambios en la propiedad anidada "stock"
watch(
  () => producto.detalles.stock,
  (nuevoValor, viejoValor) => {
    console.log(`Stock cambió de ${viejoValor} a ${nuevoValor}`);
  }
);

// Ejemplo de cambio en la propiedad
producto.detalles.stock = 5; // Esto activará el watch()
```

###  Explicación:

- Se usa una función en `watch()` (`() => producto.detalles.stock`) para observar el `stock` dentro de `detalles`.
- Cuando `stock` cambia, el callback de `watch()` se ejecuta y muestra los valores antiguo y nuevo.

## 2️ `watch()` permite escuchar cambios en propiedades específicas dentro de `reactive()`, explica cómo funciona.

`watch()` en Vue 3 observa cambios en una o varias propiedades y ejecuta una función cuando detecta un cambio.

###  Estructura básica de `watch()`

```typescript
watch(
  fuente,        // Propiedad reactiva a observar
  callback,      // Función que se ejecuta cuando la propiedad cambia
  opciones       // Opcional: { deep: true } para observar cambios profundos
);
```

###  Ejemplo de `watch()` en un objeto reactivo

```typescript
import { reactive, watch } from "vue";

const usuario = reactive({
  nombre: "Carlos",
  edad: 25,
});

// Observar cambios en la edad del usuario
watch(
  () => usuario.edad,
  (nuevoValor, viejoValor) => {
    console.log(`La edad cambió de ${viejoValor} a ${nuevoValor}`);
  }
);

usuario.edad = 30; // Esto activará el watch()
```

###  Observación profunda (`deep: true`)

Si el objeto tiene propiedades anidadas, necesitamos `deep: true` para detectar cambios en todo el objeto:

```typescript
watch(
  () => usuario,
  (nuevoValor) => {
    console.log("El objeto usuario cambió:", nuevoValor);
  },
  { deep: true } // Necesario para detectar cambios en propiedades internas
);
```

###  Diferencia clave:

- Sin `deep: true`: Solo detecta cambios en la referencia del objeto.
- Con `deep: true`: Detecta cambios dentro de cualquier propiedad anidada.

## 3️ ¿Cómo harías que un `watch()` detecte cambios en `stock` dentro de un array de productos?

Cuando usamos un array de objetos con `reactive()`, Vue no detecta cambios internos en los objetos. Debemos verificar cada objeto individualmente usando `watch()`.

###  Solución: Crear un `watch()` por cada producto en el array

```typescript
import { reactive, watch } from "vue";

const productos = reactive([
  { nombre: "Laptop", stock: 5, disponible: true },
  { nombre: "Mouse", stock: 2, disponible: true },
  { nombre: "Teclado", stock: 0, disponible: false },
]);

// Configurar un watch() para cada producto
productos.forEach((producto, index) => {
  watch(
    () => producto.stock,
    (nuevoValor) => {
      productos[index].disponible = nuevoValor > 0;
      console.log(
        `Stock de ${productos[index].nombre} cambió a ${nuevoValor}. Disponible: ${productos[index].disponible}`
      );
    }
  );
});

// Simulando cambios en el stock
productos[0].stock = 0; // Se actualizará automáticamente disponible = false
productos[1].stock = 5; // Se actualizará automáticamente disponible = true
```

###  Explicación:

- Se recorre el array con `forEach()` y se crea un `watch()` para cada producto.
- Cada `watch()` observa `stock` de un producto y actualiza `disponible` automáticamente.
- Si el `stock` baja a 0, `disponible` cambia a `false`.
- Si el `stock` sube, `disponible` vuelve a `true`.

##  Conclusión

- Vue no detecta automáticamente cambios en propiedades anidadas dentro de `reactive()`, por lo que debemos usar `watch()`.
- `watch()` monitorea cambios en propiedades reactivas y ejecuta una función cuando hay modificaciones.
- Para detectar cambios en arrays de objetos, se debe asignar un `watch()` a cada objeto dentro del array.

 Este enfoque permite manejar reactividad de forma eficiente sin usar `computed()`, cumpliendo con los requisitos de la tarea. 🚀

##  Referencias

- [Vue 3 Documentation - Reactivity](https://v3.vuejs.org/guide/reactivity.html)
- [Vue 3 `watch()` API](https://v3.vuejs.org/api/computed-watch-api.html#watch)