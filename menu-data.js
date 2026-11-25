/**
 * Dados do cardápio e da loja.
 * Para atualizar o cardápio, edite só este arquivo: o layout é gerado
 * automaticamente a partir destas listas.
 *
 * ATENÇÃO: todos os dados abaixo são FICTÍCIOS (projeto de demonstração).
 * Troque nome, endereço, horário e WhatsApp pelos dados reais da loja.
 */

const STORE = {
  name: 'Casa Brasa',
  tagline: 'Cozinha de rua, tempero de casa',
  address: 'Rua das Palmeiras, 120 · Centro',
  hours: 'Ter a Dom · 11h às 23h',
  deliveryTime: '30–45 min',
  // Número no formato internacional, só dígitos (55 + DDD + número).
  // PLACEHOLDER: substitua pelo WhatsApp real da loja.
  whatsapp: '5500000000000',
};

const CATEGORIES = [
  { id: 'lanches', label: 'Lanches', description: 'Pão na brasa, blend artesanal e molhos da casa.' },
  { id: 'refeicoes', label: 'Refeições', description: 'Pratos completos e saladas para matar a fome de verdade.' },
  { id: 'brunch', label: 'Brunch e petiscos', description: 'Para começar o dia ou dividir na mesa.' },
  { id: 'doces', label: 'Doces', description: 'Para fechar bem: sobremesas feitas aqui.' },
  { id: 'bebidas', label: 'Bebidas e combos', description: 'Bebidas geladas e combos com preço especial.' },
];

/** Monta a URL otimizada de uma foto do Unsplash. */
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;

const PRODUCTS = [
  // Lanches
  { id: 'brasa-classico', category: 'lanches', name: 'Brasa Clássico', description: 'Blend de 160 g, cheddar inglês, cebola caramelizada e maionese de alho no pão brioche.', price: 32.9, image: img('1568901346375-23c9450c58cd'), tag: 'Mais pedido' },
  { id: 'brasa-fritas', category: 'lanches', name: 'Brasa com Fritas', description: 'Burger da casa com bacon crocante, acompanhado de fritas e molho barbecue.', price: 38.9, image: img('1551782450-a2132b4ba21d') },
  { id: 'combo-dupla', category: 'lanches', name: 'Combo Dupla', description: 'Dois smash burgers, batata rústica média e dois refrigerantes lata.', price: 69.9, image: img('1550547660-d9450f859349'), tag: 'Para dividir' },
  { id: 'pizza-brotinho', category: 'lanches', name: 'Pizza Brotinho', description: 'Massa de fermentação natural, molho de tomate, muçarela, cebola roxa e rúcula.', price: 33.9, image: img('1565299624946-b28f40a0ae38'), tag: 'Novo' },

  // Refeições
  { id: 'prato-executivo', category: 'refeicoes', name: 'Prato Executivo', description: 'Fatias de carne grelhada no ponto, salada de folhas, amendoim tostado e molho da casa.', price: 42.9, image: img('1504674900247-0877df9cc836') },
  { id: 'bowl-graos', category: 'refeicoes', name: 'Bowl de Grãos', description: 'Arroz integral, legumes assados, grão-de-bico e molho de tahine.', price: 34.9, image: img('1547592180-85f173990554'), tag: 'Vegetariano' },
  { id: 'salada-mediterranea', category: 'refeicoes', name: 'Salada Mediterrânea', description: 'Folhas, tomate, cebola roxa, azeitonas e queijo branco com azeite e limão.', price: 29.9, image: img('1540189549336-e6e99c3679fe') },
  { id: 'salada-power', category: 'refeicoes', name: 'Salada Power', description: 'Folhas, frango grelhado, ovo, repolho roxo e croutons com molho da casa.', price: 31.9, image: img('1546069901-ba9599a7e63c') },

  // Brunch e petiscos
  { id: 'bruschettas', category: 'brunch', name: 'Bruschettas da Casa', description: 'Pão rústico tostado com tomate, manjericão e queijo. Serve duas pessoas.', price: 27.9, image: img('1476224203421-9ac39bcb3327') },
  { id: 'panquecas', category: 'brunch', name: 'Panquecas Americanas', description: 'Pilha de panquecas fofinhas com mel, manteiga e frutas vermelhas.', price: 24.9, image: img('1567620905732-2d1ec7ab7445') },
  { id: 'brunch-casa', category: 'brunch', name: 'Brunch da Casa', description: 'Ovos cozidos, folhas, abacate e torradas de fermentação natural.', price: 28.9, image: img('1482049016688-2d3e1b311543') },

  // Doces
  { id: 'cupcakes', category: 'doces', name: 'Cupcakes da Casa', description: 'Trio de cupcakes de baunilha com cobertura de frutas vermelhas.', price: 18.9, image: img('1563729784474-d77dbb933a9e') },
  { id: 'donuts', category: 'doces', name: 'Donuts Glaceados', description: 'Dupla de donuts com cobertura de chocolate e confeitos coloridos.', price: 14.9, image: img('1551024601-bec78aea704b') },
  { id: 'macarons', category: 'doces', name: 'Macarons Sortidos', description: 'Seis macarons em sabores variados, crocantes por fora e macios por dentro.', price: 21.9, image: img('1470124182917-cc6e71b22ecc') },
  { id: 'crepe-morango', category: 'doces', name: 'Crepe com Morangos', description: 'Crepe doce recheado com creme, morangos frescos e chantilly.', price: 19.9, image: img('1587314168485-3236d6710814') },

  // Bebidas e combos
  { id: 'limonada', category: 'bebidas', name: 'Limonada Suíça', description: 'Limão batido com leite condensado e gelo. 500 ml.', price: 12.9, image: img('1621263764928-df1444c5e859') },
  { id: 'suco-laranja', category: 'bebidas', name: 'Suco de Laranja', description: 'Laranja espremida na hora, sem açúcar. 400 ml.', price: 10.9, image: img('1600271886742-f049cd451bba') },
  { id: 'refrigerante', category: 'bebidas', name: 'Refrigerante Lata', description: 'Escolha o sabor nas observações do pedido. 350 ml.', price: 6.9, image: img('1622483767028-3f66f32aef97') },
  { id: 'combo-familia', category: 'bebidas', name: 'Combo Família', description: '4 burgers clássicos, 2 porções de fritas e refrigerante de 2 L.', price: 139.9, image: img('1586190848861-99aa4a171e90'), tag: 'Economize R$ 20' },
];
