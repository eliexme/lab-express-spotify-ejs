require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res)=>{
    res.render('homepage')
})

app.get('/artist-search', async(req, res)=>{
  const {artist} = req.query
  const data = await spotifyApi.searchArtists(artist)
  const artistArray = data.body.artists.items
  artistArray.sort((a,b)=>{
    if(a.popularity > b.popularity){
      return -1
    }else if(a.popularity < b.popularity){
      return 1
    }else{
      return 0
    }
  })
  res.render('artistResult', {artistArray})
})

app.get('/albums/:artistId', async(req, res)=>{
  const {artistId} = req.params
  const data = await spotifyApi.getArtistAlbums(artistId)
  const albumsArray = data.body.items
  res.render('albumResult', {albumsArray})
})

app.get('/tracks/:albumId', (req, res)=>{
  
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
