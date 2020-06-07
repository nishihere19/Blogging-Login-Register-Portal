const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

User.prototype= {
    find: function(user= null, callback)
    {
        if(user){
            var field =Number.isInteger(user) ? 'id': 'username';
        }
        let sql = `SELECT * FROM users WHERE ${field} = ?`;
        pool.query(sql, user, function(err,result){
            if(err) throw err
            if(result.length){
            callback(result[0]);
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
    }
}
module.exports= User;