
checkIfUserExists = function (email) {
    return Meteor.users.findOne({ 'emails.address': email });
};

let createUser = ( user ) => {
    let userId = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
            name: user.name.first + " " + user.name.last
        }
    });
    
    return userId;
};

createUsers = function(users) {
    for (let i = 0; i < users.length; i++) {
        let user = users[ i ],
        userExists = checkIfUserExists(user.email);

        if ( !userExists ) {
            let userId  = createUser(user);
        }
    }
};
