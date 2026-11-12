import type { Producto, Pedido, ConfiguracionNegocio } from '../types';

export const initialConfig: ConfiguracionNegocio = {
  nombre_negocio: "Elly's Shop",
  whatsapp_telefono: '5215512345678',
  moneda: '$',
  mensaje_bienvenida: '¡Hola! Me interesa realizar este pedido:'
};

export const initialProducts: Producto[] = [
  {
    id: 'prod-1',
    nombre: 'ACEITE PURO DE MARRUECOS, ORO ARGAN',
    descripcion: 'Aceite de argán puro de Marruecos. Nutrición profunda, brillo radiante y control de frizz para todo tipo de cabello.',
    categoria: 'Cuidado Capilar',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-2',
    nombre: 'Acondicionador Bio Plant 1Lt',
    descripcion: 'Acondicionador botánico Bio Plant en presentación de 1 litro. Hidratación intensiva y suavidad prolongada.',
    categoria: 'Cuidado Capilar',
    precio_venta: 135,
    costo: 135,
    unidad: 'litro',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-3',
    nombre: 'ACONDICIONADOR IFCHE DE COCO BIOGENCE',
    descripcion: 'Acondicionador con extracto natural de leche de coco. Repara puntas abiertas y aporta nutrición sedosa.',
    categoria: 'Cuidado Capilar',
    precio_venta: 175,
    costo: 175,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-4',
    nombre: 'Active Charcoal (Carbon Activo) Cabello Maltratado y Seco',
    descripcion: 'Tratamiento detox capilar a base de carbón activado para cabello seco, opaco o dañado por químicos.',
    categoria: 'Cuidado Capilar',
    precio_venta: 155,
    costo: 155,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-5',
    nombre: 'BIOGENCE BYE BYE PORES MATTE',
    descripcion: 'Primer minimizador de poros con acabado mate sedoso. Controla brillo y prolonga la duración del maquillaje.',
    categoria: 'Maquillaje',
    precio_venta: 65,
    costo: 65,
    unidad: 'pieza',
    stock: 5,
    imagenes: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-6',
    nombre: 'BIOGENCE Cover Max Matte',
    descripcion: 'Base líquida de alta cobertura con acabado mate aterciopelado. Larga duración sin sensación pesada.',
    categoria: 'Maquillaje',
    precio_venta: 65,
    costo: 65,
    unidad: 'pieza',
    stock: 8,
    imagenes: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-7',
    nombre: 'BIOGENCE HD CONCEALER',
    descripcion: 'Corrector de alta definición HD. Cubre ojeras, rojeces e imperfecciones con textura ligera y natural.',
    categoria: 'Maquillaje',
    precio_venta: 45,
    costo: 45,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-8',
    nombre: 'BIOGENCE MASCARA 4D',
    descripcion: 'Máscara de pestañas efecto 4D. Aporta volumen extremo, definición y curvatura sin grumos.',
    categoria: 'Maquillaje',
    precio_venta: 65,
    costo: 65,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-9',
    nombre: 'BIOGENCE Polvo Suelto Multiusos',
    descripcion: 'Polvo traslúcido suelto ultrafino. Sella el maquillaje, matifica y difumina líneas de expresión.',
    categoria: 'Maquillaje',
    precio_venta: 55,
    costo: 55,
    unidad: 'pieza',
    stock: 5,
    imagenes: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-10',
    nombre: 'BIOGENCE SERUM ACIDO HIALURONICO',
    descripcion: 'Serum hidratante concentrado con Ácido Hialurónico. Rellena líneas de expresión y retiene la humedad natural.',
    categoria: 'Cuidado Facial',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-11',
    nombre: 'BIOGENCE SERUM VITAMINA C',
    descripcion: 'Serum iluminador y antioxidante con Vitamina C pura. Unifica el tono y combate manchas y radicales libres.',
    categoria: 'Cuidado Facial',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-12',
    nombre: 'BIOGENCE VELVET MATTE',
    descripcion: 'Labial líquido efecto terciopelo mate. Color intenso y fijación duradera sin resecar los labios.',
    categoria: 'Maquillaje',
    precio_venta: 55,
    costo: 55,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-13',
    nombre: 'Crema AntiAcne Te Verde BIOGENCE',
    descripcion: 'Crema calmante y purificante con extracto de té verde. Reduce imperfecciones, calma rojeces y regula el sebo.',
    categoria: 'Cuidado Facial',
    precio_venta: 125,
    costo: 125,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-14',
    nombre: 'Crema Facial Aclarante BIOGENCE',
    descripcion: 'Crema despigmentante facial formulada para aclarar manchas solares y homogeneizar el tono cutáneo.',
    categoria: 'Cuidado Facial',
    precio_venta: 125,
    costo: 125,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-15',
    nombre: 'Crema Facial Retinol BIOGENCE',
    descripcion: 'Crema regeneradora nocturna con Retinol. Estimula el colágeno, alisa textura y renueva la piel.',
    categoria: 'Cuidado Facial',
    precio_venta: 125,
    costo: 125,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-16',
    nombre: 'Crema Gel Acido Hialuronico BIOGENCE',
    descripcion: 'Textura gel ultra refrescante de rápida absorción con ácido hialurónico. Ideal para piel mixta o grasa.',
    categoria: 'Cuidado Facial',
    precio_venta: 125,
    costo: 125,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-17',
    nombre: 'DELINEADOR LIQUIDO PLUMON ALMAY NEGRO',
    descripcion: 'Delineador en plumón tono negro carbón. Punta de precisión para trazos finos o dramáticos a prueba de agua.',
    categoria: 'Maquillaje',
    precio_venta: 65,
    costo: 65,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-18',
    nombre: 'Duo Splash Crema Corporal COCO Y VAINILLA',
    descripcion: 'Set combinado de body splash y crema corporal hidratante con aroma delicioso a coco y vainilla dulce.',
    categoria: 'Cuidado Corporal',
    precio_venta: 100,
    costo: 100,
    unidad: 'set',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-19',
    nombre: 'Ginger Shampo (Crecimiento de Cabello)',
    descripcion: 'Shampoo estimulante de jengibre natural. Activa la microcirculación en el folículo, frena la caída y promueve crecimiento.',
    categoria: 'Cuidado Capilar',
    precio_venta: 155,
    costo: 155,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-20',
    nombre: 'GOTAS GONISPA LAVANDA Y VAINILLA',
    descripcion: 'Gotas aromaterapéuticas corporales relajantes con esencia de lavanda francesa y toque de vainilla.',
    categoria: 'Cuidado Corporal',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-21',
    nombre: 'LABIAL CREMOSO',
    descripcion: 'Labial en barra con fórmula cremosa enriquecida con vitamina E. Color vibrante y máximo confort.',
    categoria: 'Maquillaje',
    precio_venta: 59,
    costo: 59,
    unidad: 'pieza',
    stock: 3,
    imagenes: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-22',
    nombre: 'Mascarilla de Aguacate y Aceite de recino Crecimiento y Caida BIOGENCE',
    descripcion: 'Mascarilla capilar nutritiva con pulpa de aguacate y aceite de ricino puro. Fortalece la fibra capilar.',
    categoria: 'Cuidado Capilar',
    precio_venta: 175,
    costo: 175,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-23',
    nombre: 'Protector solar facial gel transparente piel grasa SPF50+',
    descripcion: 'Protector solar facial toque seco en gel transparente SPF 50+. No deja residuo blanco ni sensación grasosa.',
    categoria: 'Cuidado Facial',
    precio_venta: 125,
    costo: 125,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-24',
    nombre: 'RUBOR BIOGENCE BAKED BLUSH',
    descripcion: 'Rubor horneado con microperlas luminosas. Acabado sedoso y radiante con alta pigmentación.',
    categoria: 'Maquillaje',
    precio_venta: 55,
    costo: 55,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-25',
    nombre: 'Rubor Cremoso En Barra Biogense',
    descripcion: 'Rubor en stick cremoso multiusos para mejillas y labios. Fácil de difuminar con los dedos.',
    categoria: 'Maquillaje',
    precio_venta: 65,
    costo: 65,
    unidad: 'pieza',
    stock: 4,
    imagenes: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-26',
    nombre: 'Serum Retinol BIOGENCE',
    descripcion: 'Serum anti-edad concentrado con Retinol al 1%. Alisa arrugas y mejora la elasticidad celular.',
    categoria: 'Cuidado Facial',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-27',
    nombre: 'Serum Te de Arbol BIOGENCE',
    descripcion: 'Serum purificante de Tea Tree Oil. Tratamiento puntual para brotes, puntos negros y poros congestionados.',
    categoria: 'Cuidado Facial',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-28',
    nombre: 'Set De Aceites Esenciales Canela, Eucalipto, alcanfor, Lavanda, Menta Citrico',
    descripcion: 'Colección de 5 aceites esenciales puros: Canela, Eucalipto, Alcanfor, Lavanda y Menta Cítrica. Ideales para difusor o masaje.',
    categoria: 'Bienestar',
    precio_venta: 95,
    costo: 95,
    unidad: 'set',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-29',
    nombre: 'SHAMPOO BALANCE CONTROL GRASA Y CASPA',
    descripcion: 'Shampoo terapéutico purificante. Limpia a fondo el cuero cabelludo, regula el exceso de sebo y previene caspa.',
    categoria: 'Cuidado Capilar',
    precio_venta: 175,
    costo: 175,
    unidad: 'pieza',
    stock: 1,
    imagenes: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-30',
    nombre: 'SPRAY PROTECCIONI TERMICA BIOGENCE',
    descripcion: 'Escudo térmico en spray hasta 230°C. Protege contra plancha y secadora, previene quiebre y aporta brillo espejo.',
    categoria: 'Cuidado Capilar',
    precio_venta: 95,
    costo: 95,
    unidad: 'pieza',
    stock: 2,
    imagenes: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  }
];

export const initialOrders: Pedido[] = [];
