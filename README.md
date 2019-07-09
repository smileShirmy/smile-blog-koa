# smile-blog-koa

## config

```js

```

## Mysql 相关

### 1. Warning: Using a password on the command line interface can be insecure

```
1. mysql_config_editor set --login-path=dbname --host=127.0.0.1 --user=root --password
2. 输入密码
3. mysql_config_editor print --all
4. mysql --login-path=dbname
```

### 2. 1130, "Host 'xxxx' is not allowed to connect to this MySQL server"

```
1. update user set host='%' where user='root';
2. use mysql;
3. select host,user from user;
4. flush privileges;
```