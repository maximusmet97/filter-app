import { useState, useEffect } from 'react';
import Filter from '../Components/Filter/Filter';
import * as miista from './miista-export.json';

let OFFSET = 6

export default function Home({ content }) {
  const [offset, setOffset] = useState(OFFSET);
  let [goods, setGoods] = useState([]);
  const [color, setColor] = useState('All');
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [category, setCategory] = useState('All');

  const handleFilterChange = (e, filterType) => {
    switch (filterType) {
      case "color":
        setColor(e.target.value);
        break;
      case "min":
        setMin(e.target.value);
        break;
      case "max":
        setMax(e.target.value);
        break;
      case "category":
        setCategory(e.target.value);
        break;
    }
  }

  goods = goods.slice(0, offset);

  const loadMore = () => {
    setOffset(offset + OFFSET);
  }

  useEffect(() => {
    let filteredProducts = content;
    if (color !== "All") {
      filteredProducts = filteredProducts.filter(element => {
        if (element.color === color) {
          return element;
        }
      });
    }
    if (category !== "All") {
      filteredProducts = filteredProducts.filter(element => {
        if (element.tags && element.tags.includes(category)) {
          return element;
        }
      });
    }
    if (min !== "") {
      filteredProducts = filteredProducts.filter(element => {
        if (+element.price > +min) {
          return element;
        }
      });
    }
    if (max !== "") {
      filteredProducts = filteredProducts.filter(element => {
        if (+element.price < +max) {
          return element;
        }
      });
    }
    setGoods(filteredProducts);
  }, [color, min, max, category]);

  return (
    <>
      <Filter onFilter={handleFilterChange} />
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {goods.map((item, index) => {
          if (item) {
            return (
              <div key={index} className="rounded overflow-hidden shadow-lg">
                <img className="w-full" src={item.jpg} alt="Item" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{item.name}</div>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <GetCategories arr={item.tags} />
                  <GetPrices arr={item.prices} />
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className='flex items-center justify-center p-10'>
        <button onClick={loadMore} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Load More</button>
      </div>
    </>
  );
}

const GetCategories = (props) => {
  let lst = [];
  if (props.arr) {
    props.arr.forEach((category, index) => {
      lst.push(<span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{category}</span>);
    });
  }
  return lst;
}

const GetPrices = (props) => {
  let lst = [];
  if (props.arr) {
    props.arr.forEach((element, index) => {
      lst.push(<span key={index} className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-3 mb-3">#price: {element.node.price}</span>
      );
    });
  }
  return lst;
}

export function getServerSideProps() {
  return {
    props: {
      content: miista.data.allContentfulProductPage.edges.map(element => ({
        name: element.node.name,
        jpg: element.node.thumbnailImage.file.url,
        color: element.node.colorFamily ? element.node.colorFamily[0].name : null,
        tags: element.node.categoryTags,
        prices: element.node.shopifyProductEu.variants.edges,
        price: element.node.shopifyProductEu.variants.edges ?
          element.node.shopifyProductEu.variants.edges[0].node.price :
          null
      }))
    }
  }
}