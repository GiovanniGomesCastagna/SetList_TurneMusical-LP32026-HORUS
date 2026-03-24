const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
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
}
];

// Métodos --- Músicas da SetList

app.get('/musicas', (req, res) => {
  res.json([setList]);
})

app.get('/musicas/:id', (req, res) => {
  const musica = setList.find(musica => musica.codigo == req.params.id);
  if (!musica) {
    return res.status(404).json({
      message: `Música de ID ${req.params} não foi encontrada.`
    })
  }
  return res.status(200).json([musica]);
})

app.post('/musicas', (req, res) => {
  if (!req.body.nomeMusica ||
    !req.body.artista ||
    !req.body.duracao ||
    !req.body.afinacao
  ) {
    return res.status(400).json({
      message: `Faltando preencher campos obrigatorios: nomeMusica, artista, duracao, afinacao`
    })
  }

  // geração de código automático
  const codigo = Math.max(...setList.map(musica => musica.codigo)) + 1

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
      message: `Música de ID ${req.params} não foi encontrada para atualização`
    })
  }

  if (!Object.hasOwn(req.body, 'nomeMusica') && !Object.hasOwn(req.body, 'artista') &&
      !Object.hasOwn(req.body, 'duracao') && !Object.hasOwn(req.body, 'album') && 
      !Object.hasOwn(req.body, 'ano') && !Object.hasOwn(req.body, 'afinacao')) {
        return res.status(400).json({
          message: `Informe ao menos um campo para atualizar: nomeMusica, artista, duracao, ordem, album, ano, afinacao`
        })
  }

  if (!Object.hasOwn(req.body, 'nomeMusica')) {
    musica.nomeMusica = req.body.nomeMusica;
  }

  if (!Object.hasOwn(req.body, 'artista')) {
    musica.artista = req.body.artista;
  }

  if (!Object.hasOwn(req.body, 'duracao')) {
    musica.duracao = req.body.duracao;
  }

  if (!Object.hasOwn(req.body, 'album')) {
    musica.album = req.body.album;
  }

  if (!Object.hasOwn(req.body, 'ano')) {
    musica.ano = req.body.ano;
  }

  if (!Object.hasOwn(req.body, 'afinacao')) {
    musica.afinacao = req.body.afinacao;
  }

  return res.status(200).json({
    message: `Música atualizada com sucesso.`,
    data: musica
  })
})

app.delete("/musicas/:id", (req, res) => {
  const indiceMusica = setList.findIndex(musica => musica.codigo == req.params.id)
  if (!indiceMusica || inidiceMusica === -1) {
    return res.status(404).json({
      message: `Música de ID ${req.params.id} não foi encontrada. Deleção não concluída.`
    })
  }

  setList.splice(indiceMusica, 1)

  return res.status(204).send()
})

