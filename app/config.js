module.exports =  {
    port:8080,
    db_url:'mongodb://localhost:27017/rastro',
    db_schemas:[
        {file:'./users-schema', 
        collection:'users', 
        schemaName:'userSchema', 
        modelName:'userModel'}
    ]
}