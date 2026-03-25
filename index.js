const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`Bem vindo a SetList de Turnê Musical!`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// setlist - objeto --- documentação
// objeto SetList {
//   codigo: integer, // referência interna
//   nomeMusica: string, // nome da música
//   artista: string, // artista que apresentará a música;
//   duracao: integer // anotado em segundos
//   ordem: integer, // em qual ordem a música será apresentada (Ex.: 1 -> será a primeira, 2 -> será a segunda, etc.)
//   album: string, // album o qual a música pertence
//   ano: integer, // ano em que a música foi lançada
//   afinacao: string // afinacao em que a música é tocada
// }

const setList = [
  {
    codigo: 1,
    nomeMusica: "For Whom The Bell Tolls",
    artista: "Metallica",
    duracao: 309,
    album: "Ride The Lightning",
    ano: 1984,
    afinacao: "Afinacao Padrao"
  },
  {
    codigo: 2,
    nomeMusica: "Enter Sandman",
    artista: "Metallica",
    duracao: 331,
    album: "Metallica",
    ano: 1991,
    afinacao: "Afinacao Padrao"
  },
  {
    codigo: 3,
    nomeMusica: "One",
    artista: "Metallica",
    duracao: 444,
    album: "...And Justice For All",
    ano: 1988,
    afinacao: "Afinacao Padrao"
  },
  {
    codigo: 4,
    nomeMusica: "Bad Horsue",
    artista: "Steve Vai",
    duracao: 350,
    album: "Alien Love Secrets",
    ano: 1995,
    afinacao: "Drop D"
  }
];

// Métodos --- Músicas da SetList --- CRUD básico

app.get('/musicas', (req, res) => {
  res.json(setList);
})

app.get('/musicas/:id', (req, res) => {
  const musica = setList.find(musica => musica.codigo == req.params.id);
  if (!musica) {
    return res.status(404).json({
      message: `Música de ID ${req.params.id} não foi encontrada.`
    })
  }
  return res.status(200).json(musica);
})

app.post('/musicas', (req, res) => {
  if (!req.body.nomeMusica ||
    !req.body.artista ||
    req.body.duracao === undefined ||
    !req.body.afinacao
  ) {
    return res.status(400).json({
      message: `Faltando preencher campos obrigatorios: nomeMusica, artista, duracao, afinacao`
    })
  }

  if (typeof req.body.duracao !== 'number') {
    return res.status(400).json({
      message: "Campo 'duracao' deve ser um número."
    })
  }

  if (typeof req.body.ano !== 'number' && typeof req.body.ano !== 'undefined') {
    return res.status(400).json({
      message: "Campo 'ano' deve ser um número."
    })
  }

  // geração de código automático
  const codigo = setList.length > 0
    ? Math.max(...setList.map(musica => musica.codigo)) + 1
    : 1;

  const novaMusica = {
    codigo: codigo,
    nomeMusica: req.body.nomeMusica,
    artista: req.body.artista,
    duracao: req.body.duracao,
    album: req.body.album,
    ano: req.body.ano,
    afinacao: req.body.afinacao
  }

  setList.push(novaMusica);

  return res.status(201).json({
    message: `Musica cadastrada com sucesso!`,
    data: novaMusica
  })
})

app.patch("/musicas/:id", (req, res) => {
  const musica = setList.find(musica => musica.codigo == req.params.id);
  if (!musica) {
    return res.status(404).json({
      message: `Música de ID ${req.params.id} não foi encontrada para atualização`
    })
  }

  if (!Object.hasOwn(req.body, 'nomeMusica') && !Object.hasOwn(req.body, 'artista') &&
      !Object.hasOwn(req.body, 'duracao') && !Object.hasOwn(req.body, 'album') && 
      !Object.hasOwn(req.body, 'ano') && !Object.hasOwn(req.body, 'afinacao')) {
        return res.status(400).json({
          message: `Informe ao menos um campo para atualizar: nomeMusica, artista, duracao, ordem, album, ano, afinacao`
        })
  }

  if (Object.hasOwn(req.body, 'nomeMusica')) {
    musica.nomeMusica = req.body.nomeMusica;
  }

  if (Object.hasOwn(req.body, 'artista')) {
    musica.artista = req.body.artista;
  }

  if (Object.hasOwn(req.body, 'duracao')) {
    if (typeof req.body.duracao !== 'number') {
      return res.status(400).json({
        message: `Campo 'duracao' deve ser um número.`
      });
    }
    musica.duracao = req.body.duracao;
  }

  if (Object.hasOwn(req.body, 'album')) {
    musica.album = req.body.album;
  }

  if (Object.hasOwn(req.body, 'ano')) {
    if (typeof req.body.ano !== 'number') {
      return res.status(400).json({
        message: `Campo 'ano' deve ser um número.`
      });
    }
    musica.ano = req.body.ano;
  }
  
  if (Object.hasOwn(req.body, 'afinacao')) {
    musica.afinacao = req.body.afinacao;
  }

  return res.status(200).json({
    message: `Música atualizada com sucesso.`,
    data: musica
  })
})

