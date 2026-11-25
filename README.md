# Cardápio Digital · Casa Brasa

Cardápio digital responsivo para restaurantes e lanchonetes: o cliente navega pelas categorias, monta o pedido e o envia pronto pelo WhatsApp, sem cadastro.

> Projeto de portfólio. O restaurante, os preços, o endereço e o WhatsApp são **fictícios**.

## Funcionalidades

- **Cardápio por categorias** com abas fixas no topo que destacam a seção visível
- **Cards de produto** com foto, descrição, preço em R$ e selos (Mais pedido, Novo, Vegetariano…)
- **Carrinho** em gaveta lateral: quantidade (+/−), remoção, observações e total
- **Pedido pelo WhatsApp:** a mensagem sai formatada com itens, quantidades e total
- **Carrinho salvo** no navegador (`localStorage`) entre visitas
- **Layout responsivo:** lista compacta no celular (com barra flutuante de pedido) e grade de 2, 3 ou 4 colunas no tablet e no desktop
- **Acessibilidade:** HTML semântico, foco visível, navegação por teclado (Esc fecha o carrinho) e suporte a `prefers-reduced-motion`

## Tecnologias

HTML5, CSS3 (variáveis, Grid, Flexbox, `clamp()`) e JavaScript puro (ES6+), sem frameworks nem build.

## Estrutura

```
├── index.html     # Estrutura da página
├── style.css      # Design system (tokens) e estilos responsivos
├── menu-data.js   # Dados da loja, categorias e produtos  ← edite aqui
└── script.js      # Renderização do cardápio, carrinho e pedido
```

## Como editar o cardápio

Tudo fica em `menu-data.js`:

- **Loja:** nome, endereço, horário e WhatsApp no objeto `STORE`. O número usa o formato internacional, só com dígitos (ex.: `5511999999999`).
- **Categorias:** na lista `CATEGORIES`. A ordem da lista é a ordem das abas.
- **Produtos:** na lista `PRODUCTS`, um produto por objeto:

```js
{ id: 'brasa-classico', category: 'lanches', name: 'Brasa Clássico',
  description: 'Blend de 160 g, cheddar…', price: 32.9,
  image: img('1568901346375-23c9450c58cd'), tag: 'Mais pedido' }
```

Categorias sem produtos não aparecem. O campo `tag` é opcional.

## Como rodar

Abra o `index.html` no navegador ou use um servidor local:

```bash
python -m http.server 5500
```

e acesse `http://localhost:5500`.

## Créditos

Fotos do [Unsplash](https://unsplash.com).

## Licença

[MIT](LICENSE)
