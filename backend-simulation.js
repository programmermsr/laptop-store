/* backend-simulation -----------------------------------------------------------------*/

class ProductsAndPageCount
{
    constructor()
    {
        this.products = [];
        this.pageCount = 1;
    }
}


function getProductsAndPageCount(userSelectedFilters, userSelectedSort , productCountInEachPage , paginationCurrentPage) //used for sort & filter products
{
    let allProducts = getAllProductsInDatabase();

    // =====================
    // FILTER
    // =====================
    let allFilterdProducts = allProducts.filter(product =>
    {
        // available
        if (userSelectedFilters.available && !product.available)
        {
            return false;
        }

        // price
        if (
            product.price < userSelectedFilters.priceMin ||
            product.price > userSelectedFilters.priceMax
        )
        {
            return false;
        }

        // brand
        if (userSelectedFilters.brands.length > 0)
        {
            let productBrand =
                product.brand.toLowerCase().trim();

            let brands =
                userSelectedFilters.brands.map(b =>
                    b.toLowerCase().trim()
                );

            if (!brands.includes(productBrand))
            {
                return false;
            }
        }

        // color
        if (userSelectedFilters.colors.length > 0)
        {
            let productColor = product.color.toLowerCase().trim();
            let colors = userSelectedFilters.colors.map(c => c.toLowerCase().trim());

            const hasOtherColors = colors.includes("سایر رنگ ها");
            const hasWhite = colors.includes("سفید");
            const hasBlack = colors.includes("مشکی");

            // فقط سایر رنگ‌ها
            if (hasOtherColors && !hasWhite && !hasBlack)
            {
                if (productColor === "سفید" || productColor === "مشکی")
                {
                    return false;
                }
            }
            else
            {
                // حالت عادی (سفید / مشکی / ترکیبی)
                if (!colors.includes(productColor))
                {
                    return false;
                }
            }
        }


        // ram
        if (userSelectedFilters.rams.length > 0)
        {
            const rams = userSelectedFilters.rams;
            const productRam = product.ram;

            const has32Plus = rams.includes(32); // 32 گیگ و بیشتر

            // فقط 32+
            if (has32Plus && rams.length === 1)
            {
                if (productRam < 32)
                {
                    return false;
                }
            }
            else
            {
                // حالت عادی (8 / 16 / ترکیبی)
                if (!rams.includes(productRam))
                {
                    return false;
                }
            }
        }


        // cpu
        if (userSelectedFilters.cpus.length > 0)
        {
            let productCpu =
                product.cpu.toLowerCase().trim();

            let cpus =
                userSelectedFilters.cpus.map(c =>
                    c.toLowerCase().trim()
                );

            if (!cpus.includes(productCpu))
            {
                return false;
            }
        }

        // gpu brand
        if (userSelectedFilters.gpuBrands.length > 0)
        {
            let productGpuBrand =
                product.gpuBrand.toLowerCase().trim();

            let gpuBrands =
                userSelectedFilters.gpuBrands.map(g =>
                    g.toLowerCase().trim()
                );

            if (!gpuBrands.includes(productGpuBrand))
            {
                return false;
            }
        }

        // gpu capacity (number)
        if (
            userSelectedFilters.gpuCapacities.length > 0 &&
            !userSelectedFilters.gpuCapacities.includes(product.gpuCapacity)
        )
        {
            return false;
        }

        return true;
    });

    // =====================
    // SORT
    // =====================
    switch (userSelectedSort)
    {
        case "جدید ترین":
        {
            allFilterdProducts.sort(
                (a, b) => new Date(b.dateAdd) - new Date(a.dateAdd)
            );
            break;
        }

        case "پر فروش ترین":
        {
            allFilterdProducts.sort(
                (a, b) => b.soldCount - a.soldCount
            );
            break;
        }

        case "ارزان ترین":
        {
            allFilterdProducts.sort(
                (a, b) => a.price - b.price
            );
            break;
        }

        case "گران ترین":
        {
            allFilterdProducts.sort(
                (a, b) => b.price - a.price
            );
            break;
        }
    }

    // =====================
    // PAGINATION
    // =====================
   
    let startIndex =(paginationCurrentPage - 1) * productCountInEachPage;

    let endIndex = paginationCurrentPage * productCountInEachPage;

    let productsInPage = allFilterdProducts.slice(startIndex, endIndex);

    let productsAndPageCount = new ProductsAndPageCount();

    productsAndPageCount.products =productsInPage;

    productsAndPageCount.pageCount = Math.ceil(allFilterdProducts.length / productCountInEachPage) ;

    return productsAndPageCount;
}


