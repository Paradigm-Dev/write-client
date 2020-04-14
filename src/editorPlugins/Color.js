import { Mark } from 'tiptap'
import { updateMark } from 'tiptap-commands'

export default class Color extends Mark {

  get name() {
    return 'color'
  }

  get schema() {
    return {
      attrs: {
        color: ''
      },
      defining: true,
      parseDOM: [{
        tag: 'span'
      }],
      toDOM:
        node => {
          return ['span', {
            style: `color:${node.attrs.color}`
          }, 0]
        }
    }
  }

  commands({ type }) {
    return attrs => updateMark(type, attrs)
  }
}