db = db.getSiblingDB('chefya');

db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["googleId", "nombre", "correo", "creadoEn", "actualizadoEn"],
      properties: {
        googleId: { bsonType: "string" },
        nombre: { bsonType: "string" },
        correo: { bsonType: "string" },
        telefono: { bsonType: ["string","null"] },
        direcciones: {	
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["etiqueta","calle","ciudad"],
            properties: {
              etiqueta: { bsonType: "string" }, 
              calle: { bsonType: "string" },
              ciudad: { bsonType: "string" },
              estado: { bsonType: ["string","null"] },
              cp: { bsonType: ["string","null"] },
              geo: {
                bsonType: "object",
                properties: { lat: { bsonType: "double" }, lng: { bsonType: "double" } }
              }
            }
          }
        },
        creadoEn: { bsonType: "date" },
        actualizadoEn: { bsonType: "date" }
      }
    }
  }
});
db.usuarios.createIndex({ googleId: 1 }, { unique: true });
db.usuarios.createIndex({ correo: 1 });

db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["slug", "nombre"],
      properties: { slug: { bsonType: "string" }, nombre: { bsonType: "string" } }
    }
  }
});
db.categorias.createIndex({ slug: 1 }, { unique: true });

db.createCollection("restaurantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre","slug","categorias","calificacion","entrega","activo","creadoEn","actualizadoEn"],
      properties: {
        nombre: { bsonType: "string" },
        slug: { bsonType: "string" },
        descripcion: { bsonType: ["string","null"] },
        categorias: { bsonType: "array", items: { bsonType: "objectId" } },
        calificacion: {
          bsonType: "object",
          required: ["promedio","conteo"],
          properties: {
            promedio: { bsonType: "double" },
            conteo: { bsonType: "int" }
          }
        },
        entrega: {
          bsonType: "object",
          required: ["minutosPromedio","tarifa"],
          properties: {
            minutosPromedio: { bsonType: "int" },
            tarifa: { bsonType: ["double","int"] }
          }
        },
        direccion: {
          bsonType: ["object","null"],
          properties: {
            calle: { bsonType: "string" },
            ciudad: { bsonType: "string" },
            estado: { bsonType: ["string","null"] },
            geo: { bsonType: "object", properties: { lat: { bsonType: "double" }, lng: { bsonType: "double" } } }
          }
        },
        activo: { bsonType: "bool" },
        creadoEn: { bsonType: "date" },
        actualizadoEn: { bsonType: "date" }
      }
    }
  }
});
db.restaurantes.createIndex({ slug: 1 }, { unique: true });
db.restaurantes.createIndex({ categorias: 1 });
db.restaurantes.createIndex({ "entrega.minutosPromedio": 1 });
db.restaurantes.createIndex({ "entrega.tarifa": 1 });
db.restaurantes.createIndex({ "calificacion.promedio": -1 });

db.createCollection("productos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["restauranteId","nombre","precio","disponible","creadoEn","actualizadoEn"],
      properties: {
        restauranteId: { bsonType: "objectId" },
        nombre: { bsonType: "string" },
        descripcion: { bsonType: ["string","null"] },
        precio: { bsonType: ["double","int"] },
        imagen: { bsonType: ["string","null"] },
        disponible: { bsonType: "bool" },
        etiquetas: { bsonType: ["array","null"], items: { bsonType: "string" } },
        categoriaMenu: { bsonType: ["string","null"] },
        creadoEn: { bsonType: "date" },
        actualizadoEn: { bsonType: "date" }
      }
    }
  }
});
db.productos.createIndex({ restauranteId: 1 });
db.productos.createIndex({ precio: 1 });
db.productos.createIndex({ disponible: 1 });
db.productos.createIndex({ nombre: "text", descripcion: "text" });

db.createCollection("cupones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo","tipo","valor","activo"],
      properties: {
        codigo: { bsonType: "string" },
        tipo: { enum: ["porcentaje","fijo"] },
        valor: { bsonType: ["double","int"] },
        subtotalMinimo: { bsonType: ["double","int","null"] },
        iniciaEn: { bsonType: ["date","null"] },
        expiraEn: { bsonType: ["date","null"] },
        redencionesMaximas: { bsonType: ["int","null"] },
        redimidos: { bsonType: ["int","null"] },
        activo: { bsonType: "bool" }
      }
    }
  }
});
db.cupones.createIndex({ codigo: 1 }, { unique: true });
db.cupones.createIndex({ activo: 1, expiraEn: 1 });

