/*slider-------------------------------------------------------------------------*/
//Definition
let slides = document.querySelectorAll('#slider .slide-and-btns .slides-container .slide');
let slides_container = document.querySelector('#slider .slide-and-btns .slides-container');
let slider_btn_right = document.querySelector('#slider-btn-right');
let slider_btn_left = document.querySelector('#slider-btn-left');
let slide_dots = document.querySelectorAll('.slide-dot');
const sliderImagesCount = 3 ;

slides_container.style.willChange = 'transform'; //for When the user returns to the tab 

//Copy and add last item to first
let last_clone = slides[slides.length - 1].cloneNode(true);
last_clone.id = 'last-clone';
slides_container.prepend(last_clone);

//Copy and add first item to last
let first_clone = slides[0].cloneNode(true); 
first_clone.id = 'first-clone';
slides_container.append(first_clone);

//Transfers required to get the location right
slide_width = slides[0].clientWidth;
slides_container.style.transform = `translateX(${-slide_width}px)`;

//Activate the first circle
slide_dots[0].classList.add('slide-dot-active');

//go to slide
let current_slide = 1;  
let item_index = 1;
let slide_lock;

slider_btn_right.addEventListener('click', ()=>
{
    if(slide_lock == true) return;
    current_slide += 1;
    goToSlide(current_slide); 
})
slider_btn_left.addEventListener('click', ()=>
{
    if(slide_lock == true) return;
    current_slide -= 1;
    goToSlide(current_slide); 
})
function goToSlide(slideIndex)
{
    //if(slide_lock == true) return; //It shouldn't be there to resize work properly & it check  in auto and btns
    slide_lock = true;
    slide_width = slides[0].clientWidth;
    slides_container.style.transform = `translateX(${-slide_width * (slideIndex)}px)`;
    slides_container.style.transition = '1s';
   updateDots();
   resetAutoSlide(); //for when click on btns

}
function updateDots() 
{
    slide_dots.forEach(dot => dot.classList.remove('slide-dot-active'));
    let dot_index = current_slide;
    if(dot_index === 0) dot_index = sliderImagesCount;
    if(dot_index === sliderImagesCount + 1) dot_index = 1;
    slide_dots[dot_index - 1].classList.add('slide-dot-active');
}

//To move slides when they reach the end or beginning

slides_container.addEventListener('transitionend', () =>
{
    slides = document.querySelectorAll('#slider .slide-and-btns .slides-container .slide');

    if (slides[current_slide].id === last_clone.id)
    {
        slides_container.style.transition = 'none';
        current_slide = slides.length - 2;
        slides_container.style.transform =
            `translateX(${-slide_width * current_slide}px)`;
    }

    if (slides[current_slide].id === first_clone.id)
    {
        slides_container.style.transition = 'none';
        current_slide = 1;
        slides_container.style.transform =
            `translateX(${-slide_width * current_slide}px)`;
    }

    slide_lock = false; //Only here is the next move allowed.
});

//To go to the same slide when the items below are clicked on
slide_dots.forEach((dot, i) => 
{
    dot.addEventListener('click', () => {
        current_slide = i + 1;
        goToSlide(current_slide);
    });
});


// auto next
function nextSlide() 
{
    if(slide_lock == true) return;
    current_slide += 1;
    goToSlide(current_slide);
}
function resetAutoSlide() 
{
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
}

let autoSlide = setInterval(nextSlide, 5000);


//When the browser resizes or user return tab
window.addEventListener('resize', () => 
{
    goToSlide(current_slide)
});

/*range-slider-input----------------------------------------------------------------------------------*/
const rangeInput = document.querySelector('.range-slider-input');
const container = document.querySelector('.range-slider');

const handle1 = document.getElementById('handle1');
const handle2 = document.getElementById('handle2');

const fill = container.querySelector('.range-slider-line');

const outputMinInput = document.getElementById('range-slider-output-min');
const outputMaxInput = document.getElementById('range-slider-output-max');

const MIN_VAL = parseInt(rangeInput.min);
const MAX_VAL = parseInt(rangeInput.max);
const STEP = parseInt(rangeInput.step);

let valMin = MIN_VAL;
let valMax = MAX_VAL;

