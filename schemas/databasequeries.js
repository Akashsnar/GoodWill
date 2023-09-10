function check_table_exists(tablename,db)
 {
    db.run(`select exists(select 1 from sqlite_master where type = 'table" and name = "${tablename}")`)
 }
 function crt_table(tablename,db)
{
    db.run( `CREATE TABLE IF NOT EXISTS ${tablename}(USERNAME TEXT , EMAIL TEXT , PASSWORD TEXT)`);
}
 function drp_table(tablename,db) {
    db.run(`drop table if exists ${tablename}`);
    }

 function insrt_val (db,tablename ,username , email, password )
{
    username = username.trim();
    email = email.trim();
   db.run(`insert into ${tablename}(username , email, password) values(${username},${email},${password})`);
}

function search_val(tablename ,columname, key)
{
   return `select exists(select 1 from ${tablename} where ${columname}="${key}" limit 1)`;
}    
 module.exports ={
    crt_table,
    drp_table,
    insrt_val,
    search_val,
    check_table_exists
 }
