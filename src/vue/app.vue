<template>
  <div id="alpheios-alignment-editor-app-container" class="alpheios-alignment-editor-app-container">
    <initial-screen @upload-data-from-file = "uploadDataFromFile" @new-initial-alignment = "newInitialAlignment" />
  </div>
</template>
<script setup>
import { reactive, inject } from 'vue'

import SettingsController from '@/lib/controllers/settings-controller.js'
import Alignment from '@/lib/data/alignment'

import InitialScreen from '@/vue/initial-screen.vue'

const textC = inject('textC')

const local = {
  fileData: null,
  extension: null,
  checkAlInDB: null
}

const state = reactive({ 
  updatedDTInDB: null
})

const uploadDataFromFile = async (fileData, extension) => {
  if (fileData) {
    const shortAlData = textC.extractIDandDateFromFile(fileData, extension)
    const checkAlInDB = await textC.checkShortAlInDB(shortAlData)

    if (shortAlData && checkAlInDB) {
      local.fileData = fileData
      local.extension = extension
      state.updatedDTInDB = checkAlInDB.updatedDT
      local.checkAlInDB = checkAlInDB

      // this.$modal.show('upload-warn')
      // $vfm.show({ component: 'Upload' })
      // console.info('modal.show - Upload', Upload)
    } else {
      uploadDataFromFileFinal(fileData, extension)
    }    
  }
}

const uploadDataFromFileFinal = (fileData, extension) => {
  const alignment = textC.uploadDataFromFile(fileData, SettingsController.tokenizerOptionValue, extension)

  if (alignment instanceof Alignment) {
    return console.info('startOver - alignment')
    // return this.startOver(alignment)
  }
  // this.showSourceTextEditor()
  console.info('showSourceTextEditor - started')
}

const newInitialAlignment = () => {
  console.info('newInitialAlignment - emitted')
}
</script>
