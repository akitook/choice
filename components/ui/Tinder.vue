var card = Vue.component('card', {
props: {
current: {
type: Boolean,
required: true
},
fullName: {
type: String,
required: true
},
picture: {
type: String,
required: false
},
rating: {
type: Number,
required: true
},
approved: {
type: Boolean
}
},
template: `
<div v-if="showing" class="card"
     v-bind:class="{ animated: animating, current: current }"
     v-bind:style="{ transform: returnTransformString }">
  <div class="image"
       v-bind:style="{ backgroundImage: returnImageString }">
    <div class="image-icon"
         v-bind:class="icon.type"
         v-bind:style="{ opacity: icon.opacity }">
    </div>
  </div>
  <h1 class="name">{{ fullName }}</h1>
  <div class="stars">
    <div v-for="(star, index) in maxStars"
         v-bind:class="[(rating > index) ? 'star-active' : 'star-inactive']">
    </div>
  </div>
</div>
`,
data: function() {
return {
showing: true,
maxStars: 5,
animating: true, // Controls CSS class with transition declaration
threshold: window.innerWidth / 3, // Breakpoint distance to approve/reject a card
maxRotation: 20, // Max rotation value in degrees
position: {
x: 0,
y: 0,
rotation: 0
},
icon: {
opacity: 0,
type: null
}
};
},
computed: {
returnImageString: function() {

return 'url(' + this.picture + ')';

},
returnTransformString: function() {

if (this.animating === false || this.approved !== null) {
const x = this.position.x;
const y = this.position.y;
const rotate = this.position.rotation;
return 'translate3D(' + x + 'px, ' + y + 'px, 0) rotate(' + rotate + 'deg)';
}
else {
return null;
}

}
},
mounted: function() {

const element = this.$el;
const self = this;

interact(element).draggable({
inertia: false,
onstart: function() {

/*
Disable CSS transitions during dragging.
*/

self.animating = false;

},
onmove: function(event) {

/*
Calculate new x and y coordinate values from the local value and
the event object value. Also adjust element rotation transformation
based on proximity to approve/reject threshold.
*/

const x = (self.position.x || 0) + event.dx;
const y = (self.position.y || 0) + event.dy;

let rotate = self.maxRotation * (x / self.threshold);

if (rotate > self.maxRotation) {
rotate = self.maxRotation;
}
else if (rotate < -self.maxRotation) {
rotate = -self.maxRotation;
}

self.position.x = x;
self.position.y = y;
self.position.rotation = rotate;

/*
Change icon image type based on drag direction and adjust opacity
from 0-1 based on current rotation amount. Also emit an event to
show/hide respective button below cards during dragging.
*/

if (rotate > 0) {
self.icon.type = 'approve';
}
else if (rotate < 0) {
self.icon.type = 'reject';
}

const opacityAmount = Math.abs(rotate) / self.maxRotation;

self.icon.opacity = opacityAmount;
self.$emit('draggedActive', self.icon.type, opacityAmount);

},
onend: function(event) {

/*
Check if card has passed the approve/reject threshold and emit approval
value change event, otherwise reset card and icon to default values.
*/

self.animating = true;

if (self.position.x > self.threshold) {
self.$emit('draggedThreshold', true);
self.icon.opacity = 1;
}
else if (self.position.x < -self.threshold) {
self.$emit('draggedThreshold', false);
self.icon.opacity = 1;
}
else {
self.position.x = 0;
self.position.y = 0;
self.position.rotation = 0;
self.icon.opacity = 0;
}

self.$emit('draggedEnded');

}

});

},
watch: {
approved: function() {

if (this.approved !== null) {

const self = this;

// Remove interact listener to prevent further dragging
interact(this.$el).unset();
this.animating = true;

/*
Move card off-screen in direction of approve/reject status,
then remove it from the DOM, thereby adjusting the CSS
nth-child selectors.
*/

const x = window.innerWidth + (window.innerWidth / 2) + this.$el.offsetWidth;

if (this.approved === true) {
this.position.x = x;
this.position.rotation = this.maxRotation;
this.icon.type = 'approve';
}
else if (this.approved === false) {
this.position.x = -x;
this.position.rotation = -this.maxRotation;
this.icon.type = 'reject';
}

this.icon.opacity = 1;

setTimeout(function() {
self.showing = false;
}, 200);

}

}
}
});

var app = new Vue({
el: '#app',
template: `
<div id="app">

  <div v-show="isLoading" class="loading">
    <div class="loading-icon"></div>
  </div>

  <div class="card-container">
    <card v-for="(card, index) in cards.data" :key="index"
          v-bind:current="index === cards.index"
          v-bind:fullName="card.name"
          v-bind:picture="card.picture"
          v-bind:rating="card.rating"
          v-bind:approved="card.approved"
          v-on:draggedThreshold="setApproval">
    </card>
  </div>

</div>
`,
data: {
isLoading: true, // Toggles the loading overlay
cards: {
data: null, // Array for card data
index: 0, // Current index in the cards.data array
max: 10 // Max cards to show in each stack
}
},
methods: {
getData: function() {

this.isLoading = true;
this.cards.data = null;
const self = this;

// Get a random list of people
const request = new XMLHttpRequest();
request.open('GET', 'https://randomuser.me/api/?results=' + this.cards.max, true);

request.onload = function() {

const response = JSON.parse(request.responseText).results;

const data = response.map(function(object) {

/*
Construct a new array with objects containing only
the relevent data from the original response data
*/

return {
name: object.name.first + ' ' + object.name.last,
picture: object.picture.large,
rating: Math.floor(Math.random() * 5 + 1),
approved: null
};

});

// Fake delay for purposes of demonstration
setTimeout(function() {
self.cards.data = data;
self.cards.index = 0;
self.isLoading = false;
}, 500);

};

request.send();

},
setApproval: function(approval) {

/*
Change approval value for current card, and request new data
if at the end of the card array
*/

this.cards.data[this.cards.index].approved = approval;
this.cards.index++;

if (this.cards.index >= this.cards.data.length) {
this.getData();
}

}

},
mounted: function() {

this.getData();

}
});
