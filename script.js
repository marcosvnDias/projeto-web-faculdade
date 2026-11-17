
class Produto {
    constructor(nome, descricao, preco, imgProduto, qtItensDisponiveis) {
        this.id = nome
        this.nome = nome
        this.descricao = descricao
        this.preco = preco
        this.imgProduto = imgProduto
        this.qtItens = 1
        this.qtItensDisponiveis = qtItensDisponiveis
        this.precoTotal = preco
    }
}

let telcado = new Produto("Teclado Mecânico Azul", "Periféricos", 424.52, "teclado-mecanico.jpg", 2)
let headset = new Produto("Headset Bluetooth", "Periféricos", 220.84, "headset.jpg", 1)
let cadeiraGamer = new Produto("Cadeira Gamer", "Móvel", 680.00, "cadeira-gamer.jpg", 3)

var listProdutos = [telcado, headset, cadeiraGamer]

const cuponsValidos = {
    "DESC10": 0.10,
    "BEMVINDO20": 0.20,
    "PROMO50": 0.50
}

let descontoAtual = 0

function renderItens(listProdutos) {
    let tabelaProduto = document.getElementById("tabelaProduto")
    tabelaProduto.innerHTML = ""

    listProdutos.forEach(produto => {
        const componenteProduto = `
            <tr>
            <td>
                <div class="product">
                <img 
                    src="./images/${produto.imgProduto}" 
                    height="100" 
                    width="100" 
                    alt="${produto.nome}" 
                />
                <div class="info">
                    <div class="name">${produto.nome}</div>
                    <div class="category">${produto.descricao}</div>
                </div>
                </div>
            </td>
            <td class="precoItem">${tratarPreco(produto.preco)}</td>
            <td>
                <div class="quantity">
                <button class="menos" data-id="${produto.id}">
                    <i class="bx bx-minus"></i>
                </button>
                <span class="qtItem">${produto.qtItens}</span>
                <button class="mais" data-id="${produto.id}">
                    <i class="bx bx-plus"></i>
                </button>
                </div>
            </td>
            <td class="precoTotalItem">${tratarPreco(produto.precoTotal)}</td>
            <td>
                <button class="remove" data-id="${produto.id}">
                <i class="bx bx-x"></i>
                </button>
            </td>
            </tr>
        `

        tabelaProduto.insertAdjacentHTML('beforeend', componenteProduto)
    })
    
    calculaValorTotal(listProdutos)
    adicionarEventos()
}

function tratarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

function adicionarEventos() {
    document.querySelectorAll('.mais').forEach((button) => {
      button.addEventListener("click", aumentarItens)
    })

    document.querySelectorAll('.menos').forEach((button) => {
      button.addEventListener("click", diminuirItens)
    })

    document.querySelectorAll('.remove').forEach((button) => {
      button.addEventListener("click", removerProduto)
    })
}

function aumentarItens(elemento) {
    const idProduto = event.currentTarget.getAttribute("data-id")
    const produto = listProdutos.find(p => p.id === idProduto)
    
    if (produto && produto.qtItens != produto.qtItensDisponiveis) {
        produto.qtItens++
        produto.precoTotal = produto.qtItens * produto.preco

        produto.precoTotal
        renderItens(listProdutos)
    } else {
        alert("Não é possível adicionar mais itens para esse produto.")
    }
}

function diminuirItens(elemento) {
    const idProduto = event.currentTarget.getAttribute("data-id")
    const produto = listProdutos.find(p => p.id === idProduto)
    
    if (produto && produto.qtItens > 1) {
        produto.qtItens--
        produto.precoTotal = produto.qtItens * produto.preco
        
        renderItens(listProdutos)
    }
}

function removerProduto(elemento) {
    const idProduto = event.currentTarget.getAttribute("data-id")
    listProdutos = listProdutos.filter(p => p.id !== idProduto)
    
    renderItens(listProdutos)
}

function calculaValorTotal(listProdutos) {
    const totalCompra = document.getElementById("totalCompra")
    const subTotal = document.getElementById("subTotal")
    const linhaDesconto = document.getElementById("linhaDesconto")
    const valorDescontoEl = document.getElementById("valorDesconto")
    
    let somaTotal = listProdutos.reduce((acumulador, produto) => acumulador + produto.precoTotal, 0)
    let total = tratarPreco(somaTotal)
    let valorDescontado = somaTotal * descontoAtual
    let totalComDesconto = tratarPreco(somaTotal - valorDescontado)

    subTotal.textContent = total
    totalCompra.textContent = totalComDesconto

    if (descontoAtual > 0) {
        linhaDesconto.style.display = "flex"
        valorDescontoEl.textContent = "- " + tratarPreco(valorDescontado)
    }
}

function configurarCupom() {
    const botaoDesconto = document.getElementById("botao-desconto")
    const areaCupom = document.getElementById("area-cupom")
    const inputCupom = document.getElementById("input-cupom")
    const botaoAplicar = document.getElementById("aplicar-cupom")

    botaoDesconto.addEventListener("click", () => {
        botaoDesconto.style.display = "none"
        areaCupom.style.display = "flex"
        areaCupom.style.minWidth = "343px"
        inputCupom.focus()
    })

    botaoAplicar.addEventListener("click", () => {
        const codigoDigitado = inputCupom.value.trim().toUpperCase()

        if (cuponsValidos[codigoDigitado]) {
            descontoAtual = cuponsValidos[codigoDigitado]
            calculaValorTotal(listProdutos)
            
            areaCupom.innerHTML = `<span style="color: #3bc55b; font-size: 14px;">✔ Cupom <strong>${codigoDigitado}</strong> aplicado!</span>`
        } else {
            alert("Cupom inválido! Tente: DESC10, BEMVINDO20 ou PROMO50")
            inputCupom.value = ""
            inputCupom.focus()
        }
    })
}

function renderNumeroPedido() {
    let numeroPedido = document.getElementById("numeroPedido")
    let numeroAleatorio = Math.floor(Math.random() * (50000))
    numeroPedido.textContent = "Pedido #" + numeroAleatorio
}

renderNumeroPedido()
configurarCupom()
renderItens(listProdutos)