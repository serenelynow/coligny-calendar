// This code used examples from 
//http://www.wdisseny.com/lluna/?lang=en

// To use another site to check the moon phase
//https://www.moonpage.com/index.html?go=T&auto_dst=T&totphase=FULL&m=2&d=26&y=7001&hour=19&min=59&sec=49

const moonPhases = {};

function loadMoonPhases(otherData, params,callback){
    if (moonPhases[otherData.cYear.toString()] != undefined && moonPhases[otherData.cYear.toString()][otherData.cMonth.toString()] != undefined) {
        // return the existing
        callback(moonPhases[otherData.cYear.toString()][otherData.cMonth.toString()]);
    } else {
        // go fetch 
        var gets=[]
        for (var i in params){
            gets.push(i + "=" +encodeURIComponent(params[i]))
        }
        var xmlhttp = new XMLHttpRequest()
        var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&")
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                loadNewPhases(otherData, JSON.parse(xmlhttp.responseText), callback)
            }
        }
        xmlhttp.open("GET", url, true)
        xmlhttp.send()
    }
}

function loadNewPhases(otherData, moon, callback){     
    var phMax = [];
    var year = moon.year.toString();
    var month = moon.month.toString()
    if (moonPhases[otherData.cYear] == undefined) {
        moonPhases[otherData.cYear] = {};
    }

    moonPhases[otherData.cYear][otherData.cMonth] = {};
    
    for (var nDay in moon.phase){
        if (moon.phase[nDay].isPhaseLimit){
            
            moonPhases[otherData.cYear][otherData.cMonth][nDay.toString()] = moon.phase[nDay].svgMini;
        }
    }
    callback(moonPhases[otherData.cYear][otherData.cMonth]);
}   

export function getMoonPhases(moonPhaseData, callback) {
    var apiParams = {
        lang        :'en',
        size        :"100%", 
        lightColor  :"rgb(255,255,230)", 
        shadeColor  :"black", 
        texturize   :true, 
        year: moonPhaseData.gYear,
        month: moonPhaseData.gMonth + 1,
        LDZ: (new Date(moonPhaseData.gYear,moonPhaseData.gMonth,moonPhaseData.gDate)) / 1000
    }
    loadMoonPhases(moonPhaseData, apiParams,callback)
}