let activeHandle = null;
let isDragging = false;

function getPercent(value)
{
    return ((value - MIN_VAL) / (MAX_VAL - MIN_VAL)) * 100;
}

function getValue(percent)
{
    return MIN_VAL + (percent / 100) * (MAX_VAL - MIN_VAL);
}

function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function updateUI()
{
    const percentMin = getPercent(valMin);
    const percentMax = getPercent(valMax);

    handle1.style.left = `${percentMin}%`;
    handle2.style.left = `${percentMax}%`;

    fill.style.left = `${percentMin}%`;
    fill.style.width = `${percentMax - percentMin}%`;

    outputMinInput.value = Math.round(valMin).toLocaleString('fa-IR');
    outputMaxInput.value = Math.round(valMax).toLocaleString('fa-IR');
}

function startDrag(e, handle)
{
    e.preventDefault();

    activeHandle = handle;
    isDragging = true;

    handle.classList.add('active');

    document.addEventListener('pointermove', onDrag);
    document.addEventListener('pointerup', stopDrag);
}

function onDrag(e)
{
    if (!isDragging || !activeHandle) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let percent = (x / rect.width) * 100;
    percent = clamp(percent, 0, 100);

    let value = getValue(percent);
    value = Math.round(value / STEP) * STEP;
    value = clamp(value, MIN_VAL, MAX_VAL);

    if (activeHandle === handle1)
    {
        valMin = Math.min(value, valMax);
    }
    else
    {
        valMax = Math.max(value, valMin);
    }

    updateUI();

    //
    if(isRangeSliderChanged())
    {
        document.querySelector('#products-filters-price .accordion-header p').style.color = 'var(--theme-color)'; 
    }
    else
    {
        document.querySelector('#products-filters-price .accordion-header p').style.color = 'black'; 
    }
}

function stopDrag()
{
    if (activeHandle)
    {
        activeHandle.classList.remove('active');
    }

    activeHandle = null;
    isDragging = false;

    document.removeEventListener('pointermove', onDrag);
    document.removeEventListener('pointerup', stopDrag);
    showFilterCount();
    setPaginationFirst();
    showProducts();
}

handle1.addEventListener('pointerdown', (e) =>
{
    startDrag(e, handle1);
});

handle2.addEventListener('pointerdown', (e) =>
{
    startDrag(e, handle2);
});

window.addEventListener('resize', () =>
{
    updateUI();
});

updateUI();

function isRangeSliderChanged() //used for show filters count
{
    if( parseInt(rangeInput.min) != valMin || parseInt(rangeInput.max) != valMax ) return true;
    else return false;
}
function getRangeSliderCurrentMin() //used for 'get-products.js'
{
    return valMin;
}
function getRangeSliderCurrentMax() //used for 'get-products.js'
{
    return valMax;
}

/*products_sort--------------------------------------------------------------------------------------------------*/
const products_sort_items = document.querySelectorAll('#products-sort .products-sort-item');
products_sort_items.forEach((item) =>
{
    item.addEventListener('click', function()
    {
        for(let i=0;i<products_sort_items.length;i++)
        {
            products_sort_items[i].classList.remove('active');
        }

        item.classList.add('active');
        showProducts();
    });
});


/*products filters UI and accordion----------------------------------------------------------------------------*/

const products_filters_title = document.querySelector('#products-filters-title');
const products_filters_content = document.querySelector('#products-filters-content');
const products_filters_title_left_img = document.querySelector('#products-filters-title-left-img');

products_filters_title.addEventListener('click' , function() 
{
    if (window.getComputedStyle(products_filters_title_left_img).display != 'block') return; //mobile only
    
    const content = products_filters_content;
    content.style.transition= 'max-height 1s ease-in-out , opacity 1s ease-in-out';
    
    if (content.style.maxHeight === "0px" || content.style.maxHeight === "") //open
    {
        content.style.maxHeight = 2000 + 'px';
        content.style.opacity = 1;
        products_filters_title.classList.add('active');
    } 
    else //close
    {
        content.style.maxHeight = 0 +'px';
        content.style.opacity = 0;
        products_filters_title.classList.remove('active');
    }
});
 

