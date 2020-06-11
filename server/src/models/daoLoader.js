/**
 * Load an implementation of a specified DAO.
 * @param {string} daoName - String of specified Data Access Object
 * @returns {module} Built in require function that returns some module - in this case implementatioon of DAO module
 */
const loadDao = (daoName) => {
    const currentDatabase = process.env.CURRENT_DATABASE
    return require(`./impl/${currentDatabase}/${daoName}_dao_${currentDatabase}_impl`)
}
  
module.exports = {
    loadDao,
}
  