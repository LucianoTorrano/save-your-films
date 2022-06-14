const bcrypt = require('bcryptjs');
const helpers = {}

helpers.encryptPassword = async (password) =>{
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password,salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword)=>{
    try{
        const isValid = await bcrypt.compare(password,savedPassword);
        return isValid;
    } catch(err){
        console.log(err);
    }
};

module.exports = helpers;