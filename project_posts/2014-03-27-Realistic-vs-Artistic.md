# Realistic vs Artistic Approach

One of the biggest choices for rendering the canvas module was to decide whether to use a more realistiic or more abstract version of rendering.

##Realistic
The realistic approach is to add more realistic enviornment, for example mountians, oceans, and skies.
![rendering.png](../project_images/rendering.png "")

Also tried adding clouds and fogs.
![clouds_fogs](../project_images/clouds_fogs.png "")

Then started experimenting with NPR (Non Photo-realistic Rendering). Toon shading which didn't went to well.
![toon_processing](../project_images/toon_processing.png "")

Tried some grayscale / pencil / cross-hatching toning
![pencil_processing](../project_images/pencil_processing.png "")


##Abstract

Needed more time to try other NPR styles (eg. watercolor, painting), so opted to try some abstract styles instead.


Dark background
![dark](../project_images/dark.png "")

Light background
![white](../project_images/white.png "")

Motion Blur background
![dark](../project_images/motionblur_processing.png "")

The finalized approach uses a blended retained backbuffer for motion blur, multiplied with a original render colors.