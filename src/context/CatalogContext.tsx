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

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_session') === 'true';
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDemoMode = !isSupabaseConfigured;

  // Persistir en LocalStorage para modo offline/demo
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

  // Cargar datos iniciales
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      if (isSupabaseConfigured) {
        // Verificar sesión activa en Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAdmin(true);
          localStorage.setItem('is_admin_session', 'true');
        }

        await fetchConfiguracion();
        await fetchProductos();
        if (session) {
          await fetchPedidos();
        }
      }
      setIsLoading(false);
    };

    initData();

    // Listener de cambios de autenticación en Supabase
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const logged = Boolean(session);
        setIsAdmin(logged);
        localStorage.setItem('is_admin_session', logged ? 'true' : 'false');
        if (logged) {
          fetchProductos();
          fetchPedidos();
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

  const fetchProductos = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const tableName = isAdmin ? 'productos' : 'productos_publicos';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProductos(data);
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
      const existing = prev.find((item) => item.producto.id === producto.id);
      if (existing) {
        const newQuantity = Math.min(producto.stock, existing.cantidad + cantidad);
        return prev.map((item) =>
          item.producto.id === producto.id ? { ...item, cantidad: newQuantity } : item
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
        if (item.producto.id === productoId) {
          const maxStock = item.producto.stock;
          return { ...item, cantidad: Math.min(maxStock, cantidad) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productoId: string) => {
    setCart((prev) => prev.filter((item) => item.producto.id !== productoId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.producto.precio_venta * item.cantidad,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  // Crear Pedido y Generar Enlace de WhatsApp
  const createOrder = async (cliente: CustomerFormData) => {
    const codigo = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevoPedido: Pedido = {
      id: isSupabaseConfigured ? '' : `ped-${Date.now()}`,
      codigo,
      cliente_nombre: cliente.nombre,
      cliente_telefono: cliente.telefono,
      cliente_direccion: cliente.direccion,
      notas: cliente.notas,
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

    if (isSupabaseConfigured) {
      try {
        const { data: pedidoData, error: pedidoError } = await supabase
          .from('pedidos')
          .insert({
            codigo,
            cliente_nombre: cliente.nombre,
            cliente_telefono: cliente.telefono,
            cliente_direccion: cliente.direccion,
            notas: cliente.notas,
            total: cartTotal,
            estado: 'pendiente',
          })
          .select()
          .single();

        if (pedidoError) throw pedidoError;

        const detallesToInsert = cart.map((item) => ({
          pedido_id: pedidoData.id,
          producto_id: item.producto.id,
          producto_nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio_venta,
          subtotal: item.producto.precio_venta * item.cantidad,
        }));

        const { error: detallesError } = await supabase
          .from('pedido_detalles')
          .insert(detallesToInsert);

        if (detallesError) console.error('Error al guardar detalles de pedido:', detallesError);

        if (isAdmin) {
          fetchPedidos();
        }
        fetchProductos();
      } catch (err) {
        console.error('Error registrando pedido en Supabase:', err);
      }
    } else {
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

    const itemsText = cart
      .map(
        (i) =>
          `• ${i.cantidad}x ${i.producto.nombre} (${configuracion.moneda}${i.producto.precio_venta} c/u) = ${configuracion.moneda}${i.cantidad * i.producto.precio_venta}`
      )
      .join('\n');

    const cleanPhone = configuracion.whatsapp_telefono.replace(/[^0-9]/g, '');

    const message = `🛍️ *${configuracion.nombre_negocio}*
${configuracion.mensaje_bienvenida}

📋 *Folio del Pedido:* #${codigo}
👤 *Cliente:* ${cliente.nombre}
📞 *Teléfono:* ${cliente.telefono}
${cliente.direccion ? `📍 *Dirección de entrega:* ${cliente.direccion}` : ''}
${cliente.notas ? `📝 *Notas:* ${cliente.notas}` : ''}

🛒 *PRODUCTOS SOLICITADOS:*
${itemsText}

💰 *TOTAL A PAGAR: ${configuracion.moneda}${cartTotal.toFixed(2)}*

_Pedido registrado automáticamente desde el catálogo web._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    clearCart();

    return { success: true, codigo, whatsappUrl };
  };

  const loginAdmin = async (identifier: string, pass?: string) => {
    if (!isSupabaseConfigured) {
      if (identifier === 'admin123' || pass === 'admin123') {
        setIsAdmin(true);
        localStorage.setItem('is_admin_session', 'true');
        return { success: true };
      }
      return { success: false, error: 'Contraseña demo incorrecta. Usa: admin123' };
    }

    try {
      const email = identifier.includes('@') ? identifier : `${identifier}@catalogo.local`;
      const password = pass || identifier;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setIsAdmin(true);
      localStorage.setItem('is_admin_session', 'true');
      await fetchProductos();
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
    localStorage.removeItem('is_admin_session');
    fetchProductos();
  };

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

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
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
      console.error('Error al subir imagen:', err);
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
