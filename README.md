# PreferenceTest

## Simple explanation of this opensource

1. Create wav directory like the below example.

```
wav/
 |---- set1/
 |      |-- method1/
 |      |    |-- utt_id1.wav
 |      |    |-- utt_id2.wav
 |      |-- method2/
 |      |    |-- utt_id1.wav
 |      |    |-- utt_id2.wav
 |      |-- sample.list
 |
 |---- set2
 |      |--
 ```
 The command ```find wav/set1 -name "*.wav" | grep "method1" > wav/set1/method1.list``` will be helpful to create list files.

2. Customize preference.js depending on the structure of the wav directory. It's simple, and not a difficult code.

3. Customize index.html as you like.

4. Use some server you can deploy this code. If you are not familiar with this kind of thing, Github Pages would be easy to use.

5. If subjects finish the test, a csv file is automatically emitted.

