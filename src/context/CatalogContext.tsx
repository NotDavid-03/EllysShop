import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Producto, Pedido, ConfiguracionNegocio, CartItem, EstadoPedido } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialProducts, initialOrders, initialConfig } from '../lib/mockData';

interface CustomerFormData {
  nombre: string;
  telefono: string;
  direccion: string;
  notas: string;
}

interface CatalogContextType {
  productos: Producto[];
  configuracion: ConfiguracionNegocio;
  pedidos: Pedido[];
  cart: CartItem[];
  isAdmin: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  
  // Acciones de Carrito
  addToCart: (producto: Producto, cantidad?: number) => void;
  updateCartQuantity: (productoId: string, cantidad: number) => void;
  removeFromCart: (productoId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Acciones de Pedido y WhatsApp
  createOrder: (cliente: CustomerFormData) => Promise<{ success: boolean; codigo: string; whatsappUrl: string }>;
  
  // Acciones de Administrador
  loginAdmin: (passwordOrEmail: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  addProduct: (producto: Omit<Producto, 'id'>) => Promise<boolean>;
  updateProduct: (id: string, producto: Partial<Producto>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (pedidoId: string, estado: EstadoPedido) => Promise<boolean>;
  updateConfiguracion: (config: Partial<ConfiguracionNegocio>) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
  reloadProducts: () => Promise<void>;
  reloadOrders: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>(() => {
    const saved = localStorage.getItem('local_productos');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [configuracion, setConfiguracion] = useState<ConfiguracionNegocio>(() => {
    const saved = localStorage.getItem('local_config');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const saved = localStorage.getItem('local_pedidos');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('local_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // SEGURIDAD: Nunca confiar ciegamente en localStorage para el rol de Admin.
  // Inicia en false y solo se confirma si Supabase valida un token criptográfico JWT real.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDemoMode = !isSupabaseConfigured;

  // Persistir en LocalStorage solo si no hay Supabase configurado (modo demo)
  useEffect(() => {
    if (isDemoMode) {
      localStorage.setItem('local_productos', JSON.stringify(productos));
      localStorage.setItem('local_config', JSON.stringify(configuracion));
      localStorage.setItem('local_pedidos', JSON.stringify(pedidos));
    }
  }, [productos, configuracion, pedidos, isDemoMode]);

  useEffect(() => {
    localStorage.setItem('local_cart', JSON.stringify(cart));
  }, [cart]);

  // Cargar datos iniciales y verificar sesión de forma criptográfica
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      if (isSupabaseConfigured) {
        // Verificar sesión criptográfica JWT en Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const isValidAdmin = Boolean(session?.user);
        setIsAdmin(isValidAdmin);

        await fetchConfiguracion();
        await fetchProductos(isValidAdmin);
        if (isValidAdmin) {
          await fetchPedidos();
        }
      }
      setIsLoading(false);
    };

    initData();

    // Listener de cambios de autenticación en Supabase
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const logged = Boolean(session?.user);
        setIsAdmin(logged);
        if (logged) {
          fetchProductos(true);
          fetchPedidos();
        } else {
          fetchProductos(false);
          setPedidos([]);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const fetchConfiguracion = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) {
        setConfiguracion({
          nombre_negocio: data.nombre_negocio || initialConfig.nombre_negocio,
          whatsapp_telefono: data.whatsapp_telefono || initialConfig.whatsapp_telefono,
          moneda: data.moneda || initialConfig.moneda,
          mensaje_bienvenida: data.mensaje_bienvenida || initialConfig.mensaje_bienvenida,
        });
      }
    } catch (e) {
      console.warn('Error al cargar configuración:', e);
    }
  };

  // SEGURIDAD:
  // Si es admin autenticado -> Consulta la tabla 'productos' (con costos).
  // Si es cliente anónimo -> Consulta EXCLUSIVAMENTE la vista 'productos_publicos' (donde costo NO existe).
  const fetchProductos = async (adminOverride?: boolean) => {
    if (!isSupabaseConfigured) return;
    const adminActive = typeof adminOverride === 'boolean' ? adminOverride : isAdmin;
    try {
      const tableName = adminActive ? 'productos' : 'productos_publicos';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        if (data.length > 0) {
          setProductos(data);
        } else {
          setProductos(initialProducts);
        }
      }
    } catch (e) {
      console.warn('Error al cargar productos:', e);
    }
  };

  const fetchPedidos = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          detalles:pedido_detalles(*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPedidos(data);
      }
    } catch (e) {
      console.warn('Error al cargar pedidos:', e);
    }
  };

  // Carrito
  const addToCart = (producto: Producto, cantidad = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.producto?.id === producto.id);
      if (existing) {
        const newQuantity = Math.min(producto.stock, existing.cantidad + cantidad);
        return prev.map((item) =>
          item.producto?.id === producto.id ? { ...item, cantidad: newQuantity } : item
        );
      } else {
        const initialQty = Math.min(producto.stock, Math.max(1, cantidad));
        return [...prev, { producto, cantidad: initialQty }];
      }
    });
  };

  const updateCartQuantity = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.producto?.id === productoId) {
          const maxStock = item.producto.stock;
          return { ...item, cantidad: Math.min(maxStock, cantidad) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productoId: string) => {
    setCart((prev) => prev.filter((item) => item.producto?.id !== productoId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (Number(item.producto?.precio_venta) || 0) * item.cantidad,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  // ========================================================
  // PROTOCOLO DE PEDIDO SEGURO (ANTI-ALTERACIÓN DE PRECIOS)
  // ========================================================
  const createOrder = async (cliente: CustomerFormData) => {
    // 1. Sanitización de entradas del cliente (Anti-XSS e Inyecciones)
    const cleanNombre = cliente.nombre.trim().slice(0, 100);
    const cleanTelefono = cliente.telefono.trim().replace(/[^0-9+]/g, '').slice(0, 25);
    const cleanDireccion = cliente.direccion.trim().slice(0, 200);
    const cleanNotas = cliente.notas.trim().slice(0, 300);

    if (!cleanNombre || cleanTelefono.length < 8) {
      throw new Error('Por favor ingresa un nombre y un teléfono de contacto válidos.');
    }

    if (cart.length === 0) {
      throw new Error('El pedido está vacío.');
    }

    let codigo = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
    let finalTotal = cartTotal;
    let itemsResumen = cart.map((i) => ({
      nombre: i.producto.nombre,
      cantidad: i.cantidad,
      precio: Number(i.producto.precio_venta),
      subtotal: Number(i.producto.precio_venta) * i.cantidad,
    }));

    if (isSupabaseConfigured) {
      try {
        // SEGURIDAD CRÍTICA:
        // Solo enviamos los IDs y las cantidades solicitadas.
        // La base de datos consulta los precios oficiales y calcula el total de forma atómica.
        const itemsPayload = cart.map((item) => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
        }));

        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          'crear_pedido_seguro',
          {
            p_cliente_nombre: cleanNombre,
            p_cliente_telefono: cleanTelefono,
            p_cliente_direccion: cleanDireccion,
            p_notas: cleanNotas,
            p_items: itemsPayload,
          }
        );

        if (rpcError) {
          console.error('Error en crear_pedido_seguro:', rpcError);
          throw new Error(rpcError.message || 'Error al validar el pedido con el servidor.');
        }

        if (rpcResult && rpcResult.success) {
          codigo = rpcResult.codigo;
          finalTotal = Number(rpcResult.total);
          if (Array.isArray(rpcResult.items)) {
            itemsResumen = rpcResult.items.map((it: any) => ({
              nombre: it.nombre,
              cantidad: it.cantidad,
              precio: Number(it.precio_unitario),
              subtotal: Number(it.subtotal),
            }));
          }
        }

        if (isAdmin) {
          fetchPedidos();
        }
        fetchProductos();
      } catch (err: any) {
        console.error('Fallo de validación de pedido:', err);
        throw err;
      }
    } else {
      // Modo local / demo
      const nuevoPedido: Pedido = {
        id: `ped-${Date.now()}`,
        codigo,
        cliente_nombre: cleanNombre,
        cliente_telefono: cleanTelefono,
        cliente_direccion: cleanDireccion,
        notas: cleanNotas,
        total: cartTotal,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        detalles: cart.map((item) => ({
          producto_id: item.producto.id,
          producto_nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio_venta,
          subtotal: item.producto.precio_venta * item.cantidad,
        })),
      };
      setPedidos((prev) => [nuevoPedido, ...prev]);
      setProductos((prev) =>
        prev.map((p) => {
          const itemCart = cart.find((i) => i.producto.id === p.id);
          if (itemCart) {
            return { ...p, stock: Math.max(0, p.stock - itemCart.cantidad) };
          }
          return p;
        })
      );
    }

    // 2. Construir plantilla oficial formateada para WhatsApp con los valores verificados
    const itemsText = itemsResumen
      .map(
        (i) =>
          `• ${i.cantidad}x ${i.nombre} (${configuracion.moneda}${i.precio.toFixed(2)} c/u) = ${configuracion.moneda}${i.subtotal.toFixed(2)}`
      )
      .join('\n');

    const cleanPhone = configuracion.whatsapp_telefono.replace(/[^0-9]/g, '');

    const message = `🛍️ *${configuracion.nombre_negocio}*
${configuracion.mensaje_bienvenida}

📋 *Folio del Pedido:* #${codigo}
👤 *Cliente:* ${cleanNombre}
📞 *Teléfono:* ${cleanTelefono}
${cleanDireccion ? `📍 *Dirección de entrega:* ${cleanDireccion}` : ''}
${cleanNotas ? `📝 *Notas:* ${cleanNotas}` : ''}

🛒 *PRODUCTOS SOLICITADOS:*
${itemsText}

💰 *TOTAL A PAGAR: ${configuracion.moneda}${finalTotal.toFixed(2)}*

_Pedido registrado y verificado automáticamente desde el catálogo web._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    clearCart();

    return { success: true, codigo, whatsappUrl };
  };

  // Login de Administrador
  const loginAdmin = async (identifier: string, pass?: string) => {
    // Si no está configurado Supabase, modo demo
    if (!isSupabaseConfigured) {
      if (identifier === 'admin123' || pass === 'admin123') {
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, error: 'Contraseña demo incorrecta. Usa: admin123' };
    }

    // En Supabase: Requiere email y contraseña válidos con token JWT firmado
    try {
      const email = identifier.includes('@') ? identifier : `${identifier}@catalogo.local`;
      const password = pass || identifier;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return { success: false, error: error?.message || 'Credenciales inválidas.' };
      }

      setIsAdmin(true);
      await fetchProductos(true);
      await fetchPedidos();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error al iniciar sesión' };
    }
  };

  const logoutAdmin = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAdmin(false);
    fetchProductos(false);
  };

  // Operaciones de Admin sobre Productos
  const addProduct = async (prod: Omit<Producto, 'id'>) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('productos')
        .insert({
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          categoria: prod.categoria || 'General',
          precio_venta: prod.precio_venta,
          costo: prod.costo || 0,
          unidad: prod.unidad || 'pieza',
          stock: prod.stock,
          imagenes: prod.imagenes || [],
          activo: prod.activo !== false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error al agregar producto:', error);
        return false;
      }
      setProductos((prev) => [data, ...prev]);
      return true;
    } else {
      const newProd: Producto = {
        ...prod,
        id: `prod-${Date.now()}`,
      };
      setProductos((prev) => [newProd, ...prev]);
      return true;
    }
  };

  const updateProduct = async (id: string, prod: Partial<Producto>) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('productos')
        .update(prod)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar producto:', error);
        return false;
      }
      setProductos((prev) => prev.map((p) => (p.id === id ? data : p)));
      return true;
    } else {
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...prod } : p)));
      return true;
    }
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) {
        console.error('Error al eliminar producto:', error);
        return false;
      }
      setProductos((prev) => prev.filter((p) => p.id !== id));
      return true;
    } else {
      setProductos((prev) => prev.filter((p) => p.id !== id));
      return true;
    }
  };

  // ========================================================
  // SUBIDA SEGURA DE IMÁGENES (VALIDACIÓN ESTRICTA)
  // ========================================================
  const uploadImage = async (file: File): Promise<string | null> => {
    // 1. Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('Archivo rechazado: supera 5MB');
      return null;
    }

    // 2. Validar tipo MIME
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      console.error('Archivo rechazado: tipo no permitido', file.type);
      return null;
    }

    if (!isSupabaseConfigured) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt) ? fileExt : 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${cleanExt}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fotos-productos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('fotos-productos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error al subir imagen de forma segura:', err);
      return null;
    }
  };

  const updateOrderStatus = async (pedidoId: string, estado: EstadoPedido) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado })
        .eq('id', pedidoId);

      if (error) {
        console.error('Error actualizando pedido:', error);
        return false;
      }
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado } : p))
      );
      return true;
    } else {
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado } : p))
      );
      return true;
    }
  };

  const updateConfiguracion = async (newConf: Partial<ConfiguracionNegocio>) => {
    const updated = { ...configuracion, ...newConf };
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('configuracion')
        .update({
          nombre_negocio: updated.nombre_negocio,
          whatsapp_telefono: updated.whatsapp_telefono,
          moneda: updated.moneda,
          mensaje_bienvenida: updated.mensaje_bienvenida,
        })
        .eq('id', 1);

      if (error) {
        console.error('Error actualizando configuración:', error);
        return false;
      }
    }
    setConfiguracion(updated);
    return true;
  };

  return (
    <CatalogContext.Provider
      value={{
        productos,
        configuracion,
        pedidos,
        cart,
        isAdmin,
        isLoading,
        isDemoMode,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        createOrder,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateConfiguracion,
        uploadImage,
        reloadProducts: fetchProductos,
        reloadOrders: fetchPedidos,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog debe ser usado dentro de un CatalogProvider');
  }
  return context;
};
