const dbChef = db.getSiblingDB('chefya');

const usuarioId     = new ObjectId();
const categoriaId   = new ObjectId();
const restauranteId = new ObjectId();
const productoId    = new ObjectId();
const pedidoId      = new ObjectId();

const ahora = new Date();

dbChef.usuarios.insertOne({
  _id: usuarioId,
  googleId: "demo-001",
  nombre: "Ana Pérez",
  correo: "ana.perez@example.com",
  telefono: "5512345678",
  direcciones: [
    {
      etiqueta: "Casa",
      calle: "Av. Siempre Viva 123",
      ciudad: "CDMX",
      estado: "CDMX",
      cp: "01000",
      geo: { lat: 19.4326, lng: -99.1332 }
    }
  ],
  creadoEn: ahora,
  actualizadoEn: ahora
});

dbChef.categorias.insertOne({
  _id: categoriaId,
  slug: "mexicana",
  nombre: "Mexicana"
});

dbChef.restaurantes.insertOne({
  _id: restauranteId,
  nombre: "Taqueria",
  slug: "taqueria",
  descripcion: "Tacos al pastor y antojitos mexicanos",
  categorias: [categoriaId],
  calificacion: { promedio: 5.0, conteo: 1 },
  entrega: { minutosPromedio: 25, tarifa: 20 },
  direccion: {
    calle: "Calle a 45",
    ciudad: "CDMX",
    estado: "CDMX",
    geo: { lat: 19.43, lng: -99.14 }
  },
  activo: true,
  creadoEn: ahora,
  actualizadoEn: ahora
});

dbChef.productos.insertOne({
  _id: productoId,
  restauranteId: restauranteId,
  nombre: "Taco al pastor",
  descripcion: "Con piña y salsa de la casa",
  precio: 50,
  imagen: "https://ejemplo.com/taco.jpg",
  disponible: true,
  etiquetas: ["taco", "cerdo", "pastor"],
  categoriaMenu: "Plato fuerte",
  creadoEn: ahora,
  actualizadoEn: ahora
});

dbChef.cupones.insertOne({
  codigo: "BIENVENIDA10",
  tipo: "fijo",
  valor: 10,
  subtotalMinimo: 80,
  iniciaEn: ahora,
  expiraEn: new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000),
  redencionesMaximas: 1000,
  redimidos: 0,
  activo: true
});

dbChef.carritos.insertOne({
  usuarioId: usuarioId,
  items: [
    {
      restauranteId: restauranteId,
      productoId: productoId,
      nombre: "Taco al pastor",
      precio: 50,
      cantidad: 2,
      subtotal: 100
    }
  ],
  cuponAplicado: { codigo: "BIENVENIDA10", descuento: 10 },
  moneda: "MXN",
  subtotal: 100,
  tarifaEnvio: 20,
  total: 110,
  actualizadoEn: ahora
});

dbChef.pedidos.insertOne({
  _id: pedidoId,
  folio: "CY-2025-000001",
  usuarioId: usuarioId,
  restauranteId: restauranteId,
  items: [
    {
      productoId: productoId,
      nombre: "Taco al pastor",
      precio: 50,
      cantidad: 2,
      subtotal: 100
    }
  ],
  direccionEntrega: {
    etiqueta: "Casa",
    calle: "Av. Siempre Viva 123",
    ciudad: "CDMX",
    estado: "CDMX",
    cp: "01000"
  },
  cupon: { codigo: "BIENVENIDA10", descuento: 10 },
  montos: { subtotal: 100, tarifaEnvio: 20, total: 110 },
  estado: "recibido",
  realizadoEn: ahora,
  cronologia: [{ estado: "recibido", en: ahora }],
  pago: { modo: "simulado", estado: "autorizado", referencia: "SIM-001" },
  creadoEn: ahora,
  actualizadoEn: ahora
});

dbChef.notificaciones.insertOne({
  usuarioId: usuarioId,
  pedidoId: pedidoId,
  tipo: "estado_pedido",
  titulo: "Pedido recibido",
  mensaje: "¡Hemos recibido tu pedido y empezaremos a prepararlo!",
  estadoDesde: null,
  estadoHacia: "recibido",
  leida: false,
  creadoEn: ahora,
  leidaEn: null
});

dbChef.reseñas.insertOne({
  usuarioId: usuarioId,
  restauranteId: restauranteId,
  estrellas: 5,
  comentario: "Excelentes tacos, entrega rápida.",
  creadoEn: ahora,
  actualizadoEn: ahora
});

const agg = dbChef.reseñas.aggregate([
  { $match: { restauranteId: restauranteId } },
  { $group: { _id: "$restauranteId", promedio: { $avg: "$estrellas" }, conteo: { $sum: 1 } } }
]).toArray();

if (agg.length > 0) {
  dbChef.restaurantes.updateOne(
    { _id: restauranteId },
    { $set: { "calificacion.promedio": agg[0].promedio, "calificacion.conteo": agg[0].conteo, actualizadoEn: new Date() } }
  );
}
