const API_URL = "http://localhost:5000/graphql";

export async function fetchProductos() {
  const query = `
    query {
      productos {
        id
        nombre
        precio
        stock
        disponible
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await res.json();
  return data.productos;
}

export async function actualizarStock(id: number, cantidad: number) {
  const query = `
    mutation {
      actualizarStock(id: ${id}, cantidad: ${cantidad}) {
        producto {
          id
          nombre
          precio
          stock
          disponible
        }
        mensaje
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await res.json();
  return data.actualizarStock.producto;
}
