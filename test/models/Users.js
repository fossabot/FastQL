export default (db) => {
    db.table('users')
    db.primary('id')
    return db
};
