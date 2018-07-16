module.exports = (db) => {
    db.table('orders')
    db.primary('id')    
    return {
        db
    }
};

