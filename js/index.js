const demo_prefix = ["Mion","Kel","Ke","A","Avae","Syn","Ad","Ay","Ca","Cer","Ci","Dae","Da","Dor","La","E","Eir","Weld","Fi","Ga"];
const demo_middle = ["ith","ry","lat","re", "ve", "vin","ral","lyn","li","moi","ly","ren","la","men","le","na","lad"];
const demo_suffix = ["zair","ir","mis","har","ess","dra", "ric", "len", "ral", "mon", "yra","lon","lyn","ean","ren","ra","or","ias","vin","rith","ril","reth","rion","her", "ith", "lyn", "as"];

const demo = new nameCrafter({maxConsonants: 2, bannedClusters : { "n$" : "^m", "c$" : "^[qwrtplkjhgfdzxcvbnm]"}});

demo.setToLibrary("demo_names", demo_prefix, demo_middle, demo_suffix, { lengthRates : [0,6,4] });

var new_names;

function craftNames() {
    
    new_names = demo.craftMultipleNames(5, [{ set : "demo_names"}]);
    
    let name_list = [];
    
    for (let i = 0; i < new_names.length; i++) {
        
        let name = "";
        let full_name = new_names[i];
        for (let s = 0; s < full_name.length; s++) {
            name += " " + full_name[s].name;
        }
        
        name_list.push(name);
           
    }
    
    document.getElementById("intro_demo").innerHTML = "<p>" + name_list.join(", ").trim() + "</p>";
    
}