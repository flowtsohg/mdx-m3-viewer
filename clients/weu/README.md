This client is used to recover old maps that were created in 3rd party World Editor applications, such as World Editor Unlimited (hence WEU).
These 3rd party editors add custom GUI events, conditions, and actions, which cannot be read by the vanila editor, and cause it to crash.
Since such 3rd party editors are more or less dead nowadays, it means maps made with them are no longer editable.
The weu utility code is used to look for and convert such things back to vanila, when possible, using multiple different tricks.
Incidently, it can also mostly convert maps made with the Chinese YDWE editor back to something vanila can read (most likely some manual user actions needed, based on the maps).
When given a campaign, this conversion will run for every map in it.
NOTE: for technical reasons, this only works for TFT maps, aka W3X files.
