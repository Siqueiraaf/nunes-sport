import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categorias = [
  {
    nome: 'Calçados',
    subcategorias: ['Botas', 'Chinelos', 'Chuteiras', 'Sapatênis', 'Tênis', 'Tênis de corrida'],
  },
  {
    nome: 'Roupas',
    subcategorias: ['Bermudas', 'Calças', 'Camisas de Time', 'Camisetas', 'Jaquetas e Casacos', 'Plus Size', 'Regatas', 'Shorts'],
  },
  {
    nome: 'Acessórios',
    subcategorias: ['Bonés', 'Lancheiras', 'Meias', 'Mochilas e Sacolas', 'Toucas', 'Óculos para Natação'],
  },
];

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

function App() {
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    preco: '',
    categoria: '',
    subcategoria: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // buscar produtos da API
    axios.get('http://localhost:3030/api/produtos').then((response) => {
      setProdutos(response.data);
    });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ver algum campo está vazio
    if (Object.values(formData).some((value) => value === '')) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // veificar se o código já existe
    const codigoExistente = produtos.some((produto) => produto.codigo === formData.codigo);

    if (codigoExistente) {
      setError('Já existe um produto com esse código.');
      return;
    }

    // dados para a API
    axios.post('http://localhost:3030/api/produtos', formData).then(() => {
      updateProductList();
      setFormData({
        nome: '',
        codigo: '',
        descricao: '',
        preco: '',
        categoria: '',
        subcategoria: '',
      });
      setError(null);

      alert('Produto adicionado com sucesso!');
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3030/api/produtos/${id}`).then(() => {
      updateProductList();
    });
  };

  const handleEdit = (produto) => {
    setEditingProduct(produto);
    setIsEditing(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:3030/api/produtos/${editingProduct.id}`, editingProduct).then(() => {
      updateProductList();
      setIsEditing(false);
      alert('Produto atualizado com sucesso!');
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateProductList = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao atualizar a lista de produtos', error);
    }
  };

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>
        <img
          src={process.env.PUBLIC_URL + '/logo-Nunes.png'}
          alt="Nunes Sports Logo"
          style={{ marginRight: '10px', maxWidth: '150px' }}
        />
        Nunes Sports - Sistema de Produtos
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            placeholder="Digite o nome do produto"
            value={formData.nome}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Código:
          <input
            type="text"
            name="codigo"
            placeholder="Digite o código do produto"
            value={formData.codigo}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Descrição:
          <textarea
            name="descricao"
            placeholder="Digite a descrição do produto"
            value={formData.descricao}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Preço:
          <input
            type="number"
            name="preco"
            placeholder="Digite o preço do produto"
            value={formData.preco}
            onChange={handleInputChange}
          />
        </label>
        {formData.preco && <p>Preço formatado: {formatPrice(formData.preco)}</p>}
        <label>
          Categoria:
          <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.nome} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>
        </label>
        {formData.categoria && (
          <label>
            Subcategoria:
            <select name="subcategoria" value={formData.subcategoria} onChange={handleInputChange}>
              <option value="">Selecione uma subcategoria</option>
              {categorias
                .find((cat) => cat.nome === formData.categoria)
                .subcategorias.map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
            </select>
          </label>
        )}
        <button type="submit">Adicionar ao Sistema de Produtos</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <h2>Lista de Produtos</h2>
      <button onClick={openModal}>Ver Lista de Produtos</button>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Lista de Produtos</h2>
            <input
              type="text"
              placeholder="Pesquisar por código ou nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {filteredProdutos.map((produto) => (
                <li key={produto.id}>
                  {produto.nome} - {produto.codigo} - R${produto.preco} - Categoria: {produto.categoria} - Subcategoria: {produto.subcategoria}{' '}
                  <button onClick={() => handleDelete(produto.id)}>Excluir</button>
                  <b> </b>
                  <button onClick={() => handleEdit(produto)}>Editar</button>
                </li>
              ))}
            </ul>
            {isEditing && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Editar Produto</h2>
                  <form onSubmit={(e) => handleUpdate(e)}>
                    <label>
                      Nome:
                      <input
                        type="text"
                        name="nome"
                        value={editingProduct.nome}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nome: e.target.value })}
                      />
                    </label>
                    <label>
                      Código:
                      <input
                        type="text"
                        name="codigo"
                        value={editingProduct.codigo}
                        onChange={(e) => setEditingProduct({ ...editingProduct, codigo: e.target.value })}
                      />
                    </label>
                    <label>
                      Descrição:
                      <textarea
                        name="descricao"
                        value={editingProduct.descricao}
                        onChange={(e) => setEditingProduct({ ...editingProduct, descricao: e.target.value })}
                      />
                    </label>
                    <label>
                      Preço:
                      <input
                        type="number"
                        name="preco"
                        value={editingProduct.preco}
                        onChange={(e) => setEditingProduct({ ...editingProduct, preco: e.target.value })}
                      />
                    </label>
                    <label>
                      Categoria:
                      <select
                        name="categoria"
                        value={editingProduct.categoria}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoria: e.target.value })}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                          <option key={cat.nome} value={cat.nome}>
                            {cat.nome}
                          </option>
                        ))}
                      </select>
                    </label>
                    {editingProduct.categoria && (
                      <label>
                        Subcategoria:
                        <select
                          name="subcategoria"
                          value={editingProduct.subcategoria}
                          onChange={(e) => setEditingProduct({ ...editingProduct, subcategoria: e.target.value })}
                        >
                          <option value="">Selecione uma subcategoria</option>
                          {categorias
                            .find((cat) => cat.nome === editingProduct.categoria)
                            .subcategorias.map((subcat) => (
                              <option key={subcat} value={subcat}>
                                {subcat}
                              </option>
                            ))}
                        </select>
                      </label>
                    )}
                    <button type="submit">Atualizar Produto</button>
                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                  </form>
                </div>
              </div>
            )}
            <button onClick={updateProductList}>Atualizar Lista</button>
            <b> </b>
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
