<template>
  <p ref="editable" contenteditable v-on="listeners" v-html="value"></p>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    }
  },
  computed: {
    listeners() {
      return { ...this.$listeners, input: this.onInput }
    }
  },
  // mounted() {
  //   this.$refs.editable.textContent = this.value
  // },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.innerText)
    }
  }
}
</script>