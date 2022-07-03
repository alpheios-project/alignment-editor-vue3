<template>
  <div class="alpheios-alignment-tokens-editor-block alpheios-alignment-editor-container">
      <h2 class="alpheios-alignment-text-editor-block__header">
        <span class="alpheios-alignment-text-editor-block__part">
          <span class="alpheios-alignment-text-editor-block__header-link" @click="goToTextEnterScreen">{{ l10n.getMsgS('TEXT_EDITOR_LINK') }}</span>
          <span class="alpheios-alignment-text-editor-block__header-link" @click="goToAlignTextScreen">{{ l10n.getMsgS('ALIGN_EDITOR_LINK') }}</span>
          <span class="alpheios-alignment-text-editor-block__header-label">{{ l10n.getMsgS('TOKENS_EDITOR_HEADING') }}</span>
        </span>
        <span class="alpheios-alignment-text-editor-block-buttons__part">
          <tooltip :tooltipText = "l10n.getMsgS('TEXT_EDITOR_HEADER_HELP')" tooltipDirection = "top">
            <button class="alpheios-editor-button-tertiary alpheios-actions-menu-button alpheios-actions-menu-button-with-icon" id="alpheios-actions-menu-button__enter-help"
                @click="state.helpEditState++">
                <span class="alpheios-alignment-button-icon">
                  <question-icon />
                </span>
            </button>
          </tooltip>
          <tooltip :tooltipText = "l10n.getMsgS('TEXT_EDITOR_HEADER_OPTIONS')" tooltipDirection = "top">
            <button class="alpheios-editor-button-tertiary alpheios-actions-menu-button alpheios-actions-menu-button-with-icon" id="alpheios-actions-menu-button__enter-options"
                @click="state.optionsTextEditState++">
                <span class="alpheios-alignment-button-icon">
                  <gear-icon />
                </span>
            </button>
          </tooltip>
        </span>
        <span class="alpheios-alignment-text-editor-block__part alpheios-alignment-text-editor-block__part-right">
          <button class="alpheios-editor-button-tertiary alpheios-actions-menu-button" id="alpheios-actions-menu-button__enter-save"
              @click="state.saveEditState++">
              {{ l10n.getMsgS('TEXT_EDITOR_HEADER_SAVE') }}
          </button>
        </span>
      </h2>

    <tokens-editor-inner-block v-if="state.renderTokensEditor" @insertTokens="startInsertTokens" 
        :removeAllActivatedFlag = "state.removeAllActivatedFlag"/>

    <modal name="save-edit" :toggleState="state.saveEditState" 
          :draggable="true" height="auto" 
           >   
      <save-popup @closeModal = "state.saveEditState++" />
    </modal>

    <modal name="options-edit" :toggleState="state.optionsTextEditState" 
          :draggable="true" height="auto" :shiftY="0.3" >   
      <options-text-edit @closeModal = "state.optionsTextEditState++" />
    </modal>

    <modal name="help-edit" :toggleState="state.helpEditState" 
          height="auto" width="80%" :shiftY="0.3"
          :max-width="1300" :adaptive="true">     
      <help-popup @closeModal = "state.helpEditState++" mname = "help-edit">
        <template v-slot:content > <help-block-edit /> </template>
      </help-popup>
    </modal>

    <modal name="insert-tokens" :toggleState="state.insertTokensState" 
          height="auto" :shiftY="0.3" >   
      <insert-tokens @closeModal = "closeInsertTokens"  :token = "state.edittedToken"  />
    </modal>

  </div>
</template>
<script setup>
import L10nSingleton from '@/lib/l10n/l10n-singleton.js'
import SettingsController from '@/lib/controllers/settings-controller.js'
import Tooltip from '@/vue/common/tooltip.vue'

import Modal from '@/vue/modal-base/modal.vue'
import SavePopup from '@/vue/modal-slots/save-popup.vue'
import OptionsTextEdit from '@/vue/options/options-text-edit.vue'
import TokensEditorInnerBlock from '@/vue/tokens-editor/tokens-editor-inner-block.vue'

import HelpPopup from '@/vue/modal-slots/help-popup.vue'
import HelpBlockEdit from '@/vue/help-blocks/eng/help-block-edit.vue'
import InsertTokens from '@/vue/tokens-editor/insert-tokens-block.vue'

import QuestionIcon from '@/inline-icons/question.svg'
import GearIcon from '@/inline-icons/gear.svg'

import { computed, inject, reactive, watch } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits([ 'showSourceTextEditor', 'showAlignmentGroupsEditor' ])

const l10n = computed(() => { return L10nSingleton })
const $store = useStore()
const $alignedGC = inject('$alignedGC')

const props = defineProps({
  renderEditor: {
    type: Number,
    required: true
  }
})

const state = reactive({
  renderTokensEditor: false,
  showModalOptions: false,
  edittedToken: null,
  removeAllActivatedFlag: 1,

  saveEditState: 0,
  optionsTextEditState: 0,
  helpEditState: 0,
  insertTokensState: 0
})

watch( 
  () => $store.state.alignmentRestarted, 
  () => {
    state.renderTokensEditor = false
  }
)
watch( 
  () =>props.renderEditor, 
  () => {
    if (alignmentStared) { state.renderTokensEditor = true }
  }
)

const alignmentStared = computed(() => {
  return $store.state.alignmentUpdated && $alignedGC.alignmentGroupsWorkflowStarted
})

const startInsertTokens = (token) => {
  state.edittedToken = token
  state.insertTokensState++
}

const closeInsertTokens = () => {
  state.edittedToken = null
  state.insertTokensState++
}

const goToTextEnterScreen = () => {
  state.removeAllActivatedFlag = state.removeAllActivatedFlag + 1
  emit('showSourceTextEditor')
}

const goToAlignTextScreen = () => {
  state.removeAllActivatedFlag = state.removeAllActivatedFlag + 1
  emit('showAlignmentGroupsEditor')
}
</script>

<style lang="scss">
  .alpheios-alignment-tokens-editor-block.alpheios-alignment-editor-container {
    padding: 20px 30px 20px 40px;  
  }

</style>