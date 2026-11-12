-- ========================================================
-- SCRIPT DE CARGA DE PRODUCTOS DE ELLY'S SHOP
-- Copia y pega esto en el "SQL Editor" de Supabase y dale a RUN.
-- ========================================================

-- Limpiar productos de prueba anteriores si existen
DELETE FROM public.productos WHERE nombre IN (
    'Café de Especialidad 500g', 
    'Taza Cerámica Hecha a Mano', 
    'Miel de Abeja Pura 1kg', 
    'Vela Aromática de Soja (Lavanda)', 
    'Libreta de Hojas Recicladas A5'
);

-- Insertar los 30 productos con sus categorías, precios, costos, stock y 3 fotos de muestra
INSERT INTO public.productos (nombre, categoria, descripcion, precio_venta, costo, unidad, stock, imagenes, activo)
VALUES
(
    'ACEITE PURO DE MARRUECOS, ORO ARGAN',
    'Cuidado Capilar',
    'Aceite de argán puro de Marruecos. Nutrición profunda, brillo radiante y control de frizz para todo tipo de cabello.',
    95.00, 95.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Acondicionador Bio Plant 1Lt',
    'Cuidado Capilar',
    'Acondicionador botánico Bio Plant en presentación de 1 litro. Hidratación intensiva y suavidad prolongada.',
    135.00, 135.00, 'litro', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'ACONDICIONADOR IFCHE DE COCO BIOGENCE',
    'Cuidado Capilar',
    'Acondicionador con extracto natural de leche de coco. Repara puntas abiertas y aporta nutrición sedosa.',
    175.00, 175.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Active Charcoal (Carbon Activo) Cabello Maltratado y Seco',
    'Cuidado Capilar',
    'Tratamiento detox capilar a base de carbón activado para cabello seco, opaco o dañado por químicos.',
    155.00, 155.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE BYE BYE PORES MATTE',
    'Maquillaje',
    'Primer minimizador de poros con acabado mate sedoso. Controla brillo y prolonga la duración del maquillaje.',
    65.00, 65.00, 'pieza', 5,
    ARRAY[
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE Cover Max Matte',
    'Maquillaje',
    'Base líquida de alta cobertura con acabado mate aterciopelado. Larga duración sin sensación pesada.',
    65.00, 65.00, 'pieza', 8,
    ARRAY[
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE HD CONCEALER',
    'Maquillaje',
    'Corrector de alta definición HD. Cubre ojeras, rojeces e imperfecciones con textura ligera y natural.',
    45.00, 45.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE MASCARA 4D',
    'Maquillaje',
    'Máscara de pestañas efecto 4D. Aporta volumen extremo, definición y curvatura sin grumos.',
    65.00, 65.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE Polvo Suelto Multiusos',
    'Maquillaje',
    'Polvo traslúcido suelto ultrafino. Sella el maquillaje, matifica y difumina líneas de expresión.',
    55.00, 55.00, 'pieza', 5,
    ARRAY[
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE SERUM ACIDO HIALURONICO',
    'Cuidado Facial',
    'Serum hidratante concentrado con Ácido Hialurónico. Rellena líneas de expresión y retiene la humedad natural.',
    95.00, 95.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE SERUM VITAMINA C',
    'Cuidado Facial',
    'Serum iluminador y antioxidante con Vitamina C pura. Unifica el tono y combate manchas y radicales libres.',
    95.00, 95.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'BIOGENCE VELVET MATTE',
    'Maquillaje',
    'Labial líquido efecto terciopelo mate. Color intenso y fijación duradera sin resecar los labios.',
    55.00, 55.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Crema AntiAcne Te Verde BIOGENCE',
    'Cuidado Facial',
    'Crema calmante y purificante con extracto de té verde. Reduce imperfecciones, calma rojeces y regula el sebo.',
    125.00, 125.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Crema Facial Aclarante BIOGENCE',
    'Cuidado Facial',
    'Crema despigmentante facial formulada para aclarar manchas solares y homogeneizar el tono cutáneo.',
    125.00, 125.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Crema Facial Retinol BIOGENCE',
    'Cuidado Facial',
    'Crema regeneradora nocturna con Retinol. Estimula el colágeno, alisa textura y renueva la piel.',
    125.00, 125.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Crema Gel Acido Hialuronico BIOGENCE',
    'Cuidado Facial',
    'Textura gel ultra refrescante de rápida absorción con ácido hialurónico. Ideal para piel mixta o grasa.',
    125.00, 125.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'DELINEADOR LIQUIDO PLUMON ALMAY NEGRO',
    'Maquillaje',
    'Delineador en plumón tono negro carbón. Punta de precisión para trazos finos o dramáticos a prueba de agua.',
    65.00, 65.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Duo Splash Crema Corporal COCO Y VAINILLA',
    'Cuidado Corporal',
    'Set combinado de body splash y crema corporal hidratante con aroma delicioso a coco y vainilla dulce.',
    100.00, 100.00, 'set', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Ginger Shampo (Crecimiento de Cabello)',
    'Cuidado Capilar',
    'Shampoo estimulante de jengibre natural. Activa la microcirculación en el folículo, frena la caída y promueve crecimiento.',
    155.00, 155.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'GOTAS GONISPA LAVANDA Y VAINILLA',
    'Cuidado Corporal',
    'Gotas aromaterapéuticas corporales relajantes con esencia de lavanda francesa y toque de vainilla.',
    95.00, 95.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'LABIAL CREMOSO',
    'Maquillaje',
    'Labial en barra con fórmula cremosa enriquecida con vitamina E. Color vibrante y máximo confort.',
    59.00, 59.00, 'pieza', 3,
    ARRAY[
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Mascarilla de Aguacate y Aceite de recino Crecimiento y Caida BIOGENCE',
    'Cuidado Capilar',
    'Mascarilla capilar nutritiva con pulpa de aguacate y aceite de ricino puro. Fortalece la fibra capilar.',
    175.00, 175.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Protector solar facial gel transparente piel grasa SPF50+',
    'Cuidado Facial',
    'Protector solar facial toque seco en gel transparente SPF 50+. No deja residuo blanco ni sensación grasosa.',
    125.00, 125.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'RUBOR BIOGENCE BAKED BLUSH',
    'Maquillaje',
    'Rubor horneado con microperlas luminosas. Acabado sedoso y radiante con alta pigmentación.',
    55.00, 55.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Rubor Cremoso En Barra Biogense',
    'Maquillaje',
    'Rubor en stick cremoso multiusos para mejillas y labios. Fácil de difuminar con los dedos.',
    65.00, 65.00, 'pieza', 4,
    ARRAY[
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Serum Retinol BIOGENCE',
    'Cuidado Facial',
    'Serum anti-edad concentrado con Retinol al 1%. Alisa arrugas y mejora la elasticidad celular.',
    95.00, 95.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Serum Te de Arbol BIOGENCE',
    'Cuidado Facial',
    'Serum purificante de Tea Tree Oil. Tratamiento puntual para brotes, puntos negros y poros congestionados.',
    95.00, 95.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608248597359-006277741d40?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'Set De Aceites Esenciales Canela, Eucalipto, alcanfor, Lavanda, Menta Citrico',
    'Bienestar',
    'Colección de 5 aceites esenciales puros: Canela, Eucalipto, Alcanfor, Lavanda y Menta Cítrica. Ideales para difusor o masaje.',
    95.00, 95.00, 'set', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'SHAMPOO BALANCE CONTROL GRASA Y CASPA',
    'Cuidado Capilar',
    'Shampoo terapéutico purificante. Limpia a fondo el cuero cabelludo, regula el exceso de sebo y previene caspa.',
    175.00, 175.00, 'pieza', 1,
    ARRAY[
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ],
    true
),
(
    'SPRAY PROTECCIONI TERMICA BIOGENCE',
    'Cuidado Capilar',
    'Escudo térmico en spray hasta 230°C. Protege contra plancha y secadora, previene quiebre y aporta brillo espejo.',
    95.00, 95.00, 'pieza', 2,
    ARRAY[
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    ],
    true
);
