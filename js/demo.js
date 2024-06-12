var demo_prefix = ["Mion","Kel","Ke","A","Avae","Syn","Ad","Ay","Ca","Cer","Ci","Dae","Da","Dor","La","E","Eir","Weld","Fi","Ga"];
var demo_middle = ["ith","ry","lat","re", "ve", "vin","ral","lyn","li","moi","ly","ren","la","men","le","na","lad"];
var demo_suffix = ["zair","ir","mis","har","ess","dra", "ric", "len", "ral", "mon", "yra","lon","lyn","ean","ren","ra","or","ias","vin","rith","ril","reth","rion","her"];


$(document).ready(function() {
    var demo_1 = new nameCrafter({maxConsonants: 2});
    demo_1.setToLibrary("demo_names", demo_prefix, demo_middle, demo_suffix, {lengthRates : [0,7,3]});
    
    $("#demo_1").on( "click", function() {
    
        $("#intro_demo").empty();
        

        var new_names = demo_1.craftMultipleNames(5, [{ set : "demo_names"}]);
        $("#intro_demo").append("<p>");
        for (let i = 0; i < new_names.length; i++) {
            let name = "";
            let full_name = new_names[i];
            for (let s = 0; s < full_name.length; s++) {
                name += " " + full_name[s].name;
            }
            
            $("#intro_demo").append(name);
            
            if (i != new_names.length-1 ) {
                $("#intro_demo").append(", ");
            }
            
        }
        $("#intro_demo").append("</p>");

    });
});