<template>
  <v-app>
    <div v-if="!loading_screen">
      <!-- System toolbar -->
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
        <input type="text" v-model="data.title" placeholder="Untitled document" class="doc-title centralize hidden-xs-only" style="-webkit-app-region: no-drag;">
        <v-spacer></v-spacer>
        <div style="-webkit-app-region: no-drag;">
          <v-icon @click="minimize()" v-ripple class="toolbar-icon">mdi-minus</v-icon>
          <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="toolbar-icon">mdi-crop-square</v-icon>
          <v-icon @click="close()" v-ripple class="toolbar-icon">mdi-close</v-icon>
        </div>
      </v-system-bar>

      <v-content class="hidden-sm-and-up">
        <div style="text-align: center; margin: 100px 0px;">
          <h1 class="display-3 red--text font-weight-bold text-uppercase">:(</h1>
          <h6 class="headline white--text font-weight-thin mt-10">Write does not work on screens this small.</h6>
          <p class="subtitle-1 mt-4 font-weight-light">Try increasing your screen resolution.</p>
        </div>
      </v-content>

      <!-- Site content -->
      <v-content class="hidden-xs-only">
        <!-- <v-toolbar color="blue darken-4" dense ref="toolbar" class="hidden-print-only">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon><v-icon>mdi-format-text-variant</v-icon></v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="data.blocks.push({ type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, rows: 3 })">
                <v-list-item-title><v-icon>mdi-format-paragraph</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 1, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-1</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 2, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-2</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 3, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-3</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 4, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-4</v-icon></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon><v-icon>mdi-menu</v-icon></v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="data.blocks.push({ type: 'nl', list: ['', '', ''], index: data.blocks.length })">
                <v-list-item-title><v-icon>mdi-menu</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'ul', list: ['', '', ''], index: data.blocks.length })">
                <v-list-item-title><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'ol', list: ['', '', ''], index: data.blocks.length })">
                <v-list-item-title><v-icon>mdi-format-list-numbered</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'cl', list: ['', '', ''], index: data.blocks.length })">
                <v-list-item-title><v-icon>mdi-format-list-checkbox</v-icon></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon @click="data.blocks.push({ type: 'image', src: '', alt: '', src_saved: false, index: data.blocks.length })"><v-icon>mdi-image</v-icon></v-btn>
          <v-btn icon @click="data.blocks.push({ type: 'divider', index: data.blocks.length })"><v-icon>mdi-minus</v-icon></v-btn>
          <v-btn icon @click="data.blocks.push({ type: 'code', index: data.blocks.length })"><v-icon>mdi-code-tags</v-icon></v-btn>
          <v-btn icon @click="data.blocks.push({ type: 'embed', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-web</v-icon></v-btn>
          <v-btn icon @click="data.blocks.push({ type: 'html', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-language-html5</v-icon></v-btn>
          <v-btn icon @click="data.blocks.push({ type: 'quote', content: '', author: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-format-quote-close</v-icon></v-btn>
          <v-btn icon @click="data.blocks.push({ type: 'gap', index: data.blocks.length })"><v-icon>mdi-arrow-expand-vertical</v-icon></v-btn>
          <v-divider inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-divider vertical inset v-if="current_block.type == 'text' || current_block.type == 'header'"></v-divider>
          <div v-if="current_block.type == 'text' || current_block.type == 'header'">
            <v-btn icon @click="data.blocks[current_block.index].format.b = !data.blocks[current_block.index].format.b" v-model="data.blocks[current_block.index].format.b">
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>
            <v-btn icon @click="data.blocks[current_block.index].format.i = !data.blocks[current_block.index].format.i" v-model="data.blocks[current_block.index].format.i">
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>
            <v-btn icon @click="data.blocks[current_block.index].format.ul = !data.blocks[current_block.index].format.ul" v-model="data.blocks[current_block.index].format.ul">
              <v-icon>mdi-format-underline</v-icon>
            </v-btn>
            <v-btn icon @click="data.blocks[current_block.index].format.ol = !data.blocks[current_block.index].format.ol" v-model="data.blocks[current_block.index].format.ol">
              <v-icon>mdi-format-overline</v-icon>
            </v-btn>
            <v-btn icon @click="data.blocks[current_block.index].format.str = !data.blocks[current_block.index].format.str" v-model="data.blocks[current_block.index].format.str">
              <v-icon>mdi-format-strikethrough</v-icon>
            </v-btn>
          </div>
          <v-menu :close-on-content-click="false" offset-y v-if="current_block.type == 'text' || current_block.type == 'header'">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon v-if="current_block.type == 'text' || current_block.type == 'header'"><v-icon>mdi-format-align-{{ data.blocks[current_block.index].format.align }}</v-icon></v-btn>
            </template>
            <v-list dense>
              <v-list-item-group v-model="data.blocks[current_block.index].format.align">
                <v-list-item value="left">
                  <v-list-item-title><v-icon>mdi-format-align-left</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="center">
                  <v-list-item-title><v-icon>mdi-format-align-center</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="right">
                  <v-list-item-title><v-icon>mdi-format-align-right</v-icon></v-list-item-title>
                </v-list-item>
              </v-list-item-group>

              <v-list-item-group v-model="data.blocks[current_block.index].format.just">
                <v-list-item value="top">
                  <v-list-item-title><v-icon>mdi-format-align-top</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="middle">
                  <v-list-item-title><v-icon>mdi-format-align-middle</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="bottom">
                  <v-list-item-title><v-icon>mdi-format-align-bottom</v-icon></v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
          <v-menu offset-y v-if="current_block.type == 'text' || current_block.type == 'header'">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon v-if="current_block.type == 'text' || current_block.type == 'header'"><v-icon>mdi-format-font</v-icon></v-btn>
            </template>
            <v-list dense>
              <v-list-item-group  v-model="data.blocks[current_block.index].format.font">
                <v-list-item value="Roboto">
                  <v-list-item-title style="font-family: 'Roboto'"><v-list-item-title>Sans-serif</v-list-item-title></v-list-item-title>
                </v-list-item>

                <v-list-item value="Roboto Slab">
                  <v-list-item-title style="font-family: 'Roboto Slab'"><v-list-item-title>Serif</v-list-item-title></v-list-item-title>
                </v-list-item>

                <v-list-item value="Roboto Mono">
                  <v-list-item-title style="font-family: 'Roboto Mono'"><v-list-item-title>Monospace</v-list-item-title></v-list-item-title>
                </v-list-item>

                <v-list-item value="Roboto Condensed">
                  <v-list-item-title style="font-family: 'Roboto Condensed'"><v-list-item-title>Condensed</v-list-item-title></v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
          <v-menu :close-on-content-click="false" offset-y v-if="current_block.type == 'text' || current_block.type == 'header'">
            <template v-slot:activator="{ on }">
              <v-btn :style="{ 'color': data.blocks[current_block.index].format.color }" v-on="on" icon v-if="current_block.type == 'text' || current_block.type == 'header'"><v-icon>mdi-format-color-fill</v-icon></v-btn>
            </template>
            <v-color-picker show-swatches mode="hexa" style="background-color: #2E2E2E;" v-model="data.blocks[current_block.index].format.color"></v-color-picker>
          </v-menu>
          <v-btn icon @click="clearFormat(current_block.index)" v-if="current_block.type == 'text' || current_block.type == 'header'"><v-icon>mdi-format-clear</v-icon></v-btn>
        </v-toolbar> -->

        <v-toolbar color="blue darken-4" dense ref="tabs" class="hidden-print-only elevation-0" style="z-index: 3">
          <v-tabs show-arrows color="grey lighten-1" v-model="tab" background-color="transparent">
            <v-tab>File</v-tab>
            <v-tab>Format</v-tab>
            <v-tab>Insert</v-tab>
            <v-tab>Layout</v-tab>
            <v-tab>Review</v-tab>
            <v-tab>Settings</v-tab>
            <v-tab>Help</v-tab>
            <v-tabs-slider></v-tabs-slider>
          </v-tabs>
        </v-toolbar>

        <v-toolbar dense ref="toolbar" class="hidden-print-only">
          <v-tabs-items class="transparent" style="width: 100%;" v-model="tab">
            <v-tab-item>
              <v-btn text large @click="saveDocument()"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
              <v-btn text large @click="newDocument()"><v-icon left>mdi-file-document-box-plus</v-icon>New</v-btn>
              <v-btn text large @click="open_dialog = true"><v-icon left>mdi-folder-open</v-icon>Open</v-btn>
              <v-btn text large @click="print_dialog = true"><v-icon left>mdi-printer</v-icon>Print</v-btn>
            </v-tab-item>

            <v-tab-item>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn text icon v-on="on"><v-icon>mdi-history</v-icon></v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="document.execCommand('undo')">
                    <v-list-item-icon><v-icon>mdi-undo</v-icon></v-list-item-icon>
                    <v-list-item-title>Undo</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="document.execCommand('redo')">
                    <v-list-item-icon><v-icon>mdi-redo</v-icon></v-list-item-icon>
                    <v-list-item-title>Redo</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn text icon v-on="on"><v-icon>mdi-clipboard-outline</v-icon></v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="document.execCommand('cut')">
                    <v-list-item-icon><v-icon>mdi-content-cut</v-icon></v-list-item-icon>
                    <v-list-item-title>Cut</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="document.execCommand('copy')">
                    <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
                    <v-list-item-title>Copy</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="document.execCommand('paste')">
                    <v-list-item-icon><v-icon>mdi-content-paste</v-icon></v-list-item-icon>
                    <v-list-item-title>Paste</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-divider inset vertical></v-divider>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn :disabled="!blockText" v-on="on" text large><v-icon left>mdi-format-font</v-icon>{{ blockText ? data.blocks[current_block.index].format.font : 'Roboto' }}</v-btn>
                </template>
                <!-- <v-subheader>Font</v-subheader> -->
                <v-list dense>
                  <v-list-item-group v-model="modelFont">
                    <v-list-item value="Roboto">
                      <v-list-item-title style="font-family: 'Roboto'"><v-list-item-title>Roboto</v-list-item-title></v-list-item-title>
                    </v-list-item>

                    <v-list-item value="Roboto Slab">
                      <v-list-item-title style="font-family: 'Roboto Slab'"><v-list-item-title>Roboto Slab</v-list-item-title></v-list-item-title>
                    </v-list-item>

                    <v-list-item value="Roboto Mono">
                      <v-list-item-title style="font-family: 'Roboto Mono'"><v-list-item-title>Roboto Mono</v-list-item-title></v-list-item-title>
                    </v-list-item>

                    <v-list-item value="Roboto Condensed">
                      <v-list-item-title style="font-family: 'Roboto Condensed'"><v-list-item-title>Roboto Condensed</v-list-item-title></v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
              <!-- <div v-if="current_block.type == 'text' || current_block.type == 'header'"> -->
              <v-btn :disabled="!blockText" icon @click="data.blocks[current_block.index].format.b = !data.blocks[current_block.index].format.b" :v-model="blockText ? data.blocks[current_block.index].format.b : null">
                <v-icon>mdi-format-bold</v-icon>
              </v-btn>
              <v-btn :disabled="!blockText" icon @click="data.blocks[current_block.index].format.i = !data.blocks[current_block.index].format.i" :v-model="blockText ? data.blocks[current_block.index].format.i : null">
                <v-icon>mdi-format-italic</v-icon>
              </v-btn>
              <v-btn :disabled="!blockText" icon @click="data.blocks[current_block.index].format.ul = !data.blocks[current_block.index].format.ul" :v-model="blockText ? data.blocks[current_block.index].format.ul : null">
                <v-icon>mdi-format-underline</v-icon>
              </v-btn>
              <!-- <v-btn icon @click="data.blocks[current_block.index].format.ol = !data.blocks[current_block.index].format.ol" v-model="data.blocks[current_block.index].format.ol">
                <v-icon>mdi-format-overline</v-icon>
              </v-btn>
              <v-btn icon @click="data.blocks[current_block.index].format.str = !data.blocks[current_block.index].format.str" v-model="data.blocks[current_block.index].format.str">
                <v-icon>mdi-format-strikethrough</v-icon>
              </v-btn> -->
              <!-- </div> -->
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn :disabled="!blockText" :style="{ 'color': blockText ? data.blocks[current_block.index].format.color : null }" v-on="on" icon><v-icon>mdi-format-color-fill</v-icon></v-btn>
                </template>
                <v-color-picker show-swatches mode="hexa" style="background-color: #2E2E2E;" v-model="modelColor"></v-color-picker>
              </v-menu>
              <v-btn icon @click="clearFormat(current_block.index)" :disabled="!blockText"><v-icon>mdi-format-clear</v-icon></v-btn>
              <v-divider inset vertical></v-divider>
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon :disabled="!blockText"><v-icon>mdi-format-align-{{ blockText ? data.blocks[current_block.index].format.align : 'left' }}</v-icon></v-btn>
                </template>
                <v-list dense>
                  <v-list-item-group v-model="modelAlign">
                    <v-list-item value="left">
                      <v-list-item-icon><v-icon>mdi-format-align-left</v-icon></v-list-item-icon>
                      <v-list-item-title>Left</v-list-item-title>
                    </v-list-item>

                    <v-list-item value="center">
                      <v-list-item-icon><v-icon>mdi-format-align-center</v-icon></v-list-item-icon>
                      <v-list-item-title>Center</v-list-item-title>
                    </v-list-item>

                    <v-list-item value="right">
                      <v-list-item-icon><v-icon>mdi-format-align-right</v-icon></v-list-item-icon>
                      <v-list-item-title>Right</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>

                  <v-list-item-group v-model="modelJustify">
                    <v-list-item value="top" disabled>
                      <v-list-item-icon><v-icon color="grey">mdi-format-align-top</v-icon></v-list-item-icon>
                      <v-list-item-title>Top</v-list-item-title>
                    </v-list-item>

                    <v-list-item value="middle" disabled>
                      <v-list-item-icon><v-icon color="grey">mdi-format-align-middle</v-icon></v-list-item-icon>
                      <v-list-item-title>Middle</v-list-item-title>
                    </v-list-item>

                    <v-list-item value="bottom" disabled>
                      <v-list-item-icon><v-icon color="grey">mdi-format-align-bottom</v-icon></v-list-item-icon>
                      <v-list-item-title>Bottom</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </v-tab-item>

            <v-tab-item>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" text large><v-icon left>mdi-format-text-variant</v-icon>Text</v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="data.blocks.push({ type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, rows: 3 })">
                    <v-list-item-icon><v-icon>mdi-format-paragraph</v-icon></v-list-item-icon>
                    <v-list-item-title>Paragraph</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 1, rows: 1 })">
                    <v-list-item-icon><v-icon>mdi-format-header-1</v-icon></v-list-item-icon>
                    <v-list-item-title>Header 1</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 2, rows: 1 })">
                    <v-list-item-icon><v-icon>mdi-format-header-2</v-icon></v-list-item-icon>
                    <v-list-item-title>Header 2</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 3, rows: 1 })">
                    <v-list-item-icon><v-icon>mdi-format-header-3</v-icon></v-list-item-icon>
                    <v-list-item-title>Header 3</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="data.blocks.push({ type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 4, rows: 1 })">
                    <v-list-item-icon><v-icon>mdi-format-header-4</v-icon></v-list-item-icon>
                    <v-list-item-title>Header 4</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" text large><v-icon left>mdi-menu</v-icon>List</v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="data.blocks.push({ type: 'nl', list: ['', '', ''], index: data.blocks.length })">
                    <v-list-item-icon><v-icon>mdi-menu</v-icon></v-list-item-icon>
                    <v-list-item-title>Regular</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="data.blocks.push({ type: 'ul', list: ['', '', ''], index: data.blocks.length })">
                    <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
                    <v-list-item-title>Bulleted</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="data.blocks.push({ type: 'ol', list: ['', '', ''], index: data.blocks.length })">
                    <v-list-item-icon><v-icon>mdi-format-list-numbered</v-icon></v-list-item-icon>
                    <v-list-item-title>Numbered</v-list-item-title>
                  </v-list-item>

                  <v-list-item disabled @click="data.blocks.push({ type: 'cl', list: ['', '', ''], index: data.blocks.length })">
                    <v-list-item-icon><v-icon color="grey">mdi-format-list-checkbox</v-icon></v-list-item-icon>
                    <v-list-item-title>Checklist</v-list-item-title>
                  </v-list-item>

                  <v-list-item disabled @click="data.blocks.push({ type: 'toc', index: data.blocks.length })">
                    <v-list-item-icon><v-icon color="grey">mdi-table-of-contents</v-icon></v-list-item-icon>
                    <v-list-item-title>Table of Contents</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-divider inset vertical></v-divider>
              <v-btn text large @click="data.blocks.push({ type: 'image', src: '', alt: '', src_saved: false, index: data.blocks.length })"><v-icon left>mdi-image</v-icon>Image</v-btn>
              <v-btn icon @click="data.blocks.push({ type: 'divider', index: data.blocks.length })"><v-icon>mdi-minus</v-icon></v-btn>
              <v-btn icon @click="data.blocks.push({ type: 'code', index: data.blocks.length })"><v-icon>mdi-code-tags</v-icon></v-btn>
              <v-btn icon @click="data.blocks.push({ type: 'embed', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-web</v-icon></v-btn>
              <v-btn icon @click="data.blocks.push({ type: 'html', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-language-html5</v-icon></v-btn>
              <v-btn icon @click="data.blocks.push({ type: 'quote', content: '', author: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-format-quote-close</v-icon></v-btn>
              <v-btn icon @click="data.blocks.push({ type: 'gap', index: data.blocks.length })"><v-icon>mdi-arrow-expand-vertical</v-icon></v-btn>
            </v-tab-item>

            <v-tab-item>
              <v-btn text large disabled><v-icon left>mdi-page-layout-header-footer</v-icon>Header/Footer</v-btn>
              <v-btn icon disabled><v-icon>mdi-format-indent-decrease</v-icon></v-btn>
              <v-btn icon disabled><v-icon>mdi-format-indent-increase</v-icon></v-btn>
              <v-btn text large disabled>Margins</v-btn>
            </v-tab-item>

            <v-tab-item>
              <v-btn text large disabled><v-icon left>mdi-spellcheck</v-icon>Spellcheck</v-btn>
              <v-btn icon disabled><v-icon>mdi-dictionary</v-icon></v-btn>
              <v-divider vertical></v-divider>
              <v-btn text large disabled><v-icon left>mdi-counter</v-icon>Word Count</v-btn>
              <v-btn icon disabled><v-icon>mdi-share-variant</v-icon></v-btn>
              <v-btn icon disabled><v-icon>mdi-translate</v-icon></v-btn>
            </v-tab-item>

            <v-tab-item>
              <v-btn text large @click.prevent="focus(!focus_mode)" v-model="focus_mode"><v-icon left>mdi-image-filter-center-focus-strong</v-icon>Focus</v-btn>
              <v-btn text large disabled v-model="$root.auto_update"><v-icon left>mdi-update</v-icon>Auto-Update</v-btn>
            </v-tab-item>

            <v-tab-item>
              <v-btn text large @click="info_dialog = true"><v-icon left>mdi-information</v-icon>Info</v-btn>
            </v-tab-item>
          </v-tabs-items>
        </v-toolbar>

        <div class="scrollable-shell">
          <v-container style="width: 816px;" width="816" height="1056" id="editor" @click.self="resetCurrentBlock()" @mouseover.self="current_hover_block_index = null">
            <v-layout @contextmenu.prevent="showBlockMenu($event, block, index)" v-for="(block, index) in data.blocks" :key="index" @click="current_block = block" class="block" align-center justify-center @mouseover="current_hover_block_index = block.index">
              <v-flex xs12 class="text" v-if="block.type == 'text'">
                <!-- <p>[&nbsp;<span class="intLink" onclick="this.;"><strong>Bold</strong></span> | <span class="intLink" onclick="this.insertMetachars('&lt;em&gt;','&lt;\/em&gt;');"><em>Italic</em></span> | <span class="intLink" onclick="var newURL=prompt('Enter the full URL for the link');if(newURL){this.insertMetachars('&lt;a href=\u0022'+newURL+'\u0022&gt;','&lt;\/a&gt;');}else{document.myForm.myTxtArea.focus();}">URL</span> | <span class="intLink" onclick="this.insertMetachars('\n&lt;code&gt;\n','\n&lt;\/code&gt;\n');">code</span> | <span class="intLink" onclick="this.insertMetachars(' :-)');">smile</span> | etc. etc.&nbsp;]</p> -->
                <!-- <text-input v-model="block.content" :value="block.content"></text-input> -->
                <!-- <p contenteditable v-on:load="$event.target.textContent = block.content" v-on:change="$event.target.textContent = block.content" v-on:input="block.content = $event.target.textContent" :class="{ 'body-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }"></p> -->
                <textarea @input="autoExpand($event.target)" style="width: 100%;" :class="{ 'body-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Paragraph"></textarea>
              </v-flex>

              <v-flex xs12 class="header1" v-if="block.type == 'header' && block.size == 1">
                <textarea rows="1" @keyup="autoExpand($event.target)" style="width: 100%;" :class="{ 'display-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
              </v-flex>

              <v-flex xs12 class="header2" v-if="block.type == 'header' && block.size == 2">
                <textarea @input="autoExpand($event.target)" style="width: 100%;" :class="{ 'display-2': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
              </v-flex>

              <v-flex xs12 class="header3" v-if="block.type == 'header' && block.size == 3">
                <textarea @input="autoExpand($event.target)" style="width: 100%;" :class="{ 'display-3': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
              </v-flex>

              <v-flex xs12 class="header4" v-if="block.type == 'header' && block.size == 4">
                <textarea @input="autoExpand($event.target)" style="width: 100%;" :class="{ 'display-4': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
              </v-flex>

              <v-flex xs12 class="quote" v-if="block.type == 'quote'">
                <div v-if="!block.src_saved">
                  <input type="text" v-model="block.content" placeholder="Content" style="width: 500px; margin-right: 14px;">
                  <input type="text" v-model="block.author" placeholder="Author" style="width: 250px; margin-right: 14px;">
                  <v-btn text color="accent" @click="block.src_saved = true" v-if="block.content">Save</v-btn>
                </div>
                <blockquote class="blockquote" v-if="block.src_saved" style="width: 100%;">{{ block.content }}</blockquote>
                <p class="subtitle-1" v-if="block.src_saved" style="text-align: right; margin-right: 100px;">— {{ block.author }}</p>
              </v-flex>

              <v-flex xs12 class="image" v-if="block.type == 'image'">
                <div v-if="!block.src_saved">
                  <input type="text" v-model="block.src" placeholder="URL" style="width: 500px; margin-right: 14px;">
                  <input type="text" v-model="block.alt" placeholder="Caption" style="width: 250px; margin-right: 14px;">
                  <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
                </div>
                <img v-if="block.src_saved" :src="block.src" :alt="block.alt" style="max-width: calc(100vw - 28%);">
                <p v-if="block.src_saved" class="caption" style="text-align: right; margin-right: 100px;">{{ block.alt }}</p>
              </v-flex>

              <v-flex xs12 class="nl" v-if="block.type == 'nl'">
                <ul class="mb-3" style="list-style-type: none;">
                  <li v-for="(item, index) in block.list" :key="index">
                    <input type="text" v-model="block.list[index]" placeholder="List item" style="width: 100%;">
                  </li>
                </ul>
              </v-flex>

              <v-flex xs12 class="ul" v-if="block.type == 'ul'">
                <ul class="mb-3">
                  <li v-for="(item, index) in block.list" :key="index">
                    <input type="text" v-model="block.list[index]" placeholder="List item" style="width: 100%;">
                  </li>
                </ul>
              </v-flex>

              <v-flex xs12 class="ol" v-if="block.type == 'ol'">
                <ol class="mb-3">
                  <li v-for="(item, index) in block.list" :key="index">
                    <input type="text" v-model="block.list[index]" placeholder="List item" style="width: 100%;">
                  </li>
                </ol>
              </v-flex>

              <v-flex xs12 class="embed" v-if="block.type == 'embed'">
                <div v-if="!block.src_saved">
                  <input type="text" v-model="block.src" placeholder="URL" style="width: 750px; margin-right: 14px;">
                  <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
                </div>
                <embed v-if="block.src_saved" :src="block.src" :style="{ 'width': '100%', 'height': block.size + 'px' }">
              </v-flex>

              <v-flex xs12 class="html" v-if="block.type == 'html'">
                <div v-if="!block.src_saved">
                  <textarea type="text" v-model="block.src" placeholder="Source" style="width: 750px; margin-right: 14px;"></textarea>
                  <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
                </div>
                <iframe v-if="block.src_saved" :srcdoc="block.src" style="width: 100%;"></iframe>
              </v-flex>

              <v-flex xs12 :class="{ 'divider': block.index != current_hover_block_index, 'divider-hover': block.index == current_hover_block_index }" v-if="block.type == 'divider'">
                <v-divider></v-divider>
              </v-flex>

              <v-flex xs12 class="gap" v-if="block.type == 'gap'">
                <div style="height: 45px;"></div>
              </v-flex>

              <v-flex xs12 class="code" v-if="block.type == 'code'">
                <kbd><input type="text" v-model="block.content" placeholder="Code snippet"></kbd>
              </v-flex>
            </v-layout>

            <p class="mt-4">{{ current_block }}</p>
          </v-container>
        </div>

        <v-menu v-model="block_menu.open" offset-y :position-x="block_menu.x" :position-y="block_menu.y" absolute>
          <v-list dense>
            <v-list-item :disabled="block_menu.data.index == 0" @click="moveUp(block_menu.data, block_menu.index)">
              <v-list-item-icon><v-icon :color="(block_menu.data.index == 0) ? 'grey' : 'white'">mdi-chevron-up</v-icon></v-list-item-icon>
              <v-list-item-title>Move up</v-list-item-title>
            </v-list-item>

            <v-list-item @click="deleteBlock(block_menu.index)" color="red">
              <v-list-item-icon><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon>
              <v-list-item-title class="red--text">Delete block</v-list-item-title>
            </v-list-item>

            <v-list-item :disabled="(block_menu.data.index + 1) == data.blocks.length" @click="moveDown(block_menu.data, block_menu.index)">
              <v-list-item-icon><v-icon :color="((block_menu.data.index + 1) == data.blocks.length) ? 'grey' : 'white'">mdi-chevron-down</v-icon></v-list-item-icon>
              <v-list-item-title>Move down</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="addListItem(block_menu.index)" v-if="block_menu.data.type == 'ul' || block_menu.data.type == 'ol' || block_menu.data.type == 'nl'">
              <v-list-item-icon><v-icon>mdi-plus</v-icon></v-list-item-icon>
              <v-list-item-title>Add item</v-list-item-title>
            </v-list-item>

            <v-list-item @click="removeListItem(block_menu.index)" v-if="block_menu.data.type == 'ul' || block_menu.data.type == 'ol' || block_menu.data.type == 'nl'">
              <v-list-item-icon><v-icon>mdi-minus</v-icon></v-list-item-icon>
              <v-list-item-title>Remove item</v-list-item-title>
            </v-list-item>

            <v-list-item @click="block_menu.data.src_saved = false" v-if="(block_menu.data.type == 'image' || 'embed') && block_menu.data.src_saved">
              <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
              <v-list-item-title>Edit data</v-list-item-title>
            </v-list-item>

            <v-list-item @click="block_menu.data.size == 4 ? null : block_menu.data.size += 1" v-if="block_menu.data.type == 'header'" :disabled="block_menu.data.size == 4">
              <v-list-item-icon><v-icon :class="{ 'grey--text': block_menu.data.size == 4, 'white--text': block_menu.data.size != 4 }">mdi-format-font-size-increase</v-icon></v-list-item-icon>
              <v-list-item-title :class="{ 'grey--text': block_menu.data.size == 4, 'white--text': block_menu.data.size != 4 }">Increase size</v-list-item-title>
            </v-list-item>

            <v-list-item @click="block_menu.data.size == 1 ? null : block_menu.data.size -= 1" v-if="block_menu.data.type == 'header'" :disabled="block_menu.data.size == 1">
              <v-list-item-icon><v-icon :class="{ 'grey--text': block_menu.data.size == 1, 'white--text': block_menu.data.size != 1 }">mdi-format-font-size-decrease</v-icon></v-list-item-icon>
              <v-list-item-title :class="{ 'grey--text': block_menu.data.size == 1, 'white--text': block_menu.data.size != 1 }">Decrease size</v-list-item-title>
            </v-list-item>

            <v-menu offset-x left v-if="block_menu.data.type == 'embed' || block_menu.data.type == 'html'" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-list-item v-if="block_menu.data.type == 'embed' || block_menu.data.type == 'html'" v-on="on" icon>
                  <v-list-item-icon><v-icon>mdi-resize</v-icon></v-list-item-icon>
                  <v-list-item-title>Resize</v-list-item-title>
                </v-list-item>
              </template>
              <v-list dense>
                <v-slider max="750" style="max-width: 500px; min-width: 200px; padding: 20px 40px 0px 40px;" v-model="data.blocks[current_block.index].size"></v-slider>
              </v-list>
            </v-menu>
          </v-list>
        </v-menu>

        <v-dialog v-model="open_dialog" max-width="500" class="hidden-print-only">
          <v-card>
            <v-card-title>
              <span>Open</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="open_dialog = false" class="dialog-close-btn">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-file-input v-model="uploaded_file" id="file-uploader" label="Write document" accept="application/json"></v-file-input>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="accent" @click="openDocument()">Open</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="red" @click="open_dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="print_dialog" max-width="500" class="hidden-print-only">
          <v-card>
            <v-card-title>
              <span>Print</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="print_dialog = false" class="dialog-close-btn">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-list dense rounded>
                <v-list-item-group v-model="printer">
                  <v-list-item v-for="(printer, index) in printers" :key="index" :value="printer">
                    <v-list-item-title>{{ printer.name }}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <p>{{ printer }}</p>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="accent" @click="printDocument()">Print</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="red" @click="print_dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="corrupt_dialog" max-width="350" class="hidden-print-only">
          <v-card color="red">
            <v-card-title>
              <span style="margin: auto;" class="white--text font-weight-bold text-uppercase">Corrupt Document</span>
            </v-card-title>

            <v-card-text style="text-align: center;">Please upload a valid document.</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="white" @click="corrupt_dialog = false">Okay</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="info_dialog" max-width="350" class="hidden-print-only">
          <v-card>
            <v-card-title>
              <span>Information</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="info_dialog = false" class="dialog-close-btn">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <div style="margin: auto;">
                <img src="@/assets/logo_full.png" style="width: 250px;">
              </div>
              Version: v{{ app_version }}
            </v-card-text>

            <v-card-actions>
              <v-btn text color="white" @click="info_dialog = false">Close</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="red" @click="$noFunc()">Support</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-content>
    </div>

    <div v-if="loading_screen">
      <div class="loading-image mt-12" style="width: 100vw; text-align: center">
        <img src="@/assets/logo_full.png" style="width: 250px;">
      </div>
      <h1 class="display-1 text-center mt-6">Write</h1>
      <p class="body-2 text-weight-light grey--text text-center">v{{ app_version }}</p>
      <v-progress-linear style="position: absolute; bottom: 0px;" indeterminate></v-progress-linear>
    </div>
  </v-app>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { saveAs } from 'file-saver'
