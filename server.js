const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rfl1998*',
  database: 'nunes_sports',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao Banco de Dados');
});

// Rotas para CRUD
app.get('/api/produtos', (req, res) => {
  connection.query('SELECT * FROM produtos', (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/api/produtos', (req, res) => {
  const { nome, codigo, descricao, preco, categoria, subcategoria } = req.body;
  connection.query(
    'INSERT INTO produtos (nome, codigo, descricao, preco, categoria, subcategoria) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, codigo, descricao, preco, categoria, subcategoria],
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send('Produto criado com sucesso!');
      }
    }
  );
});

app.put('/api/produtos/:id', (req, res) => {
  const { nome, codigo, descricao, preco, categoria, subcategoria } = req.body;
  const { id } = req.params;
  connection.query(
    'UPDATE produtos SET nome=?, codigo=?, descricao=?, preco=?, categoria=?, subcategoria=? WHERE id=?',
    [nome, codigo, descricao, preco, categoria, subcategoria, id],
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send('Produto atualizado com sucesso!');
      }
    }
  );
});

app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM produtos WHERE id=?', [id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Produto excluído com sucesso!');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});