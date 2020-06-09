/**
 * Load an implementation of a specified DAO.
 */
const loadDao = (daoName) => {
    const currentDatabase = process.env.CURRENT_DATABASE
    return require(`./impl/${currentDatabase}/${daoName}_dao_${currentDatabase}_impl`)
}
  
module.exports = {
    loadDao,
}
  