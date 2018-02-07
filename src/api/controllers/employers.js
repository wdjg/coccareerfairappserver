import mongoose from 'mongoose'
const Employer = mongoose.model('Employer');
const Line = mongoose.model('Line');

// get employers/:id
function getEmployerById(req, res) {
    if (!req.user._id) {
        res.status(401).json({
            "message": "UnauthorizedError: Need to be logged in"
        });
    } else {
        Employer.findById(req.params.id).exec(function (err, employer) {
            if (err)
                return res.send(err);
            res.status(200).json(employer);
        });
    }
};

// get employers?name=XXX
function getEmployerBySearch(req, res) {
    if (!req.user._id) {
        res.status(401).json({
            "message": "UnauthorizedError: Need to be logged in"
        });
    } else if (!req.query.name) {
        res.status(401).json({
            "message": "InputError: Missing name parameter in url"
        });
    } else {
        Employer.findOne({name: req.query.name}).exec(function (err, employer) {
            if (err)
                return res.send(err);
            res.status(200).json(employer);
        });
    }
};

// post employers
function createEmployer(req, res) {
    if (!req.user._id) {
        res.status(401).json({
            "message": "UnauthorizedError: Need to be logged in"
        });
    } else if (!req.body.name) {
        res.status(400).json({
            "message": "InputError: Missing name parameter"
        });
    } else {
        var employer = Employer();
        employer.name = req.body.name
        employer.save(function(err){
            if(err)
                return res.send(err);
            res.status(200).json(employer);
        });
    }
};

// put employers/:id
function updateEmployer(req, res) {
    if (!req.user._id) {
        res.status(401).json({
            "message": "UnauthorizedError: Need to be logged in"
        });
    } else {
        Employer.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}).exec(function (err, employer) {
            if (err)
                return res.send(err);
            res.status(200).json(employer);
        })
    }
};

// delete employers/:id
function deleteEmployer(req, res) {
    if (!req.user._id) {
        res.status(401).json({
            "message": "UnauthorizedError: Need to be logged in"
        });
    } else {
        Employer.remove({_id: req.params.id}).exec(function (err, employer) {
            if (err)
                res.send(err);
            res.status(200).json({
                "message": "Successfully deleted employer"
            })
        })
    }
};

// get /employers/:id/users
function getLineUsersById(req, res) {

    if (!req.user._id) {
        res.status(401).json({
            "message": "UnauthorizedError: Need to be logged in"
        });
    } else {
        var users = [];
        var query = Line.find({employer_id: req.params.id}).where({status: "inline"}).sort({updated_by: -1})
        query.exec(function(err, lines) {
            if (err)
                return res.send(err);
            lines.forEach(function(line) {
                Line.findOne({_id: line.user_id}).exec( function(err, user){
                    users.push(user);
                });
            });
        }).then(function() {
            res.status(200).json({
                "users": users
            })
        })
    }
}

export default { getEmployerById, getEmployerBySearch, createEmployer, updateEmployer, deleteEmployer, getLineUsersById}