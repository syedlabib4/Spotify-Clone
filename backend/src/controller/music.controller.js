const musicModel=require("../models/music.model")
const albumModel=require("../models/album.model")
const {uploadFile}=require("../services/storage.service")
const jwt = require("jsonwebtoken")
require("dotenv").config()


async function createMusic(req, res) {

    const { title } = req.body
    const file = req.file
    const user = req.user

    if (!file) {
        return res.status(400).json({
            message: "File required"
        })
    }

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: user.id
    })

    res.status(201).json({
        message: "music created successfully",
        music
    })
}


async function createAlbum(req,res){
    
    const {title,musics}=req.body
    const album=await albumModel.create({
title,
artist:req.user.id,
musics:musics

    })
    res.status(201).json({
message:"album create successfully",
album:{
    id:album._id,
    title:album.title,
    artist:album.artist,
    musics:album.music
}
    })
}


async function getAllMusics(req,res){
const musics=await musicModel.find().populate("artist","username email")

res.status(200).json({
message: "musics fetched successfully",
musics:musics
})

}


async function getAllAlbums(req,res){
const albums=await albumModel.find().select("title artist").populate("artist","username email")

res.status(200).json({
message:"albums fetched successfully",
albums:albums
})



}


async function getAlbumById(req,res){
const albumId=req.params.albumId
const album =await  albumModel.findById(albumId).populate("artist","username email").populate("musics")

return res.status(200).json({
    message:"Album fetched successfully",
    album:album
})
}

async function deleteMusic(req,res){
    const musicId = req.params.musicId
    const userId = req.user.id
    
    const music = await musicModel.findById(musicId)
    
    if (!music) {
        return res.status(404).json({
            message: "Music not found"
        })
    }
    
    if (music.artist.toString() !== userId) {
        return res.status(403).json({
            message: "You can only delete your own songs"
        })
    }
    
    await musicModel.findByIdAndDelete(musicId)
    
    res.status(200).json({
        message: "Song deleted successfully"
    })
}

async function addSongsToAlbum(req,res){
    const albumId = req.params.albumId
    const { songIds } = req.body
    const userId = req.user.id

    const album = await albumModel.findById(albumId)
    
    if (!album) {
        return res.status(404).json({
            message: "Album not found"
        })
    }

    if (album.artist.toString() !== userId) {
        return res.status(403).json({
            message: "You can only modify your own albums"
        })
    }

    album.musics = [...new Set([...album.musics, ...songIds])]
    await album.save()

    res.status(200).json({
        message: "Songs added to album successfully",
        album
    })
}

async function removeSongFromAlbum(req,res){
    const { albumId, musicId } = req.params
    const userId = req.user.id

    const album = await albumModel.findById(albumId)
    
    if (!album) {
        return res.status(404).json({
            message: "Album not found"
        })
    }

    if (album.artist.toString() !== userId) {
        return res.status(403).json({
            message: "You can only modify your own albums"
        })
    }

    album.musics = album.musics.filter(id => id.toString() !== musicId)
    await album.save()

    res.status(200).json({
        message: "Song removed from album successfully",
        album
    })
}

async function deleteAlbum(req,res){
    const { albumId } = req.params
    const userId = req.user.id

    const album = await albumModel.findById(albumId)
    
    if (!album) {
        return res.status(404).json({
            message: "Album not found"
        })
    }

    if (album.artist.toString() !== userId) {
        return res.status(403).json({
            message: "You can only delete your own albums"
        })
    }

    await albumModel.findByIdAndDelete(albumId)

    res.status(200).json({
        message: "Album deleted successfully"
    })
}

module.exports={createMusic,createAlbum,getAllMusics,getAllAlbums,getAlbumById,deleteMusic,addSongsToAlbum,removeSongFromAlbum,deleteAlbum}