function getProductById(id) //used for add to shopping cart
{
    id = Number(id);
    let allProducts = getAllProductsInDatabase();
    let product = allProducts.find(p => p.id === id);
    return product ?? null;
} 

/*database---------------------------------------------------------------------------------------*/
function getAllProductsInDatabase()
{
    let productsInDatabase = [];

    //1
    let product1 = new Product();
    product1.id = 1;
    product1.model = "Victus 15-fa2706ng";//مدل های مختلف لپ تاپ با توجه به برند ولی زیاد طولانی نباشد
    product1.available = true; //true,false
    product1.price = 32000000; //between 12_000_000 to 550_000_000
    product1.brand = "HP"; //hp,microsoft,lenovo,msi,acer,asus
    product1.color = "مشکی";  //سفید ، مشکی ، آبی ،قرمز ، قهوه ای ، سبز ، خاکستری
    product1.ram = 16; //8,16,32,64
    product1.cpu = "Intel Core i5"; //Intel Core i3,Intel Core i5,Intel Core i7,Intel Core i9,AMD Ryzen 5,AMD Ryzen 7,AMD Ryzen 9
    product1.gpuBrand = "NVIDIA"; //NVIDIA, AMD , Intel
    product1.gpuName = "RTX 2050"; //مدل های موجود بین NVIDIA, AMD , Intel
    product1.gpuCapacity = 4; //4,6,8,10,12,16,24,32,64
    product1.image = "images/laptop images/hp victus.png";
    product1.dateAdd = "2026-02-08";
    product1.soldCount = 10;
    productsInDatabase.push(product1);
    
     //2
    let product2 = new Product();
    product2.id = 2;
    product2.model = "OMEN 16-wd0012nf";
    product2.available = true;
    product2.price = 78000000;
    product2.brand = "HP";
    product2.color = "سفید";
    product2.ram = 32;
    product2.cpu = "Intel Core i7";
    product2.gpuBrand = "NVIDIA";
    product2.gpuName = "RTX 4070";
    product2.gpuCapacity = 8;
    product2.image = "images/laptop images/hp omen.png";
    product2.dateAdd = "2024-01-22";
    product2.soldCount = 31;
    productsInDatabase.push(product2);

    //3
    let product3 = new Product();
    product3.id = 3;
    product3.model = "Spectre x360 16 2-in-1";
    product3.available = true;
    product3.price = 185000000;
    product3.brand = "HP";
    product3.color = "آبی";
    product3.ram = 16;
    product3.cpu = "Intel Core i7";
    product3.gpuBrand = "Intel";
    product3.gpuName = "Intel Iris Xe";
    product3.gpuCapacity = 8;
    product3.image = "images/laptop images/hp spectre.png";
    product3.dateAdd = "2022-11-08";
    product3.soldCount = 18;
    productsInDatabase.push(product3);

    //4
    let product4 = new Product();
    product4.id = 4;
    product4.model = "Surface Pro";
    product4.available = true;
    product4.price = 165000000;
    product4.brand = "Microsoft";
    product4.color = "قهوه ای";
    product4.ram = 16;
    product4.cpu = "Intel Core i7";
    product4.gpuBrand = "Intel";
    product4.gpuName = "Intel Iris Xe";
    product4.gpuCapacity = 8;
    product4.image = "images/laptop images/microsoft surface.png";
    product4.dateAdd = "2024-06-03";
    product4.soldCount = 14;
    productsInDatabase.push(product4);

    //5
    let product5 = new Product();
    product5.id = 5;
    product5.model = "Legion 5 Pro 16ARX8";
    product5.available = true;
    product5.price = 65000000;
    product5.brand = "lenovo";
    product5.color = "خاکستری";
    product5.ram = 32;
    product5.cpu = "AMD Ryzen 7";
    product5.gpuBrand = "NVIDIA";
    product5.gpuName = "RTX 4070";
    product5.gpuCapacity = 8;
    product5.image = "images/laptop images/lenovo legion gray.png";
    product5.dateAdd = "2023-09-19";
    product5.soldCount = 56;
    productsInDatabase.push(product5);

    //6
    let product6 = new Product();
    product6.id = 6;
    product6.model = "Legion 5 Pro 16IRX9";
    product6.available = true;
    product6.price = 68000000;
    product6.brand = "lenovo";
    product6.color = "مشکی";
    product6.ram = 16;
    product6.cpu = "Intel Core i7";
    product6.gpuBrand = "NVIDIA";
    product6.gpuName = "RTX 4060";
    product6.gpuCapacity = 8;
    product6.image = "images/laptop images/lenovo legion black.png";
    product6.dateAdd = "2024-02-11";
    product6.soldCount = 49;
    productsInDatabase.push(product6);

    //7
    let product7 = new Product();
    product7.id = 7;
    product7.model = "Titan 18 HX";
    product7.available = true;
    product7.price = 420000000;
    product7.brand = "msi";
    product7.color = "مشکی";
    product7.ram = 64;
    product7.cpu = "Intel Core i9";
    product7.gpuBrand = "NVIDIA";
    product7.gpuName = "RTX 4090";
    product7.gpuCapacity = 16;
    product7.image = "images/laptop images/msi titan black.png";
    product7.dateAdd = "2025-01-05";
    product7.soldCount = 7;
    productsInDatabase.push(product7);

    //8 
    let product8 = new Product();
    product8.id = 8;
    product8.model = "Predator Helios 16";
    product8.available = true;
    product8.price = 95000000;
    product8.brand = "acer";
    product8.color = "سفید";
    product8.ram = 32;
    product8.cpu = "Intel Core i7";
    product8.gpuBrand = "AMD";
    product8.gpuName = "RX 7800M";
    product8.gpuCapacity = 12;
    product8.image = "images/laptop images/acer white.png";
    product8.dateAdd = "2023-12-27";
    product8.soldCount = 23;
    productsInDatabase.push(product8);

    //9
    let product9 = new Product();
    product9.id = 9;
    product9.model = "Predator Helios Neo";
    product9.available = true;
    product9.price = 88000000;
    product9.brand = "acer";
    product9.color = "مشکی";
    product9.ram = 16;
    product9.cpu = "Intel Core i7";
    product9.gpuBrand = "NVIDIA";
    product9.gpuName = "RTX 4060";
    product9.gpuCapacity = 8;
    product9.image = "images/laptop images/acer black.png";
    product9.dateAdd = "2024-04-09";
    product9.soldCount = 34;
    productsInDatabase.push(product9);

    //10
    let product10 = new Product();
    product10.id = 10;
    product10.model = "ROG Strix Scar";
    product10.available = true;
    product10.price = 120000000;
    product10.brand = "asus";
    product10.color = "سفید";
    product10.ram = 32;
    product10.cpu = "Intel Core i9";
    product10.gpuBrand = "NVIDIA";
    product10.gpuName = "RTX 4080";
    product10.gpuCapacity = 12;
    product10.image = "images/laptop images/asus rog white.png";
    product10.dateAdd = "2023-06-18";
    product10.soldCount = 19;
    productsInDatabase.push(product10);

    //11 
    let product11 = new Product();
    product11.id = 11;
    product11.model = "ROG Strix Scar";
    product11.available = true;
    product11.price = 115000000;
    product11.brand = "asus";
    product11.color = "مشکی";
    product11.ram = 32;
    product11.cpu = "Intel Core i9";
    product11.gpuBrand = "AMD";
    product11.gpuName = "RX 7900M";
    product11.gpuCapacity = 16;
    product11.image = "images/laptop images/asus rog black.png";
    product11.dateAdd = "2024-08-02";
    product11.soldCount = 21;
    productsInDatabase.push(product11);

    //12
    let product12 = new Product();
    product12.id = 12;
    product12.model = "TUF Gaming F15";
    product12.available = true;
    product12.price = 62000000;
    product12.brand = "asus";
    product12.color = "مشکی";
    product12.ram = 16;
    product12.cpu = "Intel Core i7";
    product12.gpuBrand = "NVIDIA";
    product12.gpuName = "RTX 4060";
    product12.gpuCapacity = 8;
    product12.image = "images/laptop images/asus tuf black.png";
    product12.dateAdd = "2023-10-14";
    product12.soldCount = 63;
    productsInDatabase.push(product12);

    //13
    let product13 = new Product();
    product13.id = 13;
    product13.model = "Victus 16";
    product13.available = true;
    product13.price = 42000000;
    product13.brand = "HP";
    product13.color = "مشکی";
    product13.ram = 16;
    product13.cpu = "Intel Core i7";
    product13.gpuBrand = "NVIDIA";
    product13.gpuName = "RTX 3050";
    product13.gpuCapacity = 6;
    product13.image = "images/laptop images/hp victus.png";
    product13.dateAdd = "2024-03-11";
    product13.soldCount = 37;
    productsInDatabase.push(product13);

    //14
    let product14 = new Product();
    product14.id = 14;
    product14.model = "OMEN 17";
    product14.available = true;
    product14.price = 98000000;
    product14.brand = "HP";
    product14.color = "سفید";
    product14.ram = 32;
    product14.cpu = "Intel Core i9";
    product14.gpuBrand = "NVIDIA";
    product14.gpuName = "RTX 4080";
    product14.gpuCapacity = 12;
    product14.image = "images/laptop images/hp omen.png";
    product14.dateAdd = "2023-07-02";
    product14.soldCount = 22;
    productsInDatabase.push(product14);

    //15
    let product15 = new Product();
    product15.id = 15;
    product15.model = "Spectre x360 14";
    product15.available = true;
    product15.price = 155000000;
    product15.brand = "HP";
    product15.color = "آبی";
    product15.ram = 16;
    product15.cpu = "AMD Ryzen 9";
    product15.gpuBrand = "Intel";
    product15.gpuName = "Intel Iris Xe";
    product15.gpuCapacity = 8;
    product15.image = "images/laptop images/hp spectre.png";
    product15.dateAdd = "2022-09-18";
    product15.soldCount = 26;
    productsInDatabase.push(product15);

    //16
    let product16 = new Product();
    product16.id = 16;
    product16.model = "Surface 5";
    product16.available = true;
    product16.price = 145000000;
    product16.brand = "Microsoft";
    product16.color = "قهوه ای";
    product16.ram = 16;
    product16.cpu = "Intel Core i5";
    product16.gpuBrand = "Intel";
    product16.gpuName = "Intel Iris Xe";
    product16.gpuCapacity = 8;
    product16.image = "images/laptop images/microsoft surface.png";
    product16.dateAdd = "2023-11-05";
    product16.soldCount = 29;
    productsInDatabase.push(product16);

    //17
    let product17 = new Product();
    product17.id = 17;
    product17.model = "Legion Slim 5";
    product17.available = true;
    product17.price = 59000000;
    product17.brand = "lenovo";
    product17.color = "خاکستری";
    product17.ram = 16;
    product17.cpu = "AMD Ryzen 7";
    product17.gpuBrand = "NVIDIA";
    product17.gpuName = "RTX 4060";
    product17.gpuCapacity = 8;
    product17.image = "images/laptop images/lenovo legion gray.png";
    product17.dateAdd = "2024-05-21";
    product17.soldCount = 41;
    productsInDatabase.push(product17);

    //18
    let product18 = new Product();
    product18.id = 18;
    product18.model = "Legion 7i";
    product18.available = true;
    product18.price = 88000000;
    product18.brand = "lenovo";
    product18.color = "مشکی";
    product18.ram = 32;
    product18.cpu = "Intel Core i9";
    product18.gpuBrand = "NVIDIA";
    product18.gpuName = "RTX 4070";
    product18.gpuCapacity = 8;
    product18.image = "images/laptop images/lenovo legion black.png";
    product18.dateAdd = "2023-02-14";
    product18.soldCount = 33;
    productsInDatabase.push(product18);

    //19
    let product19 = new Product();
    product19.id = 19;
    product19.model = "MSI Raider GE78";
    product19.available = true;
    product19.price = 210000000;
    product19.brand = "msi";
    product19.color = "مشکی";
    product19.ram = 32;
    product19.cpu = "Intel Core i9";
    product19.gpuBrand = "NVIDIA";
    product19.gpuName = "RTX 4090";
    product19.gpuCapacity = 16;
    product19.image = "images/laptop images/msi titan black.png";
    product19.dateAdd = "2024-09-09";
    product19.soldCount = 11;
    productsInDatabase.push(product19);

    //20
    let product20 = new Product();
    product20.id = 20;
    product20.model = "Predator Helios Neo";
    product20.available = true;
    product20.price = 76000000;
    product20.brand = "acer";
    product20.color = "سفید";
    product20.ram = 16;
    product20.cpu = "AMD Ryzen 7";
    product20.gpuBrand = "AMD";
    product20.gpuName = "RX 7600M";
    product20.gpuCapacity = 8;
    product20.image = "images/laptop images/acer white.png";
    product20.dateAdd = "2023-08-30";
    product20.soldCount = 27;
    productsInDatabase.push(product20);

    //21
    let product21 = new Product();
    product21.id = 21;
    product21.model = "Predator Helios 18";
    product21.available = true;
    product21.price = 102000000;
    product21.brand = "acer";
    product21.color = "مشکی";
    product21.ram = 32;
    product21.cpu = "Intel Core i9";
    product21.gpuBrand = "NVIDIA";
    product21.gpuName = "RTX 4080";
    product21.gpuCapacity = 12;
    product21.image = "images/laptop images/acer black.png";
    product21.dateAdd = "2025-01-12";
    product21.soldCount = 16;
    productsInDatabase.push(product21);

    //22
    let product22 = new Product();
    product22.id = 22;
    product22.model = "ROG Zephyrus G16";
    product22.available = true;
    product22.price = 99000000;
    product22.brand = "asus";
    product22.color = "سفید";
    product22.ram = 32;
    product22.cpu = "Intel Core i9";
    product22.gpuBrand = "NVIDIA";
    product22.gpuName = "RTX 4070";
    product22.gpuCapacity = 8;
    product22.image = "images/laptop images/asus rog white.png";
    product22.dateAdd = "2024-10-01";
    product22.soldCount = 24;
    productsInDatabase.push(product22);

    //23
    let product23 = new Product();
    product23.id = 23;
    product23.model = "ROG Strix G16";
    product23.available = false;
    product23.price = 87000000;
    product23.brand = "asus";
    product23.color = "مشکی";
    product23.ram = 16;
    product23.cpu = "Intel Core i7";
    product23.gpuBrand = "AMD";
    product23.gpuName = "RX 7700M";
    product23.gpuCapacity = 12;
    product23.image = "images/laptop images/asus rog black.png";
    product23.dateAdd = "2023-04-17";
    product23.soldCount = 0;
    productsInDatabase.push(product23);

    //24
    let product24 = new Product();
    product24.id = 24;
    product24.model = "TUF Gaming A15";
    product24.available = false;
    product24.price = 54000000;
    product24.brand = "asus";
    product24.color = "مشکی";
    product24.ram = 16;
    product24.cpu = "AMD Ryzen 5";
    product24.gpuBrand = "NVIDIA";
    product24.gpuName = "RTX 3050";
    product24.gpuCapacity = 4;
    product24.image = "images/laptop images/asus tuf black.png";
    product24.dateAdd = "2022-12-01";
    product24.soldCount = 0;
    productsInDatabase.push(product24);

    //25
    let product25 = new Product();
    product25.id = 25;
    product25.model = "Victus 15";
    product25.available = false;
    product25.price = 36000000;
    product25.brand = "HP";
    product25.color = "مشکی";
    product25.ram = 8;
    product25.cpu = "Intel Core i5";
    product25.gpuBrand = "Intel";
    product25.gpuName = "UHD Graphics";
    product25.gpuCapacity = 4;
    product25.image = "images/laptop images/hp victus.png";
    product25.dateAdd = "2021-06-20";
    product25.soldCount = 0;
    productsInDatabase.push(product25);

    //26
    let product26 = new Product();
    product26.id = 26;
    product26.model = "OMEN 15";
    product26.available = false;
    product26.price = 61000000;
    product26.brand = "HP";
    product26.color = "سفید";
    product26.ram = 16;
    product26.cpu = "Intel Core i7";
    product26.gpuBrand = "NVIDIA";
    product26.gpuName = "RTX 3060";
    product26.gpuCapacity = 6;
    product26.image = "images/laptop images/hp omen.png";
    product26.dateAdd = "2022-02-09";
    product26.soldCount = 0;
    productsInDatabase.push(product26);

    //27
    let product27 = new Product();
    product27.id = 27;
    product27.model = "Surface Pro";
    product27.available = false;
    product27.price = 135000000;
    product27.brand = "Microsoft";
    product27.color = "قهوه ای";
    product27.ram = 16;
    product27.cpu = "Intel Core i7";
    product27.gpuBrand = "Intel";
    product27.gpuName = "Intel Iris Xe";
    product27.gpuCapacity = 8;
    product27.image = "images/laptop images/microsoft surface.png";
    product27.dateAdd = "2023-01-28";
    product27.soldCount = 0;
    productsInDatabase.push(product27);

    //28
    let product28 = new Product();
    product28.id = 28;
    product28.model = "Legion 5";
    product28.available = false;
    product28.price = 52000000;
    product28.brand = "lenovo";
    product28.color = "خاکستری";
    product28.ram = 16;
    product28.cpu = "AMD Ryzen 5";
    product28.gpuBrand = "NVIDIA";
    product28.gpuName = "RTX 3050";
    product28.gpuCapacity = 4;
    product28.image = "images/laptop images/lenovo legion gray.png";
    product28.dateAdd = "2022-07-13";
    product28.soldCount = 0;
    productsInDatabase.push(product28);

    //29
    let product29 = new Product();
    product29.id = 29;
    product29.model = "Titan GT77";
    product29.available = false;
    product29.price = 390000000;
    product29.brand = "msi";
    product29.color = "مشکی";
    product29.ram = 64;
    product29.cpu = "Intel Core i9";
    product29.gpuBrand = "NVIDIA";
    product29.gpuName = "RTX 4090";
    product29.gpuCapacity = 16;
    product29.image = "images/laptop images/msi titan black.png";
    product29.dateAdd = "2023-05-04";
    product29.soldCount = 0;
    productsInDatabase.push(product29);

    //
    return productsInDatabase;
}



