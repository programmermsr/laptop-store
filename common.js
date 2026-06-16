/* text change for instagram id */
const textEl = document.querySelector("#footer-social-networks a p");
const text = textEl.textContent;
textEl.textContent = "";

let index = 0;
let isTyping = false;
let interval = null;

const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting && !isTyping)
        {
            isTyping = true;

            interval = setInterval(() =>
            {
                if (index < text.length)
                {
                    textEl.textContent += text[index];
                    index++;
                }
                else
                {
                    clearInterval(interval);
                    observer.disconnect();
                }
            }, 150);
        }
    });
});

observer.observe(textEl);


/*input updown-----------------------------------------------------------------------------------*/
function set_codes_for_input_number_updown_s()
{
    let input_number_updown_s = document.querySelectorAll('.input-number-updown');
    input_number_updown_s.forEach((input_number_updown) =>
    {
        const plusButton = input_number_updown.querySelector('.input-number-updown-plus');
        const minusButton = input_number_updown.querySelector('.input-number-updown-minus');
        const inputField = input_number_updown.querySelector('input');
        const min = parseInt(inputField.min) || 1;
        const max = parseInt(inputField.max) || Infinity;

        plusButton.addEventListener('click', () =>
        {
            let val = parseInt(inputField.value) || min;
            if (val < max) inputField.value = val + 1;
            inputField.dispatchEvent(new Event('input'));
        });

        minusButton.addEventListener('click', () =>
        {
            let val = parseInt(inputField.value) || min;
            if (val > min) inputField.value = val - 1;
            inputField.dispatchEvent(new Event('input'));
        });

        inputField.addEventListener('input', () =>
        {
            if (inputField.value != "")
            {
                let num = parseInt(inputField.value);
                if (isNaN(num) || num < min) inputField.value = min;
                else if (num > max) inputField.value = max;
            }
        });

        inputField.addEventListener('blur', () =>
        {
            if (inputField.value === "" || isNaN(parseInt(inputField.value)))
            {
                inputField.value = min;
            }
            else if (parseInt(inputField.value) < min)
            {
                inputField.value = min;
            }
            else if (parseInt(inputField.value) > max)
            {
                inputField.value = max;
            }
        });
    });
}


/*shopping cart--------------------------------------------------------------------*/
class ShoppingCartItem
{
    constructor(id, model, image, color, specs, price, count)
    {
        this.id = id;
        this.model = model;
        this.image = image;
        this.color = color;
        this.specs = specs;
        this.price = price;
        this.count = count;
    }
}
const SHOPPING_CART_COOKIE_NAME = 'laptop-store-shopping-cart-cookie';
const SHOPPING_CART_COOKIE_EXPIRE_DAYS = 5;

// add
function add_or_change_item_to_Cookie(item)
{
    let shopping_cart_items = Cookies.get(SHOPPING_CART_COOKIE_NAME);
    if (shopping_cart_items == undefined) shopping_cart_items = [];
    else shopping_cart_items = JSON.parse(shopping_cart_items);

    let current_item = shopping_cart_items.find(x => x.id == item.id);
    if (current_item == undefined)
    {
        shopping_cart_items.push(item);
    }
    else
    {
        current_item.count++;
    }

    Cookies.set(
        SHOPPING_CART_COOKIE_NAME,
        JSON.stringify(shopping_cart_items),
        { expires: SHOPPING_CART_COOKIE_EXPIRE_DAYS }
    );

    update_shopping_cart_and_header_btn();
}


function delete_item_from_Cookie(id)
{
    let shopping_cart_items = Cookies.get(SHOPPING_CART_COOKIE_NAME);
    if (shopping_cart_items == undefined) return;
    else shopping_cart_items = JSON.parse(shopping_cart_items);

    let item_index = shopping_cart_items.findIndex(x => x.id == id);
    shopping_cart_items.splice(item_index, 1);

    Cookies.set(
        SHOPPING_CART_COOKIE_NAME,
        JSON.stringify(shopping_cart_items),
        { expires: SHOPPING_CART_COOKIE_EXPIRE_DAYS }
    );

    update_shopping_cart_and_header_btn();
}


