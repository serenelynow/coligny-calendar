// This code used examples from 
//http://www.wdisseny.com/lluna/?lang=en

// To use another site to check the moon phase
//https://www.moonpage.com/index.html?go=T&auto_dst=T&totphase=FULL&m=2&d=26&y=7001&hour=19&min=59&sec=49

const moonPhases = {};

function loadMoonPhases(otherData, params, callback){
    if (moonPhases[otherData.cYear.toString()] != undefined && moonPhases[otherData.cYear.toString()][otherData.cMonth.toString()] != undefined) {
        // return the existing
        callback(moonPhases[otherData.cYear.toString()][otherData.cMonth.toString()]);
    } else if (navigator.onLine == true) {
        // go fetch 
        var gets = [];
        for (var i in params) {
            gets.push(i + "=" + encodeURIComponent(params[i]));
        }
        var xmlhttp = new XMLHttpRequest();
        var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var json;
                try {
                     json = JSON.parse(xmlhttp.responseText);
                } catch (e) {
                    console.warn('An unexpected response occurred retrieving the moonPhases.');
                    console.warn('responseText: ' + xmlhttp.responseText);
                } 
                finally {
                    loadNewPhases(otherData, json, callback);
                }
                
            }
        }
        xmlhttp.ontimeout = function (e) {
            console.warn("Loading moon phases is taking too long and so won't be loaded for this month");
            loadNewPhases(otherData, undefined, callback);
        };
        xmlhttp.timeout = 5000;
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    } else {
        console.warn("There is no internet connection so the moon phases won't be loaded.");
        loadNewPhases(otherData, undefined, callback);
    }
}

function loadNewPhases(otherData, moon, callback){  

    var moonPhase;
    if (moon != undefined) {
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

        moonPhase = moonPhases[otherData.cYear][otherData.cMonth];

    } else {
        moonPhase = [];
    }
    
    callback(moonPhase);
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