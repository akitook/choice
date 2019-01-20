<template>
  <div class="loading">
    <div class="loading-icon" />
  </div>
</template>
<style lang="scss" scoped>
/* LOADING */

$loadingSize: 125px;

%loadingPosition {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -($loadingSize / 2);
  margin-top: -($loadingSize / 2);
}

%loadingBorder {
  width: $loadingSize;
  height: $loadingSize;
  border-radius: 50%;
  border: 4px solid $colour-white;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.loading > .loading-icon {
  width: $loadingSize;
  height: $loadingSize;
  @extend %loadingPosition;
}

.loading > .loading-icon:before,
.loading > .loading-icon:after {
  content: '';
  display: block;
  @extend %loadingPosition;
  @extend %loadingBorder;
}

.loading > .loading-icon:before {
  z-index: 0;
  animation: 1s pulse infinite linear;
}

.loading > .loading-icon:after {
  z-index: 10;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/617753/loading-default.jpg')
    center center no-repeat #ffffff;
  background-size: cover;
}

@-webkit-keyframes pulse {
  0% {
    opacity: 0;
    -webkit-transform: scale(0.8);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.5);
  }
}

@-moz-keyframes pulse {
  0% {
    opacity: 0;
    -moz-transform: scale(0.8);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -moz-transform: scale(1.5);
  }
}

@-ms-keyframes pulse {
  0% {
    opacity: 0;
    -ms-transform: scale(0.8);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -ms-transform: scale(1.5);
  }
}

@-o-keyframes pulse {
  0% {
    opacity: 0;
    -o-transform: scale(0.8);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -o-transform: scale(1.5);
  }
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
