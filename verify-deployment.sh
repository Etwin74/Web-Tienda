#!/bin/bash

echo "=== VERIFICACIÓN DESPLIEGUE FERRETERÍA WILMER ==="
echo ""
echo "URL Base: https://u3b5htvlr95g.space.minimax.io"
echo ""

# Verificar que las páginas cargan
echo "1. Verificando carga de páginas..."
echo ""

echo "- Landing Page (/):"
curl -s -o /tmp/landing.html -w "HTTP %{http_code} | Size: %{size_download} bytes\n" https://u3b5htvlr95g.space.minimax.io/

echo "- Página Productos:"
curl -s -o /tmp/productos.html -w "HTTP %{http_code} | Size: %{size_download} bytes\n" https://u3b5htvlr95g.space.minimax.io/productos.html

echo "- Página Servicios:"
curl -s -o /tmp/servicios.html -w "HTTP %{http_code} | Size: %{size_download} bytes\n" https://u3b5htvlr95g.space.minimax.io/servicios.html

echo ""
echo "2. Verificando elementos clave en LANDING PAGE..."
echo ""

# Verificar Hero con botones
if grep -q "Ver Productos" /tmp/landing.html && grep -q "Ver Servicios" /tmp/landing.html; then
    echo "✅ Botones 'Ver Productos' y 'Ver Servicios' encontrados en Hero"
else
    echo "❌ ERROR: Botones del Hero no encontrados"
fi

# Verificar secciones
if grep -q "Nuestros Socios" /tmp/landing.html; then
    echo "✅ Sección 'Nuestros Socios' encontrada"
else
    echo "❌ ERROR: Sección 'Nuestros Socios' no encontrada"
fi

if grep -q "Proyectos Destacados" /tmp/landing.html; then
    echo "✅ Sección 'Proyectos Destacados' encontrada"
else
    echo "❌ ERROR: Sección 'Proyectos Destacados' no encontrada"
fi

if grep -q "Nuestra Empresa" /tmp/landing.html || grep -q "Historia" /tmp/landing.html; then
    echo "✅ Sección 'Nuestra Empresa' encontrada"
else
    echo "❌ ERROR: Sección 'Nuestra Empresa' no encontrada"
fi

# Verificar socios
echo ""
echo "3. Verificando socios en Landing..."
for socio in "Stanley" "BTICINO" "CPP" "Aceros"; do
    if grep -qi "$socio" /tmp/landing.html; then
        echo "✅ Socio '$socio' encontrado"
    else
        echo "⚠️  Socio '$socio' no encontrado"
    fi
done

echo ""
echo "4. Verificando elementos en PÁGINA PRODUCTOS..."
echo ""

# Verificar breadcrumb
if grep -q "Inicio" /tmp/productos.html && grep -q "Productos" /tmp/productos.html; then
    echo "✅ Breadcrumb 'Inicio / Productos' encontrado"
else
    echo "❌ ERROR: Breadcrumb no encontrado"
fi

# Verificar buscador y filtros
if grep -q "search" /tmp/productos.html || grep -q "buscar" /tmp/productos.html; then
    echo "✅ Buscador de productos encontrado"
else
    echo "⚠️  Buscador no encontrado"
fi

# Verificar carrito
if grep -q "carrito" /tmp/productos.html || grep -q "cart" /tmp/productos.html; then
    echo "✅ Carrito de compras encontrado"
else
    echo "⚠️  Carrito no encontrado"
fi

# Verificar JavaScript
if grep -q "productos.js" /tmp/productos.html; then
    echo "✅ JavaScript productos.js vinculado"
else
    echo "❌ ERROR: JavaScript productos.js no vinculado"
fi

# Verificar botón volver
if grep -q "Volver al Inicio" /tmp/productos.html; then
    echo "✅ Botón 'Volver al Inicio' encontrado"
else
    echo "❌ ERROR: Botón 'Volver al Inicio' no encontrado"
fi

echo ""
echo "5. Verificando elementos en PÁGINA SERVICIOS..."
echo ""

# Verificar breadcrumb
if grep -q "Inicio" /tmp/servicios.html && grep -q "Servicios" /tmp/servicios.html; then
    echo "✅ Breadcrumb 'Inicio / Servicios' encontrado"
else
    echo "❌ ERROR: Breadcrumb no encontrado"
fi

# Verificar Swiper
if grep -q "swiper" /tmp/servicios.html || grep -q "Swiper" /tmp/servicios.html; then
    echo "✅ Biblioteca Swiper encontrada"
else
    echo "❌ ERROR: Biblioteca Swiper no encontrada"
fi

# Verificar carrusel
if grep -q "swiper-container" /tmp/servicios.html || grep -q "swiper-slide" /tmp/servicios.html; then
    echo "✅ Estructura de carrusel Swiper encontrada"
else
    echo "⚠️  Estructura de carrusel no encontrada"
fi

# Verificar JavaScript
if grep -q "servicios.js" /tmp/servicios.html; then
    echo "✅ JavaScript servicios.js vinculado"
else
    echo "❌ ERROR: JavaScript servicios.js no vinculado"
fi

# Verificar botón volver
if grep -q "Volver al Inicio" /tmp/servicios.html; then
    echo "✅ Botón 'Volver al Inicio' encontrado"
else
    echo "❌ ERROR: Botón 'Volver al Inicio' no encontrado"
fi

echo ""
echo "=== VERIFICACIÓN COMPLETADA ==="
