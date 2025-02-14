
type Product = {
  id: number,
  name: string,
  description: string,
  price: number,
  img_url: string
  }
  
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <img src={product.img_url} alt={product.name} style={{ width: '100%', height: 'auto' }} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Цена: ${product.price}</p>
    </div>
  );
};
export default ProductCard