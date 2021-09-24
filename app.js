const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const authRouter = require('./routes/authRouter')
const linkRouter = require('./routes/linkRouter')
const redirectRouter = require('./routes/redirectRouter')
const path = require('path');

const app = express()
app.use(express.json({extended: true}))

app.use('/api/auth', authRouter)
app.use('/api/link', linkRouter)
app.use('/t/', redirectRouter)

if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build','index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start () {
    try { 
        await mongoose.connect(config.get('mongoUri'), {
            // useNewUrlParsel: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App has been started on  port ${PORT} ...`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()