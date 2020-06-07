const pool = require('./pool');

function Blog() {};

Blog.prototype={
    myblogs: function(userid=null, callback){
        if(userid){
            let sql=`SELECT * FROM blogs WHERE (id) = ?`
            pool.query(sql,userid,function(err,result){
                if(err) throw err
                if(result.length){
                    callback(result);
                }else{
                    callback(null);
                }
            });
        }
        else{
            callback(null);
        }
    },
    allblogs: function(callback){
        
            let sql=`SELECT * FROM blogs`
            pool.query(sql,function(err,result){
                if(err) throw err
                if(result.length){
                    callback(result);
                }else{
                    callback(null);
                }
            });
        
        
    }
}
module.exports= Blog;