app.delete("/musicas/:id", (req, res) => {
  const indiceMusica = setList.findIndex(musica => musica.codigo == req.params.id)
  if (indiceMusica === -1) {
    return res.status(404).json({
      message: `Música de ID ${req.params.id} não foi encontrada. Deleção não concluída.`
    })
  }

  setList.splice(indiceMusica, 1)

  return res.status(204).send()
})

// Métodos gerais --- Pesquisas e afins

app.get("/musicas/pesquisar/nome", (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    return res.status(400).json({ 
      message: `Parâmetro 'nome' é obrigatório.`
    })
  }

  const musicasPorNome = setList.filter(musica =>
    musica.nomeMusica.toLowerCase().includes(nome.toLowerCase())
  );
  if (musicasPorNome.length === 0) {
    return res.status(404).json({
      message: `Nenhuma música foi encontrada. Tente novamente`
    })
  }

  return res.status(200).json({
    quantidade: musicasPorNome.length,
    musicasPorNome
  })
})

app.get("/musicas/pesquisar/artista", (req, res) => {
  const { artista } = req.query;

  if (!artista) {
    return res.status(400).json({ 
      message: `Parâmetro 'artista' é obrigatório.`
    })
  }

  const musicasPorArtista = setList.filter(musica =>
    musica.artista.toLowerCase().includes(artista.toLowerCase())
  );
  if (musicasPorArtista.length === 0) {
    return res.status(404).json({
      message: `Nenhuma música deste artista foi encontrada ou registrada.`
    })
  }

  return res.status(200).json({
    quantidade: musicasPorArtista.length,
    musicasPorArtista
  })
})

app.get("/musicas/pesquisar/duracao/:tipo", (req, res) => {
  const tipo = req.params.tipo;

  const musicasPorDuracao = setList.filter(musica => {
    if (tipo === 'curta') return musica.duracao <= 280;
    if (tipo === 'media') return musica.duracao > 280 && musica.duracao <= 330;
    if (tipo === 'longa') return musica.duracao > 330;
    return false
  })

  if (!['curta', 'media', 'longa'].includes(tipo)) {
    return res.status(400).json({
      message: `Duração inválida. Favor utilizar 'curta', 'media' ou 'longa'.`
    })
  }

  if (musicasPorDuracao.length === 0) {
    return res.status(404).json({
      message: `Nenhuma música encontrada para este tipo de duração.`
    })
  }

  return res.status(200).json({
    quantidade: musicasPorDuracao.length,
    musicasPorDuracao
  })
})

app.get("/musicas/pesquisar/album", (req, res) => {
  const { album } = req.query;

  if (!album) {
    return res.status(400).json({ 
      message: `Parâmetro 'album' é obrigatório.`
    })
  }

  const musicasPorAlbum = setList.filter(musica =>
    musica.album.toLowerCase().includes(album.toLowerCase())
  );
  if (musicasPorAlbum.length === 0) {
    return res.status(404).json({
      message: `Nenhuma música deste álbum foi encontrada ou registrada.`
    })
  }

  return res.status(200).json({
    quantidade: musicasPorAlbum.length,
    musicasPorAlbum
  })
})

app.get("/musicas/pesquisar/ano", (req, res) => {
  const ano = Number(req.query.ano);

  if (isNaN(ano)) {
    return res.status(400).json({ 
      message: `Ano inválido.`
    })
  }

  const musicasPorAno = setList.filter(musica => musica.ano == ano);
  
  if (musicasPorAno.length === 0) {
    return res.status(404).json({
      message: `Nenhuma música deste ano foi encontrada ou registrada.`
    })
  }

  return res.status(200).json({
    quantidade: musicasPorAno.length,
    musicasPorAno
  })
})

app.get("/musicas/pesquisar/afinacao", (req, res) => {
  const { afinacao } = req.query;

  if (!afinacao) {
    return res.status(400).json({ 
      message: `Parâmetro 'afinacao' é obrigatório.`
    })
  }
  const musicasPorAfinacao = setList.filter(musica =>
    musica.afinacao.toLowerCase().includes(afinacao.toLowerCase())
  );
  if (musicasPorAfinacao.length === 0) {
    return res.status(404).json({
      message: `Nenhuma música nesta afinação foi encontrada ou registrada.`
    })
  }

  return res.status(200).json({
    quantidade: musicasPorAfinacao.length,
    musicasPorAfinacao
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Erro interno do servidor"
  });
});