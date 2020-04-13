<template>
  <div>
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
          <v-btn icon @click="editor.commands.clearSearch()"><v-icon>mdi-close</v-icon></v-btn>
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
              <p>file</p>
              <!-- <v-btn text large @click="saveDocument()"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
              <v-btn text large @click="newDocument()"><v-icon left>mdi-file-document-box-plus</v-icon>New</v-btn>
              <v-btn text large @click="open_dialog = true"><v-icon left>mdi-folder-open</v-icon>Open</v-btn>
              <v-btn text large @click="print_dialog = true"><v-icon left>mdi-printer</v-icon>Print</v-btn> -->
            </v-tab-item>

            <v-tab-item>
              <button @click="checkMarkAttrs(getMarkAttrs)">Attrs</button>
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
              <v-btn icon :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                <v-icon>mdi-format-bold</v-icon>
              </v-btn>

              <v-btn icon :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
                <v-icon>mdi-format-italic</v-icon>
              </v-btn>

              <v-btn icon :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
                <v-icon>mdi-format-strikethrough</v-icon>
              </v-btn>

              <v-btn icon v-model="isActive.underline()" @click="commands.underline">
                <v-icon>mdi-format-underline</v-icon>
              </v-btn>

              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn disabled :style="{ 'color': 'white' }" v-on="on" icon><v-icon>mdi-format-color-fill</v-icon></v-btn>
                </template>
                <v-color-picker show-swatches mode="hexa" style="background-color: #2E2E2E;"></v-color-picker>
              </v-menu>
              <v-btn icon @click="clearFormat(current_block.index)" disabled><v-icon>mdi-format-clear</v-icon></v-btn>
              <v-divider inset vertical></v-divider>
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon><v-icon>mdi-format-align-left</v-icon></v-btn>
                </template>
                <v-list dense>
                  <v-list-item-group>
                    <v-list-item v-model="isActive.alignment({ textAlign: 'left' })" @click="commands.alignment({ textAlign: 'left' })">
                      <v-list-item-icon><v-icon>mdi-format-align-left</v-icon></v-list-item-icon>
                      <v-list-item-title>Left</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-model="isActive.alignment({ textAlign: 'center' })" @click="commands.alignment({ textAlign: 'center' })">
                      <v-list-item-icon><v-icon>mdi-format-align-center</v-icon></v-list-item-icon>
                      <v-list-item-title>Center</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-model="isActive.alignment({ textAlign: 'right' })" @click="commands.alignment({ textAlign: 'right' })">
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

                  <v-list-item @click="commands.bullet_list" v-model="isActive.bullet_list()">
                    <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
                    <v-list-item-title>Bulleted</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="commands.ordered_list" v-model="isActive.ordered_list()">
                    <v-list-item-icon><v-icon>mdi-format-list-numbered</v-icon></v-list-item-icon>
                    <v-list-item-title>Numbered</v-list-item-title>
                  </v-list-item>

                  <v-list-item disabled @click="commands.todo_list" v-model="isActive.todo_list()">
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
              <v-btn icon disabled><v-icon>mdi-dictionary</v-icon></v-btn>
              <v-divider vertical></v-divider>
              <v-btn text large disabled><v-icon left>mdi-counter</v-icon>Word Count</v-btn>
              <v-btn icon disabled><v-icon>mdi-share-variant</v-icon></v-btn>
              <v-btn icon disabled><v-icon>mdi-translate</v-icon></v-btn>
            </v-tab-item>

            <v-tab-item>
              <!-- <v-btn text large @click.prevent="focus(!focus_mode)" v-model="focus_mode"><v-icon left>mdi-image-filter-center-focus-strong</v-icon>Focus</v-btn>
              <v-btn text large disabled v-model="$root.auto_update"><v-icon left>mdi-update</v-icon>Auto-Update</v-btn> -->
            </v-tab-item>

            <v-tab-item>
              <!-- <v-btn text large @click="info_dialog = true"><v-icon left>mdi-information</v-icon>Info</v-btn> -->
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

    <v-footer app>
      <span class="overline green--text">2 Users Connected</span>
    </v-footer>
  </div>
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
import Paragraph from '@/editorPlugins/Paragraph.js'
import iFrame from '@/editorPlugins/iFrame.js'

export default {
  name: 'editor',
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      console: console,
      document: document,
      tab: 1,
      search: {
        open: false,
        search_term: '',
        replaceTerm: ''
      },
      image: {
        open: false,
        src: '',
        cmd: null
      },
      editor: undefined
    }
  },
  beforeDestroy() {
    this.editor.destroy()
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
    newDocument() {
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
          new TrailingNode(),
          new iFrame()
        ],
        content: null
      })
    },
    checkMarkAttrs(attrsFunc) {
      var attrs = attrsFunc
      console.log(attrs)
    }
  },
  created() {
    this.newDocument()
  }
}
</script>

<style>
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
  height: calc(100vh - 128px);
  overflow: auto;
}
</style>