// ============================================================
// Práticas 2, 3 e 4: Interações do Cardápio e Carrinho
// ============================================================

// ---------- Elementos da tela ----------
const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
const contadorHtml = document.getElementById('contador-itens');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalHtml = document.getElementById('total-carrinho');
const sidebar = document.getElementById('sidebar-carrinho');
const overlay = document.getElementById('overlay');
const btnAbrirCarrinho = document.getElementById('abrir-carrinho');
const btnFecharCarrinho = document.getElementById('fechar-carrinho');
const btnFinalizar = document.getElementById('finalizar-pedido');

// ---------- Estado do carrinho ----------
// Map: nome do produto -> { preco, qtd }
const carrinho = new Map();

// ---------- Funções auxiliares ----------
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTotal() {
    let total = 0;
    carrinho.forEach((item) => { total += item.preco * item.qtd; });
    return total;
}

function contarItens() {
    let total = 0;
    carrinho.forEach((item) => { total += item.qtd; });
    return total;
}

// ---------- Lógica do carrinho ----------
function adicionarItem(nome, preco) {
    if (carrinho.has(nome)) {
        carrinho.get(nome).qtd += 1;
    } else {
        carrinho.set(nome, { preco: preco, qtd: 1 });
    }
    renderizarCarrinho();
}

function diminuirItem(nome) {
    if (!carrinho.has(nome)) return;
    const item = carrinho.get(nome);
    item.qtd -= 1;
    if (item.qtd <= 0) carrinho.delete(nome);
    renderizarCarrinho();
}

function removerItem(nome) {
    carrinho.delete(nome);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    // 1. Atualiza o contador do cabeçalho
    contadorHtml.innerText = contarItens();

    // 2. Atualiza a lista de itens da sidebar
    if (carrinho.size === 0) {
        listaCarrinho.innerHTML =
            '<p class="carrinho-vazio">Seu carrinho está vazio. Adicione itens do cardápio! 🍔</p>';
    } else {
        listaCarrinho.innerHTML = '';

        carrinho.forEach((item, nome) => {
            const div = document.createElement('div');
            div.className = 'item-carrinho';
            div.innerHTML = `
                <div class="item-info">
                    <strong>${nome}</strong>
                    <span>${formatarPreco(item.preco)} cada</span>
                </div>
                <div class="item-controles">
                    <button type="button" class="btn-qtd" data-acao="menos"
                            data-nome="${nome}" aria-label="Diminuir">−</button>
                    <span class="qtd">${item.qtd}</span>
                    <button type="button" class="btn-qtd" data-acao="mais"
                            data-nome="${nome}" aria-label="Aumentar">+</button>
                    <button type="button" class="btn-remover" data-acao="remover"
                            data-nome="${nome}" title="Remover item">🗑️</button>
                </div>
            `;
            listaCarrinho.appendChild(div);
        });
    }

    // 3. Atualiza o total
    totalHtml.innerText = formatarPreco(calcularTotal());
}

// ---------- Eventos dos botões "Adicionar" ----------
// O querySelectorAll busca pela classe .btn-adicionar, por isso
// os botões de bebida (que também têm essa classe) somam no carrinho.
botoesAdicionar.forEach((botao) => {
    botao.addEventListener('click', () => {
        const nome = botao.dataset.nome;
        const preco = parseFloat(botao.dataset.preco);

        adicionarItem(nome, preco);

        // Feedback visual rápido no botão
        const textoOriginal = botao.textContent;
        botao.textContent = 'Adicionado ✓';
        botao.classList.add('adicionado');
        setTimeout(() => {
            botao.textContent = textoOriginal;
            botao.classList.remove('adicionado');
        }, 800);

        // Pulso no contador do carrinho
        btnAbrirCarrinho.classList.remove('pulsar');
        void btnAbrirCarrinho.offsetWidth; // reinicia a animação
        btnAbrirCarrinho.classList.add('pulsar');
    });
});

// ---------- Controles dentro da sidebar (delegação de eventos) ----------
listaCarrinho.addEventListener('click', (event) => {
    const botao = event.target.closest('button');
    if (!botao) return;

    const nome = botao.dataset.nome;
    const acao = botao.dataset.acao;

    if (acao === 'mais' && carrinho.has(nome)) {
        adicionarItem(nome, carrinho.get(nome).preco);
    } else if (acao === 'menos') {
        diminuirItem(nome);
    } else if (acao === 'remover') {
        removerItem(nome);
    }
});

// ---------- Abrir / fechar a sidebar ----------
function abrirCarrinho() {
    sidebar.classList.add('aberto');
    overlay.classList.add('ativo');
    document.body.classList.add('carrinho-aberto');
}

function fecharCarrinho() {
    sidebar.classList.remove('aberto');
    overlay.classList.remove('ativo');
    document.body.classList.remove('carrinho-aberto');
}

btnAbrirCarrinho.addEventListener('click', abrirCarrinho);
btnFecharCarrinho.addEventListener('click', fecharCarrinho);
overlay.addEventListener('click', fecharCarrinho);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharCarrinho();
});

// ---------- Finalizar pedido ----------
let timeoutAviso;

btnFinalizar.addEventListener('click', () => {
    if (carrinho.size === 0) {
        clearTimeout(timeoutAviso);
        btnFinalizar.textContent = 'Adicione itens primeiro! 🛒';
        btnFinalizar.classList.add('aviso');
        timeoutAviso = setTimeout(() => {
            btnFinalizar.textContent = 'Finalizar Pedido';
            btnFinalizar.classList.remove('aviso');
        }, 1600);
        return;
    }

    listaCarrinho.innerHTML =
        '<div class="pedido-sucesso">✅ Pedido confirmado!<br>Obrigado pela preferência!<br>Volte sempre 🍔</div>';

    carrinho.clear();
    contadorHtml.innerText = '0';
    totalHtml.innerText = formatarPreco(0);

    setTimeout(() => {
        fecharCarrinho();
        renderizarCarrinho();
    }, 2600);
});

// ---------- Fallback de imagens (caso alguma URL falhe) ----------
document.querySelectorAll('img.imagem-produto').forEach((img) => {
    img.addEventListener('error', () => {
        img.src = 'https://picsum.photos/seed/' +
                  encodeURIComponent(img.alt) + '/600/400';
    });
});

// ---------- Render inicial ----------
renderizarCarrinho();