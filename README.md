## nameCrafter ##########################

    That name generator that constructs names from given syllable lists.

## Introduction #########################

    So, has anyone else had that problem that you are trying to play a TTRPG with your buddies or maybe you are writing
    some stuff and while just doing your thing you suddenly need to name a character. Sometimes it's an easy task, but 
    other times... You got nothing. 
    
    Just me? Well, did you relate to it or not, this can actually get tricky, trust me.
    
    If you are after a real-life name, you are in luck: there is plenty of lists and generators spitting out exsisting, 
    real-life names. However, once you get to the names of fantastic variety, there is less options, and many of them 
    start to repeat themselves very fast. 
    
    So I stumbled of a drow name generation method in https://www.dnd.kismetrose.com/DrowNameGenerator.html, which uses
    syllables or small parts of names, to create full names - this is fantastic, because it means larger variety of 
    names, that at the same time have a consistant style and sound. But the issue with just randomizing syllables that
    you will end up with some that just don't fit to getter - triples of the the same consonant, odd character clusters
    that are unpronouncable etc... 
    
    But what if we could check for that? What if we could check that the syllables/parts fit together before putting 
    them together?
    
    That is where nameCrafter comes in!
    
    The nameCrafter is nifty lil'Javascript plugin, which you can feed clusters of syllables, which it analyses with 
    parameters given to it to figure out if you'd like there parts/syllables go together: as a result, it generetas lot 
    more names that make somesort of names, actually. Or that is the goal, atleast. 
    
    Was this a problem that really needed solving? You decide! But never the less, here it is!

## Updates ###############################

    09.06.2024 - First Git commit. Things ain't quite functioning right yet, but I'll be fixing it shortly. The 
    banned_clusters still working unexpectedly, sometimes causing unwanted syllable pairings.
    
## Updates ###############################