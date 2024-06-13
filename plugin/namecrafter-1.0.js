class nameCrafter {
    
    // giving the default options for single instance of nameCrafter, and setting debugger on.
    
    constructor (libraryConfig, debugging = false) {
        
        this.libraryOptions = {
            vowels : "[aeiouy]",
            consonants : "[bcdfghjklmnpqrstvwxz]",
            maxVowels : 2,
            maxConsonants : 3,
            bannedClusters : {},
            replaceables : {},
            matchModifier : "gi",
            replaceModifier: "g" 
        };
        
        this.library = {};
        this.debug = debugging;
        
        if (typeof libraryConfig === "object") {
            this.libraryOptions = {...this.libraryOptions, ...libraryConfig };
        }
        
        if (typeof debugging === "boolean") {
            this.debug = debugging;
        }

        this.init();
    }
    
    init() {
        
        this.safetySettings = {
            maxFullNames : 30,
            maxSingleNames : 10,
            maxSyllables : 10
        };
        
        if (this.debug) {
            console.log("nameCrafter successfully initialized. Waiting for syllable sets to populate the library.");
        }
    }
    
    changeSafetySettings(newSettings = {}) {
        if (typeof newSettings === "object") {
            this.safetySettings = {...this.safetySettings, ...newSettings };
            
            if (this.debug) {
                console.log("nameCrafter: Safety settings updated succesfully. I hope you are sure about this!");
            }
        } else if (this.debug) {
            console.log("nameCrafter: Safety settings failed to update. Waited for an object.");
        }
    }
    
    // general utility functions
    
    randomize(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    matchPattern(string, pattern, modifier = this.libraryOptions.matchModifier) {
        
        return !!string.match(new RegExp(pattern, modifier));
    }
    
    // syllable manipulation
    
    testTheSyllableCharts(chart, chartName) {
        
        let test = "was a success.";
        
        if (this.debug) {
            console.log("nameCrafter: Testing " + chartName + "-array.");
        }
        
        if (Array.isArray(chart)) {
            if (chart.every(v => !Array.isArray(v))) {
                
                if (chart.every(v => typeof v === "string")) {
                    if (this.debug) {
                        console.log("nameCrafter: Single syllable array given, when testing the " + chartName + "-array. Array packed to another array to match function requirements.");
                    }
                } else {
                    chart = chart.flat();
                    if (this.debug) {
                        console.log("nameCrafter: While testing the " + chartName + "-array, there was mix of different types of children. Array was flattened to reduce the posibility of bugs.");
                    }
                }
                chart = [chart];
            }
        } else {
            if (this.debug) {
                console.log("nameCrafter: While testing the " + chartName + "-array, it did not appear to be an array at all. Make sure you are giving the syllables in form of an array.");
                test = "failed";
            }
        }
        
        if (this.debug) {
            console.log("nameCrafter: Testing " + chartName + "-array check complete. It " + test);
        }
        
        return chart;
    }
    
    getStartCluster(currentString) {
        
        let startCluster = { "vowels" : 0, "consonants" : 0 };
        
        let vowels = currentString.match(new RegExp("^" + this.libraryOptions.vowels + "+", "gi"));
        let consonants = currentString.match(new RegExp("^" + this.libraryOptions.consonants + "+", "gi"));
        
        if (vowels) {
            startCluster.vowels = vowels[0].length;
        }
        
        if (consonants) {
            startCluster.consonants = consonants[0].length;
        }
        
        return startCluster;
        
    }
    
    getEndCluster(currentString) {
        let endCluster = { "vowels" : 0, "consonants" : 0 };
        
        let vowels = currentString.match(new RegExp(this.libraryOptions.vowels + "+$", "gi"));
        let consonants = currentString.match(new RegExp(this.libraryOptions.consonants + "+$", "gi"));
        
        if (vowels) {
            endCluster.vowels = vowels[0].length;
        }
        
        if (consonants) {
            endCluster.consonants = consonants[0].length;
        }
        
        
        return endCluster;
    }
    
    
    // rate sets and checks
    
    setSyllableRates(syllableChart) {
        let rates = [];
        
        for (let i = 0; i < syllableChart.length; i++) {
            rates[i] = syllableChart.length - i;
        }
     
        return rates;
    }
    
    determineRate(rates) {
        return this.randomize(0, rates.reduce((total, current) => total + current, 0));
    }
    
    determineNumberFromRate(rates) {
        
        let current_rate = this.determineRate(rates);
        let amount = 0;
        
        for (let i = 0, threshold = 0; i < rates.length; i++) {
            threshold = threshold + rates[i];
            
            if (rates[i] == 0 || current_rate > threshold) {
                amount = amount + 1;
            }
        }
        
        return amount;
        
    }
    
    fixedChartsAndRates(currentString, originalSyllables, originalRates) {
        
        let fixedOptions = { "syllables" : [], "rates" : [] };
        let endCluster = this.getEndCluster(currentString);
        let maxConsonants =  Math.max(0, this.libraryOptions.maxConsonants - endCluster.consonants);
        let maxVowels =  Math.max(0, this.libraryOptions.maxVowels - endCluster.vowels);
        
        for (let i = 0; i < originalSyllables.length; i++) {
            let currentSyllableGroup = [];
            let originalSyllableGroup = originalSyllables[i];
            
            for (let c = 0; c < originalSyllableGroup.length; c++) {
                let currentSyllable = originalSyllableGroup[c];
                let startCluster = this.getStartCluster(currentSyllable);
                
                
                if (startCluster.vowels <= maxVowels && startCluster.consonants <= maxConsonants) {
        
                    let pass = true;
                    
                    if (Object.keys(this.libraryOptions.bannedClusters).length) {

                        for (let [situation, banned] of Object.entries(this.libraryOptions.bannedClusters)) {
                            if ( this.matchPattern(currentString, situation) && this.matchPattern(currentSyllable, banned)) {
                                pass = false;
                            }
                        
                        }
                        
                    }
                    
                    if (pass == true) {
                        currentSyllableGroup.push(currentSyllable);
                    }
    
                }
                
            }
            
            if (currentSyllableGroup.length) {
                fixedOptions.syllables.push(currentSyllableGroup);
                fixedOptions.rates.push(originalRates[i]);
            }
        }
        
        return fixedOptions;
        
    }
    
    // Setting a new set to the Library
    
    setToLibrary(name, prefixes, middles, suffixes, options = {}) {
        
        if (this.debug) {
            console.log("nameCrafter: Setting up " + name + "-set to the library.");
        }
        
        this.defaultSetOptions = {
            preposition : null,
            postposition : null,
            lengthRates : [1,6,3]
        };
        
        prefixes = this.testTheSyllableCharts(prefixes, "prefix");
        middles = this.testTheSyllableCharts(middles, "middle");
        suffixes = this.testTheSyllableCharts(suffixes, "suffix");
        
        this.library[name.toString()] = {
            "prefixes" : prefixes,
            "prefixRates" : this.setSyllableRates(prefixes),
            "middles" : middles,
            "middleRates" : this.setSyllableRates(middles),
            "suffixes" : suffixes,
            "suffixRates" : this.setSyllableRates(suffixes),
            "options" : {...this.defaultSetOptions, ...options }
        };
        
        if (this.debug) {
            console.log("nameCrafter: Syllable set " + name.toString() + " setup completed.");
        }
    }
    
    
    // Name Crafting functions
    
    craftName(set, exceptions = {}) {
        let nameLength;
        
        if (this.debug) {
            console.log("nameCrafter: Attempting to craft a name.");
        }
        
        let currentSet = this.library[set];
        
        if (typeof exceptions.nameLength == "number" && exceptions.nameLength > 0) {
            nameLength = Math.round(exceptions.nameLength);
        } else if (typeof exceptions.nameLength == "number" | !exceptions.nameLength) {
            nameLength = this.determineNumberFromRate(currentSet.options.lengthRates)+1;
        } else if (typeof exceptions.nameLength == "object") {
            nameLength = this.determineNumberFromRate(exceptions.nameLength)+1;
        } else {
            if (this.debug) {
                console.log("nameCrafter: nameLength given in wrong form. Check that you give the data either as integer or an array.");
            }
        }
        
        nameLength = Math.min(Math.max(nameLength, 1), this.safetySettings.maxSyllables);
        
        if (this.debug) {
            console.log("nameCrafter: " + nameLength + " syllables.");
        }
        
        
        let nameData = { "name": "", "originalSyllables": [] };
        
        for (let i = 0; i < nameLength; i++) {
            
            if (this.debug) {
                let t = i+1;
                console.log("nameCrafter: Determining syllable " + t );
            }
            
            let parts = currentSet.middles;
            let rates = currentSet.middleRates;
            let currentOptions;
            
            if (i == 0) {
                parts = currentSet.prefixes;
                rates = currentSet.prefixRates;
            } else if (i == nameLength-1) {
                parts = currentSet.suffixes;
                rates = currentSet.suffixRates;
            }
            
            if (i == 0) {
                currentOptions = { "syllables" : parts, "rates" : rates };
            } else {
                currentOptions = this.fixedChartsAndRates(nameData.name, parts, rates);
            }
            
            let rarityGroup = currentOptions.syllables[this.determineNumberFromRate(currentOptions.rates)];
            let syllable = rarityGroup[this.randomize(0,rarityGroup.length-1)];
            
            nameData.name += syllable;
            nameData.originalSyllables.push(syllable);
            
            if (this.debug) {
                console.log("nameCrafter: chose syllable: " + syllable );
            }
        }
        
        if (Object.keys(this.libraryOptions.replaceables).length) {
            
            if (this.debug) {
                console.log("nameCrafter: checking name for replacables.");
            }
        
            for (let [key, cases] of Object.entries(this.libraryOptions.replaceables)) {

                if (this.matchPattern(nameData.name, key)) {
                    for (let [which, what] of Object.entries(cases)) {
                        nameData.name = nameData.name.replace(new RegExp(which, this.libraryOptions.replaceModifier), what);
                    }
                }
            }
        }
        
        let preposition = exceptions.preposition ? exceptions.preposition : currentSet.options.preposition;
        let postposition = exceptions.postposition ? exceptions.postposition : currentSet.options.postposition;
        
        
        if (preposition) {
            nameData.originalSyllables.unshift(preposition);
            nameData.name = preposition + nameData.name;
            if (this.debug) {
                console.log("nameCrafter: Added preposition.");
            }
        }
        
        if (postposition) {
            nameData.name += postposition;
            nameData.originalSyllables.push(postposition);
            if (this.debug) {
                console.log("nameCrafter: Added postposition.");
            }
        }
        
        return nameData;
        
    }
    
    craftMultipleNames(totalNames, setInfo) {
        let names = [];
        
        totalNames = Math.min(Math.max(totalNames,1), this.safetySettings.maxFullNames);
        
        for (let i = 0; i < totalNames; i++) {
            
            if (this.debug) {
                let t = i+1;
                console.log("nameCrafter: crafting name number " + t);
            }
            
            var name = [];
            
            if (typeof setInfo === "string") {
                
                name.push(this.craftName(setInfo));
            
            } else if (Array.isArray(setInfo)) {
                
                let infoLength = Math.min(setInfo.length, this.safetySettings.maxSingleNames);
                
                for (let l = 0; l < infoLength; l++) {
                    let current = setInfo[l];
                    if (typeof current === "string") {
                        
                        name.push(this.craftName(current, 0));
                        
                    } else if (typeof current === "object") {
                        
                        if (!current.nameLength) {
                            current.nameLength = 0;
                        }
                        
                        name.push(this.craftName(current.set, current.exceptions));
                    }
                    
                }
                
            } else {
                if (this.debug) {
                    console.log("nameCrafter: setInfo given in wrong form, expecting object (array) or a string.");
                }
            }
        
            names.push(name);
        }
        
        if (this.debug) {
            console.log("nameCrafter: Returning names.");
        }
        
        return names;
    }
    
    
}