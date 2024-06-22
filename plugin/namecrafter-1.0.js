class nameCrafter {
    
    // giving the default options for single instance of nameCrafter, and setting debugger on.
    
    constructor (libraryConfig, debugging = false) {
        
        this.libraryOptions = {
            vowels : "[aeiouy]",
            consonants : "[bcdfghjklmnpqrstvwxz]",
            maxVowels : 2,
            maxConsonants : 3,
            bannedClusters : [],
            replacements : [],
            blockRepeats : [
                { min: 2, max: 2, allowed: 1},
                { min: 3, max: null, allowed: 0}
            ],
            punctuation: [],
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
    
    matchAmount(string, pattern, modifier = this.libraryOptions.matchModifier) {
        let match = string.match(new RegExp(pattern, modifier));
        return !!match ? match.length : 0;
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
    
    determineNumberFromRate(rates) {
        
        let current_rate = this.randomize(0, rates.reduce((total, current) => total + current, 0));
        let amount = 0;
        
        for (let i = 0, threshold = 0; i < rates.length; i++) {
            threshold = threshold + rates[i];
            
            if (rates[i] == 0 || current_rate > threshold) {
                amount = amount + 1;
            }
        }
        
        return amount;
        
    }
    
    // Syllable filters 
    
    
    filterByClusterSizes(originalSyllableGroup, max = { consonants: 0, vowels : 0}) {
        return originalSyllableGroup.filter((currentSyllable) => this.getStartCluster(currentSyllable).vowels <= max.vowels && this.getStartCluster(currentSyllable).consonants <= max.consonants);
    }
    
    filterOffBanned(originalSyllableGroup, nameSoFar, nameHas, ban) {
        return originalSyllableGroup.filter((currentSyllable) => !(this.matchPattern(nameSoFar, nameHas) && this.matchPattern(currentSyllable, ban)));
    }
    
    filterOffLongSyllables(originalSyllableGroup, longSyllableThreshold) {
        return originalSyllableGroup.filter((c) => c.length < longSyllableThreshold);
    }
    
    filterOffShortSyllables(originalSyllableGroup, longSyllableThreshold) {
        return originalSyllableGroup.filter((c) => c.length >= longSyllableThreshold);
    }
    
    filterOffRepeats(originalSyllableGroup, nameSoFar, repeatRule) {
       return originalSyllableGroup.filter((c) => {
           let check = true;
           
           if (repeatRule.min > 0 && repeatRule.allowed >= 0) {
               
               let match = this.matchAmount(nameSoFar, c);
               let max = Number.isInteger(repeatRule.max) && repeatRule.max >= repeatRule.min ? true : Boolean(c.length <= repeatRule.max);
               
               
               if (c.length >= repeatRule.min && max && match >= repeatRule.allowed) {
                   check = false;
               }
           }
           
           return check;
           
       });
    } 
    
    
    fixedChartsAndRates(round, nameSoFar, originalSyllables, originalRates, allowLongSyllables = true, longSyllableThreshold = 4, mustHave = false) {
        
        let fixedOptions = { "syllables" : [], "rates" : [] };
        let endCluster = this.getEndCluster(nameSoFar);
        let max = { consonants : Math.max(0, this.libraryOptions.maxConsonants - endCluster.consonants), vowels : Math.max(0, this.libraryOptions.maxVowels - endCluster.vowels)};
        
        for (let i = 0; i < originalSyllables.length; i++) {
            let currentSyllableGroup = originalSyllables[i];
            
            if (!allowLongSyllables) {
                currentSyllableGroup = this.filterOffLongSyllables(currentSyllableGroup, longSyllableThreshold);
            } else if (mustHave) {
                currentSyllableGroup = this.filterOffShortSyllables(currentSyllableGroup, longSyllableThreshold);
            }
            
            if ( round > 0) {
                currentSyllableGroup = this.filterByClusterSizes(currentSyllableGroup, max);
                
                if (this.libraryOptions.bannedClusters.length) {
                    var clusters = this.libraryOptions.bannedClusters;
                    for (let b = 0; b < clusters.length; b++) {
                        currentSyllableGroup = this.filterOffBanned(currentSyllableGroup, nameSoFar, clusters[b].nameHas, clusters[b].ban);
                    }
                }
            
                if (this.libraryOptions.blockRepeats) {

                    if (Array.isArray(this.libraryOptions.blockRepeats)) {
                        for (var r = 0; r < this.libraryOptions.blockRepeats.length; r++) {
                            currentSyllableGroup = this.filterOffRepeats(currentSyllableGroup, nameSoFar, this.libraryOptions.blockRepeats[r]);
                        }
                    } else if (typeof this.libraryOptions.blockRepeats == "object") {
                        currentSyllableGroup = this.filterOffRepeats(currentSyllableGroup, nameSoFar, this.libraryOptions.blockRepeats);
                    } else {
                        if (this.debug) {
                            console.log("nameCrafter: blockRepeats given to library in non-traditional form.");
                        }
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
            lengthRates : [1,6,3],
            longSyllable : {
                threshold : 0,
                maximums : null,
                setLengths : null,
                forceLenghts : false
            },
            bannedClusters: [],
            replacements : [],
            blockRepeats : [],
            punctuation: []
            
        };
        
        prefixes = this.testTheSyllableCharts(prefixes, "prefix");
        middles = this.testTheSyllableCharts(middles, "middle");
        suffixes = this.testTheSyllableCharts(suffixes, "suffix");
        
        this.library[name.toString()] = {
            "prefix" : { syllables : prefixes, rates : this.setSyllableRates(prefixes)},
            "middle" : { syllables : middles, rates : this.setSyllableRates(middles)},
            "suffix" : { syllables : suffixes, rates : this.setSyllableRates(this.setSyllableRates(suffixes))},
            "options" : { ...this.defaultSetOptions, ...options }
        };
        
        this.library[name.toString()].options.bannedClusters.concat(this.libraryOptions.bannedClusters);
        this.library[name.toString()].options.replacements.concat(this.libraryOptions.replacements);
        this.library[name.toString()].options.punctuation.concat(this.libraryOptions.punctuation);
        this.library[name.toString()].options.blockRepeats.concat(this.libraryOptions.blockRepeats);
        
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
            nameLength = Math.round(exceptions.nameLength)-1;
        } else if (typeof exceptions.nameLength == "number" | !exceptions.nameLength) {
            nameLength = this.determineNumberFromRate(currentSet.options.lengthRates);
        } else if (typeof exceptions.nameLength == "object") {
            nameLength = this.determineNumberFromRate(exceptions.nameLength);
        } else {
            if (this.debug) {
                console.log("nameCrafter: nameLength given in wrong form. Check that you give the data either as integer or an array.");
            }
        }
        
        nameLength = Math.min(Math.max(nameLength, 0), this.safetySettings.maxSyllables);
        
        let findLongSyllables = [];
        let longSyllable = exceptions.longSyllable ? {...currentSet.options.longSyllable, ...exceptions.longSyllable } : currentSet.options.longSyllable;
        
        if (longSyllable.setLengths && longSyllable.setLengths[nameLength]) {
            
            findLongSyllables = longSyllable.setLengths[nameLength];
            
            if (findLongSyllables.length-1 < nameLength) {
                for (let f = findLongSyllables.length-1; f <= nameLength; f++) {
                    findLongSyllables.push(false);
                }
            } else if (findLongSyllables.length-1 > nameLength) {
                findLongSyllables = findLongSyllables.filter((c,i) => i <= nameLength);
            }
            
        } else {
        
            let maximum = longSyllable.maximums != null && Number.isInteger(parseInt(longSyllable.maximums[nameLength])) ? parseInt(longSyllable.maximums[nameLength]) : nameLength;

            for (let l = 0; l <= nameLength; l++) {
                if (longSyllable.threshold < 2) {
                    findLongSyllables.push(true);
                } else if (longSyllable.maximums.length < nameLength+1 || maximum < 1) {   
                    findLongSyllables.push(false);
                } else {
                    findLongSyllables.push(true);
                    maximum--;
                }
            }
        }
        
        if (this.debug) {
            console.log("nameCrafter: " + nameLength + " syllables.");
        }
        
        
        let nameData = { "name": "", "originalSyllables": [] };
        
        for (let i = 0; i <= nameLength; i++) {
            
            if (this.debug) {
                let t = i+1;
                console.log("nameCrafter: Determining syllable " + t );
            }
            
            let currentOptions;
            
            if (i == 0) {
                currentOptions = currentSet.prefix;
            } else if (i == nameLength) {
                currentOptions = currentSet.suffix;
            } else {
                currentOptions = currentSet.middle;
            }
            
            
            if ( i > 0 || !findLongSyllables[i] || longSyllable.forceLenghts) {
                currentOptions = this.fixedChartsAndRates(i, nameData.name, currentOptions.syllables, currentOptions.rates, findLongSyllables[i], longSyllable.threshold, longSyllable.forceLenghts);
            }
            
            let rarityGroup = currentOptions.syllables[this.determineNumberFromRate(currentOptions.rates)];
            let syllable = "";
               
            if (rarityGroup) {
                syllable = rarityGroup[this.randomize(0,rarityGroup.length-1)];
            } else if (this.debug) {
                console.log("nameCrafter: One syllable skipped, there was no fitting syllables in the current circumstance.");
            }
            
            if (this.libraryOptions.punctuation.length) {
                for (let p = 0; p < this.libraryOptions.punctuation.length; p++) {
                    let punctuation = this.libraryOptions.punctuation[p];
                    if (this.matchPattern(nameData.name, punctuation.nameHas)) {
                        if (this.matchPattern(syllable, punctuation.ifWith)) {
                            nameData.name += punctuation.addBetween;
                            nameData.originalSyllables.push(punctuation.addBetween);
                        }
                    }
                }
            }
            
            
            nameData.name += syllable.trim();
            nameData.originalSyllables.push(syllable);
            
            if (syllable.length <= longSyllable.threshold && i < nameLength && findLongSyllables[i] && !longSyllable.forceLenghts) {
                
                let maximum = 1;
                
                for (let f = i+1; f <= nameLength; f++) {
                    if (findLongSyllables[f] == false && maximum > 0) {
                        findLongSyllables[f] = true;
                        maximum--;
                    }
                }
            }
            
            if (this.debug) {
                console.log("nameCrafter: chose syllable: " + syllable );
            }
        }
        
        if (this.libraryOptions.replacements.length) {
            let replacements = this.libraryOptions.replacements;
            
            if (this.debug) {
                console.log("nameCrafter: checking name for replacables.");
            }
        
            for (let r = 0; r < replacements.length; r++) {
                if (this.matchPattern(nameData.name, replacements[r].nameHas)) {
                    for (let [which, what] of Object.entries(replacements[r].replace)) {
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
            nameData.originalSyllables.push(postposition);
            nameData.name += postposition;
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