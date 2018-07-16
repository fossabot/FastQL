module.exports = (db) => {
    db.table('authors')
    db.primary('id')    
    return {
        db
    }
};

