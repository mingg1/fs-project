import FormField from 'components/FormField';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  addToCart,
  findProduct,
  getProduct,
  getProducts,
} from 'redux/slices/productsSlice';
import { Size } from 'utils/types';

const Product = () => {
  const dispatch = useAppDispatch();
  const {
    productsData: { products, product, isLoading, error },
    loggedInUser: { banned },
  } = useAppSelector((state) => state);
  const { id } = useParams();
  const [selectedSize, setSize] = useState<Size | undefined>(undefined);

  useEffect(() => {
    if (id && products.length === 0) {
      dispatch(getProducts());
      dispatch(getProduct(id));
    } else {
      dispatch(findProduct(id));
    }
  }, [dispatch, id, products]);

  const addFavorite = () => {};

  return (
    <main>
      {isLoading ? (
        <p>Loading ...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : product ? (
        <section className="product">
          <figure>
            <img
              className="product__thumbnail"
              alt={product?.name}
              src={product?.thumbnail}
            />
          </figure>
          <div className="product__info">
            <h1 className="product__name">{product.name}</h1>
            <h2 className="product__price">{product.price} €</h2>
            <hr />
            <p className="product__description">{product.description}</p>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                selectedSize &&
                  dispatch(
                    addToCart({
                      ...product,
                      size: selectedSize,
                      quantity: 1,
                    })
                  );
              }}
            >
              <h3>Size</h3>
              <div className="product__size-list">
                {Object.values(Size).map((size) => (
                  <FormField
                    key={size}
                    label={size}
                    input={{
                      type: 'radio',
                      name: 'size',
                      id: size,
                      value: size,
                      checked: product.quantity <= 0,
                      disabled:
                        product.quantity <= 0 || !product.size.includes(size),
                      required: true,
                      onChange: (evt) => {
                        setSize(evt.target.value as Size);
                      },
                    }}
                  />
                ))}
              </div>
              <button type="submit" disabled={product.quantity <= 0 || banned}>
                Add to bag
              </button>
            </form>
            <button
              disabled={banned}
              className="wishlist__button"
              onClick={addFavorite}
            >
              Add to wishlist
            </button>
          </div>
        </section>
      ) : (
        <p>No data</p>
      )}
    </main>
  );
};

export default Product;
