# nameCrafter

Welcome to nameCrafter, that name generator that constructs names from given syllable lists. Fun! If you wish to test it out, grab the javascript file from the plugin folder and see the index.html for more in-depth setup-instructions! The nameCrafter is pure javascript, it doesn't require any other library to function.

But what is this nameCrafter exactly? To get the basic premise and how it works, scroll down to find out!

## Updates

15.06.2024 - slimmed down and made the original funtion that finds the possible syllables to join lot more effective, and added possibility to define what counts as a long syllable, and how many long syllables can be in a single name. 

12.06.2024 - banned_cluster bug fixed and making sure all the starting features I wished to have here are functional. There is a wishlist of things I want to add and make better over time, but 1.0 should now be usable anmd public!  

09.06.2024 - First Git commit. Things ain't quite functioning right yet, but I'll be fixing it shortly. The banned_clusters still working unexpectedly, sometimes causing unwanted syllable pairings.

## Introduction, or how this project came to be and why

So, has anyone else had that problem that you are trying to play a TTRPG with your buddies or maybe you are writing some stuff and while just doing your thing you suddenly need to name a character. Sometimes it's an easy task, but other times... You got nothing. 
    
Just me? Well, did you relate to it or not, this can actually get tricky, trust me.
    
If you are after a real-life name, you are in luck: there is plenty of lists and generators spitting out exsisting,  real-life names. However, once you get to the names of fantastic variety, there is less options, and many of them  start to repeat themselves very fast. 
    
So I stumbled of a drow name generation method in https://www.dnd.kismetrose.com/DrowNameGenerator.html, which uses syllables or small parts of names, to create full names - this is fantastic, because it means larger variety of names, that at the same time have a consistant style and sound. But the issue with just randomizing syllables that you will end up with some that just don't fit to getter - triples of the the same consonant, odd character clusters that are unpronouncable etc... 
    
But what if we could check for that? What if we could check that the syllables/parts fit together before putting them together?
    
That is where nameCrafter comes in!
    
The nameCrafter is nifty lil'Javascript plugin, which you can feed clusters of syllables, which it analyses with parameters given to it to figure out if you'd like there parts/syllables go together: as a result, it generetas lot more names that make somesort of names, actually. Or that is the goal, atleast. 
    
Was this a problem that really needed solving? You decide! But never the less, here it is!
    
## So, how does it work?

The purpose of nameCrafter is to give tools to control how you make up strings that can then used as fancy names for your next RPG PC, story character or your favorite plush toy. For this it uses syllable-lists that you can build and maintain yourself to make more delightfully surprising name results. 

To be clear though, while I use the syllable-word in context of nameCrafter, I do not nesseserally mean syllables in the most literal, linguistic sense. You can use literal syllables, but more predictable and controlled results and to  make the code run more smoothly as this can get pretty heavy, you might actually prefer using more like often occuring character clusters you wish to see in your names, which can be anything from single character, to multiple syllables and small words. Like ending "-ana" doesn't nessesary count as single syllble in linguistic sense, but you could use it as one in purpose of making a generator.

Syllables are divided on 3 groups, prefixes that start words, suffixes that end words and middles which, you guessed it, appaer in the middle of the word. Each name generated this way will atleast have a prefix if it has just one part/syllable, prefix and a suffix if it has 2 parts/syllables and it will start to have middles if the name has 3+ parts/syllables. The code will first generate prefix, and based on rules given to the generator, it will determine which syllables out of following middle or suffix charts can appear after that, and then the code picks one of those to continue the string and so on and so forth. You can also determine "replaceables", characters and character clusters which will be tweaked after the full name is done to more trickier situations, like when trying to build names with vowel harmony with limited  options and so on. These things are detected with. 

Do note thought, tools are here to help you, but remember that the more larger you build your names and more complex you make things, heavier the code is to run and more unpredictable and chaotic the results are - so when doing your syllable-lists, be mindful, be creative, try to build more appealing syllable patterns that are easier to get good results with, and use nameCrafter to just smooth the edges. 

Further setup details, check the index.html for setup info and a little demo.

## Planned/Dream features to add when possible

- Adding more flexibility on the prepositions and postpotions 
- Ability to generate compound names with flexible ways to join them together
- Adding puhnctuations in middle of names based on chosen criteria
- Making things lighter. Always making things lighter to run, if possible.

### Thanks for reading, have fun, and keep crafting!