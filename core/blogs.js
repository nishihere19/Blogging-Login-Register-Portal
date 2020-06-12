const pool = require('./pool');

function Blog() {};

Blog.prototype={
    find: function(userid=null,callback){
        if(userid){
            let sql=`SELECT fullname FROM users WHERE id=?;`;
            pool.query(sql,userid,function(err,result){
                if(err) throw err
                if(result.length){
                    callback(result[0]);
                }
                else{
                    callback(null);
                }
            });

        }
        else{
            callback(null);
        }
    },
    myblogs: function(userid=null, callback){
        if(userid){
            let sql=`SELECT * FROM blogs WHERE (id) = ?`
            pool.query(sql,userid,function(err,result){
                if(err) throw err
                if(result.length){
                    //console.log(result);
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