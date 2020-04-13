<template>
  <v-app>
          <v-system-bar app window style="-webkit-app-region: drag;" :color="$vuetify.breakpoint.xsOnly ? 'transparent' : 'blue darken-4'" class="hidden-print-only">
        <v-fade-transition group leave-absolute>
          <div key="logo" v-if="!$root.notify.is" style="display: inline-flex !important;">
            <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
            <span style="margin-right: 4px">Write</span>
            <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span>
          </div>
          <span key="notification" v-if="$root.notify.is">{{ $root.notify.text }}</span>
        </v-fade-transition>
        <v-spacer></v-spacer>
        <input type="text" v-model="$root.file.title" placeholder="Untitled document" class="title-bar hidden-xs-only" style="-webkit-app-region: no-drag;">
        <v-spacer></v-spacer>
        <div style="-webkit-app-region: no-drag;">
          <v-icon @click="minimize()" v-ripple class="toolbar-icon">mdi-minus</v-icon>
          <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="toolbar-icon">mdi-crop-square</v-icon>
          <v-icon @click="close()" v-ripple class="toolbar-icon">mdi-close</v-icon>
        </div>
      </v-system-bar>

    <v-content>
      <Editor/>
    </v-content>
  </v-app>
</template>

<script>
import Editor from './components/Editor'

export default {
  name: 'App',
  components: {
    Editor,
  },
  data() {
    return {

    }
  }
}
</script>

<style>
/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px;}
::-webkit-scrollbar-track { background: rgb(33, 33, 33); }
::-webkit-scrollbar-thumb { background: rgb(100, 100, 100); }
::-webkit-scrollbar-thumb:hover { background: rgb(60, 60, 60); }
::-webkit-scrollbar-corner { background: rgb(33, 33, 33); }

html {
  overflow-y: auto !important;
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

input { outline: none; }
input.title-bar { width: auto; }

.title-bar {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

</style>