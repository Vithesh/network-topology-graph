/**
 * Created with JetBrains WebStorm.
 * User: deepikai
 * Date: 23/8/13
 * Time: 6:01 PM
 * To change this template use File | Settings | File Templates.
 */

var CreateJson = {
    mainJson:[],
    addJson :function(){
        var min = 1;
        var max = 500;

        for(var i=0 ; i<1000 ; i++)
        {
            var src = Math.round(min + (Math.random()*max));
            var trg = Math.round(min + (Math.random()*max));

            var temp = {
                "adjacencies": [
                    {
                        "nodeTo": trg+".0.0.1",
                        "nodeFrom": src+".0.0.1",

                        'data':{
                            "$color": "#FFF",
                        }

                    }

                ],
                'id' :src+".0.0.1",
                'name':src+".0.0.1",
                'data':{
                    "$color": "#C74243",
                    "$type": "star",
                    "$dim": 8
                }


            }  ;

            this.mainJson.push(temp);

        }


    }

}
CreateJson.addJson();
window.graphJson = CreateJson.mainJson;