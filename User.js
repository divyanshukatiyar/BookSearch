const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
    },
    {timestamps: true}
);

userSchema.pre('save', function(next) { // registers a middleware function that will be executed before the document is saved
    // to the database. The next parameter is a function that should be called when the middleware is finished. 
    // The next function is used to pass control to the next middleware function in the stack.
    // If the next function is not called, the request will be left hanging.
    const user = this;
    if(!user.isModified('password')) {
        return next(); // if the password is modified, the middlware will hash it, else it will just move on to the next middleware
    }
    bcrypt.genSalt(10, function(err, salt) // generates a salt with 10 rounds. Salt is used in combination with the password to generate a hash
        // which is stored in the database. function(err, salt) is a callback function that will be called when the salt is generated.
    {
        if(err) {
            return next(err); // checks for errors. If yes, then the middleware calls the next function with the error which will be handled by the error handling middleware.
        }
        bcrypt.hash(user.password, salt, function(err, hash) { // creates the hash using the password and the generated salt. function(err, hash) is a callback function that will be called when the hash is generated.
            if(err) {
                return next(err); // checks for errors during hashing. If yes, then the error will be handled by an error handling middleware.
            }
            user.password = hash;
            next(); // calls the next function, indicating that the middleware has completed its task and the next middleware in the chain should be executed.
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) { // adding a new method to the userSchema which takes in a candidate password and a callback function
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) { //This line compares the candidatePassword with the hashed password stored in the database for this user
        if(err) {
            return callback(err);
        }
        callback(null, isMatch); // isMatch is a boolean value that indicates whether the candidatePassword matches the hashed password stored in the database.
    });
}

const User = mongoose.model('User', userSchema); // This line creates a model for the userSchema and assigns it to a variable called User

module.exports = User;