//accordion
const headers = document.querySelectorAll('.accordion-header');

for (let i = 0; i < headers.length; i++) 
{
  headers[i].onclick = function() 
  {
    const content = headers[i].parentElement.querySelector('.accordion-content');
    content.style.transition= 'max-height 1s ease-in-out';
    if (content.style.maxHeight === "0px" || content.style.maxHeight === "") //open
    {
      content.style.maxHeight = 2000 + 'px';
      headers[i].parentElement.classList.add('active');
    } 
    else //close
    {
      content.style.maxHeight = 0 +'px';
      headers[i].parentElement.classList.remove('active');
    }
  };
}

//resize
window.addEventListener('resize', () => 
{
    products_filters_content.style.transition= 'none';
    
    const headers = document.querySelectorAll('.accordion-header');
    for (let i = 0; i < headers.length; i++) 
    {
        headers[i].parentElement.querySelector('.accordion-content').style.transition= 'none';;
    }
   
   show_or_hide_products_filters_content()
    
});
//
show_or_hide_products_filters_content(); //for first time
function show_or_hide_products_filters_content()
{
    if (window.innerWidth >= 992) //desktop
    {
        products_filters_content.style.maxHeight = 2000 + 'px';
        products_filters_content.style.opacity = 1;
    }
        
    else 
    {
        if(products_filters_title.classList.contains('active') == false)
        {
            products_filters_content.style.maxHeight = 0 + 'px';
            products_filters_content.style.opacity = 0;
        } 
        else
        {
            products_filters_content.style.maxHeight = 2000 + 'px';
            products_filters_content.style.opacity = 1;
        }  
    }
    
}

//filetr when selected show count
function showFilterCount()
{   
    const products_filters_title_right_count = document.getElementById('products-filters-title-right-count');
    let filetr_selected_count = 0;
    
    //state 1
    let p_collection = document.querySelectorAll('#products-filters-content .accordion-header p');
    p_collection.forEach((p) =>
    {
        if(p.style.color ==  'var(--theme-color)') filetr_selected_count +=1;
    });
    if(document.querySelector('#products-filters-available label').style.color == 'var(--theme-color)') filetr_selected_count +=1;

    //state 2
    // filetr_selected_count = document.querySelectorAll('#products-filters-content input[type="checkbox"]:checked').length;
    // if(isRangeSliderChanged()) filetr_selected_count +=1;
    
    if(filetr_selected_count == 0) products_filters_title_right_count.innerHTML = ``;
    else products_filters_title_right_count.innerHTML = `(${filetr_selected_count} مورد)`;
}

//EventListener for filters_checkboxes
const filters_checkboxes = document.querySelectorAll('#products-filters-content input[type="checkbox"]');

filters_checkboxes.forEach((checkbox) =>
{
    checkbox.addEventListener('change', function()
    {
       if(checkbox.parentElement.parentElement.id == 'products-filters-available')
       {
            if(checkbox.checked) document.querySelector('#products-filters-available label').style.color = 'var(--theme-color)';
            else document.querySelector('#products-filters-available label').style.color = 'black';
        }    
       else
        {
            let checkbox_filterPart_parent = checkbox.parentElement.parentElement.parentElement.parentElement;
            if(checkbox.checked)
            {
                checkbox_filterPart_parent.querySelector('.accordion-header p').style.color = 'var(--theme-color)';
            }
            else 
            {
                let selected_checkboxes_in_filterPart_parent_count = checkbox_filterPart_parent.querySelectorAll('input[type="checkbox"]:checked').length;
                if(selected_checkboxes_in_filterPart_parent_count == 0)
                    checkbox_filterPart_parent.querySelector('.accordion-header p').style.color = 'black';
            }
       }

      showFilterCount();
      setPaginationFirst();
      showProducts();
      
    });
});


/*pagination------------------------------------------------------------------------- */
const pagination_prev_btn = document.getElementById('pagination-prev-btn');
const pagination_next_btn = document.getElementById('pagination-next-btn');
const pagination_numbers = document.getElementById('pagination-numbers');
const maxBtnNumbersShow = 5; //btn numbers count show
let pagination_current = 1;
let pagination_max = 1;

