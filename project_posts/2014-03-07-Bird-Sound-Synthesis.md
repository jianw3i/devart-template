# 6. Birdcall Synthesis


We decided to implement the birdcall synthesis technique described here [Start from Birdcall synthesis - Obiwannab](http://obiwannabe.co.uk/tutorials/html/tutorial_birds.html) to provide the sound for the birds/emotions being displayed on the canvas as well as the emopad. The technique defined by Obiwannab models the physiological structure of a bird's throat to design a synthesis structure which affects sound similarly.

A parametric synthesis approach also allows for the sound to be changed during an interaction without needing to have large varieties of source sounds or complicated audio processing.

## Platform.
First the platform. The Web technology platform seemed a like a natural choice here. Joshua has worked a lot with WebGL and GPU rendering on the browser, and has a lot of experience. The WebAudioAPI is a very capable low latency, audio platform, which can support audio synthesis. Using the WebAudioAPI would give us a chance to explore a new set of emotions ourselves. Also the web platforms is portable and allows easy extension in the future.

The WebAudioAPI defines a small set of primitives, and lets you connect them in multiple ways to create your own audio processing graph. User interaction can be used to change the parameters of these primitives.

The original work was done in Pure Data, so we need to move it to the WebAudioAPI

## AM
Amplitude Modulation (AM) is a very common primitive used in audio synthesis. This is easily implemented in the WebAudioAPI by modulating the `gain` property of the Gain Node.


## FM
Frequency Modulation (FM) is another very common primitive usually used to generate richer sounds. The WebAudioAPI supports the by letting the `frequency` property of an Oscillator Node be adjusted by the output of another Oscillator Node.

## Envelopes
Envelopes are typically used to adjust the parameters (like `gain`) of other primitives. They model the rise and fall in pitches and volumes of natural sounds.

Using a combination of AM and FM and Envelopes as defined by Obiwannab, we implemented a similar structure using the WebAudioAPI.

## Presets
The various parameters defined by Obiwannab mimic the sounds of different birds. While the parameters need to be tweaked in the WebAudioAPI structure, they give a great ball park of what would sound good.
