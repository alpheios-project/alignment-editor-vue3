<template>
  <div class="alpheios-editor-help-content alpheios-editor-help-enter-content-part5">
      <h4 class="alpheios-editor-help-content-title" @click="state.partVisible = !state.partVisible">DESCRIBING</h4>
      <div class="alpheios-editor-help-content-text" v-show="state.partVisible">
          <p>This button opens a template for you to describe the text in that box, using either Alpheios default terms 
            or terms derived from the Dublin Core metadata standard. You are strongly encouraged to at least 
            enter a Short Name for the text that can then be used by the program to refer to this text in all subsequent displays.
          </p>
          <p class="alpheios-editor-help-content-text__image"><img :src="state.descriptionPNG" /></p>
          <p>If you do not enter anything in the description fields, the red icon will remind you to do so -turning green only after 
            you have made some entry. Even after it has turned green you can use this icon to modify or amplify your description. 
            It will bring up the same template that the <b>[DESCRIBE]</b> button did. At present no minimum information is required.
          </p> 

          <p class="alpheios-editor-help-content-text__close-link" @click="state.partVisible = false">Close</p>
      </div>
  </div>
</template>
<script setup>
import descriptionPNG from '@/_images/description.png'
import { reactive } from 'vue'

const state = reactive({
  partVisible: false,
  descriptionPNG: descriptionPNG
})
</script>
<style lang="scss">
</style>