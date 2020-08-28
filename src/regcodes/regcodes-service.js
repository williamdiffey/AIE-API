const RegcodesService = {
  insertRegcode(db, newRegcode) {
    return db
      .insert(newRegcode)
      .into('aie_regcodes')
      .returning('*')
      .then(([regcode]) => regcode)
  },
}
module.exports = RegcodesService