function updatePagination(R_pagination_current , R_pagination_max) 
{
    pagination_current = R_pagination_current;
    pagination_max = R_pagination_max;
    if(pagination_max <= 1 ) 
    {
        document.getElementById('pagination').style.visibility  = 'hidden';
        return;
    } 
    else
    {
        document.getElementById('pagination').style.visibility  = 'visible';
    }

    //able or disable pagination_prev_btn and pagination_next_btn
    if (pagination_current === 1) pagination_prev_btn.disabled = true;
    else pagination_prev_btn.disabled = false;

    if (pagination_current === pagination_max) pagination_next_btn.disabled = true;
    else pagination_next_btn.disabled = false;

    //create numbers btns
    pagination_numbers.innerHTML = '';

    let start = Math.max(1, pagination_current - Math.floor(maxBtnNumbersShow / 2)); //btn first
    let end = Math.min(pagination_max, start + maxBtnNumbersShow - 1); //btn last

    if (end - start + 1 < maxBtnNumbersShow) start = Math.max(1, end - maxBtnNumbersShow + 1); 
    for (let i = start; i <= end; i++) 
    {
        const btn = document.createElement('button');
        btn.classList.add('pagination-btn'); 
        if (i === pagination_current)  btn.classList.add('active'); 
        btn.textContent = i;

        btn.onclick = () => 
        {
            pagination_current = i;
            updatePagination(pagination_current , pagination_max);
            showProducts();
    
            //go to up
            const el = document.getElementById("products-background");
            const y =el.getBoundingClientRect().top + window.pageYOffset -20; 
            window.scrollTo({ top: y,behavior: "smooth"});
        };
        pagination_numbers.appendChild(btn);
    }
    //add btnDots and btn max
    if( end < pagination_max)
    {
        //btnDots ...
        const btnDots = document.createElement('button');
        btnDots.classList.add('pagination-btn');
        btnDots.classList.add('pagination-btn-dots'); 
        btnDots.textContent = '...';
        pagination_numbers.appendChild(btnDots);
        //btn max
        const btnMax = document.createElement('button');
        btnMax.classList.add('pagination-btn'); 
        btnMax.textContent = pagination_max;
        btnMax.onclick = () => 
        {
            pagination_current = pagination_max;
            updatePagination(pagination_current , pagination_max);
        };
        pagination_numbers.appendChild(btnMax);
    }
}

pagination_prev_btn.onclick = () => 
{
    if (pagination_current > 1) 
    {
        pagination_current--;
        updatePagination(pagination_current , pagination_max);
        showProducts();
        //go to up
        const el = document.getElementById("products-background");
        const y =el.getBoundingClientRect().top + window.pageYOffset -20; 
        window.scrollTo({ top: y,behavior: "smooth"});
    }
};

pagination_next_btn.onclick = () => 
{
    if (pagination_current < pagination_max) 
    {
        pagination_current++;
        updatePagination(pagination_current , pagination_max);
        showProducts();
        //go to up
        const el = document.getElementById("products-background");
        const y =el.getBoundingClientRect().top + window.pageYOffset -20; 
        window.scrollTo({ top: y,behavior: "smooth"});
    }
};

function getPagination_current()
{
    return pagination_current;
}
function setPaginationFirst()
{
    pagination_current = 1;
}

/*get and show products-------------------------------------------------------------------------------*/
//get User Selected Filters
const products_filters_available_checkbox = document.querySelector('#products-filters-available input[type="checkbox"]');
function getUserSelectedFilters()
{
    let userSelectedFilters = 
    {
        available: products_filters_available_checkbox.checked,
        priceMin: getRangeSliderCurrentMin(),
        priceMax: getRangeSliderCurrentMax(),
        brands: getSlectedCheckboxesNames('#products-filters-brand'),
        colors: getSlectedCheckboxesNames('#products-filters-color'),
        rams: getSlectedCheckboxesNames('#products-filters-ram').map(text => parseInt(text, 10)),
        cpus: getSlectedCheckboxesNames('#products-filters-cpu'),
        gpuBrands: getSlectedCheckboxesNames('#products-filters-gpu-brand'),
        gpuCapacities: getSlectedCheckboxesNames('#products-filters-gpu-capacity').map(text => parseInt(text, 10))
    };
    return userSelectedFilters;
}

