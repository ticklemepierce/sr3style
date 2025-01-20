# SR 3 Style

Leverage the power of spaced repetition to learn 3-Style!

## Terminology

`card` - Returned from FSRS
`log` - Returned from FSRS
`recordLogItem` - object consisting of card and (optional) log
`setType` - i.e. Edges, Corners, +centers, parity
`set` - the main grouping. For a letter pair driven setType, this will be equivalent to the first letter in the pair. For another setType, such as parity, it will be equivalent to the corresponding letter.
`subSet` - sub grouping. For a letter pair driven setType, this will be equivalent to the second letter in the pair.
`caseId` - since not all setTypes have letterPairs, we think of it as a `case` - however this is a reserved word, hence `caseId`
`learningCase` - entity for a user-setType-caseId
`recordLogItemMap` - object consisting of `case` with value of `recordLogItem`
