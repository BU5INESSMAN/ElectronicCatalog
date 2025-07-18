import React, { useEffect, useState } from 'react';
import API from './api';
import { Link } from 'react-router-dom';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Отправка запросов...');
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          API.get('/products').catch(error => {
            console.error('Ошибка /api/products:', error.response || error);
            throw new Error('Ошибка загрузки продуктов');
          }),
          API.get('/products/categories').catch(error => {
            console.error('Ошибка /api/products/categories:', error.response || error);
            throw new Error('Ошибка загрузки категорий');
          }),
          API.get('/products/brands').catch(error => {
            console.error('Ошибка /api/products/brands:', error.response || error);
            throw new Error('Ошибка загрузки брендов');
          }),
        ]);
        console.log('Продукты:', productsRes.data);
        console.log('Категории:', categoriesRes.data);
        console.log('Бренды:', brandsRes.data);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        setError('');
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      (!selectedCategory || product.category_id === parseInt(selectedCategory)) &&
      (!selectedBrand || product.brand_id === parseInt(selectedBrand)) &&
      (!search || product.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>Каталог товаров</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по названию"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Все бренды</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        {filteredProducts.length === 0 && <p>Товары не найдены</p>}
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              <img src={product.image_url} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>{product.price} ₽</strong></p>
                <p className="card-text">Категория: {product.category_name}</p>
                <p className="card-text">Бренд: {product.brand_name}</p>
                <Link to={`/product/${product.id}`} className="btn btn-primary">Подробнее</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;