<template>
  <v-app dark>
    <!-- System toolbar -->
    <v-system-bar app window style="-webkit-app-region: drag;" class="blue darken-4">
      <span class="font-weight-light grey--text lighten-4">Early-access beta</span>
      <v-spacer></v-spacer>
      <div class="centralize">
        <img src="./assets/logo.png" height="18" style="position: relative; top: +2px; margin-right: 5px;">
        <span>Write</span>
      </div>
      <v-spacer></v-spacer>
      <div style="-webkit-app-region: no-drag; position: relative; top: +1px;">
        <v-icon @click="minimize()" v-ripple class="toolbar-icon">mdi-minus</v-icon>
        <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="toolbar-icon">mdi-crop-square</v-icon>
        <v-icon @click="close()" v-ripple class="toolbar-icon">mdi-close</v-icon>
      </div>
    </v-system-bar>

		<!-- Site content -->
		<v-content>
			<Write />
		</v-content>

    <!-- Snackbar -->
		<v-snackbar v-model="$root.snackbar" bottom right :timeout="2000">{{ $root.feedback }}</v-snackbar>
  </v-app>
</template>

<script>
const remote = require('electron').remote
import Write from './components/Write'

export default {
	name: 'app',
	components: {
	  Write
	},
	data() {
		return {
			win: remote.getCurrentWindow(),
			maximized: remote.getCurrentWindow().isMaximized()
		}
	},
  methods: {
    close() {
      this.win.close()
    },
    maximize() {
      this.win.maximize()
      this.maximized = remote.getCurrentWindow().isMaximized()
    },
    unmaximize() {
      this.win.unmaximize()
      this.maximized = remote.getCurrentWindow().isMaximized()
    },
    minimize() {
      this.win.minimize()
    },
    reload() {
      location.reload()
    },
    goBack() {
      this.win.webContents.goBack()
    },
    goForward() {
      this.win.webContents.goForward()
    },
  }
}
</script>

<style>
/* Scrollbar */

/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(33, 33, 33);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(100, 100, 100);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(60, 60, 60);
}

html {
  overflow-y: auto !important;
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.toolbar-icon {
  border-radius: 100px;
}

.centralize {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}
</style>
