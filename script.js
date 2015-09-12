// Variables for `touchAndDrag` and `clickAndDrag`
var initialTouch, previousTouch, origValue, recursive,
	axis = 'pageY',
	totalFrames = 45, imgWidth = 200,
	targetObj = document.querySelector('#gatoHolder'),
	targetRender = document.querySelector('#gato'),
	spans = document.querySelectorAll('#gato span'),
	logo = document.querySelector('#gatoLogo'),
	offsetTop = targetObj.getBoundingClientRect().top;

var isMobile = false;
if(true){
// if(typeof window.orientation !== 'undefined'){
	isMobile = true;
	console.log('touchAndDragToExpand');
	touchAndDragToExpand(targetObj); 
}
else {
	console.log('clickAndDrag');

	clickAndDrag(targetObj);
}
document.querySelector('#hell').innerHTML = typeof window.orientation;

function clickAndDrag(targetObj) {
	targetObj.addEventListener('mousedown', function(event){ 
		recursive = false;
		initalBannerContact(event);
		if(targetObj.setCapture) 
			targetObj.setCapture();

		targetObj.addEventListener('mousemove', bannerIsDragged);
		targetObj.addEventListener('mouseup', mouseUpHandler);
		targetObj.addEventListener('mouseleave', mouseUpHandler);
	});

	function mouseUpHandler(event) {
		bannerContactEnd(event);
		if(document.releaseCapture) { document.releaseCapture(); }

		targetObj.removeEventListener('mousemove', bannerIsDragged);
		targetObj.removeEventListener('mouseup', mouseUpHandler);
	}
}



function touchAndDragToExpand(targetObj) {
	targetObj.addEventListener('touchstart', tryme);
	targetObj.addEventListener('touchmove', bannerIsDragged);
	targetObj.addEventListener('touchend', bannerContactEnd);
}

var v = 0;
function tryme(event) {
	initalBannerContact(event);
}

function initalBannerContact(event){ 
	// initialTouch = RPNS.device.mobile ? event.changedTouches[0][axis] : event[axis];
	console.log(event.changedTouches[0]);
	console.log(event.changedTouches[0][axis] );
	initialTouch = isMobile ? event.changedTouches[0][axis] : event[axis];
	previousTouch = initialTouch;

	origValue = parseInt(targetRender.style.backgroundPositionX) || 0;


	event.preventDefault();
	event.stopPropagation();
}

function bannerIsDragged(event){ 
	// var currentTouch = RPNS.device.mobile ? event.changedTouches[0][axis] : event[axis];
	var currentTouch = isMobile ? event.changedTouches[0][axis] : event[axis];
	var displacement = -parseInt((currentTouch - initialTouch) * totalFrames/130); //denominator is scale in pixels

	var newValue = Math.abs(origValue/imgWidth) + displacement;
	newValue = newValue >= totalFrames ? totalFrames - 1 : newValue < 0 ? 0 : newValue;
	targetRender.style.backgroundPositionX = -newValue*imgWidth + 'px';

	var spanOpacity = newValue == 0 ? 1 : newValue >= 12 ? 0 : (100 * 11 / newValue) / 1100;
	spans[0].style.opacity = spanOpacity;
	spans[1].style.opacity = spanOpacity;
	spans[2].style.opacity = spanOpacity;

	var bgOpacity = newValue <= 19 ? 1 : newValue >= 44 ? 0 : 1 - ((newValue - 19) * (1/26));
	targetObj.style.backgroundColor = 'rgba(0, 0, 0, ' + bgOpacity + ')';
	logo.style.opacity =  1 - bgOpacity ;

	console.log(1 - bgOpacity);

	previousTouch = currentTouch;
}

function bannerContactEnd(){ 
	var elem = targetObj,
		property = 'backgroundPositionX',
		origVal  = parseInt(targetRender.style.backgroundPositionX),
		finalVal = 0,
		duration =  Math.abs(origVal) * 0.25, // in milliseconds
		unitOfMeasurement =  'px';
    var start = new Date().getTime();


	function easeOut(t, d){
	  return 1 - Math.pow(1 - (t / d), 2.5);
	}

	function easeIn(t, d){
	  return Math.pow(t / d, 5);
	}

	recursive = true;

	function step(timestamp) {
        var now = new Date().getTime();
        var ellapsed = now - start;
        var factor = easeOut(ellapsed, duration);
        var diff = (parseInt((finalVal - origVal) * factor/imgWidth) * imgWidth);
        var newVal = origVal + diff;
        targetRender.style[property] = newVal + unitOfMeasurement;

        var frame = Math.abs(newVal/200);
		var spanOpacity = frame >= 8 ? 0 : frame == 0 ? 1 : (100 * 7 / frame) / 700;
		spans[0].style.opacity = spanOpacity;
		spans[1].style.opacity = spanOpacity;
		spans[2].style.opacity = spanOpacity;

		var bgOpacity = frame <= 19 ? 1 : frame >= 44 ? 0 : 1 - ((frame - 19) * (1/26));
		targetObj.style.backgroundColor = 'rgba(0, 0, 0, ' + bgOpacity + ')';
		logo.style.opacity =  1 - bgOpacity ;


	  if (recursive && ellapsed < duration ){ 
	    window.requestAnimationFrame(step);
	  }
	}
	window.requestAnimationFrame(step);





}
