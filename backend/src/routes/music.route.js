const express=require("express")
const musicController = require("../controller/music.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const multer=require("multer")
const upload=multer({storage:multer.memoryStorage()})
const router=express.Router()


router.post("/upload",authMiddleware.authArtist, upload.single("music"), musicController.createMusic)
router.post("/album", authMiddleware.authArtist,musicController.createAlbum)
router.post("/album/:albumId/add-songs", authMiddleware.authArtist, musicController.addSongsToAlbum)
router.delete("/:musicId", authMiddleware.authArtist, musicController.deleteMusic)
router.delete("/album/:albumId/songs/:musicId", authMiddleware.authArtist, musicController.removeSongFromAlbum)
router.delete("/album/:albumId", authMiddleware.authArtist, musicController.deleteAlbum)
router.get("/", authMiddleware.authUser,musicController.getAllMusics)
router.get("/albums",authMiddleware.authUser,musicController.getAllAlbums)
router.get("/albums/:albumId",authMiddleware.authUser,musicController.getAlbumById)




module.exports=router