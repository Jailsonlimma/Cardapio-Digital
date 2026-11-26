// carrinho salvo no navegador
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || {};

function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function acharProduto(id) {
  return PRODUCTS.find(function (p) {
    return p.id === id;
  });
}

// monta o cardapio na tela
function mostrarCardapio() {
  let htmlCardapio = '';
  let htmlCategorias = '';

  CATEGORIES.forEach(function (categoria) {
    const produtos = PRODUCTS.filter(function (p) {
      return p.category === categoria.id;
    });

    htmlCategorias += '<a href="#' + categoria.id + '">' + categoria.label + '</a>';

    htmlCardapio += '<section class="categoria" id="' + categoria.id + '">';
    htmlCardapio += '<h2>' + categoria.label + '</h2>';
    htmlCardapio += '<p class="descricao">' + categoria.description + '</p>';
    htmlCardapio += '<div class="produtos">';

    produtos.forEach(function (produto) {
      htmlCardapio += `
        <div class="produto">
          <div>
            ${produto.tag ? '<span class="tag">' + produto.tag + '</span>' : ''}
            <h3>${produto.name}</h3>
            <p>${produto.description}</p>
            <div class="preco">
              ${formatarPreco(produto.price)}
              <button class="btn-add" onclick="adicionar('${produto.id}')">+</button>
            </div>
          </div>
          <img src="${produto.image}" alt="${produto.name}">
        </div>`;
    });

    htmlCardapio += '</div></section>';
  });

  document.getElementById('cardapio').innerHTML = htmlCardapio;
  document.getElementById('categorias').innerHTML = htmlCategorias;
}

function adicionar(id) {
  if (carrinho[id]) {
    carrinho[id]++;
  } else {
    carrinho[id] = 1;
  }
  atualizarCarrinho();
}

function remover(id) {
  carrinho[id]--;
  if (carrinho[id] <= 0) {
    delete carrinho[id];
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  let html = '';
  let total = 0;
  let quantidade = 0;

  for (let id in carrinho) {
    const produto = acharProduto(id);
    if (!produto) continue;

    const qtd = carrinho[id];
    total += produto.price * qtd;
    quantidade += qtd;

    html += `
      <div class="item-carrinho">
        <div>
          <strong>${produto.name}</strong><br>
          <small>${formatarPreco(produto.price * qtd)}</small>
        </div>
        <div>
          <button onclick="remover('${id}')">-</button>
          ${qtd}
          <button onclick="adicionar('${id}')">+</button>
        </div>
      </div>`;
  }

  document.getElementById('itens-carrinho').innerHTML = html;
  document.getElementById('total').innerText = formatarPreco(total);
  document.getElementById('qtd-carrinho').innerText = quantidade;

  if (quantidade === 0) {
    document.getElementById('carrinho-vazio').style.display = 'block';
  } else {
    document.getElementById('carrinho-vazio').style.display = 'none';
  }
}

function abrirCarrinho() {
  document.getElementById('carrinho').classList.add('aberto');
  document.getElementById('fundo-escuro').classList.add('aberto');
}

function fecharCarrinho() {
  document.getElementById('carrinho').classList.remove('aberto');
  document.getElementById('fundo-escuro').classList.remove('aberto');
}

// manda o pedido pro whatsapp
function enviarPedido() {
  if (Object.keys(carrinho).length === 0) {
    alert('Seu pedido está vazio!');
    return;
  }

  let mensagem = 'Olá, ' + STORE.name + '! Quero fazer um pedido:\n\n';
  let total = 0;

  for (let id in carrinho) {
    const produto = acharProduto(id);
    mensagem += carrinho[id] + 'x ' + produto.name + ' - ' + formatarPreco(produto.price * carrinho[id]) + '\n';
    total += produto.price * carrinho[id];
  }

  mensagem += '\nTotal: ' + formatarPreco(total);

  const obs = document.getElementById('observacoes').value;
  if (obs !== '') {
    mensagem += '\nObservações: ' + obs;
  }

  window.open('https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent(mensagem));
}

function limparPedido() {
  carrinho = {};
  document.getElementById('observacoes').value = '';
  atualizarCarrinho();
}

// aberto ou fechado (11h as 23h, fecha segunda)
function verificarHorario() {
  const agora = new Date();
  const hora = agora.getHours();
  const status = document.getElementById('status');

  if (agora.getDay() !== 1 && hora >= 11 && hora < 23) {
    status.innerText = 'Aberto agora';
  } else {
    status.innerText = 'Fechado agora';
    status.classList.add('fechado');
  }
}

document.getElementById('btn-carrinho').addEventListener('click', abrirCarrinho);
document.getElementById('fechar-carrinho').addEventListener('click', fecharCarrinho);
document.getElementById('fundo-escuro').addEventListener('click', fecharCarrinho);
document.getElementById('btn-enviar').addEventListener('click', enviarPedido);
document.getElementById('btn-limpar').addEventListener('click', limparPedido);

mostrarCardapio();
atualizarCarrinho();
verificarHorario();
