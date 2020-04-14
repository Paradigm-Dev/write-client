<template>
  <v-app>
    <v-system-bar v-if="process.platform == 'win32'" app window style="-webkit-app-region: drag; -webkit-user-select: none;" :color="$vuetify.breakpoint.xsOnly || !user ? 'transparent' : 'blue darken-4'" class="hidden-print-only">
      <v-fade-transition group leave-absolute>
        <div key="logo" v-if="!$root.notify.is" style="display: inline-flex !important;">
          <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
          <span style="margin-right: 4px">Write</span>
          <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span>
        </div>
        <span key="notification" v-if="$root.notify.is">{{ $root.notify.text }}</span>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <input @keypress.enter="renameDocument()" v-if="editor" type="text" v-model="title" placeholder="Untitled document" class="title-bar hidden-xs-only" style="-webkit-app-region: no-drag; border-radius: 6px;" :style="{ border: title == doc.name ? 'none' : '#FF9800 2px solid' }">
      <v-spacer></v-spacer>
      <div style="-webkit-app-region: no-drag;">
        <v-icon @click="minimize()" v-ripple class="toolbar-icon">mdi-minus</v-icon>
        <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="toolbar-icon">mdi-crop-square</v-icon>
        <v-icon @click="close()" v-ripple class="toolbar-icon">mdi-close</v-icon>
      </div>
    </v-system-bar>

    <v-system-bar v-if="process.platform == 'darwin'" app window style="-webkit-app-region: drag;" height="38" :color="$vuetify.breakpoint.xsOnly || !user ? 'transparent' : 'blue darken-4'" class="hidden-print-only">
      <v-fade-transition group leave-absolute style="margin: 4px 4px 0px 70px;">
        <div key="logo" v-if="!$root.notify.is" style="display: inline-flex !important;">
          <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
          <span style="margin-right: 4px">Write</span>
          <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span>
        </div>
        <span key="notification" v-if="$root.notify.is">{{ $root.notify.text }}</span>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <input @keypress.enter="renameDocument()" v-if="editor" type="text" v-model="title" placeholder="Untitled document" class="title-bar hidden-xs-only" style="-webkit-app-region: no-drag; border-radius: 6px;" :style="{ border: title == doc.name ? 'none' : '#FF9800 2px solid' }">
      <v-spacer></v-spacer>
      <v-slide-x-reverse-transition>
        <div v-if="editor && changes" style="height: 10px; width: 10px; border-radius: 10px;" class="orange mr-1"></div>
      </v-slide-x-reverse-transition>
    </v-system-bar>

    <v-slide-x-transition group hide-on-leave>
      <v-content v-if="!user" key="login">
        <v-card width="500" class="mx-auto" style="margin-top: 150px;">
          <v-card-title class="display-1 font-weight-light">Sign in</v-card-title>

          <v-card-text>
            <v-text-field v-model="username" label="Username"></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" @keypress.enter="signIn()"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="signIn()" text color="blue accent-1">Sign in</v-btn>
          </v-card-actions>
        </v-card>
      </v-content>

      <v-content v-if="!editor && user" key="home">
        <v-container>
          <h1 class="display-2 font-weight-light mt-6">Welcome, <span :style="{ color: user.color }">{{ user.username }}</span>!</h1>
          <p class="grey--text">Not {{ user.username }}? <a @click="user = false">Sign out</a>.</p>
          <v-row>
            <v-col sm="6">
              <v-btn x-large @click="newDocument()"><v-icon left>mdi-plus</v-icon>New</v-btn>
            </v-col>
            <v-col sm="6" class="pa-0">
              <v-row align="center">
                <v-col sm="10">
                  <span class="grey--text">Open...</span>
                </v-col>
                <v-col sm="2" class="text-right">
                  <v-btn icon @click="reloadFiles()"><v-icon color="grey">mdi-reload</v-icon></v-btn>
                </v-col>
              </v-row>
              <v-list>
                <v-list-item @click="openDocument(file)" v-for="(file, index) in filteredFileList" :key="index">
                  <v-list-item-title>{{ file.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-content>

      <v-content v-if="editor && user" key="editor">
        <v-navigation-drawer v-model="search.open" app>
          <v-list-item>
            <v-list-item-content class="pa-0">
              <v-list-item-title class="title">Search and Replace</v-list-item-title>
            </v-list-item-content>
            <v-btn icon @click="search.open = false" class="dialog-close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item>
          <v-divider></v-divider>
          <div class="pa-4">
            <v-text-field ref="search" @keydown.enter.prevent="editor.commands.find(search.search_term)" label="Search" v-model="search.search_term"></v-text-field>
            <v-text-field @keydown.enter.prevent="editor.commands.find(search.replace_term)" label="Replace" v-model="search.replace_term"></v-text-field>
            <div style="text-align: center;">
              <v-btn icon @click="editor.commands.find(search.search_term)"><v-icon>mdi-magnify</v-icon></v-btn>
              <v-btn icon @click="editor.commands.replace(search.replace_term)"><v-icon>mdi-find-replace</v-icon></v-btn>
              <!-- <v-btn @click="editor.commands.replaceAll(replaceWith)">Replace All</v-btn> -->
              <v-btn icon @click="editor.commands.clearSearch(), search.search_term = '', search.replace_term = ''"><v-icon>mdi-close</v-icon></v-btn>
            </div>
          </div>
        </v-navigation-drawer>

        <v-navigation-drawer v-model="image.open" app>
          <v-list-item>
            <v-list-item-content class="pa-0">
              <v-list-item-title class="title">Image</v-list-item-title>
            </v-list-item-content>
            <v-btn icon @click="image.open = false" class="dialog-close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item>
          <v-divider></v-divider>
          <div class="pa-4">
            <v-text-field @keydown.enter.prevent="finishImageInsert()" label="Image URL" v-model="image.src"></v-text-field>
            <div style="text-align: center;">
              <v-btn icon @click="finishImageInsert()"><v-icon>mdi-save</v-icon></v-btn>
            </div>
          </div>
        </v-navigation-drawer>

        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, getMarkAttrs }">
          <div>
            <v-toolbar color="blue darken-4" dense ref="tabs" class="hidden-print-only elevation-0" style="z-index: 3">
              <v-tabs show-arrows color="grey lighten-1" v-model="tab" background-color="transparent">
                <v-tab>File</v-tab>
                <v-tab>Format</v-tab>
                <v-tab>Insert</v-tab>
                <v-tab>Layout</v-tab>
                <v-tab>Review</v-tab>
                <v-tab>Settings</v-tab>
                <v-tab>Help</v-tab>
                <v-tab v-if="isActive.table()">Table</v-tab>
                <v-tab v-if="isActive.image()">Image</v-tab>
                <v-tabs-slider></v-tabs-slider>
              </v-tabs>
            </v-toolbar>

            <v-toolbar dense ref="toolbar" class="hidden-print-only">
              <v-tabs-items class="transparent" style="width: 100%;" v-model="tab">
                <v-tab-item>
                  <v-btn text large @click="saveDocument()" :style="{ border: changes ? '#FF9800 2px solid' : 'none' }"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
                  <v-btn text large @click="newDocument()"><v-icon left>mdi-plus</v-icon>New</v-btn>
                  <v-btn text large @click="open_dialog = true"><v-icon left>mdi-folder-open</v-icon>Open</v-btn>
                  <v-btn text large @click="print_dialog = true"><v-icon left>mdi-printer</v-icon>Print</v-btn>
                  <v-btn text large @click="editor = undefined"><v-icon left>mdi-close</v-icon>Close</v-btn>
                </v-tab-item>

                <v-tab-item>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn text icon v-on="on"><v-icon>mdi-history</v-icon></v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="commands.undo">
                        <v-list-item-icon><v-icon>mdi-undo</v-icon></v-list-item-icon>
                        <v-list-item-title>Undo</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="commands.redo">
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
                      <v-btn disabled v-on="on" text large><v-icon left>mdi-format-font</v-icon>Roboto</v-btn>
                    </template>
                    <v-subheader>Font</v-subheader>
                    <v-list dense>
                      <v-list-item-group>
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
                  <v-btn icon :input-value="isActive.bold()" @click="commands.bold">
                    <v-icon>mdi-format-bold</v-icon>
                  </v-btn>

                  <v-btn icon :input-value="isActive.italic()" @click="commands.italic">
                    <v-icon>mdi-format-italic</v-icon>
                  </v-btn>

                  <v-btn icon :input-value="isActive.underline()" @click="commands.underline">
                    <v-icon>mdi-format-underline</v-icon>
                  </v-btn>

                  <v-btn icon :input-value="isActive.strike()" @click="commands.strike">
                    <v-icon>mdi-format-strikethrough</v-icon>
                  </v-btn>

                  <v-menu :close-on-content-click="false" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn :style="{ 'color': isActive_color }" v-on="on" icon><v-icon>mdi-format-color-fill</v-icon></v-btn>
                    </template>
                    <v-color-picker @update:color="commands.color({ color: isActive_color }), console.log(editor.getHTML())" v-model="isActive_color" show-swatches mode="hexa" style="background-color: #2E2E2E;"></v-color-picker>
                  </v-menu>
                  <v-btn icon @click="clearFormat(current_block.index)" disabled><v-icon>mdi-format-clear</v-icon></v-btn>
                  <v-divider inset vertical></v-divider>
                  <v-menu :close-on-content-click="false" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon><v-icon>mdi-format-align-left</v-icon></v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item-group>
                        <v-list-item :input-value="isActive.alignment({ textAlign: 'left' })" @click="commands.alignment({ textAlign: 'left' })">
                          <v-list-item-icon><v-icon>mdi-format-align-left</v-icon></v-list-item-icon>
                          <v-list-item-title>Left</v-list-item-title>
                        </v-list-item>

                        <v-list-item :input-value="isActive.alignment({ textAlign: 'center' })" @click="commands.alignment({ textAlign: 'center' })">
                          <v-list-item-icon><v-icon>mdi-format-align-center</v-icon></v-list-item-icon>
                          <v-list-item-title>Center</v-list-item-title>
                        </v-list-item>

                        <v-list-item :input-value="isActive.alignment({ textAlign: 'right' })" @click="commands.alignment({ textAlign: 'right' })">
                          <v-list-item-icon><v-icon>mdi-format-align-right</v-icon></v-list-item-icon>
                          <v-list-item-title>Right</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>

                      <v-list-item-group>
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
                  <v-btn icon @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })">
                    <v-icon>mdi-table</v-icon>
                  </v-btn>

                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" text large><v-icon left>mdi-format-text-variant</v-icon>Text</v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="commands.paragraph">
                        <v-list-item-icon><v-icon>mdi-format-paragraph</v-icon></v-list-item-icon>
                        <v-list-item-title>Paragraph</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="commands.heading({ level: 1 })">
                        <v-list-item-icon><v-icon>mdi-format-header-1</v-icon></v-list-item-icon>
                        <v-list-item-title>Header 1</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="commands.heading({ level: 2 })">
                        <v-list-item-icon><v-icon>mdi-format-header-2</v-icon></v-list-item-icon>
                        <v-list-item-title>Header 2</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="commands.heading({ level: 3 })">
                        <v-list-item-icon><v-icon>mdi-format-header-3</v-icon></v-list-item-icon>
                        <v-list-item-title>Header 3</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="commands.heading({ level: 4 })">
                        <v-list-item-icon><v-icon>mdi-format-header-4</v-icon></v-list-item-icon>
                        <v-list-item-title>Header 4</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-btn icon @click="startImageInsert(commands.image)">
                    <v-icon>mdi-image</v-icon>
                  </v-btn>

                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" text large><v-icon left>mdi-menu</v-icon>List</v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item disabled @click="data.blocks.push({ type: 'nl', list: ['', '', ''], index: data.blocks.length, format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' } })">
                        <v-list-item-icon><v-icon color="grey">mdi-menu</v-icon></v-list-item-icon>
                        <v-list-item-title>Regular</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="commands.bullet_list" :input-value="isActive.bullet_list()">
                        <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
                        <v-list-item-title>Bulleted</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="commands.ordered_list" :input-value="isActive.ordered_list()">
                        <v-list-item-icon><v-icon>mdi-format-list-numbered</v-icon></v-list-item-icon>
                        <v-list-item-title>Numbered</v-list-item-title>
                      </v-list-item>

                      <v-list-item disabled @click="commands.todo_list" :input-value="isActive.todo_list()">
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
                  <v-btn icon @click="commands.horizontal_rule"><v-icon>mdi-minus</v-icon></v-btn>
                  <v-btn icon @click="console.log(commands)"><v-icon>mdi-iframe</v-icon></v-btn>
                  <!-- <v-btn icon @click="data.blocks.push({ type: 'code', index: data.blocks.length })"><v-icon>mdi-code-tags</v-icon></v-btn>
                  <v-btn icon @click="data.blocks.push({ type: 'embed', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-web</v-icon></v-btn>
                  <v-btn icon @click="data.blocks.push({ type: 'html', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-language-html5</v-icon></v-btn>
                  <v-btn icon @click="data.blocks.push({ type: 'quote', content: '', author: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-format-quote-close</v-icon></v-btn>
                  <v-btn icon @click="data.blocks.push({ type: 'gap', index: data.blocks.length })"><v-icon>mdi-arrow-expand-vertical</v-icon></v-btn> -->
                </v-tab-item>

                <v-tab-item>
                  <v-btn text large disabled><v-icon left>mdi-page-layout-header-footer</v-icon>Header/Footer</v-btn>
                  <v-btn icon disabled><v-icon>mdi-format-indent-decrease</v-icon></v-btn>
                  <v-btn icon disabled><v-icon>mdi-format-indent-increase</v-icon></v-btn>
                  <v-btn text large disabled>Margins</v-btn>
                </v-tab-item>

                <v-tab-item>
                  <v-btn icon @click="search.open = !search.open" v-model="search.open">
                    <v-icon>mdi-find-replace</v-icon>
                  </v-btn>
                  <v-btn text large disabled><v-icon left>mdi-spellcheck</v-icon>Spellcheck</v-btn>
                  <v-btn icon disabled><v-icon>mdi-book-alphabet</v-icon></v-btn>
                  <v-divider vertical></v-divider>
                  <v-btn text large disabled><v-icon left>mdi-counter</v-icon>Word Count</v-btn>
                  <v-btn icon disabled><v-icon>mdi-share-variant</v-icon></v-btn>
                  <v-btn icon disabled><v-icon>mdi-translate</v-icon></v-btn>
                </v-tab-item>

                <v-tab-item>
                  <v-btn disabled text large @click.prevent="focus(!focus_mode)" v-model="focus_mode"><v-icon left>mdi-image-filter-center-focus-strong</v-icon>Focus</v-btn>
                  <v-btn disabled text large disabled v-model="auto_update"><v-icon left>mdi-update</v-icon>Auto-Update</v-btn>
                </v-tab-item>

                <v-tab-item>
                  <v-btn disabled text large @click="info_dialog = true"><v-icon left>mdi-information</v-icon>Info</v-btn>
                </v-tab-item>

                <v-tab-item v-if="isActive.table()">
                  <v-btn icon @click="deleteTable(commands)">
                    <v-icon>mdi-table-remove</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.addColumnBefore">
                    <v-icon>mdi-table-column-plus-before</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.addColumnAfter">
                    <v-icon>mdi-table-column-plus-after</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.deleteColumn">
                    <v-icon>mdi-table-column-remove</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.addRowBefore">
                    <v-icon>mdi-table-row-plus-before</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.addRowAfter">
                    <v-icon>mdi-table-row-plus-after</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.deleteRow">
                    <v-icon>mdi-table-row-remove</v-icon>
                  </v-btn>

                  <v-btn icon @click="commands.toggleCellMerge">
                    <v-icon>mdi-table-merge-cells</v-icon>
                  </v-btn>
                </v-tab-item>

                <v-tab-item v-if="isActive.image()">
                  <v-btn text large @click="checkMarkAttrs(getMarkAttrs)"></v-btn>
                </v-tab-item>
              </v-tabs-items>
            </v-toolbar>
          </div>
        </editor-menu-bar>
        
        <div class="scrollable-shell">
          <!-- <div class="menubar">
            <v-btn icon :class="{ 'is-active': isActive.code() }" @click="commands.code">
              <v-icon>mdi-code-tags</v-icon>
            </v-btn>


            <v-btn icon :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
              <v-icon>mdi-format-quote-close</v-icon>
            </v-btn>

            <v-btn icon :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
              <v-icon>mdi-code-tags</v-icon>
            </v-btn>


          </div> -->
          <v-card style="width: 816px;" class="pa-6 mx-auto mt-6">
            <editor-content class="editor__content" :editor="editor" />
          </v-card>
        </div>

        <!-- <v-footer app>
          <span class="overline green--text">2 Users Connected</span>
        </v-footer> -->
      </v-content>
    </v-slide-x-transition>

    <v-dialog v-model="open_dialog" max-width="650" v-if="user">
      <v-card>
        <v-card-title>Open Document</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item @click="openDocument(file)" v-for="(file, index) in filteredFileList" :key="index">
              <v-list-item-title>{{ file.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
  History,
  Search,
  TodoItem,
  TodoList,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Image,
  TrailingNode
} from 'tiptap-extensions'
import Color from '@/editorPlugins/Color.js'
import Paragraph from '@/editorPlugins/Paragraph.js'
import iFrame from '@/editorPlugins/iFrame.js'
import { saveAs } from 'file-saver'
import axios from 'axios'

export default {
  name: 'editor',
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      console,
      document,
      tab: 1,
      user: false,
      username: '',
      password: '',
      search: {
        open: false,
        search_term: '',
        replace_term: ''
      },
      image: {
        open: false,
        src: '',
        cmd: null
      },
      editor: undefined,
      process,
      title: '',
      doc: false,
      open_dialog: false,
      changes: false,
      focus_mode: false,
      auto_update: true,
      info_dialog: false,
      isActive_color: ''
    }
  },
  computed: {
    filteredFileList() {
      let files = []
      this.user.files.forEach(file => {
        if (file.type == 'workshop/write') files.push(file)
      })
      return files
    }
  },
  beforeDestroy() {
    if (this.editor) this.editor.destroy()
  },
  methods: {
    deleteTable(functions) {
      functions.deleteTable()
      this.tab = 1
    },
    startImageInsert(command) {
      this.image.open = true
      this.image.cmd = command
    },
    finishImageInsert() {
      var src = this.image.src
      this.image.cmd({ src })
    },
    newDocument() { this.openDocument(null) },
    saveDocument() {
      if (this.title) {
        var data = this.editor.getJSON()
        data.title = this.title
        axios.post(`https://www.theparadigmdev.com/drawer/${this.user.username}/upload/write`, data).then(response => {
          this.changes = false
        }).catch(error => console.error(error))
      } else {
        this.$notify('Name your document')
      }
    },
    renameDocument() {
      axios.post(`https://www.theparadigmdev.com/drawer/${this.user.username}/rename/${this.doc._id}`, { name: this.title }).then(response => {
        this.doc.name = this.title
      }).catch(error => console.error(error))
    },
    async openDocument(doc) {
      this.tab = 1
      this.open_dialog = false
      if (this.editor) this.editor = undefined
      if (doc != null) {
        this.title = doc.name
        await axios.get(`https://www.theparadigmdev.com/drawer/${this.user.username}/get/${doc._id}`).then(response => {
          doc.data = response.data
          delete doc.data.title
        }).catch(error => console.error(error))
        this.doc = JSON.parse(JSON.stringify(doc))
        console.log(this.doc)
      } else {
        this.title = ''
        this.doc = null
      }
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Search({
            disableRegex: false
          }),
          new TodoItem({
            nested: true,
          }),
          new TodoList(),
          new Table({
            resizable: true,
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new Link(),
          new Image(),
          new Paragraph(),
          new Color(),
          new TrailingNode(),
          new iFrame()
        ],
        content: doc ? doc.data : null,
        onUpdate: ({ getJSON, getHTML }) => {
          this.changes = true
        }
      })
    },
    reloadFiles() {
      axios.get(`https://www.theparadigmdev.com/drawer/${this.user.username}/list`).then(response => {
        this.user.files = response.data
      })
    },
    signIn() {
      axios.post('https://www.theparadigmdev.com/users/signin', {
        username: this.username.toLowerCase(),
        password: this.password
      }).then(response => {
        if (!response.data.msg) {
          this.user = response.data
          this.username = ''
          this.password = ''
        } else {
          this.$notify('error', response.data.msg)
        }
      }).catch(error => console.error(JSON.stringify(error)))
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

*:focus {
  outline: none;
}

.find {
  background: rgba(255, 213, 0, 0.5);
}

table, th, td {
  border: 1px solid grey;
}

td {
  padding: 4px;
  min-width: 100px;
}

table {
  border-collapse: collapse;
}

div.scrollable-shell {
  height: calc(100vh - 134px);
  overflow: auto;
}

</style>