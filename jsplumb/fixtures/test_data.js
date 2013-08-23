/**
 * Created with JetBrains WebStorm.
 * User: vithesh
 * Date: 22/8/13
 * Time: 11:46 AM
 * To change this template use File | Settings | File Templates.
 */

    var CreateJson = {
        java : [],
        mysql : [],
        mainJson:null,
        addJson :function(){
            var min = 0;
            var max = 100;
            var obj1 = 500, obj2 = 500;

            for(var i=0 ; i<obj1 ; i++)
            {

                var temp = {
                    "local_addr" : "127.0.0."+Math.round(min + (Math.random()*max)),
                    "local_port" : "53495",
                    "proc_id" : "22622",
                    "proc_name" : "java",
                    "remote_addr" : "127.0.0."+Math.round(min + (Math.random()*max)),
                    "remote_port" : "3306",
                    "so_state" : "ESTABLISHED"
                } ;
                this.java.push(temp);
            }
            for(var i=0 ; i<obj2 ; i++)
            {

                var temp = {
                    "local_addr" : "127.0.0."+Math.round(min + (Math.random()*max)),
                    "local_port" : "53495",
                    "proc_id" : "22622",
                    "proc_name" : "mysql",
                    "remote_addr" : "127.0.0."+Math.round(min + (Math.random()*max)),
                    "remote_port" : "3306",
                    "so_state" : "ESTABLISHED"
                } ;
                this.mysql.push(temp);

            }
            this.mainJson = {"java" : this.java, "mysql" : this.mysql} ;
        }

    }

    CreateJson.addJson();

 window.result =  CreateJson.mainJson;