db.createCollection("carritos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuarioId","items","moneda","subtotal","tarifaEnvio","total","actualizadoEn"],
      properties: {
        usuarioId: { bsonType: "objectId" },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["restauranteId","productoId","nombre","precio","cantidad","subtotal"],
            properties: {
              restauranteId: { bsonType: "objectId" },
              productoId: { bsonType: "objectId" },
              nombre: { bsonType: "string" },
              precio: { bsonType: ["double","int"] },
              cantidad: { bsonType: "int" },
              subtotal: { bsonType: ["double","int"] }
            }
          }
        },
        cuponAplicado: {
          bsonType: ["object","null"],
          properties: { codigo: { bsonType: "string" }, descuento: { bsonType: ["double","int"] } }
        },
        moneda: { bsonType: "string" },
        subtotal: { bsonType: ["double","int"] },
        tarifaEnvio: { bsonType: ["double","int"] },
        total: { bsonType: ["double","int"] },
        actualizadoEn: { bsonType: "date" }
      }
    }
  }
});
db.carritos.createIndex({ usuarioId: 1 }, { unique: true });

db.createCollection("pedidos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["folio","usuarioId","restauranteId","items","montos","estado","realizadoEn","creadoEn","actualizadoEn"],
      properties: {
        folio: { bsonType: "string" },
        usuarioId: { bsonType: "objectId" },
        restauranteId: { bsonType: "objectId" },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["nombre","precio","cantidad","subtotal"],
            properties: {
              productoId: { bsonType: ["objectId","null"] },
              nombre: { bsonType: "string" },
              precio: { bsonType: ["double","int"] },
              cantidad: { bsonType: "int" },
              subtotal: { bsonType: ["double","int"] }
            }
          }
        },
        direccionEntrega: { bsonType: ["object","null"] },
        cupon: { bsonType: ["object","null"] },
        montos: {
          bsonType: "object",
          required: ["subtotal","tarifaEnvio","total"],
          properties: {
            subtotal: { bsonType: ["double","int"] },
            tarifaEnvio: { bsonType: ["double","int"] },
            total: { bsonType: ["double","int"] }
          }
        },
        estado: { enum: ["recibido","en_preparacion","en_camino","entregado","cancelado"] },
        realizadoEn: { bsonType: "date" },
        cronologia: {
          bsonType: ["array","null"],
          items: {
            bsonType: "object",
            required: ["estado","en"],
            properties: { estado: { bsonType: "string" }, en: { bsonType: "date" } }
          }
        },
        pago: {
          bsonType: ["object","null"],
          properties: {
            modo: { enum: ["simulado"] },
            estado: { enum: ["autorizado","fallido","reembolsado"] },
            referencia: { bsonType: "string" }
          }
        },
        creadoEn: { bsonType: "date" },
        actualizadoEn: { bsonType: "date" }
      }
    }
  }
});
db.pedidos.createIndex({ usuarioId: 1, creadoEn: -1 });
db.pedidos.createIndex({ folio: 1 }, { unique: true });
db.pedidos.createIndex({ estado: 1 });

db.createCollection("notificaciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuarioId","tipo","titulo","mensaje","leida","creadoEn"],
      properties: {
        usuarioId: { bsonType: "objectId" },
        pedidoId: { bsonType: ["objectId","null"] },
        tipo: { enum: ["estado_pedido"] },
        titulo: { bsonType: "string" },
        mensaje: { bsonType: "string" },
        estadoDesde: { bsonType: ["string","null"] },
        estadoHacia: { bsonType: ["string","null"] },
        leida: { bsonType: "bool" },
        creadoEn: { bsonType: "date" },
        leidaEn: { bsonType: ["date","null"] }
      }
    }
  }
});
db.notificaciones.createIndex({ usuarioId: 1, leida: 1, creadoEn: -1 });

db.createCollection("reseñas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuarioId","restauranteId","estrellas","creadoEn","actualizadoEn"],
      properties: {
        usuarioId: { bsonType: "objectId" },
        restauranteId: { bsonType: "objectId" },
        estrellas: { bsonType: "int", minimum: 1, maximum: 5 },
        comentario: { bsonType: ["string","null"] },
        creadoEn: { bsonType: "date" },
        actualizadoEn: { bsonType: "date" }
      }
    }
  }
});
db.reseñas.createIndex({ restauranteId: 1 });
db.reseñas.createIndex({ usuarioId: 1, restauranteId: 1 }, { unique: true });
