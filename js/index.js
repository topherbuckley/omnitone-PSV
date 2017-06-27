/**** Photo-Sphere-Viewer ****/
viewer = new PhotoSphereViewer({
  container: 'photosphere',
  panorama: 'https://raw.githubusercontent.com/topherbuckley/omnitone-PSV/master/images/beach.png',
  navbar: [
    'zoom',
    'caption',
    'fullscreen'
  ],
  default_long: 0
});

/**** Omnitone Code ****/
// Set up an audio element to feed the ambisonic source audio feed.
var audioElement = document.createElement('audio');
audioElement.src = 'https://raw.githubusercontent.com/topherbuckley/omnitone-PSV/master/audio/AmbisonicSeasideFull.wav';
audioElement.loop = true;

// Create AudioContext, MediaElementSourceNode and FOARenderer.
var audioContext = new AudioContext();
var audioElementSource =
    audioContext.createMediaElementSource(audioElement);
var foaRenderer = Omnitone.createFOARenderer(audioContext, {
    HRIRUrl: 'https://raw.githubusercontent.com/topherbuckley/omnitone-PSV/master/HRTFs/sh_hrir_o_1.wav'
  });

// Make connection and start play.
foaRenderer.initialize().then(function () {
    audioElementSource.connect(foaRenderer.input);
    foaRenderer.output.connect(audioContext.destination);
    audioElement.play();
  });

viewer.on('ready', function() {
  var camera = viewer.camera;
  // Rotate the sound field by passing Three.js camera object. (4x4 matrix)
  foaRenderer.setRotationMatrixFromCamera(camera.matrix);
  // foaDecoder.setRotationMatrixFromCamera(camera.matrix);
});

viewer.on('render', function() {
  foaRenderer.setRotationMatrixFromCamera(viewer.camera.matrix)
});
