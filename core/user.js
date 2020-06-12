const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

User.prototype= {
    find: function(user= null, callback)
    {
        //console.log(user);
        if(user){
            var field =Number.isInteger(user) ? 'id': 'username';
            //console.log(field);
        }
        //console.log(field);
        let sql = `SELECT * FROM users WHERE ${field} = ?`;
        pool.query(sql, user, function(err,result){
            if(err) throw err
            if(result.length){
                //console.log(result[0]);
            callback(result[0]);
            } else{
                callback(null);
            }
        });
    },
    findsearch: function(user= null, callback)
    {
        if(user){
            var field ='fullname';
        }
        let sql = `SELECT * FROM users WHERE ${field} = ? OR username = ?`;
        var arr=[user,user];
        pool.query(sql, arr, function(err,result){
            if(err) throw err
            if(result.length){
            callback(result);
            } else{
                callback(null);
            }
        });
    },
    create : function(body,callback)
    {
        let pvd = body.password;
        body.password = bcrypt.hashSync(pvd,10);

        var bind=[];
        for(prop in body){
            bind.push(body[prop]);
        }
        let sql= 'INSERT INTO users(username, fullname, password) VALUES (?, ?, ?)';
        pool.query(sql, bind, function(err,result){
            if(err) throw err
            callback(result.insertId);
        });

    },
    login: function(username, password, callback){
        this.find(username, function(user){
            if(user){
                if(bcrypt.compareSync(password,user.password)){
                    callback(user);
                    return;
                }
            }
            callback(null);
        });
    },
    updatestatus: function(heading,status,userdata,callback){
        let sql=`INSERT INTO blogs(id,HEADING,status,username) VALUES (?,?,?,?);`;
        let arr=[userdata.id,heading,status,userdata.fullname];
        pool.query(sql,arr,function(err,result){
            if(err) throw err
            else{
                console.log("update success!")
                callback("success");
            }
        });
    },
    follow: function(user_id,follower_id,callback){
        console.log(user_id,follower_id);
        user_id=parseInt(user_id);
        follower_id=parseInt(follower_id);
        let sql=`SELECT* FROM followers WHERE user_id=? and follower_id=?;`;
        let arr=[user_id,follower_id];
        pool.query(sql,arr,function(err,result){
        if(err) throw err
        if(result.length){
            let sql1=`DELETE FROM followers WHERE user_id=? and follower_id=?;`;
            let arr1=[user_id,follower_id];
            pool.query(sql1,arr1,function(err,result){
                if(err) throw err
                if(result){
                    callback("Follow");
                }
                else{
                    callback(null);
                }
            });
        }
        else{
            let sql1=`INSERT INTO followers(user_id,follower_id) VALUES (?,?);`;
            let arr1=[user_id,follower_id];
            pool.query(sql1,arr1,function(err,result){
                if(err) throw err
                if(result){
                    callback("Following");
                }
                else{
                    callback(null);
                }
            });
        }
        });
    },
    check: function(user_id,follower_id,callback){
        user_id=parseInt(user_id);
        follower_id=parseInt(follower_id);
        let sql=`SELECT* FROM followers WHERE user_id=? and follower_id=?;`;
        let arr=[user_id,follower_id];
        pool.query(sql,arr,function(err,result){
            if(err) throw err
            if(result.length){
                callback("Following");
            }
            else{
                callback("Follow");
            }
        });
    },
    followers: function(userid,callback){
        userid=parseInt(userid);
        let sql= `SELECT COUNT(*) AS followcount FROM followers WHERE user_id = ?;`;
        pool.query(sql,userid,function(err,result){
            if(err) throw err
            if(result.length){
               // console.log(result);
                callback(result[0].followcount);
            }
            else{
                callback(0);
            }
        });
    },
    following: function(userid,callback){
        userid=parseInt(userid);
        let sql= `SELECT COUNT(*) AS followcount1 FROM followers WHERE follower_id = ?;`;
        pool.query(sql,userid,function(err,result){
            if(err) throw err
            if(result.length){
               // console.log(result);
                callback(result[0].followcount1);
            }
            else{
                callback(0);
            }
        });
    }
    
}
module.exports= User;