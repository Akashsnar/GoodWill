const express = require('express')
const router = express.Router()
const User = require('../mongoSchema/user')
const Ngos = require('../mongoSchema/ngoschema')
const Review= require("../mongoSchema/reviewschema");


// Getting all
router.get('/', async (req, res) => {
  try {
    const user = await User.find()
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/userlength', async (req, res) => {
    try {
      const user = await User.find()
      res.json(user.length)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

router.get('/ngolength', async (req, res) => {
    try {
      const ngos = await Ngos.find()
      res.json(ngos.length)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  

  router.get('/reviewlength', async (req, res) => {
    try {
      const review = await Review.find()
      res.json(review.length)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  

// Getting One
router.get('/:id', getUser, (req, res) => {
  res.json(res.User)
})

// Creating one
router.post('/', async (req, res) => {
  const User = new User({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  })
  try {
    const newUser = await User.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.name != null) {
    res.User.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.User.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    const updatedUser = await res.User.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.User.remove()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getUser(req, res, next) {
  let User
  try {
    User = await User.findById(req.params.id)
    if (User == null) {
      return res.status(404).json({ message: 'Cannot find User' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.User = User
  next()
}

module.exports = router