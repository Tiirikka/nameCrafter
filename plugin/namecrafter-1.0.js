class nameCrafter {
    constructor (languageConfig, debugging) {
        
        this.languageOptions = {
            vowels : "[aeiouy]",
            consonants : "[bcdfghjklmnpqrstvwxz]",
            mixes : "",
            maxVowels : 2,
            maxConsonants : 3,
            bannedClusters: {},
            replaceables: {}
        };
        
        this.library = {};
        this.debug = false;
        
        if (typeof languageConfig === "object") {
            this.languageOptions = {...this.languageOptions, ...languageConfig };
        }
        
        if (typeof debugging === "boolean") {
            this.debug = debugging;
        }

        this.init();
    }
    
    init() {
        if (this.debug) {
            console.log("nameCrafter successfully initialized. Waiting for the syllable library.");
        }
    }
    
    randomize(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    testTheSyllableCharts(chart) {
        if (Array.isArray(chart)) {
            if (chart.every(v => !Array.isArray(v))) {
                chart = [chart.flat()];
                if (this.debug) {
                    console.log("nameCrafter: One of the syllable arrays either was only one level deep, or there was strings and arrays mixed in the array on the same level. This has been automatically fixed for you by flattening the original array, and putting it in a new array.");
                }
            }
        } else {
            if (this.debug) {
                console.log("nameCrafter: One of the syllable arrays is not an object. makes sure you are giving the syllables in form of an array.");
            }
        }
        
        return chart;
    }
    
    
    setSyllableRates(syllableChart) {
        let rates = [];
        
        for (let i = 0; i < syllableChart.length; i++) {
            rates[i] = syllableChart.length * 2 - i;
        }
     
        return rates;
    }
    
    setToLibrary(name, prefixes, middles, suffixes, defaultLengthRates = [2,6,4,1]) {
        
        prefixes = this.testTheSyllableCharts(prefixes);
        middles = this.testTheSyllableCharts(middles);
        suffixes = this.testTheSyllableCharts(suffixes);
        
        this.library[name.toString()] = {
            "prefixes" : prefixes,
            "prefixRates" : this.setSyllableRates(prefixes),
            "middles" : middles,
            "middleRates" : this.setSyllableRates(middles),
            "suffixes" : suffixes,
            "suffixRates" : this.setSyllableRates(suffixes),
            "lengthRates" : defaultLengthRates
        };
        
        if (this.debug) {
            console.log("nameCrafter: Syllable library " + name.toString() + " set succesfully.");
        }
    }
    
    determineRate(rates) {
        let totalRate = 0;
        let minCheck = false; 
        let minLength = 1;
        
        for (let i = 0; i < rates.length; i++) {
            totalRate = totalRate + rates[i];
        }
        
        return this.randomize(0, totalRate);
    }
    
    determineNumberFromRate(rates) {
        
        let rate = this.determineRate(rates);
        
        let amount = 0;
        
        for (let i = 0, total = 0; i < rates.length; i++) {
            total = total + rates[i];
            if (rate <= total) {
                amount = i+1;
                break;
            }
        }
        
        return amount;
        
    }
    
    getCharacterType(character) {
        
        let type;
        
        if (character.match(new RegExp(this.languageOptions.consonants, "gi"))) {
            type = "consonants";
        }
        
        if (character.match(new RegExp(this.languageOptions.vowels, "gi"))) {
            type = "vowels";
        }
        
        return type;
    }
    
    getStartCluster(currentString) {
        
        let startCluster = { "vowels" : 0, "consonants" : 0 };
        
        let vowels = currentString.match(new RegExp("^" + this.languageOptions.vowels + "+", "gi"));
        let consonants = currentString.match(new RegExp("^" + this.languageOptions.consonants + "+", "gi"));
        
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
        
        let vowels = currentString.match(new RegExp(this.languageOptions.vowels + "+$", "gi"));
        let consonants = currentString.match(new RegExp(this.languageOptions.consonants + "+$", "gi"));
        
        if (vowels) {
            endCluster.vowels = vowels[0].length;
        }
        
        if (consonants) {
            endCluster.consonants = consonants[0].length;
        }
        
        
        return endCluster;
    }
    
    matchInArray(string, patterns, modifier = "gi") {
        
        var result = false;
        
        for (let i = 0; i < patterns.length; i++) {
            if (string.match(new RegExp(patterns, modifier)) !== null) {
                result = true;
                break;
            }
        }
        
        return result;
    }
    
    fixedChartsAndRates(currentString, originalSyllables, originalRates) {
        
        let fixedOptions = { "syllables" : [], "rates" : [] };
        let endCluster = this.getEndCluster(currentString);
        let maxConsonants =  Math.max(0 , this.languageOptions.maxConsonants - endCluster.consonants);
        let maxVowels =  Math.max(0, this.languageOptions.maxVowels - endCluster.vowels);
        
        for (let i = 0; i < originalSyllables.length; i++) {
            let currentSyllableGroup = [];
            let originalSyllableGroup = originalSyllables[i];
            
            for (let c = 0; c < originalSyllableGroup.length; c++) {
                let currentSyllable = originalSyllableGroup[c];
                let startCluster = this.getStartCluster(currentSyllable);
                
                if (startCluster.vowels <= maxVowels && startCluster.consonants <= maxConsonants) {
        
                    let pass = true;
                    
                    if (Object.keys(this.languageOptions.bannedClusters).length) {

                        for (let [situation, banned] of Object.entries(this.languageOptions.bannedClusters)) {

                            if (currentString.match(new RegExp(situation, "gi")) !== null && this.matchInArray(currentSyllable, banned) == true) {
                                pass = false;
                                break;
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
    
    craftName(library, nameLength = 0) {
        
        let currentLibrary = this.library[library];
        
        if (typeof nameLength == "number" && nameLength > 0) {
            nameLength = Math.round(nameLength);
        } else if (typeof nameLength == "number") {
            nameLength = this.determineNumberFromRate(currentLibrary.lengthRates);
        } else if (typeof nameLength == "object") {
            nnameLength = this.determineNumberFromRate(nameLength);
        } else {
            if (this.debug) {
                console.log("nameCrafter: nameLength given in wrong form. Check that you give the data either as integer or an array.");
            }
        }
        
        
        let nameData = { "name": "", "syllables": [] };
        
        for (let i = 0; i < nameLength; i++) {
            
            let parts = currentLibrary.middles;
            let rates = currentLibrary.middleRates;
            let currentOptions;
            
            if (i == 0) {
                parts = currentLibrary.prefixes;
                rates = currentLibrary.prefixRates;
            } else if (i == nameLength-1) {
                parts = currentLibrary.suffixes;
                rates = currentLibrary.suffixRates;
            }
            
            if (i == 0) {
                currentOptions = { "syllables" : parts, "rates" : rates };
            } else {
                currentOptions = this.fixedChartsAndRates(nameData.name, parts, rates);
            }
            
            let rarityGroup = currentOptions.syllables[this.determineNumberFromRate(currentOptions.rates)-1];
            let syllable = rarityGroup[this.randomize(0,rarityGroup.length-1)];
            
            nameData.name += syllable;
            nameData.syllables.push(syllable);
        }
        
        for (let [key, cases] of Object.entries(this.languageOptions.replaceables)) {
            
            if (nameData.name.match(new RegExp(key, "gi"))) {
                for (let [which, what] of Object.entries(cases)) {
                    nameData.name = nameData.name.replace(new RegExp(which, "g"), what);
                }
            }
        }
        
        return nameData;
        
    }
    
    craftMultipleNames(totalNames, libraryInfo) {
        
        
        let names = [];
        for (let i = 0; i < totalNames; i++) {
            
            var name = [];
            
            if (typeof libraryInfo === "string") {
                
                
                name.push(this.craftName(libraryInfo));
            
            } else if (typeof libraryInfo === "object") {
                if (libraryInfo.library) {
                    
                    if (!libraryInfo.nameLength) {
                        libraryInfo.nameLength = 0;
                    }
                    
                    name.push(this.craftName(libraryInfo.library, libraryInfo.nameLength));
                
                } else {    
                    
                    for (let l = 0; l < libraryInfo.length; l++) {
                        let current = libraryInfo[l];
                        
                        if (!current.nameLength) {
                            current.nameLength = 0;
                        }
                        
                        name.push(this.craftName(current.library, current.nameLength));
                    }
                    
                    
                }
            } else {
                if (this.debug) {
                    console.log("nameCrafter: libraryInfo given in wrong form, expecting object (array) or a string.");
                }
            }
        
            names.push(name);
        }
        
        return names;
    }
    
    
}