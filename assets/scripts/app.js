class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName
        this.value = attrValue
    }
}

class Component {
    
    constructor(renderHookId) {
        this.hookId = renderHookId
    }

    createRootElement(tag, cssClasses, attributes) {
        const rootEl = document.createElement(tag);
        if (cssClasses) {
            rootEl.className = cssClasses
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootEl.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootEl)
        return rootEl
    }
}

class Product {
    title = ''
    imageUrl
    description
    price

    constructor(title, image, desc, price) {
        this.title = title
        this.image = image
        this.description = desc
        this.price = price
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId)
        this.product = product
    }

    addToCartHandler() {
        console.log('Adding product to cart:::', this.product)
        App.addProductToCart(this.product)
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item')
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.image}" alt="${this.product.title}" >
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h2>${this.product.price}</h2>
                    <p>${this.product.description}</p>
                    <button>Add to cart</button>    
                </div>
            </div>
        `
        const addCartButton = prodEl.querySelector('button')
        addCartButton.addEventListener(
            'click',
            this.addToCartHandler.bind(this)
        )
    }
}

class ProductList extends Component {
   

    constructor(renderHookId) {
        super(renderHookId);
    }


    products = [
        new Product(
            'A Pillow',
            'https://www.ikea.com/th/en/images/products/rumsmalva-ergonomic-pillow-side-back-sleeper__0792315_pe764703_s5.jpg?f=s',
            'A soft pillow!',
            19.99
        ),
        new Product(
            'A Carpet',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTdaf4jjG_b6Al6Y3GuJsYM1RxgeBPKPE2Q&usqp=CAU',
            'A carpet which you might like - or not.',
            89.99
        ),
    ]

    render() {
        const prodList = this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'prod-list')])
        for (const product of this.products) {
            const productItem = new ProductItem(product, prodList.id)
            productItem.render()
        }
    }
}

class ShoppingCart extends Component {
    items = []

    set cartItems(value) {
        this.items = value
        this.totalOutput.innerHTML = `<h2>Total: ${this.totalAmount}</h2>`
    }

    get cartItems() {
        return this.items
    }

    get totalAmount() {
        const sum = this.items.reduce((prevValue, curItem) => {
            return prevValue + curItem.price
        }, 0)
        return sum
    }

    constructor(renderHookId) {
        super(renderHookId)

    }

    addProduct(product) {
        const updatedItems = [...this.items]
        updatedItems.push(product);
        this.cartItems = updatedItems;
        console.log('Shopping cart::add items::', this.cartItems)
    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
            <h2>Total: ${0}</h2>
            <button>Order Now!</button>
        `
        this.totalOutput = cartEl.querySelector('h2')
    }
}

class Shop {
    render() {
        this.cart = new ShoppingCart('app')
        this.cart.render()
        const productList = new ProductList('app')
        productList.render()

    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop()
        shop.render()
        this.cart = shop.cart
        console.log('App set::cart::', this.cart)
    }

    static addProductToCart(product) {
        this.cart.addProduct(product)
    }
}

App.init()
