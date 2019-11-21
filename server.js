require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json())

const posts = [
    {
        username: 'JP',
        tittle: 'Post 1'
    },
    {
        username: 'Crossfit',
        tittle: 'Post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    // Return null if there is no authHeader or returns the token
    const token = authHeader && authHeader.split(' ')[1]

    // Token not valid
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Has token but it is not authorized to continue
        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })
}

app.listen(3000)