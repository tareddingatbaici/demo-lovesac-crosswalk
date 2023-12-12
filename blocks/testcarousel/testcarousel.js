export default function decorate(block) {
    block.classList.add(`trevortest1`);
    spoofLoadProducts(block);
    const buttons = document.createElement('div');
    buttons.className = 'carousel-buttons';
/**
    [...block.children].forEach((row, i) => {
        const classes = ['image', 'text'];
        classes.forEach((e, j) => {
          row.children[j].classList.add(`testcarousel-${e}`);
        });
        const button = document.createElement('button');
        if (!i) button.classList.add('selected');
        button.addEventListener('click', () => {
          block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
          [...buttons.children].forEach((r) => r.classList.remove('selected'));
          button.classList.add('selected');
        });
        buttons.append(button);
    });
    block.parentElement.append(buttons);*/
}

function spoofLoadProducts(block) {
    var spoof1 = {
        name: 'product1',
        sku: 'someSKU',
        url_key: 'url_key',
        stock_status: 'out of stock',
        swatch_image: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg',
        sub_title: 'subtitle',
        small_image: {
            url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg',
            label: 'small image label'
        },
        price_range: {
            minimum_price: {
                final_price: {
                    value: "3.5",
                    currency: "USD"
                }
            }
        }
    }

        var spoof2 = spoof1;
        const productItems = [spoof1, spoof2, spoof1, spoof1]

        if (productItems) {
          const baseUrl = 'https://staging.lovesac.com/';
          const carouselEl = document.createElement('ol');

          carouselEl.classList.add('product-items', 'configurable-carousel', 'products-grid', 'glide__slides');
          block.innerHTML = '';
          block.append(carouselEl);

        productItems.forEach((product) => {
            // Use insertAdjacentHTML to add the template to the carousel element
            carouselEl.insertAdjacentHTML('beforeend', `
              <li class="product-item">
                <div class="product-item-info">
                  <a href="" class="product-item-photo">
                    <img src="${product.small_image.url}" />
                  </a>
                  <div class="product-item-details">
                    <strong class="product-item-name">
                      <a title=""
                        href="${baseUrl + product.urlkey}.html"
                        class="product-item-link">
                          ${product.name}
                      </a>
                    </strong>
                    <div class="price-box">
                      <p>$${new Intl.NumberFormat().format(product.price_range.minimum_price.final_price.value)}</p>
                    </div>
                    <div class="product-sub-title">
                      ${product.sub_title}
                    </div>
                  </div>
                </div>
              </li>
            `);
            });

            const buttonLeft = document.createElement('div');
            buttonLeft.classList.add('carousel-arrow', 'carousel-arrow-left');
            block.parentElement.append(buttonLeft);

            const buttonRight = document.createElement('div');
            buttonRight.classList.add('carousel-arrow', 'carousel-arrow-right');
            block.parentElement.append(buttonRight);

            buttonRight.addEventListener('click', () => {
            const productItem = block.querySelector('.product-item');
            const itemWidth = productItem.offsetWidth - block.querySelector('.configurable-carousel').offsetLeft;
            block.scrollTo({ left: itemWidth + block.scrollLeft, behavior: 'smooth' });
            });

            buttonLeft.addEventListener('click', () => {
                const productItem = block.querySelector('.product-item');
                const itemWidth = productItem.offsetWidth - block.querySelector('.configurable-carousel').offsetLeft;
                if (block.scrollLeft !== 0) {
                    if (block.scrollLeft <= itemWidth) {
                        block.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        block.scrollTo({ left: block.scrollLeft - itemWidth, behavior: 'smooth' });
                    }
                }
            });
        }
}