import { setTimeout } from 'timers'
import fs from 'fs'

import TextInput from '@/components/TextInput'

export default {
	name: 'Write',
	data() {
		return {
      loading_screen: true,
			win: remote.getCurrentWindow(),
      maximized: remote.getCurrentWindow().isMaximized(),
      focus_mode: remote.getCurrentWindow().isFullScreen(),
      open_dialog: false,
      corrupt_dialog: false,
      print_dialog: false,
      info_dialog: false,
      data: {},
      current_block: {},
      current_hover_block_index: null,
      uploaded_file: undefined,
      contents: remote.getCurrentWebContents(),
      printers: [],
      printer: {},
      block_menu: {
        open: false,
        data: {}
      },
      tab: 1,
      document: document,
      console: console,
      window: window,
      fonts: [
        { text: 'Sans-serif', value: 'Roboto' },
        { text: 'Serif', value: 'Roboto Slab' },
        { text: 'Monospace', value: 'Roboto Mono' },
        { text: 'Condensed', value: 'Roboto Condensed' }
      ],
      app_version: remote.app.getVersion()
		}
  },
  computed: {
    blockText() {
      if (this.current_block.type == 'text' || this.current_block.type == 'header') {
        return true
      } else {
        return false
      }
    },
    clipboardActive() {
      navigator.clipboard.readText().then(text => {
        if (!text) return false
        else return true
      })
    },
    modelJustify: {
      get() {
        if (this.data.blocks[this.current_block.index].format) {
          return this.data.blocks[this.current_block.index].format.just
        } else {
          return false
        }
      },
      set(newValue) {
        if (this.data.blocks[this.current_block.index].format) {
          this.data.blocks[this.current_block.index].format.just = newValue
        }
      }
    },
    modelAlign: {
      get() {
        if (this.data.blocks[this.current_block.index].format) {
          return this.data.blocks[this.current_block.index].format.align
        } else {
          return false
        }
      },
      set(newValue) {
        if (this.data.blocks[this.current_block.index].format) {
          this.data.blocks[this.current_block.index].format.align = newValue
        }
      }
    },
    modelFont: {
      get() {
        if (this.data.blocks[this.current_block.index].format) {
          return this.data.blocks[this.current_block.index].format.font
        } else {
          return false
        }
      },
      set(newValue) {
        if (this.data.blocks[this.current_block.index].format) {
          this.data.blocks[this.current_block.index].format.font = newValue
        }
      }
    },
    modelColor: {
      get() {
        if (this.data.blocks[this.current_block.index].format) {
          return this.data.blocks[this.current_block.index].format.color
        } else {
          return false
        }
      },
      set(newValue) {
        if (this.data.blocks[this.current_block.index].format) {
          this.data.blocks[this.current_block.index].format.color = newValue
        }
      }
    }
  },
  components: {
    'text-input': TextInput
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
    focus(input) {
      this.win.setSimpleFullScreen(input)
      this.focus_mode = remote.getCurrentWindow().isFullScreen()
    },
    goBack() {
      this.contents.goBack()
    },
    goForward() {
      this.contents.goForward()
    },
    newDocument() {
      this.data = {
        title: '',
        blocks: [
          { type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 1 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 1 }
        ]
      }
    },
    printDocument() {
      this.print_dialog = false
      if (this.print_dialog == false) {
        setTimeout(() => {
          this.contents.print({
            silent: true,
            printBackground: false,
            deviceName: this.printer.name
          }, () => {
            this.$notify('Document printed successfully.')
          })
        }, 1000)
      } else {
        this.print_dialog = false
        this.printDocument()
      }
    },
    openDocument() {
      var file_ext_search = this.uploaded_file.name.search('.write.json')
      var corrupt = true
      if (file_ext_search >= 1) corrupt = false
      var reader = new FileReader()
      if (!corrupt) {
        reader.onload = e => {
          this.data = JSON.parse(e.target.result)
        }
        reader.readAsText(this.uploaded_file)
        this.open_dialog = false
      } else {
        this.uploaded_file = undefined
        this.corrupt_dialog = true
      }
    },
    saveDocument() {
      if (this.data.title) {
        var data = JSON.stringify(this.data)
        var file = new File([ data ], this.data.title + '.write.json', { type: 'application/json' })
        saveAs(file)
      } else {
        this.$notify('Name your document')
      }
    },
    moveUp(block, currentIndex) {
      this.data.blocks.splice(currentIndex, 1)
      this.data.blocks.splice(currentIndex - 1, 0, block)
      this.data.blocks[currentIndex - 1].index -= 1
      this.data.blocks[currentIndex].index += 1
    },
    moveDown(block, currentIndex) {
      this.data.blocks.splice(currentIndex, 1)
      this.data.blocks.splice(currentIndex + 1, 0, block)
      this.data.blocks[currentIndex + 1].index += 1
      this.data.blocks[currentIndex].index -= 1
    },
    addListItem(index) {
      this.data.blocks[index].list.push([''])
    },
    removeListItem(index) {
      this.data.blocks[index].list.pop()
    },
    deleteBlock(index) {
      this.data.blocks.splice(index, 1)
      this.data.blocks.forEach(block => {
        if (block.index >= index) block.index -= 1
      })
      this.resetCurrentBlock()
    },
    clearFormat(index) {
      this.data.blocks[index].format = { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }
    },
    showBlockMenu(e, data, index) {
      this.block_menu = {
        x: e.clientX,
        y: e.clientY,
        open: true,
        data: data,
        index: index
      }
    },
    resetCurrentBlock() {
      this.current_block = { type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 1 }
    },
    autoExpand(field) {
      if (field.scrollHeight > field.clientHeight) {
        field.style.height = field.scrollHeight + "px";
        field.rows = 1
      }
    }
  },
  mounted() {
    this.printers = this.contents.getPrinters()
  },
  created() {
    this.win.setSize(350, 475, true)
    setTimeout(() => {
      this.loading_screen = false
      this.win.setSize(1300, 800, true)
    }, 2500)
    ipcRenderer.on('update', (event, text) => {
      this.$notify(text)
    })
    this.resetCurrentBlock()
    this.newDocument()
  }
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track { background: rgb(33, 33, 33); }

/* Handle */
::-webkit-scrollbar-thumb { background: rgb(100, 100, 100); }

/* Handle on hover */
::-webkit-scrollbar-thumb:hover { background: rgb(60, 60, 60); }

/* Corner */
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

.toolbar-icon { border-radius: 100px; }

.centralize {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

.v-system-bar.v-system-bar--fixed.v-system-bar--window { padding: 0px 0px 0px 8px !important; }

@media screen {
  div#editor { margin-top: 16px; }

  input.doc-title::placeholder { color: #616161; }

  div.scrollable-shell {
    height: calc(100vh - 128px);
    overflow: auto;
  }
}

@media print { ::-webkit-input-placeholder { color: transparent; } }

.font-underline { text-decoration: underline; }

.font-strikethrough { text-decoration: line-through; }

.font-overline { text-decoration: overline; }

* { outline: none; }

.v-btn-toggle > .v-btn.v-btn {
  border-style: none !important;
  border-radius: 48px !important;
}

iframe { border: none !important; }

.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) { background: none !important; }

.block {
  padding: 14px;
  border-radius: 6px;
}

.block:hover { background-color: #343434; }

.v-menu__content { background-color: #424242; }

.v-toolbar__content { padding: 4px; }

.v-menu--inline { display: none !important; }

.divider {
  position: relative;
  top: +18px;
  bottom: +18px;
  height: 36px;
}

.divider-hover {
  position: relative;
  top: 0px;
  bottom: +18px;
}

textarea {
  resize: none;
  height: auto;
}

.display-1 { padding: 8px 0px 8px 0px; }

.display-2 { line-height: 3.6rem; }

.display-3 { line-height: 4.5rem; }

.display-4 { line-height: 7.15rem; }

.sticky-toolbar {
  position: fixed;
  top: 32px;
  width: 100%;
}
</style>
