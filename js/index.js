/**** Photo-Sphere-Viewer ****/
viewer = new PhotoSphereViewer({
  container: 'photosphere',
  panorama: 'images/beach.png',
  navbar: [
    'zoom',
    'markers',
    {
      id: 'my-button',
      title: 'Hello world',
      className: 'custom-button',
      content: 'Custom',
      onClick: function() {
       alert('Hello from custom button');
      }
    },
    'caption',
    'fullscreen'
  ],
  default_long: 0
});

/**** Omnitone Code ****/
// Set up an audio element to feed the ambisonic source audio feed.
var audioElement = document.createElement('audio');
audioElement.src = 'audio/AmbisonicSeaside.wav';
audioElement.loop = true;

// Create AudioContext, MediaElementSourceNode and FOARenderer.
var audioContext = new AudioContext();
var audioElementSource =
    audioContext.createMediaElementSource(audioElement);
var foaRenderer = Omnitone.createFOARenderer(audioContext, {
    HRIRUrl: 'HRTFs/sh_hrir_o_1.wav'
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
