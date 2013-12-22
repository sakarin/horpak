Running Tests
-------------

Then run `bundle install`. Authentication will then work exactly as it did in previous versions of Spree.

```shell
bundle exec rake spec
```

CarrierWave Bug with Rails 3.2.13
Fix with Downgrade to Rails 3.2.12


bundle exec rake assets:precompile RAILS_ENV=development
bundle exec rake assets:clean RAILS_ENV=development
bundle exec rake assets:clean RAILS_ENV=production

Deploy
------
```shell
cap deploy:setup
```
# edit /home/deployer/apps/blog/shared/config/database.yml on server

```shell
cap deploy:cold


```shell
sudo service nginx restart
```

----------------------------------------------------------
#- issue
----------------------------------------------------------
/etc/init.d/unicorn_realestate: 24: kill: No such process

Killing processes in UNIX
-------------------------
If you do not know the PID of a process, you can learn it by issuing a process status command, ps.

```shell
ps aux | grep unicorn
```

Terminate the processes with pids 1412 and 1157:

```shell
$ kill 1412 1157
```

Deploy
1. kill process unicorn 0
2. cap deploy:cold
