<template>
  <v-app>
    <!-- System toolbar -->
    <v-system-bar app window style="-webkit-app-region: drag;" class="blue darken-4 hidden-print-only">
      <div v-if="!$root.notify.is" style="display: inline-flex !important;">
        <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
        <span style="margin-right: 4px">Write</span>
        <span class="font-weight-light grey--text lighten-2 mr-2">early-access beta</span>
        <v-divider vertical inset></v-divider>
        <div style="-webkit-app-region: no-drag; margin-left: 8px;">
          <v-icon @click="saveDocument()" v-ripple class="toolbar-icon">mdi-content-save</v-icon>
          <v-icon @click="open_dialog = true" v-ripple class="toolbar-icon">mdi-folder-open</v-icon>
          <v-icon @click="newDocument()" v-ripple class="toolbar-icon">mdi-file-document-box-plus</v-icon>
          <v-icon @click="print_dialog = true" v-ripple class="toolbar-icon">mdi-printer</v-icon>
        </div>
      </div>
      <span v-if="$root.notify.is">{{ $root.notify.text }}</span>
      <v-spacer></v-spacer>
      <input type="text" v-model="data.title" placeholder="Untitled document" class="doc-title centralize" style="-webkit-app-region: no-drag;">
      <v-spacer></v-spacer>
      <div style="-webkit-app-region: no-drag;">
        <v-icon @click="minimize()" v-ripple class="toolbar-icon">mdi-minus</v-icon>
        <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="toolbar-icon">mdi-crop-square</v-icon>
        <v-icon @click="close()" v-ripple class="toolbar-icon">mdi-close</v-icon>
      </div>
    </v-system-bar>

		<!-- Site content -->
		<v-content>
      <v-toolbar color="blue darken-4" dense ref="toolbar" class="hidden-print-only">
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
        <v-divider vertical inset></v-divider>
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
      </v-toolbar>

      <v-toolbar color="blue darken-4" dense ref="tabs" class="hidden-print-only elevation-0" style="z-index: 3">
        <v-tabs v-model="tab" background-color="transparent">
          <v-tab>File</v-tab>
          <v-tab>Home</v-tab>
          <v-tabs-slider></v-tabs-slider>
        </v-tabs>

      </v-toolbar>

      <v-toolbar dense ref="toolbar" class="hidden-print-only">
        <v-tabs-items style="width: 100%;" v-model="tab">
          <v-tab-item>
            File
          </v-tab-item>

          <v-tab-item>
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
            <v-select :items="fonts" v-model="data.blocks[current_block.index].format.font" menu-props="offsetY"></v-select>
          </v-tab-item>
        </v-tabs-items>
      </v-toolbar>

      <div class="scrollable-shell">
        <v-container style="width: 816px;" width="816" height="1056" id="editor" @click.self="current_block = {}" @mouseover.self="current_hover_block_index = null">
          <v-layout @contextmenu.prevent="showBlockMenu($event, block, index)" v-for="(block, index) in data.blocks" :key="index" @click="current_block = block" class="block" align-center justify-center @mouseover="current_hover_block_index = block.index">
            <v-flex xs12 class="text" v-if="block.type == 'text'">
              <textarea :rows="block.rows" style="width: 100%;" :class="{ 'body-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Paragraph"></textarea>
            </v-flex>

            <v-flex xs12 class="header1" v-if="block.type == 'header' && block.size == 1">
              <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
            </v-flex>

            <v-flex xs12 class="header2" v-if="block.type == 'header' && block.size == 2">
              <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-2': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
            </v-flex>

            <v-flex xs12 class="header3" v-if="block.type == 'header' && block.size == 3">
              <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-3': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
            </v-flex>

            <v-flex xs12 class="header4" v-if="block.type == 'header' && block.size == 4">
              <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-4': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
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
        </v-container>
        <v-card class="mx-auto"></v-card>
      </div>

      <v-menu v-model="block_menu.open" offset-y :position-x="block_menu.x" :position-y="block_menu.y" absolute>
        <v-list dense>
          <v-list-item @click="moveUp(block_menu.data, block_menu.index)">
            <v-list-item-icon><v-icon>mdi-chevron-up</v-icon></v-list-item-icon>
            <v-list-item-title>Move up</v-list-item-title>
          </v-list-item>

          <v-list-item @click="deleteBlock(block_menu.index)" color="red">
            <v-list-item-icon><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon>
            <v-list-item-title class="red--text">Delete block</v-list-item-title>
          </v-list-item>

          <v-list-item @click="moveDown(block_menu.data, block_menu.index)">
            <v-list-item-icon><v-icon>mdi-chevron-down</v-icon></v-list-item-icon>
            <v-list-item-title>Move down</v-list-item-title>
          </v-list-item>

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

          <v-list-item @click="block_menu.data.rows += 1" v-if="block_menu.data.type == 'header' || block_menu.data.type == 'text'">
            <v-list-item-icon><v-icon>mdi-plus</v-icon></v-list-item-icon>
            <v-list-item-title>Increase height</v-list-item-title>
          </v-list-item>

          <v-list-item @click="block_menu.data.rows -= 1" v-if="block_menu.data.type == 'header' || block_menu.data.type == 'text'">
            <v-list-item-icon><v-icon>mdi-minus</v-icon></v-list-item-icon>
            <v-list-item-title>Decrease height</v-list-item-title>
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
		</v-content>
  </v-app>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { saveAs } from 'file-saver'
import { setTimeout } from 'timers'
import fs from 'fs'

export default {
	name: 'Write',
	data() {
		return {
			win: remote.getCurrentWindow(),
      maximized: remote.getCurrentWindow().isMaximized(),
      open_dialog: false,
      corrupt_dialog: false,
      print_dialog: false,
      data: {
        title: '',
        blocks: [
          { type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 1, rows: 1 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 1, rows: 3 }
        ]
      },
      current_block: { type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 1, rows: 1 },
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
      fonts: [
        { text: 'Sans-serif', value: 'Roboto' },
        { text: 'Serif', value: 'Roboto Slab' },
        { text: 'Monospace', value: 'Roboto Mono' },
        { text: 'Condensed', value: 'Roboto Condensed' }
      ]
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
      this.contents.goBack()
    },
    goForward() {
      this.contents.goForward()
    },
    newDocument() {
      this.data = {
        title: '',
        blocks: [
          { type: 'header', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 1, rows: 1 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 1, rows: 3 }
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
      this.current_block = {}
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
    }
  },
  mounted() {
    this.printers = this.contents.getPrinters()
  },
  created() {
    ipcRenderer.on('update', (event, text) => {
      this.$notify(text)
    })
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
    height: calc(100vh - 80px);
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

textarea { resize: none; }

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