function save_changed_count(itemId, inputValue)
{
    let shopping_cart_items = Cookies.get(SHOPPING_CART_COOKIE_NAME);
    if (shopping_cart_items == undefined) return;
    else shopping_cart_items = JSON.parse(shopping_cart_items);

    let item = shopping_cart_items.find(x => x.id == itemId);
    if (item == undefined) return;

    let val = Number(inputValue);
    if (isNaN(val) || val < 1) return;
    item.count = val;

    Cookies.set(
        SHOPPING_CART_COOKIE_NAME,
        JSON.stringify(shopping_cart_items),
        { expires: SHOPPING_CART_COOKIE_EXPIRE_DAYS }
    );

    update_shopping_cart_and_header_btn();
}


// update shopping cart and header btn
let shopping_cart_empty = document.getElementById('shopping-cart-empty');
let shopping_cart_full = document.getElementById('shopping-cart-full');
let shopping_cart_header_btn_span = document.querySelector('#shopping-cart-header-btn span');

update_shopping_cart_and_header_btn();

function update_shopping_cart_and_header_btn()
{
    let shopping_cart_items = Cookies.get(SHOPPING_CART_COOKIE_NAME);
    if (shopping_cart_items == undefined) shopping_cart_items = [];
    else shopping_cart_items = JSON.parse(shopping_cart_items);

    let shopping_cart_items_count = shopping_cart_items.length;
    let all_products_count = shopping_cart_items.reduce((sum, item) =>
    {
        return sum + Number(item.count);
    }, 0);

    if (shopping_cart_items_count == 0)
    {
        shopping_cart_header_btn_span.classList.remove('shopping-cart-header-btn-span-visible');
        shopping_cart_header_btn_span.classList.add('shopping-cart-header-btn-span-visible-no');
        shopping_cart_header_btn_span.innerHTML = '';

        shopping_cart_empty.classList.remove('no-visible');
        shopping_cart_full.classList.add('no-visible');
    }
    else
    {
        shopping_cart_header_btn_span.classList.remove('shopping-cart-header-btn-span-visible-no');
        shopping_cart_header_btn_span.classList.add('shopping-cart-header-btn-span-visible');
        shopping_cart_header_btn_span.innerHTML = all_products_count;

        shopping_cart_empty.classList.add('no-visible');
        shopping_cart_full.classList.remove('no-visible');

        let shopping_cart_items_tag = document.getElementById('shopping-cart-items');
        shopping_cart_items_tag.innerHTML = '';

        shopping_cart_items.forEach((item) =>
        {
            shopping_cart_items_tag.innerHTML += `
                <div class="shopping-cart-item">

                    <img class="shopping-cart-item-close" src="images/close red.png" alt="حذف محصول از سبد خرید"
                         onclick="delete_item_from_Cookie(${item.id})">

                    <div class="shopping-cart-item-image-and-text">
                        <img src="${item.image}" alt="لپ تاپ ${item.model} رنگ ${item.color}">
                        <div class="shopping-cart-item-text">
                            <p>${item.model}</p>
                            <div class="shopping-cart-item-color">${item.color}</div>
                        </div>
                    </div>

                    <div class="shopping-cart-item-specs">
                        <div>${item.specs}</div>
                    </div>

                    <div class="shopping-cart-item-input-and-price">
                        <div class="input-number-updown" id="input-number-updown-${item.id}">
                            <input type="number" value="${item.count}" min="1" max="99"
                                   oninput="save_changed_count(${item.id}, this.value)">
                            <button class="input-number-updown-plus">+</button>
                            <button class="input-number-updown-minus">-</button>
                        </div>
                        <p>${(item.price * item.count).toLocaleString('fa-IR')} تومان</p>
                    </div>

                </div>
            `;
        });

        set_codes_for_input_number_updown_s();

        let totalPrice = shopping_cart_items.reduce((sum, item) =>
        {
            return sum + (Number(item.price) * Number(item.count));
        }, 0);

        document.getElementById('shopping-cart-totalprice').innerHTML = totalPrice.toLocaleString('fa-IR');
    }
}


// show hide shopping cart
let shopping_cart = document.getElementById('shopping-cart');

function show_or_hide_shopping_cart()
{
    shopping_cart.classList.toggle('shopping-cart-visible-no');
    shopping_cart.classList.toggle('shopping-cart-visible');
}

document.getElementById('shopping-cart-header-btn').addEventListener('click', () =>
{
    show_or_hide_shopping_cart();
});

document.getElementById('shopping-cart-close-btn').addEventListener('click', () =>
{
    show_or_hide_shopping_cart();
});