function getSlectedCheckboxesNames(products_filters_id)
{
    let selected_checkboxes = document.querySelectorAll(`${products_filters_id} input[type="checkbox"]:checked`);
    let names = [];
    selected_checkboxes.forEach((checkbox) =>
    {
        let checkbox_name = checkbox.parentElement.parentElement.querySelector('p').innerHTML;
        names.push(checkbox_name);
    });
    return names;
}

//get user selected sort
function getUserSelectedSort()
{
    return document.querySelector('.products-sort-item.active').innerHTML;
}

//send filters and get products from backend
class Product
{
  constructor()
  {
    this.id = 0;
    this.model = "";
    this.available = false;
    this.price = 0;
    this.brand = "";
    this.color = "";
    this.ram = 0;
    this.cpu = "";
    this.gpuBrand = "";
    this.gpuName = "";
    this.gpuCapacity = 0;
    this.image = "";
    this.dateAdd = "";
    this.soldCount = 0;
  }
}


//show products
const products_items_container = document.querySelector("#products-items-container");
showProducts(); //for first run
function showProducts()
{
    const productCountInEachPage = 12;
    let userSelectedFilters = getUserSelectedFilters(); 
    let userSelectedSort = getUserSelectedSort();
    let paginationCurrentPage = getPagination_current();

   
    var result = getProductsAndPageCount(userSelectedFilters, userSelectedSort , productCountInEachPage , paginationCurrentPage ); // send => userSelectedFilters , productCountInEachPage , paginationCurrentPage   |   get => products (maximum = productCountInEachPage) , pageCount
    let products = result.products;
    let paginationPagesCount = result.pageCount;
    products_items_container.innerHTML = '';

    if (products.length === 0) products_items_container.innerHTML = `<p id ="products-not-found">محصولی یافت نشد</p>`;
    else for(let i=0;i<products.length;i++) products_items_container.innerHTML += getProductItemHtml(products[i]);
    
    updatePagination(paginationCurrentPage , paginationPagesCount);
    activeProductsBtns();
   
}


function getProductItemHtml(product)
{
    let price = `<div class = "products-item-price" data-productid = ${product.id}>
    <p>خرید</p>
     <p>${product.price.toLocaleString('fa-IR')} تومان</p>
    </div>`;
    if(product.available == false) price = `<p class="products-item-noexist">ناموجود</p>`;
    
    let str = ` <div class="products-item">

                        <img src="${product.image}" alt="لپ تاپ ${product.brand} ${product.model} رنگ ${product.color}">
                        
                        <div class="products-item-detail">
                            <p>مدل :</p>
                            <p>${product.model}</p>

                        </div>

                        <div class="products-item-detail">
                            <p>برند :</p>
                            <p>${product.brand}</p>
         
                        </div>

                         <div class="products-item-detail">
                            <p>رنگ :</p>
                            <p>${product.color}</p>
                        </div>


                        <div class="products-item-detail">
                            <p>رم :</p>
                            <p>${product.ram}</p>
                        </div>

                         <div class="products-item-detail">
                            <p>پردازنده :</p>
                            <p>${product.cpu}</p>
                        </div>

                        <div class="products-item-detail">
                            <p>کارت گرافیک :</p>
                            <p>${product.gpuName + " " + product.gpuCapacity + "g"}</p>
                        </div>

                        <div class="products-item-price-or-noexist">
                            ${price}
                        </div>

                    </div>`;
    return str;
}



/*products btns  & add product to shopping cart--------------------------------------------------------*/
function activeProductsBtns()
{
    document.querySelectorAll('.products-item-price').forEach((btn) =>
    {
        btn.addEventListener('click',function()
        {
            let productid = btn.dataset.productid;
            let product = getProductById(productid);

            let specs = product.brand + " " + "RAM" + product.ram  + " " +  product.cpu  + " " + product.gpuName;


            let item = new ShoppingCartItem(product.id,product.model, product.image,product.color,specs,product.price,1);
            add_or_change_item_to_Cookie(item);
        });
    });
}
