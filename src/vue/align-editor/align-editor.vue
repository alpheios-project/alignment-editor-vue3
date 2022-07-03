<template>
  <div class="alpheios-alignment-text-editor-block__align alpheios-alignment-align-editor-block alpheios-alignment-editor-container  alpheios-tools-enabled">
      <h2 class="alpheios-alignment-text-editor-block__header">
        <span class="alpheios-alignment-text-editor-block__part alpheios-alignment-text-editor-block__part-1">
          <span class="alpheios-alignment-text-editor-block__header-link" @click="emit('showSourceTextEditor')">
                {{ l10n.getMsgS('TEXT_EDITOR_LINK') }}</span>
          <span class="alpheios-alignment-text-editor-block__header-label">{{ l10n.getMsgS('ALIGN_EDITOR_HEADING') }}</span>
          <span class="alpheios-alignment-text-editor-block__header-link" v-if="tokensEditAvailable" 
                 @click="emit('showTokensEditor')">{{ l10n.getMsgS('TOKENS_EDITOR_LINK') }}</span>
          
          <div class="alpheios-alignment-toggle-block alpheios-alignment-annotation-mode-check-container" 
                v-if="enableAnnotationsValue">
            <label class="alpheios-switch">
              <input type="checkbox" v-model="state.annotationMode" id="alpheios-alignment-annotation-mode-check">
              <span class="alpheios-slider alpheios-round"></span>
            </label>
            <span class="alpheios-switch-label">{{ l10n.getMsgS("ALIGN_EDITOR_ANNOTATION_MODE") }}</span>
          </div>


        </span>
        
        <span class="alpheios-alignment-text-editor-block-buttons__part alpheios-alignment-text-editor-block__part-2">
          <tooltip :tooltipText = "l10n.getMsgS('TEXT_EDITOR_HEADER_HELP')" tooltipDirection = "top">
            <button class="alpheios-editor-button-tertiary alpheios-actions-menu-button alpheios-actions-menu-button-with-icon" id="alpheios-actions-menu-button__enter-help"
                @click="state.helpAlignState++">
                <span class="alpheios-alignment-button-icon">
                  <question-icon />
                </span>
            </button>
          </tooltip>
          <tooltip :tooltipText = "l10n.getMsgS('TEXT_EDITOR_HEADER_OPTIONS')" tooltipDirection = "top">
            <button class="alpheios-editor-button-tertiary alpheios-actions-menu-button alpheios-actions-menu-button-with-icon" id="alpheios-actions-menu-button__enter-options"
                @click="state.optionsTextAlignState++" >
                <span class="alpheios-alignment-button-icon">
                  <gear-icon />
                </span>
            </button>
          </tooltip>
        </span>

        <span class="alpheios-alignment-text-editor-block__part alpheios-alignment-text-editor-block__part-3">
          <button class="alpheios-editor-button-tertiary alpheios-actions-menu-button" id="alpheios-actions-menu-button__enter-save"
              @click="state.saveAlignState++">
              {{ l10n.getMsgS("ALIGN_EDITOR_SAVE") }}
          </button>
        </span>
      </h2>

    <align-editor-view-mode v-if="renderAlignEditor" @update-annotation = "updateAnnotation" 
            :annotationMode="state.annotationMode"/>   

    <modal name="help-align" :toggleState="state.helpAlignState" 
          height="80%" width="80%" :shiftY="0.3"
          :max-width="1300" :adaptive="true">     
      <help-popup @closeModal = "state.helpAlignState++" mname = "help-align">
        <template v-slot:content > <help-block-align /> </template>
      </help-popup>
    </modal>

    <modal name="save-align" :toggleState="state.saveAlignState" 
          :draggable="true" height="auto" 
           >   
      <save-popup @closeModal = "state.saveAlignState++" />
    </modal>

    <modal name="options-align" :toggleState="state.optionsTextAlignState" 
          :draggable="true" height="auto" :shiftY="0.3" >   
      <options-text-align @closeModal = "state.optionsTextAlignState++" />
    </modal>

    <modal name="annotation" :toggleState="state.annotationState" 
          :draggable="true" height="auto" :shiftY="0.3" >   

    <annotation @closeModal = "state.annotationState++" 
                                :token = "state.annotationToken" 
        />

    </modal>
  </div>
</template>
<script setup>
import L10nSingleton from '@/lib/l10n/l10n-singleton.js'
import SettingsController from '@/lib/controllers/settings-controller.js'
import Tooltip from '@/vue/common/tooltip.vue'
import Modal from '@/vue/modal-base/modal.vue'
import SavePopup from '@/vue/modal-slots/save-popup.vue'
import OptionsTextAlign from '@/vue/options/options-text-align.vue'

import AlignEditorViewMode from '@/vue/align-editor/align-editor-view-mode.vue'

import HelpPopup from '@/vue/modal-slots/help-popup.vue'
import HelpBlockAlign from '@/vue/help-blocks/eng/help-block-align.vue'
import Annotation from '@/vue/align-editor/modal_slots/annotation-block.vue'

import QuestionIcon from '@/inline-icons/question.svg'
import GearIcon from '@/inline-icons/gear.svg'

import { computed, inject, reactive } from 'vue'

import { useStore } from 'vuex'

const emit = defineEmits([ 'showSourceTextEditor', 'showTokensEditor' ])

const l10n = computed(() => { return L10nSingleton })
const $store = useStore()
const $alignedGC = inject('$alignedGC')

const state = reactive({
  helpAlignState: 0,
  optionsTextAlignState: 0,
  saveAlignState: 0,
  annotationState: 0,

  annotationToken: null,
  annotationMode: false
})

const renderAlignEditor = computed(() => {
  state.annotationMode = false
  return $store.state.alignmentUpdated && $store.state.uploadCheck && $alignedGC.alignmentGroupsWorkflowStarted
})

const enableTokensEditorOptionItemValue = computed(() => {
  return $store.state.optionsUpdated && SettingsController.enableTokensEditor
})

const useModeStructureValue = computed(() => {
  return $store.state.optionsUpdated && SettingsController.useModeStructure
})

const tokensEditAvailable = computed(() => {
  return enableTokensEditorOptionItemValue.value
})

const enableAnnotationsValue = computed(() => {
  if (!useModeStructureValue.value || !SettingsController.enableAnnotations) { 
    state.annotationMode = false 
  }
  return $store.state.optionsUpdated && SettingsController.enableAnnotations && state.useModeStructureValue
})

const updateAnnotation = (token) => {
  state.annotationToken = token
  state.annotationState++
}

const closeAnnotationModal = () => {
  state.annotationToken = null
  state.annotationState++
}

</script>
<style lang="scss">
  .alpheios-alignment-align-editor-block.alpheios-alignment-editor-container {
    padding: 20px 30px 20px 40px;  
  }

  .alpheios-alignment-text-editor-block__part {
    min-width: 255px;

    &.alpheios-alignment-text-editor-block__part-2 {
      text-align: center;
    }

    &.alpheios-alignment-text-editor-block__part-3 {
      text-align: right;
    }
  }

  div.alpheios-alignment-annotation-mode-check-container {
    display: block;
    line-height: initial;
    max-width: initial;
    min-height: initial;
    padding-top: 5px;


    .alpheios-switch-label {
      font-weight: normal;
      font-size: 80%;
      padding-left: 5px;
      line-height: 22px;
    }
  }

</style>