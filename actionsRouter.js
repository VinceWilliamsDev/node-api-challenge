const express = require('express')
const db = require('./data/helpers/actionModel')

const router = express.Router()

router.get('/', (req, res) => {
    db.get()
        .then(projects => {
            res.json(projects)
        })
        .catch(err => {
            res.status(500).json({error: 'unable to retrieve list of projects.'})
        })
})

router.get('/:id', validateId, (req, res) => {
    res.json(req.project)
})

router.post('/', validateProject, (req, res) => {
    const newProject = {
        name: req.body.name,
        description: req.body.description
    }
    db.insert(newProject)
        .then(project => {
            console.log(project)
            res.json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: 'Unable to add project'})
        })
})

router.put('/:id', validateId, validateProject, (req, res) => {
    console.log('Im in the PUT')
    if (!req.body.completed) {
        return(res.status(400).json({error: 'missing completion status'}))
    } else{
        const updatedProject = {
            name: req.body.name,
            description: req.body.description,
            completed: req.body.completed
        }
        db.update(req.params.id, updatedProject)
            .then(project => {
                console.log(project)
                res.json(project)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: 'Unable to update the specified project'})
            })
    }
    
})

router.delete('/:id', validateId, (req, res) => {
    db.remove(req.params.id)
        .then(project => {
            console.log(project)
            res.status(204).end()
        })
        .catch(err => {
            res.status(500).json({error: 'There was an error attempting to delete this project'})
        })
})


///MIDDLEWARE///
function validateId(req, res, next) {
    db.get(req.params.id)
        .then(project => {
            if (project) {
                req.project = project
                next()
            } else {
                res.status(404).json({error: 'The project with this ID was not found'})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: 'There was an error retrieving data, please try again later'})
        })
}

function validateAction(req, res, next) {
    if (!req.body) return(res.status(400).json({error: 'Missing request data'}))
    if (!req.body.project_id || !req.body.description || req.body.notes) {
        return(res.status(400).json({error: 'Some required fields are missing'}))
    }
    return next()
}


module.exports = router